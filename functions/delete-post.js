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
    const id = formData.get("id");

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        message: "Post ID required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await context.env.POSTS_KV.delete(id);

    return new Response(JSON.stringify({
      success: true,
      message: "Post deleted"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Delete failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
