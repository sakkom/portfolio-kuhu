"use client";
// import Mosaic from "./Mosaic";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";
import { memo } from "./memo";
import { Article } from "../comps/Article";
import LinearSinDistortion from "./Linear";

export default function Page() {
  const title = "uv座標の正弦波ディストーションでの揺らぎ";
  const date = "2025.11.02";
  const github = "https://github.com/sakkom/";

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={github}
        canvas={<LinearSinDistortion />}
        memo={memo}
      />
    </div>
  );
}
