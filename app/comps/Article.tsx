"use client";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
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
        justifyContent: "center",
      }}
    >
      <div className="container">
        <div style={{ rotate: "0deg" }}>
          <div
            style={{
              backgroundColor: "#111111",
              // backgroundColor: "#111111",
              padding: "0vmin 2vmin",
              fontSize: "0.7rem",
              fontWeight: "bold",
              // marginLeft: "3vmin",
              // display: "inline-block",
              // width: "33%",
              width: "max-content",
              // height: "max-content",
              // rotate: "-5deg",
            }}
            className="date"
          >
            <h5
              style={{
                textAlign: "center",
              }}
            >
              {date}
            </h5>
          </div>
          <div
            style={{
              width: "66%",
              backgroundColor: "#111111",
              padding: "0vmin 2vmin",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "1vmin",
              fontSize: "0.8rem",
              // rotate: "-5deg",
            }}
          >
            <h4>Github：</h4>
            <Link
              href={link}
              style={{
                color: "inherit",
                fontSize: "0.8rem",
                // wordBreak: "break-all",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {link}
            </Link>
          </div>
        </div>

        <div style={{ display: "block", lineHeight: 0, padding: "5vmin" }}>
          {canvas}
        </div>
        <div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              backgroundColor: isOpen ? "#111111" : "#111111",
              border: "1px solid #111111",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1vmin 2vmin",
              // marginTop: "vmin",
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

              <h2>{title}</h2>
            </div>
          </div>
          {isOpen && (
            <div
              style={{
                // backgroundColor: "#111111",
                padding: "3vmin",
                border: "1px solid #111111",
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
