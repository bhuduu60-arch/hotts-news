export async function onRequestPost(context) {
  try {
    const cookie = context.request.headers.get("Cookie") || "";
    const isLoggedIn = cookie.includes("hotts_admin=loggedin");

    if (!isLoggedIn) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await context.request.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const content = formData.get("content");
    const image = formData.get("image") || "";

    if (!id || !title || !category || !description || !content) {
      return new Response(JSON.stringify({ success: false, message: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingRaw = await context.env.POSTS_KV.get(id);
    if (!existingRaw) {
      return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existing = JSON.parse(existingRaw);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const updatedPost = {
      ...existing,
      title,
      category,
      description,
      content,
      image,
      slug,
      updatedAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(id, JSON.stringify(updatedPost));

    return new Response(JSON.stringify({ success: true, post: updatedPost }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
