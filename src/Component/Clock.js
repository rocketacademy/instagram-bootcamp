import { useEffect, useState } from "react";

export default function Clock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timerID);
  });

  return dateTime.toLocaleString();
}
