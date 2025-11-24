// components/StreamforgeWrapper.tsx
import StreamforgeUI from "./StreamforgeUI";

export default function StreamforgeWrapper({
  initialTasks,
  user,
}: {
  initialTasks: any[];
  user: any;
}) {
  return <StreamforgeUI initialTasks={initialTasks} user={user} />;
}
