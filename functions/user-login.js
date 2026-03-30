export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();

    const raw = await context.env.POSTS_KV.get(`member:${email}`);
    if (!raw) {
      return new Response(JSON.stringify({
        success: false,
        message: "Account not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = JSON.parse(raw);

    if (user.password !== password) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid password"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Login failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
