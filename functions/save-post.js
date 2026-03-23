export async function onRequestPost(context) {
  try {
    const cookie = context.request.headers.get("Cookie") || "";
    const isLoggedIn = cookie.includes("hotts_admin=loggedin");

    if (!isLoggedIn) {
      return new Response(JSON.stringify({
        success: false,
        message: "Unauthorized"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await context.request.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const content = formData.get("content");
    const image = formData.get("image") || "";

    if (!title || !category || !description || !content) {
      return new Response(JSON.stringify({
        success: false,
        message: "All fields are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const slug = title.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const postId = `post:${Date.now()}`;

    const postData = {
      id: postId,
      slug,
      title,
      category,
      description,
      content,
      image,
      createdAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(postId, JSON.stringify(postData));

    return new Response(JSON.stringify({
      success: true,
      message: "Post saved successfully",
      post: postData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
