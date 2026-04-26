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
  // Try the direct slug URL first (this is the most common pattern)
  const urlsToTry = [
    `https://shaktianandama.com/${slug}/`,
    `https://shaktianandama.com/meditacion/${slug}/`,
  ];

  for (const url of urlsToTry) {
    try {
      console.log(`[v0] Trying to fetch: ${url}`);
      
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.log(`[v0] ${url} returned ${res.status}`);
        continue;
      }

      const html = await res.text();
      
      // Check if this is actually a post page (not a redirect to home)
      if (html.includes('class="home"') || html.includes('page-template-homepage')) {
        console.log(`[v0] ${url} redirected to homepage`);
        continue;
      }

      // Extract title from various sources
      let title = "";
      const titlePatterns = [
        /<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
        /<h1[^>]*>([\s\S]*?)<\/h1>/i,
        /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
        /<title>([^<]+)</i,
      ];
      
      for (const pattern of titlePatterns) {
        const match = html.match(pattern);
        if (match) {
          title = match[1].replace(/<[^>]+>/g, "").trim();
          // Clean up title
          title = title.replace(/\s*[-|]\s*Mataji Shaktiananda.*$/i, "").trim();
          if (title && title.length > 3) break;
        }
      }

      if (!title || title.toLowerCase().includes("home")) {
        continue;
      }

      // Extract featured image
      let imageUrl: string | null = null;
      const imgPatterns = [
        /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
        /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i,
        /<img[^>]*class="[^"]*attachment-[^"]*"[^>]*src="([^"]+)"/i,
        /<figure[^>]*class="[^"]*post-thumbnail[^"]*"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i,
      ];
      
      for (const pattern of imgPatterns) {
        const match = html.match(pattern);
        if (match && match[1].includes("shaktianandama.com")) {
          imageUrl = match[1];
          // Get full resolution
          imageUrl = imageUrl.replace(/-\d+x\d+\./, ".");
          break;
        }
      }

      // Extract post date
      let date = "";
      const datePatterns = [
        /<time[^>]*datetime="([^"T]+)/i,
        /<meta[^>]*property="article:published_time"[^>]*content="([^"T]+)/i,
        /"datePublished":\s*"([^"T]+)/i,
      ];
      
      for (const pattern of datePatterns) {
        const match = html.match(pattern);
        if (match) {
          date = match[1].trim();
          break;
        }
      }

      // Extract the FULL post content
      let content = "";
      
      // Try to find the main content container
      const contentPatterns = [
        // Standard WordPress entry-content
        /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<footer|<div[^>]*class="[^"]*post-footer|<nav|<aside|<section[^>]*class="[^"]*related)/i,
        // Alternative: get everything between entry-content and next major section
        /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/article>/i,
        // Backup: just get entry-content
        /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*(?:post-footer|sharedaddy|jp-relatedposts)/i,
        // Most permissive
        /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]+)/i,
      ];

      for (const pattern of contentPatterns) {
        const match = html.match(pattern);
        if (match) {
          content = match[1];
          break;
        }
      }

      // If we got the most permissive match, try to truncate at a reasonable point
      if (content.length > 10000) {
        // Find the end of the actual content
        const endMarkers = [
          '<div class="sharedaddy',
          '<div class="jp-relatedposts',
          '<section class="related',
          '<div class="post-footer',
          '<footer class="entry-footer',
          '<nav class="post-navigation',
          '</article>',
        ];
        
        let endIndex = content.length;
        for (const marker of endMarkers) {
          const idx = content.indexOf(marker);
          if (idx > 0 && idx < endIndex) {
            endIndex = idx;
          }
        }
        content = content.slice(0, endIndex);
      }

      // Clean up the content but preserve structure
      // Remove scripts and styles
      content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
      content = content.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
      
      // Remove share buttons and related posts
      content = content.replace(/<div[^>]*class="[^"]*sharedaddy[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
      content = content.replace(/<div[^>]*id="[^"]*jp-relatedposts[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
      
      // Clean up excessive whitespace but keep paragraph structure
      content = content.replace(/\n\s*\n\s*\n/g, "\n\n");
      content = content.trim();

      // If content is still very short, this might not be the right page
      if (content.length < 100) {
        console.log(`[v0] Content too short for ${url}`);
        continue;
      }

      console.log(`[v0] Successfully scraped ${slug}: ${title}, content length: ${content.length}`);
      
      return { title, date, imageUrl, content, slug };
    } catch (err) {
      console.error(`[v0] Error fetching ${url}:`, err);
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
    return NextResponse.json(
      { error: "Meditation not found", slug },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
