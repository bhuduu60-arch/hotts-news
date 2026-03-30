export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        message: "Email required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userKey = `member:${email}`;
    const raw = await context.env.POSTS_KV.get(userKey);

    if (!raw) {
      return new Response(JSON.stringify({
        success: false,
        message: "User not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    const checkinKey = `checkin:${email}:${today}`;
    const alreadyChecked = await context.env.POSTS_KV.get(checkinKey);

    if (alreadyChecked) {
      return new Response(JSON.stringify({
        success: false,
        message: "Already checked in today",
        points: user.points
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    user.points = Number(user.points || 0) + 1;
    user.lastCheckin = new Date().toISOString();

    await context.env.POSTS_KV.put(userKey, JSON.stringify(user));
    await context.env.POSTS_KV.put(checkinKey, "done");

    return new Response(JSON.stringify({
      success: true,
      message: "Daily check-in successful",
      points: user.points
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      success: false,
      message: "Check-in failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
