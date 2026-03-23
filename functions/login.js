export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const adminUser = "bhuduu60";
  const adminPass = "HottsNews@2025";

  if (username === adminUser && password === adminPass) {
    return new Response(JSON.stringify({
      success: true,
      message: "Login successful"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "hotts_admin=loggedin; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400"
      }
    });
  }

  return new Response(JSON.stringify({
    success: false,
    message: "Invalid login details"
  }), {
    status: 401,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
