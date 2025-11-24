import Image from "next/image";
import Link from "next/link";
import "@/app/styles/main.css";
import { articles, ArticleData } from "./data/articles";

export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          margin: "2vmin 0",
          backgroundColor: "#111111",
          color: "#dddddd",
          padding: "0vmin 2vmin",
        }}
      >
        <h3>2025November</h3>
      </div>
      <div id="main-container">
        {[...articles].reverse().map((a: ArticleData) => (
          <div key={a.id} style={{ padding: "2vmin 10vmin" }}>
            <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/${a.path}`}>
              <div style={{ backgroundColor: "#111111", padding: "0 2vmin" }}>
                <h1>{a.title}</h1>
              </div>

              <Image
                src={a.gif}
                alt={a.title}
                width={700}
                height={500}
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
