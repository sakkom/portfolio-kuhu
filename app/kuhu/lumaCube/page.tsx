"use client";

import { Article } from "@/app/comps/Article";
import LumaCube from "./LumaCube";
import { memo } from "./memo";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";

export default function Page() {
  const title = "GLSLスクール2025課題2";
  const date = "2025.11.29";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/kuhu/lumaCube`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<LumaCube />}
        memo={memo}
      />
    </div>
  );
}
