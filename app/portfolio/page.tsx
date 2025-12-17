"use client";
import { RotateChar } from "./comps/RotateChar";
import { useEffect, useState } from "react";

export default function Page() {
  const profileText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
  const p0 = "Hello";
  const p1 = "MY NAME IS";
  const p2 = "sakama haruki";
  const [ratio, setRatio] = useState<number>(0);

  useEffect(() => {
    let counter = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      counter += e.deltaY;
      const r = (Math.abs(counter) / 100) % 1;
      setRatio(r);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflowY: "hidden",
        // backgroundColor: `hsl(${ratio * 360}, 50%, 50%)`,
      }}
    >
      <div>{ratio.toString()}</div>
      <div style={{ width: "50%" }}>
        {/*<RotateChar text={profileText} wheelRatio={ratio} />*/}
        <RotateChar text={p0} wheelRatio={ratio} />
        <RotateChar text={p1} wheelRatio={ratio} />
        <RotateChar text={p2} wheelRatio={ratio} />
      </div>
    </div>
  );
}
