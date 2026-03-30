export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const country = String(formData.get("country") || "").trim();
    const contact = String(formData.get("contact") || "").trim();

    if (!fullName || !email || !country) {
      return new Response(JSON.stringify({
        success: false,
        message: "Required fields missing"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingApply = await context.env.POSTS_KV.get(`apply:${email}`);
    const existingMember = await context.env.POSTS_KV.get(`member:${email}`);

    if (existingApply || existingMember) {
      return new Response(JSON.stringify({
        success: false,
        message: "You already applied or signed up"
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    const application = {
      fullName,
      email,
      country,
      contact,
      createdAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(`apply:${email}`, JSON.stringify(application));

    return new Response(JSON.stringify({
      success: true,
      message: "Application successful"
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
