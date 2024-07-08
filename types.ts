export type TaskType = {
    title: string;
    body: string;
    times: { startTime: Date; endTime: Date }[];
    state: "completed" | "in-progress" | "new";
  };
  