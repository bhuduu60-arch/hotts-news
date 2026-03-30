export async function onRequestGet(context) {
  try {
    const cookie = context.request.headers.get("Cookie") || "";
    const isLoggedIn = cookie.includes("hotts_admin=loggedin");

    if (!isLoggedIn) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const today = new Date().toISOString().slice(0, 10);
    const totalViews = Number(await context.env.POSTS_KV.get("stats:total_views") || "0");
    const dailyViews = Number(await context.env.POSTS_KV.get(`stats:daily:${today}`) || "0");
    const lastActivity = await context.env.POSTS_KV.get("stats:last_activity") || "No activity yet";

    const list = await context.env.POSTS_KV.list({ prefix: "post:" });
    const posts = [];
    let totalLikes = 0;
    let totalComments = 0;

    for (const key of list.keys) {
      const raw = await context.env.POSTS_KV.get(key.name);
      if (!raw) continue;

      const post = JSON.parse(raw);
      const views = Number(await context.env.POSTS_KV.get(`stats:post:${post.slug}`) || "0");
      const likes = Number(await context.env.POSTS_KV.get(`likes:${post.slug}`) || "0");
      const commentsRaw = await context.env.POSTS_KV.get(`comments:${post.slug}`);
      const comments = commentsRaw ? JSON.parse(commentsRaw) : [];

      totalLikes += likes;
      totalComments += comments.length;

      posts.push({
        title: post.title,
        slug: post.slug,
        views,
        likes,
        comments: comments.length
      });
    }

    posts.sort((a, b) => b.views - a.views);

    return new Response(JSON.stringify({
      success: true,
      totalViews,
      dailyViews,
      totalLikes,
      totalComments,
      lastActivity,
      topPosts: posts.slice(0, 10)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to load analytics"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
