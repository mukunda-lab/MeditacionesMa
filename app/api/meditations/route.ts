import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

interface ScrapedMeditation {
  title: string;
  slug: string;
  dateString: string;
  excerpt: string;
  imageUrl: string | null;
  link: string;
}

function extractSlugFromUrl(url: string): string {
  // Remove trailing slash and get last segment
  const clean = url.replace(/\/$/, "");
  const parts = clean.split("/");
  return parts[parts.length - 1];
}

async function scrapePage(pageNum: number): Promise<ScrapedMeditation[]> {
  const url =
    pageNum === 1
      ? "https://shaktianandama.com/meditaciones/"
      : `https://shaktianandama.com/meditaciones/page/${pageNum}/`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const meditations: ScrapedMeditation[] = [];

    // Match each article/post block
    // WordPress typically wraps posts in <article> tags
    const articlePattern =
      /<article[^>]*>([\s\S]*?)<\/article>/gi;
    let articleMatch;

    while ((articleMatch = articlePattern.exec(html)) !== null) {
      const articleHtml = articleMatch[1];

      // Extract link and title
      const linkMatch = articleHtml.match(
        /<a[^>]*href="(https?:\/\/shaktianandama\.com\/[^"]+)"[^>]*rel="bookmark"[^>]*>([\s\S]*?)<\/a>/i
      ) || articleHtml.match(
        /<h[23][^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i
      );

      if (!linkMatch) continue;

      const link = linkMatch[1];
      const title = linkMatch[2].replace(/<[^>]+>/g, "").trim();
      const slug = extractSlugFromUrl(link);

      // Extract date
      const dateMatch =
        articleHtml.match(/<time[^>]*datetime="([^"T]+)/) ||
        articleHtml.match(/class="entry-date[^"]*"[^>]*>([^<]+)/);
      let dateString = dateMatch?.[1]?.trim() || "";
      // Normalize to YYYY-MM-DD
      if (dateString && !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateString = "";
      }

      // Extract thumbnail image
      const imgMatch =
        articleHtml.match(
          /<img[^>]*src="(https?:\/\/shaktianandama\.com\/wp-content\/uploads\/[^"]+)"[^>]*>/i
        ) ||
        articleHtml.match(/src="([^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/i);
      const imageUrl = imgMatch?.[1] || null;

      // Extract excerpt
      const excerptMatch =
        articleHtml.match(
          /<div[^>]*class="[^"]*entry-summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i
        ) ||
        articleHtml.match(/<p>([\s\S]*?)<\/p>/i);
      const excerpt = excerptMatch
        ? excerptMatch[1].replace(/<[^>]+>/g, "").trim().slice(0, 200)
        : "";

      if (title && slug) {
        meditations.push({
          title,
          slug,
          dateString,
          excerpt,
          imageUrl,
          link,
        });
      }
    }

    return meditations;
  } catch (err) {
    console.error(`[v0] Error scraping page ${pageNum}:`, err);
    return [];
  }
}

export async function GET() {
  const allMeditations: ScrapedMeditation[] = [];

  // Scrape pages 1 through 10
  const pagePromises = Array.from({ length: 10 }, (_, i) => scrapePage(i + 1));
  const results = await Promise.all(pagePromises);

  for (const pageMeditations of results) {
    allMeditations.push(...pageMeditations);
  }

  return NextResponse.json({
    meditations: allMeditations,
    total: allMeditations.length,
  });
}
