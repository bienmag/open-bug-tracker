import { describe, jest, test, expect } from "@jest/globals";
import { createMockContext } from "@shopify/jest-koa-mocks";
import ProjectController from "../projects.controller";

jest.mock("../../models/Projects");

import Project from "../../models/Projects";

function createMockNext() {
  return () => new Promise(() => {});
}

describe("createProject", () => {
  // test("create simple project", async () => {
  //   const projectName = "Alan Parson's";
  //   const ctx = createMockContext({ requestBody: { name: projectName } });
  //   const next = createMockNext();

  //   const responseBody = { id: 123, name: projectName };
  //   const spy = jest.spyOn(Project, "create");
  //   spy.mockResolvedValueOnce(responseBody);

  //   await ProjectController.createProject(ctx, next);

  //   // expect(spy).toHaveBeenCalledTimes(1);
  //   // expect(spy).toHaveBeenCalledWith(projectName);
  //   // expect(ctx.response.body).toEqual(responseBody);
  //   // expect(ctx.response.status).toEqual(201);
  // });

  test("do not create project without name", async () => {
    try {
      const projName = undefined;
      const ctx = createMockContext({ requestBody: { name: projName } });
      const next = createMockNext();

      const responseBody = { id: 123, name: projName };
      const spy = jest.spyOn(Project, "create");
      // expect(spy).toBeUndefined()

      await ProjectController.createProject(ctx, next);
      throw new Error("crete did not throw error");
    } catch (e) {
      const error = e as Error;
      expect(error.message).toBe("no project name");
    }

    // expect
    // expect(projName as any).toBeUndefined()
    // expect(spy).toHaveBeenCalledTimes(1)
    // expect(spy).toHaveLength(0)
  });
});
