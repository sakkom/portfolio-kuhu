"use client";
import { useEffect, useRef, useState } from "react";
import style from "./RotateChar.module.css";
import Link from "next/link";

const FONTS = ["Georgia", "Impact", "Helvetica"];

interface RotateCharProps {
  text: string;
}

//[0, 1]
function fCharRand(text: string): Array<number> {
  return text.split("").map(() => Math.random());
}

//start not 0
const useUnixTime = () => {
  const [t, setT] = useState<number>(0);
  useEffect(() => {
    let id: number;
    // let count: number = 0;
    const animate = () => {
      // console.log(count++);
      setT(Date.now() * 0.001);
      id = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);
  return t;
};

export const RotateChar = ({ text }: RotateCharProps) => {
  const [charRand, setCharRand] = useState<Array<number>>([]);
  const unixTime = useUnixTime();

  useEffect(() => {
    const result = fCharRand(text);
    setCharRand(result);
  }, [text]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {charRand.length > 0 &&
        text.split("").map((char, i) => {
          const scaleY = 500; //[0, 500px]
          const scaleR = 10; //[0, 360 * scaleR deg]
          const trans = `translateY(${charRand[i] * scaleY}px) rotate(${charRand[i] * 360 * scaleR}deg)`;

          //useEffectの発火の前にアニメーションが発火しバグが出る可能性あり
          const delay = charRand[i]; /* + 遅延 */ //[0, 1]

          const range = 30;
          const afterRotate = charRand[i] * range - range / 2;

          const phase = unixTime * 0.15;
          const fontI = Math.floor(
            (charRand[i] * text.length + phase) % FONTS.length,
          );

          return (
            <span
              key={i}
              className={style.animated}
              style={{
                width: "2rem",
                opacity: 0,
                fontSize: "2.5rem",
                transform: trans,
                fontFamily: FONTS[fontI],
                ["--afterRotate" as any]: `${afterRotate}deg`,
                ["--delay" as any]: `${delay}s`,
              }}
            >
              {char}
            </span>
          );
        })}
    </div>
  );
};
