export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({
        success: false,
        comments: []
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const raw = await context.env.POSTS_KV.get(`comments:${slug}`);
    const comments = raw ? JSON.parse(raw) : [];

    return new Response(JSON.stringify({
      success: true,
      comments
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      comments: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
