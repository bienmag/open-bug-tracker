/** @format */

import Koa from "koa";
import Project from "../models/Projects";

interface CreateProjectRequest {
  name: string;
}

const ProjectController = {
  async createProject(ctx: Koa.Context, next: Koa.Next) {
    const body = <CreateProjectRequest>ctx.request.body;
    if (body === null || typeof body !== 'object' || typeof body.name !== "string") {
      throw new Error("no project name");
    }

    const project = await Project.create(body.name, ctx.state.user.id);
    ctx.response.body = project;
    ctx.response.status = 201;
  },

  async getProjects(ctx: Koa.Context) {
    try {
      const projects = await Project.getProjects();
      ctx.response.body = projects;
    } catch (error) {
      console.log(error);
    }
  },
  // test
  async getProject(ctx: Koa.Context) {
    try {
      const id = parseInt(ctx.params.id);
      if (id === undefined) {
        ctx.throw(401, "no project name");
      }
      const result = await Project.getProject(id);
      console.log(result);
      ctx.response.body = result;
    } catch (error) {
      console.log(error);
    }
  },
};

export default ProjectController;
