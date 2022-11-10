import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIOccurrences } from "../../../../../../lib/api";
import styles from "./OccurrenceId.module.css";
import { NextPageWithLayout } from "../../../../../_app";
import type { ReactElement } from "react";
import Layout from "../../../../../../components/layout";
import { NavbarLink } from "../../../../../../components/navbar";
import { useUser } from "../../../../../../lib/auth";

interface Occurrence {
  _id: string;
  project_id: number;
  bug_id: string;
  message: string;
  stack_trace: string;
  metadata: Metadata;
}

interface Metadata {
  user_agent: string;
  browser: string;
  mobile: boolean;
  platform: string;
  language: string;
}

const Occurrence: NextPageWithLayout = () => {
  const [occurrenceDetails, setOccurrenceDetails] = useState<any>({});

  const router = useRouter();
  const { id: bugId, occurrenceId } = router.query;
  useUser()


  useEffect(() => {
    getOccurrence();
  }, [bugId, occurrenceId]);

  async function getOccurrence() {
    if (typeof bugId !== "string" || typeof occurrenceId !== "string") {
      return;
    }
    const result = await APIOccurrences.ocurrenceDetails(bugId, occurrenceId);
    setOccurrenceDetails(result?.data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h3 className={styles.infoTitle}>Occurrence details</h3>
        <div className={styles.content}>
          <p>
            <span>ID:</span> {occurrenceDetails._id}
          </p>
          <p>
            <span>PROJECT_ID:</span> {occurrenceDetails.project_id}
          </p>
          <p>
            <span>BUG_ID: </span> {occurrenceDetails.bug_id}
          </p>
          <p>
            <span>MESSAGE:</span> {occurrenceDetails.message}
          </p>
          <p>
            <span>STACK_TRACE: </span> {occurrenceDetails.stack_trace}
          </p>
        </div>
      </div>
    </div>
  );
};

Occurrence.getLayout = function getLayout(component: ReactElement, pageProps: any) {
  const router = useRouter();
  const { projectId, bugId } = router.query;


  console.log('pageProps', pageProps)
  const links: NavbarLink[] = [
    { url: "/projects", text: "Home" },
    { url: `/projects/${projectId}`, text: "Project" },
    { url: `/projects/${projectId}/bugs/${bugId}`, text: "Bug" },
  ];

  return <Layout links={links}>{component}</Layout>;
};

export default Occurrence;
