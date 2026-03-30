export async function onRequestGet(context) {
  try {
    const list = await context.env.POSTS_KV.list({ prefix: "task:" });
    const tasks = [];

    for (const key of list.keys) {
      const raw = await context.env.POSTS_KV.get(key.name);
      if (raw) tasks.push(JSON.parse(raw));
    }

    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({
      success: true,
      tasks
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      tasks: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
