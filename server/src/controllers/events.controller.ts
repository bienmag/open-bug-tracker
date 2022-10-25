import Koa from "koa";

const EventsController = {
  async createEvent(ctx: Koa.Context, next: Koa.Next) {
    ctx.body = ctx.request.body;
    console.log(ctx.body);
    await next();
  },
};

export default EventsController;
