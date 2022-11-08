import Koa from "koa";
import { getOccurrencesCollection } from "../lib/mongo";
import Bug from "../models/Bugs";

const BugsController = {
  //GET BUG
  async getBug(ctx: Koa.Context) {
    const id = ctx.params.id;
    if (typeof id !== "string") {
      ctx.throw(401, "Bad request");
    }
    const record = await Bug.getBugById(id);

    // TODO: get occurrences from Mongo :)
    const collection = await getOccurrencesCollection();
    console.log({
      query: {
        bug_id: id,
      },
    });
    const occurrences = await collection
      .find({
        bug_id: id,
      })
      .toArray();

    ctx.statusCode = 200;
    ctx.response.body = {
      ...record,
      occurrences,
    };
  },

  //UPDATE BUG
  async updateBug(ctx: Koa.Context) {
    const id = ctx.params.id;
    if (typeof id !== "string") {
      ctx.throw(401, "Bad request");
    }
    const record = await Bug.updateBug(id);
    console.log(record);

    const collection = await getOccurrencesCollection();
    console.log({
      query: {
        bug_id: id,
      },
    });
    const occurrences = await collection
      .find({
        bug_id: id,
      })
      .toArray();

    ctx.statusCode = 200;
    ctx.response.body = {
      ...record,
      occurrences,
    };
  },


  // GET ALL BUGS
  async getBugs(ctx: Koa.Context) {
    try {
      const bugs = await Bug.getBugs()
      ctx.body = bugs
    } catch (error) {
      console.log(error)
    }
  }
};
export default BugsController;
