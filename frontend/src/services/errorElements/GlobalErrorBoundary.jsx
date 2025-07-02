import { useRouteError } from "react-router-dom";

export default function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return <div>ERROR !</div>;
}
