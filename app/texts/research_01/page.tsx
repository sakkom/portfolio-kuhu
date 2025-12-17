"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { textMetaball } from "./shader";

function splitRandom(text: string): Array<number> {
  const length = text.length - 1;
  const randoms = [];
  const random = text.split("").map(() => {
    return Math.random() * length;
  });

  return [];
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transforms, setTransforms] = useState<string[]>([]);

  const [transforms2, setTransforms2] = useState<string[]>([]);
  const [gridTransforms, setGridTransforms] = useState<string[]>([]);
  const [trails, setTrails] = useState<
    Array<{ size: number; x: number; y: number; hue: number; id: number }>
  >([]);
  const [textColors, setTextColors] = useState<Array<{ hue: number }>>([]);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const cam = new THREE.PerspectiveCamera(
      45,
      canvasWidth / canvasHeight,
      0.1,
      100,
    );
    cam.position.set(0, 0, 1.0);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(textMetaball);
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );

    const points = new THREE.Mesh(geometry, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);

      material.uniforms.uTime.value += 0.0167;

      renderer.render(scene, cam);
    };

    animate();
  }, []);

  const hello = "  Hello  ";
  const myNameIs = "  MY NAME IS";
  const contact = "Profile";
  const profileText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";

  useEffect(() => {
    const s = contact.split("").map(
      () => {
        // return `translate(${Math.random() * 500}px, ${0}px) rotate(${Math.random() * 360 * 10}deg)`;
        return `translate(${Math.random() * 500}px, 0px) rotate(${Math.random() * 360 * 10}deg)`;
      },
      // `translate(${Math.random() * -500}px, 0px) rotate(${Math.random() * 360 * 10}deg)`,
    );
    const s2 = profileText.split("").map(() => {
      // if (Math.random() > 0.5) {
      // return `translate(${Math.random() * 500}px, ${0}px) rotate(${Math.random() * 360 * 10}deg)`;
      return `translate(${0}px, ${Math.random() * 500}px) rotate(${Math.random() * 360 * 5}deg)`;
      // } else {
      //   return `translate(${0}px, ${Math.random() * 500}px) rotate(${Math.random() * 360 * 5}deg)`;
      // }
    });
    const gridColors: string[] = [];
    Array.from({ length: 125 }).map(() => {
      const t = `translate( ${Math.random() * 500 - 250}px, 0px) rotate(${Math.random() * 360 * 5}deg)`;
      gridColors.push(t);
    });
    setTransforms(s);
    setTransforms2(s2);
    setGridTransforms(gridColors);
  }, []);

  const clock = new THREE.Clock();
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        size: Math.random() * 75,
        x: e.clientX,
        y: e.clientY,
        // hue: clock.getElapsedTime() * 360,
        hue: Math.random() * 360,
        id: Math.random() + Date.now(),
      };
      setTrails((prev) => [...prev, newTrail].slice(-20));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //text color
  const textColorText = "Hello  Color  Text";
  useEffect(() => {
    let aniId: number;
    const animate = () => {
      const time = clock.getElapsedTime();

      const hues = profileText.split("").map((char, index) => {
        // 複数のsin波を重ねる
        const noise1 = Math.sin(time * 0.4 + index * 10.0) * 0.5 + 0.5;
        // const noise2 = Math.sin(time * 0.6 + index * 0.5 + 50) * 0.5 + 0.5;
        // const noise3 = Math.sin(time * 0.8 + index * 0.4 + 150) * 0.5 + 0.5;
        // const noise4 = Math.sin(time * 1.0 + index * 0.6 + 300) * 0.5 + 0.5;

        // const combined = (noise1 + noise2 + noise3 + noise4) / 4;
        // if (index === 0) console.log("noise:", combined);

        return { hue: noise1 }; // 0-1
      });

      setTextColors(hues);
      aniId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(aniId);
  }, []);
  const [randomRotations, setRandomRotations] = useState<number[][]>([]);

  useEffect(() => {
    const rotations = profileText.split("").map(() => [
      Math.random() * 20 - 10, // -10 ~ 10
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
    ]);
    setRandomRotations(rotations);
  }, []);

  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: "100px",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          overflowY: "hidden",
          fontFamily: "inter",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
          }}
        />
        <div
          style={{
            width: "50%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {profileText.split("").map((char, index) => {
            // const shffuleFont = [""];
            const shuffleFont = [
              // "Arial",
              // "Helvetica",
              "Georgia",
              // "Courier New",
              "Impact",
            ];
            const reverseIndex = profileText.length - 1 - index;
            return (
              <h1
                key={index}
                style={{
                  ["--r1" as any]: `${randomRotations[index]?.[0] || 0}deg`,
                  ["--r2" as any]: `${randomRotations[index]?.[1] || 0}deg`,
                  ["--r3" as any]: `${randomRotations[index]?.[2] || 0}deg`,
                  opacity: 0,
                  width: "1rem",
                  // height: "3rem",
                  fontFamily: `${shuffleFont[Math.floor(textColors[reverseIndex]?.hue * shuffleFont.length) % shuffleFont.length]}`,
                  // fontSize: `${2.0 + textColors[index]?.hue * 1}rem`,
                  fontSize: `1.5rem`,
                  // fontWeight: index * 1000,
                  // backgroundImage: `radial-gradient(circle,
                  //   hsl(0, 0%, ${((textColors[reverseIndex]?.hue || 0) / 360) * 100}%),
                  //   hsl(0, 0%, ${(((textColors[reverseIndex]?.hue || 0) + 60) / 360) * 100}%),
                  //   hsl(0, 0%, ${(((textColors[reverseIndex]?.hue || 0) + 120) / 360) * 0}%)
                  // )`,
                  // WebkitBackgroundClip: "text",
                  // backgroundClip: "text",
                  // WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  // color: textColors[index].hue > 0.5 ? `white` : "white",
                  color: "white",
                  transform: transforms2[index] || "none",
                  animation: `westSide 1.0s ease-in-out ${index * 0.01}s forwards,  subtleJitter 1.0s steps(3, jump-start)  2.0s infinite`,
                }}
              >
                {char}
              </h1>
            );
          })}
        </div>

        {/*マウス追従*/}
        {trails.map((trail, i) => (
          <div
            key={trail.id}
            style={{
              pointerEvents: "none",
              width: trail.size,
              height: trail.size,
              borderRadius: "50%",
              // backgroundColor: `hsl(${trail.hue}, 80%, 70%)`,
              // backgroundColor:
              //   i % 2
              //     ? `rgb(255, 255, 255, ${i / 20})`
              //     : "rgb(255, 255, 255, ${i / 20})",
              // border: `2px solid hsl(${trail.hue}, 100%, 80%, ${i / 20})`,
              border: `1px solid rgb(255, 255, 255, ${i / 20})`,
              position: "fixed",
              left: trail.x - trail.size / 2,
              top: trail.y - trail.size / 2,
              opacity: (20 - i) / 20,
              transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
              animation: `westSide 0.5s steps(3, jump-start) 0.1s forwards`,
            }}
          />
        ))}
        {/*HELLO COMP*/}
        {/*<div
          style={{
            width: "50%",
            color: "white",
          }}
        >
          <div
            style={{
              // border: "3px solid red",
              backgroundColor: "transparent",
              borderRadius: "10px 10px 0px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              {hello.split("").map((char, i) => {
                return Array.from({ length: 10 }).map((_, index) => {
                  const isLast = 10 - 1;
                  const gray = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
                  const hue = Math.random() * 360;
                  const color = `hsl(${hue}, 80%, 80%)`;

                  return (
                    <h1
                      key={`${i}-${index}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: i * 30,
                        flex: "display",
                        justifyContent: "center",
                        // transform: `translate(${Math.random} -100}px,${Math.random} * -100}px)`,
                        transform:
                          index == isLast
                            ? `translate(${Math.random() * 500}px, 0px) rotate(${Math.random() * 360 * 5}deg)`
                            : `translate(${index * Math.random() * 5 - 2.5}px, ${Math.random() * 20 - 10}px) rotate(${Math.random() * 360}deg)`,
                        // width: "10%",
                        // height: "10%",
                        backgroundColor:
                          // index == isLast ? "none" : "rgb(255,255,255, 0.3)",
                          index == isLast ? "none" : color,

                        color: index == isLast ? "black" : "transparent",
                        zIndex: index == isLast ? 100 : 0,
                        animation:
                          index != isLast
                            ? `scale 1.0s steps(3, jump-start) ${i * 0.1}s forwards`
                            : `westSide 1.0s ease-in ${i * 0.1}s forwards`,
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: 0,
                        height: 0,
                        // opacity: 0.5,
                      }}
                    >
                      {char}
                    </h1>
                  );
                });
              })}
              {myNameIs.split("").map((char, i) => {
                return Array.from({ length: 10 }).map((_, index) => {
                  const isLast = 10 - 1;
                  // const gray = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
                  const hue = Math.random() * 360;
                  const color = `hsl(${hue}, 80%, 80%)`;

                  return (
                    <h3
                      key={`${i}-${index}`}
                      style={{
                        position: "absolute",
                        top: 40,
                        left: i * 20,
                        // transform: `translate(${Math.random} -100}px,${Math.random} * -100}px)`,
                        transform:
                          index == isLast
                            ? `translate(0px,${Math.random() * 500}px) rotate(${Math.random() * 360 * 5}deg)`
                            : `translate(${index * Math.random() * 5 - 2.5}px, ${Math.random() * 15 - 7.5}px) rotate(${Math.random() * 360}deg)`,
                        // width: "25px",
                        // backgroundColor: index == isLast ? "whtie" : "white",
                        backgroundColor:
                          // index == isLast ? "none" : "rgb(255,255,255, 0.3)",/
                          index == isLast ? "none" : color,
                        color: index == isLast ? "black" : "transparent",
                        zIndex: index == isLast ? 100 : 0,
                        animation:
                          index != isLast
                            ? `scale 1.0s steps(3, jump-start) ${i * 0.1}s forwards`
                            : `westSide 1.0s ease-in ${i * 0.1}s forwards`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        // animationのため
                        width: 0,
                        height: 0,
                      }}
                    >
                      {char}
                    </h3>
                  );
                });
              })}
            </div>
          </div>
        </div>*/}
        {/*profile*/}
        {/*<div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            marginTop: "50px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {contact.split("").map((char, index) => (
              <h1
                key={index}
                style={{
                  fontFamily: "helvetica",
                  opacity: 0,
                  color: "white",
                  // WebkitTextStroke: "0.5px white",
                  // transform: `${index % 2 == 0 ? `translateX(${Math.random()}px) translateY(1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                  transform: transforms[index] || "none",
                  animation: `westSide 1.0s ease-in ${index * 0.1}s forwards`,
                }}
              >
                {char}
              </h1>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {profileText.split("").map((char, index) => (
              <h4
                key={index}
                style={{
                  fontFamily: "helvetica",
                  opacity: 0,
                  color: "white",
                  // WebkitTextStroke: "1px white",
                  // transform: `${index % 2 == 0 ? `translateX(${Math.random()}px) translateY(1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                  transform: transforms2[index] || "none",
                  animation: `westSide 1.0s ease-in ${(index + 50) * 0.01}s forwards `,
                }}
              >
                {char}
              </h4>
            ))}
          </div>
        </div>*/}
      </div>
    </>
  );
}
