/** @format */

import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "process";

interface Data {
  name: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
}

interface ProjectWithBugs {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
  bugs: any;
}

const APIprojects = {
  async postProjects(project: string) {
    try {
      return await api.post("/projects", {
        name: project,
      });
    } catch (error) {
      console.error(error)
      throw new Error("Was not able to post project");
    }
  },
  async getProjects(): Promise<Project[] | undefined> {
    try {
      return await (
        await api.get<Project[]>("/projects")
      ).data;
    } catch (error) {
      console.error(error)
      throw new Error("was not able to get project");
    }
  },
  async getProject(id: string) {
    try {
      const result = await api.get<ProjectWithBugs>(`/project/${id}`);

      return result;
    } catch (error) {
      throw new Error("was not able to get bugs");
    }
  },
};

interface Ocurrences {
  id: number;
  projectId: number;
  bugId: string;
  message: string;
  stakTrace: string;
  metadata: any;
}

const APIOccurrences = {
  async ocurrenceDetails(bugId: string, ocurrenceId: string) {
    try {
      return await api.get<Ocurrences>(
        `/bugs/${bugId}/occurrence/${ocurrenceId}`
      );
    } catch (error) {
      console.log(error);
    }
  },
};

interface BugAPI {
  id: string;
  message: string;
  solved_at: null;
  first_seen: string;
  last_seen: string;
  num_occurrences: number;
  occurrences: [
    {
      report_date: string;
      stack_trace: string;
      meta_data: {
        user_agent: string;
        browser: string;
      };
    }
  ];
}

interface Bug {
  bug_id: string;
  message: string;
  solved_at: null;
  first_seen: string;
  last_seen: string;
  occurrences: Object[];
}

const APIBugs = {
  async getBug(id: string) {
    try {
      return await api.get<Bug>(`/bugs/${id}`);
    } catch (error) {
      console.log(error);
    }
  },

  async getBugs() {
    try {
      return await api.get<Bug[]>("/bugs");
    } catch (error) {
      console.log(error);
    }
  },
};
const setToken = function (token: string): void {
  console.log(api.defaults.headers.common);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export { api, APIprojects, APIBugs, APIOccurrences, setToken };
