import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIprojects } from "../../lib/api";
import {
  Badge,
  Card,
  Grid,
  Text,
  SectionHeading,
  DateTime,
} from "@contentful/f36-components";
import styles from "../../styles/ProjectsId.module.css";
import { useUser } from "../../lib/auth";

import Link from "next/link";

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

function ProjectId(): JSX.Element {
  const router = useRouter();
  const id = router.query.id;

  const [project, setProject] = useState<any>("");
  useUser()

  useEffect(() => {
    if (typeof id !== "string") {
      return;
    }
    const getProject = async function (id: string) {
      const result = await APIprojects.getProject(id);
      const project = result?.data;
      setProject(project);
    };

    getProject(id);
  }, [id]);


  return (
    <div className={styles.container}>
      <h2 className={styles.titleProject}>{project?.name}</h2>
      <div className={styles.boxTitles}>
        <h3 className={styles.titleCount}>
          active bugs {project.bugs_count_active}
        </h3>
        <h3 className={styles.titleCount}>
          <span> total bugs </span>
          {project.bugs_count_total}
        </h3>
      </div>
      <div className={styles.list}>
        {project.bugs?.map((bug: Bug) => {
          const flag = bug.solved_at ? "Solved" : "To fix";
          const variant = bug.solved_at ? "positive" : "negative";
          return (
            <Link key={project.id} href={`/bugs/${bug.bug_id}`}>
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
}

export default ProjectId;
