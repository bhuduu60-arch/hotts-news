export async function onRequestGet(context) {
  try {
    const list = await context.env.POSTS_KV.list({ prefix: "post:" });
    const posts = [];

    for (const key of list.keys) {
      const raw = await context.env.POSTS_KV.get(key.name);
      if (raw) {
        posts.push(JSON.parse(raw));
      }
    }

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({
      success: true,
      posts
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      posts: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
