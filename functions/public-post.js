export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        message: "Slug is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const list = await context.env.POSTS_KV.list({ prefix: "post:" });

    for (const key of list.keys) {
      const raw = await context.env.POSTS_KV.get(key.name);
      if (!raw) continue;

      const post = JSON.parse(raw);
      if (post.slug === slug) {
        return new Response(JSON.stringify({
          success: true,
          post
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({
      success: false,
      message: "Post not found"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
