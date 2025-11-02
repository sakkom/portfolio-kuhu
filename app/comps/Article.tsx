"use client";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";
import glsl from "highlight.js/lib/languages/glsl";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface ArticleProps {
  title: string;
  date: string;
  link: string;
  canvas: React.ReactNode;
  memo: () => React.ReactNode;
}
export const Article = ({ title, date, link, canvas, memo }: ArticleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // hljs.initHighlighting();
      hljs.highlightAll();
    }
  }, [isOpen]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div
          style={{
            backgroundColor: "#111111",
            padding: "1vmin 2vmin",
            fontSize: "0.7rem",
            fontWeight: "bold",
            // marginLeft: "3vmin",
          }}
          className="date"
        >
          <h5>{date}</h5>
        </div>
        <div style={{ backgroundColor: "#111111", padding: "1vmin 2vmin" }}>
          <h2>{title}</h2>
        </div>

        <div
          style={{
            backgroundColor: "#111111",
            padding: "1vmin 2vmin",
            fontWeight: "bold",
            display: "flex",
            alignItems: "start",
            gap: "1vmin",
            fontSize: "0.8rem",
          }}
        >
          <h4>Github:</h4>
          <Link href={link}>{link}</Link>
        </div>

        {canvas}

        <div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              backgroundColor: "#111111",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1vmin 2vmin",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1vmin",
              }}
            >
              <ChevronDownIcon
                style={{
                  transform: `rotate(${isOpen ? "0deg" : "-90deg"})`,
                }}
              />

              <h2>Memo</h2>
            </div>
          </div>
          {isOpen && (
            <div
              style={{
                backgroundColor: "#111111",
                padding: "3vmin",
              }}
            >
              {memo()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
