import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface MeditationContent {
  title: string;
  date: string;
  imageUrl: string | null;
  content: string;
  slug: string;
}

async function scrapeMeditation(slug: string): Promise<MeditationContent | null> {
  // Try multiple URL patterns the site might use
  const urlsToTry = [
    `https://shaktianandama.com/${slug}/`,
    `https://shaktianandama.com/meditacion/${slug}/`,
    `https://shaktianandama.com/?p=${slug}`,
  ];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          Accept: "text/html,application/xhtml+xml",
        },
        next: { revalidate: 86400 }, // cache for 24h
      });

      if (!res.ok) continue;

      const html = await res.text();

      // Extract title
      const titleMatch =
        html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)<\/h1>/s) ||
        html.match(/<h1[^>]*>(.*?)<\/h1>/s);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : slug;

      // Extract featured image
      const ogImageMatch = html.match(
        /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/
      );
      const featuredImgMatch = html.match(
        /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/
      );
      const imageUrl =
        ogImageMatch?.[1] || featuredImgMatch?.[1] || null;

      // Extract post date
      const dateMatch =
        html.match(/<time[^>]*datetime="([^"]+)"/) ||
        html.match(/"datePublished":\s*"([^"]+)"/);
      const date = dateMatch?.[1]?.split("T")[0] || "";

      // Extract post content
      const contentMatch =
        html.match(
          /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)<\/div>\s*<\/div>/s
        ) ||
        html.match(/<div[^>]*class="[^"]*post-content[^"]*"[^>]*>(.*?)<\/article>/s) ||
        html.match(/<div[^>]*class="[^"]*the-content[^"]*"[^>]*>([\s\S]*?)<\/div>/s);

      // Clean content
      let content = contentMatch?.[1] || "";
      // Remove scripts and styles
      content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
      // Keep paragraph and line break structure
      content = content.trim();

      if (title && title !== slug) {
        return { title, date, imageUrl, content, slug };
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const result = await scrapeMeditation(slug);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
