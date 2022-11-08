interface ProjectId {
  project_id: number;
}

export const Bugtracker = {
  config: function (project_id: ProjectId) {
    return window.addEventListener("error", (event: ErrorEvent) => {
      event.currentTarget;
      if (event.currentTarget instanceof Window) {
        const target = event.currentTarget;

        if (target.navigator instanceof Navigator) {
          const user_agent: string = target.navigator.userAgent;
          const platform: string | undefined =
            target.navigator.userAgentData?.platform;
          const browser: string | undefined =
            target.navigator.userAgentData?.brands[1].brand;
          const language: string | undefined = target.navigator.language;
          const mobile: boolean | undefined =
            target.navigator.userAgentData?.mobile;
          const stack: string = event.error.stack;

          const payload = JSON.stringify({
            project_id,
            message: event.message,
            stack_trace: stack,
            metadata: {
              user_agent,
              browser,
              mobile,
              platform,
              language,
            },
          });
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          fetch("http://localhost:8080/events", {
            method: "POST",
            body: payload,
            headers: myHeaders,
          }).then((res) => res.json());
        }
      }
    });
  },
};
