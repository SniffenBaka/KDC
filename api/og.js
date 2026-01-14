export const config = {
  runtime: 'edge',
};

// List of known crawler bots that need OG meta tags
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'WhatsApp',
  'TelegramBot',
  'Zalo',
  'vkShare',
  'Pinterestbot',
  'Embedly',
  'Quora Link Preview',
  'outbrain',
  'W3C_Validator',
  'applebot',
  'bingbot',
  'Googlebot',
];

// Supabase configuration (hardcoded because Edge Runtime)
const SUPABASE_URL = 'https://sscbcvcmqubmxjqpodlt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2JjdmNtcXVibXhqcXBvZGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNzYxMDcsImV4cCI6MjA4Mjc1MjEwN30.A9207QFdEtGgzjKnGVmiPpcgwXgYCwhYCyCcsk4eE4o';

// Default values
const SITE_NAME = 'Eight Ducks';
const DEFAULT_TITLE = 'Eight Ducks - Many Stories';
const DEFAULT_DESCRIPTION = 'Khoảng khắc Eight Ducks - Chạm vào ký ức thanh xuân. Chia sẻ những câu chuyện tình cảm tuổi học trò, ký ức đẹp và cảm hứng.';
const DEFAULT_IMAGE = 'https://i.ibb.co/twbnpPDK/d93ab92f-7d17-4f7e-8d6a-a2601020866b.png';

function isCrawlerBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

async function fetchPostFromSupabase(postId) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?id=eq.${postId}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Supabase fetch error:', response.status);
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

function generateOgHtml(post, url) {
  const title = post?.title || DEFAULT_TITLE;
  const description = truncate(stripHtml(post?.content || post?.excerpt) || DEFAULT_DESCRIPTION, 200);
  const image = post?.image || DEFAULT_IMAGE;
  
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${title} | ${SITE_NAME}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- Redirect to SPA for regular browsers -->
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`;
}

export default async function handler(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if this is a crawler bot
  if (!isCrawlerBot(userAgent)) {
    // For regular users, redirect to the SPA
    return new Response(null, {
      status: 302,
      headers: {
        'Location': url.pathname + url.search,
      },
    });
  }
  
  // Extract post ID from URL path: /post/123 or /api/og?id=123
  let postId = url.searchParams.get('id');
  
  if (!postId) {
    // Try to extract from path like /post/123
    const pathMatch = url.pathname.match(/\/post\/(\d+)/);
    if (pathMatch) {
      postId = pathMatch[1];
    }
  }
  
  // Fetch post data from Supabase
  const post = postId ? await fetchPostFromSupabase(postId) : null;
  
  // Generate the OG HTML
  const fullUrl = `${url.origin}${url.pathname}`;
  const html = generateOgHtml(post, fullUrl);
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
}
