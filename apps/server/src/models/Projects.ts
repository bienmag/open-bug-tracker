/** @format */

import { getOccurrencesCollection } from "../lib/mongo";
import prisma from "../lib/prisma";

const getActiveBugsOnProject = (project: Project): Promise<number> => {
  return prisma.bugs.count({
    where: { project_id: project.id, solved_at: null },
  });
};
const getTotalBugsOnProject = (project: Project): Promise<number> => {
  return prisma.bugs.count({
    where: { project_id: project.id },
  });
};

class Project {
  constructor(public id: number, public name: string) {}

  static async create(projectName: string, user_id: number): Promise<Project> {
    const { id, name } = await prisma.project.create({
      data: {
        name: projectName,
        creator: {
          connect: {
            id: user_id,
          },
        },
      },
    });
    return new Project(id, name);
  }

  static async getProjects(): Promise<any> {
    const projects = await prisma.project.findMany();

    const projectInfoPromises = projects.map(async (project) => {
      return {
        ...project,
        bugs_count_active: await getActiveBugsOnProject(project),
        bugs_count_total: await getTotalBugsOnProject(project),
      };
    });
    const masterPromise = Promise.all(projectInfoPromises);
    return await masterPromise;
  }

  static async getProject(id: number): Promise<any> {
    const projectBasic = await prisma.project.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    const bugs = await prisma.bugs.findMany({
      select: {
        bug_id: true,
        message: true,
        num_occurences: true,
        solved_at: true,
        first_seen: true,
        last_seen: true,
      },
      where: {
        project_id: id,
      },
    });

    const bugs_count_active = await getActiveBugsOnProject(projectBasic);
    const bugs_count_total = await getTotalBugsOnProject(projectBasic);

    const projectAssembled = {
      ...projectBasic,
      bugs_count_active,
      bugs_count_total,
      bugs,
    };
    return projectAssembled;
  }
}

export default Project;
