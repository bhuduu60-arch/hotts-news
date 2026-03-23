export async function onRequestGet(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  const isLoggedIn = cookie.includes("hotts_admin=loggedin");

  return new Response(JSON.stringify({
    loggedIn: isLoggedIn
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
