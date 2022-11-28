import prisma from "../lib/prisma";

class Bug {
  constructor(
    public bug_id: string,
    public project_id: number,
    public message: string,
    public stack_trace: string,
    public num_occurences: number,
    public first_seen: Date,
    public last_seen: Date,
    public solve_at?: Date | null
  ) {}

  // GET BUGS BY ID
  static async getBugById(bug_id: string): Promise<Bug> {
    const record = await prisma.bugs.findUnique({
      where: { bug_id },
    });
    console.log(record);

    if (record === null) {
      throw new Error("No bug with this id");
    }
    return new Bug(
      record.bug_id,
      record.project_id,
      record.message,
      record.stack_trace,
      record.num_occurences,
      record.first_seen,
      record.last_seen,
      record.solved_at
    );
  }
  // UPDATE BUGS SOLVE AT DATE
  static async updateBug(bug_id: string): Promise<Bug> {
    const bug = await prisma.bugs.update({
      where: { bug_id },
      data: {
        solved_at: new Date(),
      },
      // TODO: uncomment when relationship is implemented
      // include: {
      //   project: true,
      // },
    });
    return new Bug(
      bug.bug_id,
      bug.project_id,
      bug.message,
      bug.stack_trace,
      bug.num_occurences,
      bug.first_seen,
      bug.last_seen,
      bug.solved_at
    );
  }

  //GET ALL BUGS
  static async getBugs (): Promise <any> {
    const bugs = await prisma.bugs.findMany()
    return bugs
  }
}

export default Bug;
