import { Hono } from "hono";

const app = new Hono();

const clientID = "c5f460a5cb4b39b69bbc";
const clientSecret = "9ca1b02c5b9fc2f4ae19fcc70aed131f10d0aa75";
const redirectURI = "http://localhost:8000/oauth/redirect";

app.get("/", (c) =>
  c.html(`<html>
<head>
  <title>Deno OAuth2 Demo</title>
</head>
<body>
  <a id="login" href="https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${
    encodeURIComponent(redirectURI)
  }">Login with GitHub</a>
</body>
</html>`));

app.get("/oauth/redirect", async (c) => {
  const requestToken = c.req.query("code");
  console.log("authorization code:", requestToken);

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        code: requestToken,
      }),
    },
  ).then((res) => res.json());

  const accessToken = tokenResponse.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await fetch("https://api.github.com/user", {
    headers: {
      "Accept": "application/json",
      "Authorization": `token ${accessToken}`,
    },
  }).then((res) => res.json());

  console.log(result);
  const name = result.name;

  return c.redirect(`/welcome?name=${encodeURIComponent(name)}`);
});

app.get("/welcome", (c) => {
  const name = c.req.query("name");
  return c.html(`<html><body>Welcome, ${name}!</body></html>`);
});

Deno.serve(app.fetch);
