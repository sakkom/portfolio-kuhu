"use client";
import { Article } from "@/app/comps/Article";
import RandVertex from "./RandomVertex";
import { memo } from "./memo";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";

export default function Page() {
  const title = "GLSLスクール2025課題1・頂点シェーダー";
  const date = "2025.11.18";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/randVertex`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<RandVertex />}
        memo={memo}
      />
    </div>
  );
}
