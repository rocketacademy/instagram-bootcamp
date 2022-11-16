import { Spinner } from "react-bootstrap";

export function LoadingSpinners({ variant }) {
  return (
    <>
      <Spinner animation="grow" variant={variant} size="md" />
      <Spinner animation="grow" variant={variant} size="md" />
      <Spinner animation="grow" variant={variant} size="md" />
    </>
  );
}
