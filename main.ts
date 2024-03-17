import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { db } from "./client.ts";

const app = new Hono();

const clientID = "c5f460a5cb4b39b69bbc";
const clientSecret = "9ca1b02c5b9fc2f4ae19fcc70aed131f10d0aa75";
const redirectURI = "http://localhost:8000/oauth/redirect";
const jwtSecret = "myVerySecretKeyForJWT";

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

  const githubUser = await fetch("https://api.github.com/user", {
    headers: {
      "Authorization": `token ${accessToken}`,
    },
  }).then((res) => res.json());

  // 检查用户是否已存在于数据库(通过id)
  const user = await db.selectFrom("users").where(
    "github_id",
    "=",
    githubUser.id,
  ).selectAll().execute();

  if (!user.length) {
    console.log("不存在");

    await db.insertInto("users").values({
      github_id: githubUser.id,
      email: githubUser.email,
      name: githubUser.name,
    }).execute();
  }

  const token = await sign({ github_id: githubUser.id }, jwtSecret);

  return c.redirect(`/welcome?token=${encodeURIComponent(token)}`);
});

app.get("/welcome", (c) => {
  const token = c.req.query("token");
  return c.html(`<html><body>Welcome! Your token is: ${token}</body></html>`);
});

app.use("/protected/*", jwt({ secret: jwtSecret }));

app.get("/protected/personal-info", async (c) => {
  const jwtPayload = c.get("jwtPayload");

  const user = await db.selectFrom("users").where(
    "github_id",
    "=",
    jwtPayload.github_id,
  ).selectAll()
    .executeTakeFirst();

  return c.json(user);
});

Deno.serve(app.fetch);
