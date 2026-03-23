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
    const telegram = formData.get("telegram") || "";
    const youtube = formData.get("youtube") || "";
    const googleVerification = formData.get("googleVerification") || "";

    const settings = {
      telegram,
      youtube,
      googleVerification
    };

    await context.env.POSTS_KV.put("settings:site", JSON.stringify(settings));

    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Failed to save settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
