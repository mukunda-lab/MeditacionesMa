import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

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
          medium_large?: { source_url: string };
        };
      };
    }>;
  };
}

interface MeditationData {
  id: number;
  title: string;
  slug: string;
  dateString: string;
  excerpt: string;
  imageUrl: string | null;
  link: string;
}

function stripHtml(html: string): string {
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

function formatDate(isoDate: string): string {
  // Convert "2025-05-28T12:00:00" to "2025-05-28"
  return isoDate.split("T")[0];
}

function getBestImage(post: WPPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  // Try to get the best quality image
  const sizes = media.media_details?.sizes;
  if (sizes?.full?.source_url) return sizes.full.source_url;
  if (sizes?.large?.source_url) return sizes.large.source_url;
  if (sizes?.medium_large?.source_url) return sizes.medium_large.source_url;

  return media.source_url || null;
}

export async function GET() {
  try {
    // Fetch all posts with embedded featured images
    // WordPress REST API allows up to 100 per page
    const allMeditations: MeditationData[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `https://shaktianandama.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`;
      
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "es-419,es;q=0.9,en;q=0.8",
          "Referer": "https://shaktianandama.com/",
          "Origin": "https://shaktianandama.com",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        if (res.status === 400) {
          // No more pages
          hasMore = false;
          break;
        }
        throw new Error(`WordPress API error: ${res.status}`);
      }

      const posts: WPPost[] = await res.json();
      
      if (posts.length === 0) {
        hasMore = false;
        break;
      }

      for (const post of posts) {
        allMeditations.push({
          id: post.id,
          title: stripHtml(post.title.rendered),
          slug: post.slug,
          dateString: formatDate(post.date),
          excerpt: stripHtml(post.excerpt.rendered).slice(0, 300),
          imageUrl: getBestImage(post),
          link: post.link,
        });
      }

      // Check if there are more pages
      const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
      if (page >= totalPages) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Sort by date descending (newest first)
    allMeditations.sort((a, b) => b.dateString.localeCompare(a.dateString));

    return NextResponse.json({
      meditations: allMeditations,
      total: allMeditations.length,
    });
  } catch (error) {
    console.error("[v0] Error fetching from WordPress API:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditations", meditations: [], total: 0 },
      { status: 500 }
    );
  }
}
