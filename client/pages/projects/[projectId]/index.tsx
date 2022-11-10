import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIprojects } from "../../../lib/api";
import {
  Badge,
  Card,
  Grid,
  Text,
  SectionHeading,
  DateTime,
} from "@contentful/f36-components";
import styles from "./ProjectsId.module.css";
import { useUser } from "../../lib/auth";
import Link from "next/link";
import type { ReactElement } from "react";
import Layout from "../../../components/layout";
import type { NextPageWithLayout } from "../../_app";
import { NavbarLink } from "../../../components/navbar";

interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
  bugs: any;
}

interface Bug {
  bug_id: string;
  message: string;
  solved_at?: Date;
  num_occurences: number;
  first_seen: Date;
  last_seen: Date;
}

const ProjectId: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId;

  const [project, setProject] = useState<Project | undefined>();
  useUser()

  useEffect(() => {
    if (typeof projectId !== "string") {
      return;
    }
    const getProject = async function (projectId: string) {
      const result = await APIprojects.getProject(projectId);
      const project = result?.data as Project;
      setProject(project);
    };

    getProject(projectId);
  }, [projectId]);


  return (
    <div className={styles.container}>
      <h2 className={styles.titleProject}>{project?.name}</h2>
      <div className={styles.boxTitles}>
        <h3 className={styles.titleCount}>
          active bugs {project?.bugs_count_active}
        </h3>
        <h3 className={styles.titleCount}>
          <span> total bugs </span>
          {project?.bugs_count_total}
        </h3>
      </div>
      <div className={styles.list}>
        {project?.bugs?.map((bug: Bug) => {
          const flag = bug.solved_at ? "Solved" : "To fix";
          const variant = bug.solved_at ? "positive" : "negative";
          return (
            <Link key={project?.id} href={`/projects/${projectId}/bugs/${bug.bug_id}`}>
              <Card key={bug.bug_id} margin="spacingXl">
                {" "}
                <SectionHeading>{bug.message}</SectionHeading>
                <Grid
                  columns="0.70fr 0.6fr  1fr 1fr 1fr"
                  alignContent="space-evenly"
                >
                  <Badge variant={variant}>{flag}</Badge>
                  <Text></Text>
                  <Text>Ocurrences</Text>
                  <Text>First seen</Text>
                  <Text>Last seen</Text>
                </Grid>
                <Grid
                  columns=" 0.70fr 0.6fr  1fr 1fr 1fr"
                  alignContent="space-evenly"
                >
                  <Text></Text>
                  <Text></Text>
                  <Text fontColor="gray500">{bug.num_occurences}</Text>
                  <Text fontColor="gray500" fontSize="fontSizeS">
                    <DateTime format="day" date={bug.first_seen} />
                  </Text>
                  <Text fontColor="gray500" fontSize="fontSizeS">
                    <DateTime format="day" date={bug.last_seen} />
                  </Text>
                </Grid>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

ProjectId.getLayout = function getLayout(projectId: ReactElement) {
  const links: NavbarLink[] = [
    { url: "/projects", text: "Home" },
  ];

  return <Layout links={links}>{projectId}</Layout>;
};

export default ProjectId;
