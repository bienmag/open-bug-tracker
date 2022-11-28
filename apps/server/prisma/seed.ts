/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const randomUser1 = await prisma.user.create({
    data: {
      id: 1,
      github_token: "test123",
      github_user: "gosvig123",
      avatar_url: "url123",
    },
  });

  const testProject = await prisma.project.create({
    data: {
      name: "testproject",
      creator_id: 70000,
    },
  });

  const bug = await prisma.bugs.create({
    data: {
      project_id: 1,
      message: "if this was real you should fix it",
      stack_trace: "still not real",
      first_seen: "test",
      last_seen: "test",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: string) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
