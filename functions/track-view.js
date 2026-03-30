export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const path = formData.get("path") || "/";
    const slug = formData.get("slug") || "";
    const today = new Date().toISOString().slice(0, 10);

    const totalViewsKey = "stats:total_views";
    const dailyViewsKey = `stats:daily:${today}`;
    const pathViewsKey = `stats:path:${path}`;
    const postViewsKey = slug ? `stats:post:${slug}` : null;

    const totalViews = Number(await context.env.POSTS_KV.get(totalViewsKey) || "0") + 1;
    const dailyViews = Number(await context.env.POSTS_KV.get(dailyViewsKey) || "0") + 1;
    const pathViews = Number(await context.env.POSTS_KV.get(pathViewsKey) || "0") + 1;

    await context.env.POSTS_KV.put(totalViewsKey, String(totalViews));
    await context.env.POSTS_KV.put(dailyViewsKey, String(dailyViews));
    await context.env.POSTS_KV.put(pathViewsKey, String(pathViews));
    await context.env.POSTS_KV.put("stats:last_activity", new Date().toISOString());

    if (postViewsKey) {
      const postViews = Number(await context.env.POSTS_KV.get(postViewsKey) || "0") + 1;
      await context.env.POSTS_KV.put(postViewsKey, String(postViews));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
