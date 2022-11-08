import Koa, { Context } from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import EventsController from "./controllers/events.controller";
import ProjectController from "./controllers/projects.controller";
import BugsController from "./controllers/bugs.controller";
import querystring from "query-string";
import axios from "axios";
import User from "./models/Users";
import { JWT_SECRET } from "./lib/constants";

const app = new Koa();
const port = process.env.PORT || 8080;

const router = new Router();
var options = {
  origin: "*",
};

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  await next();
});

app.use(cors(options));
app.use(bodyParser());

router.get("/login/github", (ctx: Context) => {
  const qs = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_AUTHORIZE_URI,
    scope: "user:email",
    state: process.env.GITHUB_STATE,
  };
  ctx.redirect(
    `https://github.com/login/oauth/authorize?${querystring.stringify(qs)}`
  );
});

router.get("/login/github/authorize", async (ctx: Context) => {
  const code = ctx.query.code;
  const state = ctx.query.state;
  if (state !== process.env.GITHUB_STATE) {
    ctx.body = "Invalid state";
    return;
  }

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.GITHUB_AUTHORIZE_URI,
    }
  );

  const data = querystring.parse(response.data);
  if (typeof data.access_token !== "string") {
    ctx.body = "Invalid access token";
    ctx.status = 400;
    return;
  }
  const accessToken = data.access_token;

  const userResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  // Create USER
  const user = await User.login(userResponse.data, accessToken);

  // Create JWT
  const { id, username, email, name, avatarUrl } = user;
  const token = jwt.sign({ id, username, email, name, avatarUrl }, JWT_SECRET);

  // Redirect to frontend
  ctx.redirect(`http://localhost:3000?token=${token}`);
});

const authRouter = new Router();
authRouter.use((ctx, next) => {
  if (ctx.request.headers.authorization) {
    const token = ctx.request.headers.authorization.split("Bearer ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      ctx.state.user = decoded;
      return next();
    } catch (err) {
      ctx.throw(401, "Invalid token");
    }
  }
  ctx.throw(401, "Invalid token");
});

router.post("/events", EventsController.createEvent);
authRouter.post("/projects", ProjectController.createProject);

authRouter.get("/bugs", BugsController.getBugs);
authRouter.get("/bugs/:id", BugsController.getBug);
authRouter.put("/bugs/:id/solve", BugsController.updateBug);

authRouter.get("/projects", ProjectController.getProjects);
authRouter.get("/project/:id", ProjectController.getProject);

authRouter.get("/bugs/:id/occurrence/:id", EventsController.getEvent);

router.use(authRouter.routes());

// router.get("/health", (ctx: Context) => {
//   ctx.body = ctx.req.oidc.isAuthenticated() ? "Logged in" : "Logged out";
// });
// //@ts-ignore
// router.get("/private", requiresAuth(), (ctx: Context) => {
//   ctx.body = ctx.req.oidc.user;
// });

app.listen(port, () => {
  console.log(`🚀 Server listening ${port} 🍟 🚀`);
});

app.on("error", async (err) => {
  console.error(err);
});

app.use(router.routes());
