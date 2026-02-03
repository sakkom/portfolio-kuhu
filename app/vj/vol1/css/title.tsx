"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Gravitas_One, Rubik_Pixels } from "next/font/google";

const gravitas = Gravitas_One({
  weight: "400",
  subsets: ["latin"],
});

const rubik = Rubik_Pixels({
  weight: "400",
  subsets: ["latin"],
});

const shuffleFonts = [rubik.style, { fontFamily: "Georgia" }, gravitas.style];
const title = "PanicmindInBAKERY2F";

export const Title = ({
  context,
  isTitle,
  color,
}: {
  context: any;
  isTitle: boolean;
  color: number;
}) => {
  const [charRand, setCharRand] = useState<number[]>([]);
  const [charRand1, setCharRand1] = useState<number[]>([]);
  const [unixTime, setUnixTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const clock = new THREE.Clock();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!context) return;
    const currentTime = Date.now().toString();
    setUnixTime(currentTime);
    setCharRand(title.split("").map(() => Math.random()));
    setCharRand1(currentTime.split("").map(() => Math.random()));

    let aniId: number;
    const loop = () => {
      const currentTime = Date.now().toString();
      setUnixTime(currentTime);
      if (context?.onBeat) {
        setCharRand(title.split("").map(() => Math.random()));
        setCharRand1(currentTime.split("").map(() => Math.random()));
      }
      aniId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(aniId);
  }, [context?.onBeat]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        // display: isTitle ? "flex" : "none",
        display: "flex",
        opacity: isTitle ? 1.0 : 0.0,
        transition: "opacity 0.5s linear",
      }}
    >
      {title.split("").map((char, i) => {
        const fontIndex = Math.floor((charRand[i] || 0) * shuffleFonts.length);
        return (
          <div
            key={i}
            style={{
              ...shuffleFonts[fontIndex],
              fontSize: 25,
              color: `hsl(0, 0%, ${(1.0 - color) * 100}%)`,
              // color: `hsl(${charRand[i] * 360}, 100%, 50%)`,
            }}
          >
            {char}
          </div>
        );
      })}
      {unixTime.split("").map((char, i) => {
        const fontIndex = Math.floor((charRand1[i] || 0) * shuffleFonts.length);
        return (
          <div
            key={`unix-${i}`}
            style={{
              ...shuffleFonts[fontIndex],
              fontSize: 25,
              // color: color ? "black" : "white",
              color: `hsl(0, 0%, ${(1.0 - color) * 100}%)`,
              // color: `hsl(${charRand[i] * 360}, 100%, 50%)`,
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};
