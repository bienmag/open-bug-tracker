-- CreateTable
CREATE TABLE "Occurrences" (
    "occurence_id" SERIAL NOT NULL,
    "bug_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "Occurrences_pkey" PRIMARY KEY ("occurence_id")
);

-- CreateTable
CREATE TABLE "Bugs" (
    "bug_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "stack_trace" TEXT NOT NULL,
    "num_occurences" INTEGER NOT NULL,
    "first_seen" TIMESTAMP(3) NOT NULL,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "solved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bugs_pkey" PRIMARY KEY ("bug_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "prjoect_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("prjoect_id")
);
