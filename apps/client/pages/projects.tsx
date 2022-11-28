import {
  Badge,
  Box,
  Card,
  EntityList,
  Subheading,
  Modal,
} from "@contentful/f36-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { Key, ReactNode, useEffect, useState } from "react";
import FormProject from "../components/newProject";
import { APIprojects } from "../lib/api";
import { useUser } from "../lib/auth";
import styles from "../styles/Projects.module.css";


interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
}

function Projects(): JSX.Element {
  const [listProjects, setListProjects] = useState<any>([]);
  const [projectId, setProjectid] = useState("");

  useUser()

  const getProjects = async function () {
    const result = await APIprojects.getProjects();

    setListProjects(result);
  };

  const createProject = async function (project: string) {
    const result = await APIprojects.postProjects(project);
    setProjectid(result?.data.id);
    getProjects();
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>PROJECTS</h1>
        <FormProject onSubmit={createProject}> </FormProject>
        <div className={styles.list}>
          {listProjects?.map((project: Project) => {
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className={styles.element}>
                  <div className={styles.upBox}>
                    <h3 className={styles.subTitle}>{project.name}</h3>

                    {project.bugs_count_active < 1 && (
                      <div className={styles.solved}> SOLVED</div>
                    )}
                    {project.bugs_count_active > 0 && (
                      <div className={styles.toFix}> TO FIX</div>
                    )}
                  </div>
                  <div className={styles.subBox}>
                    <div className={styles.idTitle}>
                      Project id: {project.id}
                    </div>
                    <div>
                      {project.bugs_count_active} active{" "}
                      {`bug${project.bugs_count_active === 1 ? "" : "s"}`},
                      total {project.bugs_count_total}{" "}
                      {`bug${project.bugs_count_total === 1 ? "" : "s"}`}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Projects;
