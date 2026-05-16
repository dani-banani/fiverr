import { useEffect, useState } from "react";

function useCountdown(seconds) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
}

export default useCountdown;