import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "process";

interface Data {
  name: string;
}

function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  res.status(200).json({ name: "John Doe" });
}

const api = axios.create({
  baseURL: "http://localhost:8080",
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
      console.log(error);
    }
  },
  async getProjects(): Promise<Project[] | undefined> {
    try {
      return await (
        await api.get<Project[]>("/projects")
      ).data;
    } catch (error) {
      console.log(error);
    }
  },
  async getProject(id: string) {
    try {
      const result = await api.get<ProjectWithBugs>(`/project/${id}`);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
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
  bug_id: string,
  message: string,
  solved_at: null,
  first_seen: string,
  last_seen: string
  occurrences: Object[]
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
      return await api.get<Bug[]>('/bugs');
    } catch (error) {
      console.log(error)
    }
  }
}

const setToken = function (token: string): void {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`

}




export { handler, api, APIprojects, APIBugs, APIOccurrences, setToken };
