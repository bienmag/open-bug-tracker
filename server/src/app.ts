import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import dotenv from "dotenv";
dotenv.config();

import EventsController from "./controllers/events.controller";
import ProjectController from "./controllers/projects.controller";
import { Context } from "vm";
import { nextTick } from "process";
import BugsController from "./controllers/bugs.controller";
import { Server } from "http";

const app = new Koa();

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

router.post("/events", EventsController.createEvent);
router.post("/projects", ProjectController.createProject);

router.get("/bugs", BugsController.getBugs);
router.get("/bugs/:id", BugsController.getBug);
router.put("/bugs/:id/solve", BugsController.updateBug);

router.get("/projects", ProjectController.getProjects);
router.get("/project/:id", ProjectController.getProject);

router.get("/bugs/:id/occurrence/:id", EventsController.getEvent);

app.on("error", async (err, ctx: Koa.Context, next: Koa.Next) => {
  console.log(err);
  await next();
});

app.use(router.routes());

export function startServer(
  opts = { port: process.env.PORT || 8080 }
): Promise<Server> {
  return new Promise((resolve) => {
    const server = app.listen(opts.port, () => {
      console.log(`Server listening on port ${opts.port}`);
      resolve(server);
    });
  });
}
