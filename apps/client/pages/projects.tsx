/** @format */

import { NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";
import FormProject from "../components/newProject";
import { APIprojects, setToken } from "../lib/api";
import { UseUser } from "../lib/auth";
import styles from "../styles/Projects.module.css";
import qs from 'qs'

interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
}

interface ProjectPageProps {
  projects: Project[]
}

function Projects({ projects }: ProjectPageProps): JSX.Element {
  console.log('projects', projects)
  const [newProjects, setNewProjects] = useState<Project[]>([]);

  UseUser();

  const allProjects = projects.concat(newProjects)

  const createProject = async function (projectInput: string) {
    const result = await APIprojects.postProjects(projectInput)
    const project = result.data as Project
    setNewProjects(projects => projects.concat(project))
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>PROJECTS</h1>
        <FormProject onSubmit={createProject}> </FormProject>
        <div className={styles.list}>
          {allProjects.map((project: Project) => {
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
  )
}

export default Projects;

export async function getServerSideProps(context: NextPageContext) {
  const redirect = {
    redirect: {
      destination: '/',
      permanent: false
    }
  }
  if (context.req === undefined || context.req.headers.cookie === undefined) {
    return redirect
  }
  const { token } = qs.parse(context.req.headers.cookie)
  if (typeof token !== 'string') {
    return redirect
  }
  setToken(token)
  try {
    console.log('token', token)
    const result = await APIprojects.getProjects();
    return {
      props: {
        projects: result
      }
    }

  } catch (error) {
    // remove token from cookie
    context.res?.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly')
    return redirect
  }
}
