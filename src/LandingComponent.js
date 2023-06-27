import { useState } from "react";
import HookComponent from "./HookComponent";

export default function LandingComponent() {
  const [show, setShow] = useState(false);

  return (
    <div>
      {show ? <HookComponent /> : <p>No Components here!</p>}
      <button onClick={() => setShow(!show)}>Show / Hide</button>
    </div>
  );
}
