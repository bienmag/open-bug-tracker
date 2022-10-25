import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

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

  async getProjects() {
    try {
      return await api.get<Project[]>("/projects");
    } catch (error) {
      console.log(error);
    }
  },
};

export { handler, api, APIprojects };
