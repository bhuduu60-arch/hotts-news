export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: "Post ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const raw = await context.env.POSTS_KV.get(id);

    if (!raw) {
      return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, post: JSON.parse(raw) }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Failed to load post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
