"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const handleClick = () => {
      const ctx = new AudioContext();
      const oscillatorNode = ctx.createOscillator();
      const speaker = ctx.destination;
      oscillatorNode.connect(speaker);
      oscillatorNode.start();
    };

    window.addEventListener("click", handleClick, { once: true });
    return () => removeEventListener("click", handleClick);
  }, []);

  return <div>click</div>;
}
