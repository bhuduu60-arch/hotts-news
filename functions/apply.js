export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const country = formData.get("country");
    const contact = formData.get("contact") || "";

    if (!fullName || !email || !country) {
      return new Response(JSON.stringify({
        success: false,
        message: "Required fields missing"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = `user:${Date.now()}`;
    const userData = {
      id: userId,
      fullName,
      email,
      country,
      contact,
      points: 0,
      status: "approved",
      createdAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(userId, JSON.stringify(userData));

    return new Response(JSON.stringify({
      success: true,
      message: "Application successful",
      user: userData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Application failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
