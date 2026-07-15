import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { hebrewsArticles } from "@/lib/articles";

const articleDisplayOrder = [
  "how-to-read-hebrews",
  "who-wrote-hebrews-pauline-authorship",
  "jesus-in-hebrews",
  "heavenly-sanctuary-in-hebrews",
  "within-the-veil-hebrews-6-19-20",
  "through-the-veil-his-flesh-hebrews-10-19-20",
  "which-veil-christs-ascension-1844-judgment",
  "once-for-all-still-ministering-cross-priesthood",
  "cleansing-heavenly-sanctuary-hebrews-daniel-1844",
  "jesus-priest-forever-melchizedek-superior-priesthood",
  "better-covenant-law-written-on-heart",
  "sabbath-rest-still-remains-hebrews-3-4",
  "can-a-believer-fall-away-warning-passages-hebrews",
  "faith-resurrection-better-country-hebrews-11",
  "mount-zion-unshakable-kingdom"
];

const articleDisplayRank = new Map(articleDisplayOrder.map((slug, index) => [slug, index]));
const orderedHebrewsArticles = [...hebrewsArticles].sort(
  (a, b) => (articleDisplayRank.get(a.slug) ?? 999) - (articleDisplayRank.get(b.slug) ?? 999)
);

export const metadata: Metadata = {
  title: "Hebrews Articles",
  description: "Long-form guides for reading Hebrews with historical setting, structure, and theological clarity."
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <section className="articles-hero" aria-labelledby="articles-title">
        <div className="articles-hero-copy">
          <h1 id="articles-title">Articles</h1>
          <p>
            Dive deeper into Hebrews through focused studies on its setting, priesthood, covenant, sanctuary
            message, and call to perseverance.
          </p>
        </div>
      </section>

      <section className="articles-shell" aria-label="Hebrews article library">
        <div className="articles-grid">
          {orderedHebrewsArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="article-list-card">
              <span className="article-list-icon" aria-hidden="true">
                <FileText className="h-5 w-5" />
              </span>
              <span className="article-list-eyebrow">{article.eyebrow}</span>
              <strong>{article.title}</strong>
              <span>{article.summary}</span>
              <em>
                Read Article
                <ArrowRight className="h-4 w-4" />
              </em>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
