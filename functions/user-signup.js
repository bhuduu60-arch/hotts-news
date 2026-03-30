export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: "Email and password required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const appliedRaw = await context.env.POSTS_KV.get(`apply:${email}`);
    if (!appliedRaw) {
      return new Response(JSON.stringify({
        success: false,
        message: "Apply first before signup"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingUser = await context.env.POSTS_KV.get(`member:${email}`);
    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        message: "Account already exists"
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    const application = JSON.parse(appliedRaw);

    const userData = {
      id: `member:${Date.now()}`,
      fullName: application.fullName,
      email,
      country: application.country,
      contact: application.contact || "",
      password,
      points: 0,
      createdAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(`member:${email}`, JSON.stringify(userData));

    return new Response(JSON.stringify({
      success: true,
      message: "Signup successful"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Signup failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
