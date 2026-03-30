export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const slug = formData.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: "Slug required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = `likes:${slug}`;
    const current = Number(await context.env.POSTS_KV.get(key) || "0");
    const updated = current + 1;

    await context.env.POSTS_KV.put(key, String(updated));

    return new Response(JSON.stringify({ success: true, likes: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Like failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
