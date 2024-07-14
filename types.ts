export type TaskType = {
    id: string;
    title: string;
    body: string;
    times: { startTime: Date; endTime: Date }[];
    state: "completed" | "in-progress" | "new";
  };
  
export type GoogleUserObj = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean
}