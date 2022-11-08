import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIBugs } from "../../../lib/api";
import { useUser } from "../../../lib/auth";
import styles from "../../../styles/BugsId.module.css";
import { Badge, DateTime } from "@contentful/f36-components";

interface Bug {
  id: string;
  message: string;
  solved_at: null;
  first_seen: string;
  last_seen: string;
  occurrences: Object[];
}

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

function Bug(): JSX.Element {
  const [bugdetails, setBugDetails] = useState<any>({});
  const [listoccurrences, setListOccurrences] = useState<any>([]);

  const router = useRouter()
  const id = router.query.id
  useUser()

  useEffect(() => {
    getBug();
  }, [id]);

  async function getBug() {
    if (typeof id !== "string") {
      return;
    }
    const result = await APIBugs.getBug(id);
    const bug = result?.data;
    const occurrences = result?.data.occurrences;
    setBugDetails(bug);
    setListOccurrences(occurrences);
  }
  const flag = function (bug: Bug | undefined) {
    return bug?.solved_at ? "Solved" : "To fix";
  };
  const variant = function (bug: Bug | undefined) {
    return bug?.solved_at ? "positive" : "negative";
  };

  return (
    <div className={styles.container}>
      <div className={styles.upBox}>
        <div className={styles.messageBox}>
          <Badge variant={variant(bugdetails)}>{flag(bugdetails)}</Badge>
          <h1 className={styles.titleProject}>
            <span>Bug message:</span> <br />
            {bugdetails.message}
          </h1>
        </div>
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Info</h3>
          <div className={styles.firstSeen}>
            <div className={styles.firstSeenTitle}>First Seen </div>
            <div className={styles.date}>
              <DateTime format="day" date={bugdetails.first_seen} />
            </div>
          </div>
          <div className={styles.lastSeen}>
            <div className={styles.lastSeenTitle}>Last Seen </div>
            <div className={styles.date}>
              <DateTime format="day" date={bugdetails.last_seen} />
            </div>
          </div>
          <div className={styles.numOccurrences}>
            <div className={styles.numOccurrencesTitle}>Num Occurrences</div>
            <div className={styles.date}>{bugdetails.num_occurences}</div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBox}></div>
      <h2 className={styles.occurrencesTitle}> Occurrences</h2>
      <div className={styles.line}></div>
      <div className={styles.gridTitles}>
        <h4> User Agent</h4>
        <h4> Browser</h4>
        <h4> Mobile</h4>
        <h4> Platform</h4>
        <h4> Language</h4>
      </div>
      <div className={styles.list}>
        {listoccurrences.map((occurrence: Occurrence) => {
          return (
            <Link
              key={occurrence._id}
              href={`/bugs/${bugdetails.bug_id}/occurrences/${occurrence._id}`}
            >
              <div className={styles.card}>
                <div className={styles.user_agent}>
                  {occurrence.metadata.user_agent}
                </div>
                <div className={styles.browser}>
                  {occurrence.metadata.browser}
                </div>
                <div className={styles.mobile}>
                  {occurrence.metadata.mobile}
                </div>
                <div className={styles.platform}>
                  {occurrence.metadata.platform}
                </div>
                <div className={styles.language}>
                  {occurrence.metadata.language}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Bug;
