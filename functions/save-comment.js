export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const slug = formData.get("slug");
    const name = formData.get("name");
    const comment = formData.get("comment");

    if (!slug || !name || !comment) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing fields"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = `comments:${slug}`;
    const raw = await context.env.POSTS_KV.get(key);
    const comments = raw ? JSON.parse(raw) : [];

    comments.unshift({
      name: String(name).trim(),
      comment: String(comment).trim(),
      createdAt: new Date().toISOString()
    });

    await context.env.POSTS_KV.put(key, JSON.stringify(comments));

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
      message: "Comment failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
