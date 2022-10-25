import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import { PrismaClient } from "@prisma/client";
import EventsController from "./controllers/events.controller";
import { Context } from "vm";

const app = new Koa();
const port = 3000;

const prisma = new PrismaClient();

const router = new Router();
app.use(cors());
app.use(bodyParser());

router.post("/events", EventsController.createEvent);
router.get("/projects", (ctx: Context) => {
  console.log("hi there. ");
  ctx.body = "hi there";
});

router.get("/projects", () => {
  console.log("hi");
});

app.listen(port, () => {
  console.log(`🚀 Server listening ${port} 🍟 🚀`);
});

app.use(router.routes());

//hi
// POST localhost:3000/events
