import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
        };
      };
    }>;
  };
}

interface MeditationContent {
  title: string;
  date: string;
  imageUrl: string | null;
  content: string;
  slug: string;
  link: string;
}

function stripHtmlForTitle(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanContent(html: string): string {
  // Remove scripts and styles
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  // Remove share buttons and related posts
  content = content.replace(/<div[^>]*class="[^"]*sharedaddy[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  content = content.replace(/<div[^>]*id="[^"]*jp-relatedposts[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  // Clean up whitespace
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

  return content;
}

function formatDate(isoDate: string): string {
  return isoDate.split("T")[0];
}

function getBestImage(post: WPPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  const sizes = media.media_details?.sizes;
  if (sizes?.full?.source_url) return sizes.full.source_url;
  if (sizes?.large?.source_url) return sizes.large.source_url;

  return media.source_url || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Fetch the specific post by slug with embedded featured image
    const url = `https://shaktianandama.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`;
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "es-419,es;q=0.9,en;q=0.8",
        "Referer": "https://shaktianandama.com/",
        "Origin": "https://shaktianandama.com",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(`WordPress API error: ${res.status}`);
    }

    const posts: WPPost[] = await res.json();

    if (posts.length === 0) {
      return NextResponse.json(
        { error: "Meditation not found", slug },
        { status: 404 }
      );
    }

    const post = posts[0];
    
    const result: MeditationContent = {
      title: stripHtmlForTitle(post.title.rendered),
      date: formatDate(post.date),
      imageUrl: getBestImage(post),
      content: cleanContent(post.content.rendered),
      slug: post.slug,
      link: post.link,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[v0] Error fetching meditation from WordPress API:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditation", slug },
      { status: 500 }
    );
  }
}
