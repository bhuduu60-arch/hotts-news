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
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const link = String(formData.get("link") || "").trim();
    const points = Number(formData.get("points") || "0");

    if (!title || !description || !link || !points) {
      return new Response(JSON.stringify({
        success: false,
        message: "All fields are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const taskId = `task:${Date.now()}`;
    const taskData = {
      id: taskId,
      title,
      description,
      link,
      points,
      status: "active",
      createdAt: new Date().toISOString()
    };

    await context.env.POSTS_KV.put(taskId, JSON.stringify(taskData));

    return new Response(JSON.stringify({
      success: true,
      task: taskData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Task creation failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
