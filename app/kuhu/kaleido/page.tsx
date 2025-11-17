"use client";
// import Mosaic from "./Mosaic";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";
import { memo } from "./memo";
import { Article } from "../../comps/Article";
import Kaleido from "./Kaleido";

export default function Page() {
  const title = "kaleido scope";
  const date = "2025.11.08";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/glitch`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<Kaleido isHome={false} />}
        memo={memo}
      />
    </div>
  );
}
