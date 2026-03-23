export async function onRequestGet() {
  return new Response(JSON.stringify({
    success: true,
    message: "Logged out"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "hotts_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
    }
  });
}
