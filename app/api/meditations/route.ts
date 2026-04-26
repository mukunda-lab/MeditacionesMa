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
  const clean = url.replace(/\/$/, "");
  const parts = clean.split("/");
  return parts[parts.length - 1];
}

function parseDate(dateStr: string): string {
  // Parse dates like "May 28, 2025" or "28 de mayo de 2025"
  const months: Record<string, string> = {
    january: "01", jan: "01", enero: "01",
    february: "02", feb: "02", febrero: "02",
    march: "03", mar: "03", marzo: "03",
    april: "04", apr: "04", abril: "04",
    may: "05", mayo: "05",
    june: "06", jun: "06", junio: "06",
    july: "07", jul: "07", julio: "07",
    august: "08", aug: "08", agosto: "08",
    september: "09", sep: "09", septiembre: "09",
    october: "10", oct: "10", octubre: "10",
    november: "11", nov: "11", noviembre: "11",
    december: "12", dec: "12", diciembre: "12",
  };

  const lower = dateStr.toLowerCase();
  
  // Try ISO format first
  const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // Try "Month Day, Year" format
  const enMatch = lower.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (enMatch) {
    const month = months[enMatch[1]];
    if (month) {
      return `${enMatch[3]}-${month}-${enMatch[2].padStart(2, "0")}`;
    }
  }

  // Try "Day de Month de Year" format
  const esMatch = lower.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
  if (esMatch) {
    const month = months[esMatch[2]];
    if (month) {
      return `${esMatch[3]}-${month}-${esMatch[1].padStart(2, "0")}`;
    }
  }

  return "";
}

async function scrapePage(pageNum: number): Promise<ScrapedMeditation[]> {
  const url =
    pageNum === 1
      ? "https://shaktianandama.com/meditaciones/"
      : `https://shaktianandama.com/meditaciones/page/${pageNum}/`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "es-419,es;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Ch-Ua": '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const meditations: ScrapedMeditation[] = [];

    // Split by article boundaries - look for post containers
    // The site likely uses different class names, so we try multiple patterns
    const postBlocks = html.split(/<article\b/i).slice(1);

    for (const block of postBlocks) {
      // Close the article tag context
      const articleHtml = "<article" + block.split(/<\/article>/i)[0];

      // Extract the post link - look for permalink patterns
      const linkPatterns = [
        /href="(https:\/\/shaktianandama\.com\/[a-z0-9-]+\/?)"/gi,
        /href="(https:\/\/shaktianandama\.com\/meditacion\/[a-z0-9-]+\/?)"/gi,
      ];

      let link = "";
      for (const pattern of linkPatterns) {
        const match = pattern.exec(articleHtml);
        if (match && !match[1].includes("/page/") && !match[1].includes("/category/") && !match[1].includes("/tag/")) {
          link = match[1];
          break;
        }
      }

      if (!link) continue;

      const slug = extractSlugFromUrl(link);
      if (!slug || slug === "meditaciones") continue;

      // Extract title - look in h2 or h3 with entry-title class or inside link
      const titleMatch = 
        articleHtml.match(/<h[123][^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
        articleHtml.match(/<h[123][^>]*>[\s\S]*?<a[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/i) ||
        articleHtml.match(/class="entry-title"[^>]*>([\s\S]*?)</i);
      
      let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      if (!title) continue;
      
      // Decode HTML entities
      title = title
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, " ");

      // Extract image - look for featured image or first img in post
      const imgPatterns = [
        /src="(https:\/\/shaktianandama\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|webp))"/gi,
        /data-src="(https:\/\/shaktianandama\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|webp))"/gi,
        /srcset="(https:\/\/shaktianandama\.com\/wp-content\/uploads\/[^"\s]+)/gi,
      ];

      let imageUrl: string | null = null;
      for (const pattern of imgPatterns) {
        const match = pattern.exec(articleHtml);
        if (match) {
          imageUrl = match[1];
          // Get the highest resolution version (remove size suffix like -300x200)
          imageUrl = imageUrl.replace(/-\d+x\d+\./, ".");
          break;
        }
      }

      // Extract date
      const datePatterns = [
        /<time[^>]*datetime="([^"]+)"/i,
        /<time[^>]*>([^<]+)</i,
        /class="[^"]*entry-date[^"]*"[^>]*>([^<]+)</i,
        /class="[^"]*posted-on[^"]*"[^>]*>([^<]+)</i,
        /(\w+\s+\d{1,2},?\s+\d{4})/i,
        /(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i,
      ];

      let dateString = "";
      for (const pattern of datePatterns) {
        const match = pattern.exec(articleHtml);
        if (match) {
          dateString = parseDate(match[1].trim());
          if (dateString) break;
        }
      }

      // Extract excerpt
      const excerptMatch =
        articleHtml.match(/<div[^>]*class="[^"]*entry-summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
        articleHtml.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
        articleHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      
      let excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      excerpt = excerpt.slice(0, 250).replace(/\s+/g, " ");

      meditations.push({
        title,
        slug,
        dateString,
        excerpt,
        imageUrl,
        link,
      });
    }

    return meditations;
  } catch (err) {
    console.error(`[v0] Error scraping page ${pageNum}:`, err);
    return [];
  }
}

export async function GET() {
  const allMeditations: ScrapedMeditation[] = [];

  // Scrape pages 1 through 12 to get all meditations
  const pagePromises = Array.from({ length: 12 }, (_, i) => scrapePage(i + 1));
  const results = await Promise.all(pagePromises);

  for (const pageMeditations of results) {
    allMeditations.push(...pageMeditations);
  }

  // Sort by date descending
  allMeditations.sort((a, b) => b.dateString.localeCompare(a.dateString));

  return NextResponse.json({
    meditations: allMeditations,
    total: allMeditations.length,
  });
}
