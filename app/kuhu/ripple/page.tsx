"use client";
// import Mosaic from "./Mosaic";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";
import { memo } from "./memo";
import { Article } from "../../comps/Article";
import Ripple from "./Ripple";

export default function Page() {
  const title = "uv座標のリップル効果";
  const date = "2025.11.10";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/ripple`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<Ripple isHome={false} />}
        memo={memo}
      />
    </div>
  );
}
