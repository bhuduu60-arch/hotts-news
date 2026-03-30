export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: "Slug required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const likes = Number(await context.env.POSTS_KV.get(`likes:${slug}`) || "0");

    return new Response(JSON.stringify({ success: true, likes }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, likes: 0 }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
