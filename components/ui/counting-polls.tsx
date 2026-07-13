"use client";

import { useEffect, useState } from "react";
import { animate } from "motion/react";

export function CountingPolls() {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, 1000, {
      duration: 2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      },
    });
    return controls.stop;
  }, []);

  return <span className="tabular-nums">{displayValue.toLocaleString()}</span>;
}
