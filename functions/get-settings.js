export async function onRequestGet(context) {
  try {
    const raw = await context.env.POSTS_KV.get("settings:site");
    const settings = raw ? JSON.parse(raw) : {
      telegram: "",
      youtube: "",
      googleVerification: ""
    };

    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false, settings: {} }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
