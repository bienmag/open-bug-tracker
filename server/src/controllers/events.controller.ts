import Koa from "koa";
import { ObjectId } from "mongodb";

import { getOccurrencesCollection } from "../lib/mongo";
import prisma from "../lib/prisma";

interface EventInput {
  project_id: number;
  message: string;
  stack_trace: string;
  metadata: any;
}

const EventsController = {
  async createEvent(ctx: Koa.Context, next: Koa.Next) {
    try {
      const event = ctx.request.body as unknown as EventInput;
      let bug = await prisma.bugs.findUnique({
        where: {
          project_message: {
            message: event.message,
            project_id: event.project_id,
          },
        },
      });

      if (bug) {
        bug = await prisma.bugs.update({
          where: {
            project_message: {
              message: bug.message,
              project_id: event.project_id,
            },
          },
          data: {
            num_occurences: bug.num_occurences + 1,
            last_seen: new Date().toISOString(),
          },
        });
      } else {
        bug = await prisma.bugs.create({
          data: {
            project: {
              connect: { id: event.project_id },
            },
            message: event.message,
            stack_trace: event.stack_trace,
            num_occurences: 1,
            first_seen: new Date().toISOString(),
            last_seen: new Date().toISOString(),
          },
        });
      }

      // BUG CREATED
      const occurrences = await getOccurrencesCollection();
      await occurrences.insertOne({
        project_id: event.project_id,
        bug_id: bug.bug_id,
        message: event.message,
        stack_trace: event.stack_trace,
        metadata: event.metadata,

      });

      ctx.status = 202;
    } catch (error) {
      console.log(error);
    }
  },

  async getEvent(ctx: Koa.Context, next: Koa.Next) {
    try {
      const id = ctx.params.id;
      const occurrences = await getOccurrencesCollection();
      const result = await occurrences.findOne({
        _id: new ObjectId(id),
      });

      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  },
};

export default EventsController;
