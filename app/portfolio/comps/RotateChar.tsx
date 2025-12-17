"use client";
import { useEffect, useState } from "react";
import style from "./RotateChar.module.css";
import Link from "next/link";

const FONTS = ["Georgia", "Impact", "Helvetica"];

interface RotateCharProps {
  text: string;
  wheelRatio: number;
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

export const RotateChar = ({ text, wheelRatio }: RotateCharProps) => {
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
          /*start animation*/
          const scaleY = 500; //[0, 500px]
          const scaleR = 10; //[0, 360 * scaleR deg]
          const trans = `translateY(${charRand[i] * scaleY}px) rotate(${charRand[i] * 360 * scaleR}deg)`;
          /*useEffectの発火の前にアニメーションが発火しバグが出る可能性あり*/
          const delay = charRand[i]; /* + 遅延 */ //[0, 1]

          /*after rotate animation props*/
          const range = 30;
          const afterRotate = charRand[i] * range - range / 2;

          /*after chagne font animation*/
          const phase = unixTime * 0.15;
          const fontI = Math.floor(
            (charRand[i] * text.length + phase) % FONTS.length,
          );

          const ratioRange = charRand[i] * 500 - 250;
          const rI = text.length - 1 - i;
          const wave =
            Math.sin((rI + 1) * wheelRatio * 1) *
            Math.pow(wheelRatio, 5) *
            1000;
          // const waveX = Math.sin((rI + 1) * wheelRatio * 1) * -100;

          return (
            <div
              key={i}
              style={{
                width: "2rem",
                transform: `translate(${0}px, ${wave}px)`,
              }}
            >
              <span
                // key={i}
                className={style.animated}
                style={{
                  display: "inline-block",
                  opacity: 0,
                  // fontSize: "2.5rem",
                  fontSize: `${(1 - wheelRatio) * 2.0}rem`,
                  transform: trans,
                  filter: `blur(${wheelRatio * 5}px)`,
                  fontFamily: FONTS[fontI],
                  ["--afterRotate" as any]: `${afterRotate}deg`,
                  ["--delay" as any]: `${delay}s`,
                }}
              >
                {char}
              </span>
            </div>
          );
        })}
    </div>
  );
};
