import exp from "constants";
import prisma from "../lib/prisma";
import Project from "./Projects";

interface GithubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string | null;
}

class User {
  constructor(
    public id: number,
    public username: string,
    public avatarUrl: string,
    public email: string | null,
    public projects: Project[] = [],
    public name: string | null
  ) { }

  static async login(
    githubUser: GithubUser,
    accessToken: string
  ): Promise<User> {
    const { id, github_user, name, avatar_url, email } =
      await prisma.user.upsert({
        where: {
          id: githubUser.id,
        },
        update: {
          github_token: accessToken,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
          email: githubUser.email,
        },
        create: {
          id: githubUser.id,
          github_token: accessToken,
          github_user: githubUser.login,
          name: githubUser.name,
          avatar_url: githubUser.avatar_url,
          email: githubUser.email,
        },
        include: {
          projects: true,
        },
      });

    return new User(id, github_user, avatar_url, email, undefined, name);
  }
}

export default User;
