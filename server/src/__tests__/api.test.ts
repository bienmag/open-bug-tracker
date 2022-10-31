import { describe, beforeAll, afterAll, test } from "@jest/globals";
import { Server } from "http";
import { startServer } from "../app";
import axios, { AxiosInstance } from "axios";

import prisma from "../lib/prisma";

let server: Server;
let api: AxiosInstance;

beforeAll(async () => {
  server = await startServer({ port: "9080" });
  const addressInfo = server.address();
  if (typeof addressInfo === "string" || addressInfo === null) {
    console.error(
      "Port is null. This is possibly because the server is not running."
    );
    process.exit(1);
  }
  api = axios.create({
    baseURL: `http://localhost:${addressInfo.port}`,
  });

  await prisma.$connect();
});

afterAll((done) => {
  const deleteBugs = prisma.bugs.deleteMany();
  const deleteProjects = prisma.project.deleteMany();

  Promise.all([
    prisma.$transaction([deleteBugs, deleteProjects]),
    prisma.$disconnect(),
  ]).then(() => {
    server.close((err) => {
      if (err) console.error(err);
      console.log("Server closed");
      done();
    });
  });
});

describe("POST /projects", () => {
  test("Creates a project", async () => {
    try {
      const response = await api.post("/projects", {
        name: "Test Project",
        description: "This is a test project for testing purposes.",
      });
      expect(response.status).toEqual(201);

      const project = await prisma.project.findUnique({
        where: {
          id: response.data.id,
        },
      });
      expect(project).not.toBeNull();
      expect(project?.name).toEqual("Test Project");
    } catch (error) {
      console.error(error);
    }
  });
});

describe("/events", () => {
  let project_id: number;
  beforeAll(async () => {
    const project = await prisma.project.create({
      data: {
        name: "Test Project",
      },
    });
    project_id = project.id;
  });

  test("posts an event with no precedence", async () => {
    try {
      const response = await api.post("/events", {
        project_id,
        message: "This is a test error",
        stack_trace: "This is a test error\n at test.test (test.js:1:1)",
      });
      expect(response.status).toBe(202);
      expect(response.data).toMatchInlineSnapshot(`"Accepted"`);

      const bug = await prisma.bugs.findUnique({
        where: {
          project_message: {
            message: "This is a test error",
            project_id,
          },
        },
      });
      expect(bug).not.toBe(null);
      expect(bug?.message).toBe("This is a test error");
      expect(bug?.stack_trace).toBe(
        "This is a test error\n at test.test (test.js:1:1)"
      );
      expect(bug?.num_occurences).toEqual(1);
      expect(bug?.first_seen).not.toEqual(null);
      expect(bug?.last_seen).toEqual(bug?.first_seen);
    } catch (error) {
      console.error(error);
    }
  });

  test("throws error when creating an event with a non-existing project", async () => {
    try {
      await api.post("/events", {
        project_id: 100,
        message: "This is a test error with a non-existing project",
        stack_trace: "This is a test error\n at test.test (test.js:1:1)",
      });
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error;
      }
      const response = error.response;
      expect(response?.status).toBe(404);
      expect(response?.data).toMatchInlineSnapshot(`"Not Found"`);

      const bug = await prisma.bugs.findUnique({
        where: {
          project_message: {
            message: "This is a test error with a non-existing project",
            project_id: 100,
          },
        },
      });
      expect(bug).toBe(null);
    }
  });

  test("posts an event with an existing bug", async () => {
    const bug = await prisma.bugs.create({
      data: {
        project: {
          connect: { id: project_id },
        },
        message: "This is a test error with an existing bug",
        stack_trace: "This is a test error\n at test.test (test.js:1:1)",
        num_occurences: 1,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      },
    });

    const response = await api.post("/events", {
      project_id,
      message: "This is a test error",
      stack_trace: "This is a test error\n at test.test (test.js:1:1)",
    });
    expect(response.status).toBe(202);
    expect(response.data).toMatchInlineSnapshot(`"Accepted"`);
  });
});
