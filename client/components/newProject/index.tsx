import React, { useState } from "react";
import styles from "../../styles/Projects.module.css";
import {
  Form,
  FormControl,
  TextInput,
  Button,
} from "@contentful/f36-components";

interface FormProject {
  children: React.ReactNode[] | React.ReactNode;
  onSubmit: (project: string) => Promise<void>;
}

export default function FormProject({
  onSubmit,
  children,
}: FormProject): JSX.Element {
  const [inputProject, setProject] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInput = function (
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setProject(event.target.value);
  };

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (inputProject) {
      await onSubmit(inputProject);
      setProject("");
    }
  };
  const submitForm = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  return (
    <div className={styles.projectForm}>
      {children}
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <FormControl.Label isRequired>Project</FormControl.Label>
          <TextInput
            value={inputProject}
            type="text"
            onChange={handleInput}
            placeholder="Write new project.."
          ></TextInput>
          <FormControl.HelpText marginTop="spacingXs" marginBottom="spacingXs">
            Please enter the project name
          </FormControl.HelpText>
          <Button variant="primary" type="submit" isDisabled={submitted}>
            {submitted ? "Submitted" : "Add"}
          </Button>
        </FormControl>
      </Form>
    </div>
  );
}
