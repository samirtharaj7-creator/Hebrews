import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function HeroSection() {
  return (
    <section className="home-showcase">
      <div className="home-showcase-shell">
        <section className="home-showcase-hero" aria-labelledby="home-title">
          <div className="home-showcase-copy">
            <p className="home-title-prefix">The Letter to the</p>
            <h1 id="home-title">Hebrews</h1>
            <p className="home-showcase-description">
              Read the King James text of Hebrews with a chapter-by-chapter guide and verse-by-verse study notes.
            </p>
            <div className="home-showcase-actions">
              <Link href="/hebrews/1" className="home-showcase-primary">
                Read chapter 1 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/background" className="home-showcase-secondary">Explore the introduction</Link>
            </div>
          </div>
        </section>
        <section className="home-chapter-study" aria-labelledby="home-chapter-title">
          <div className="home-section-split">
            <div><p className="home-section-kicker">13 chapters</p><h2 id="home-chapter-title">Choose a chapter to begin.</h2></div>
            <p id="content-status">The complete KJV text and verse-by-verse commentary are ready for study.</p>
          </div>
          <div className="home-chapter-group-grid">
            <article className="home-chapter-group">
              <BookOpen className="home-chapter-group-icon h-6 w-6" />
              <p>New Testament · 13 Chapters</p><h3>Hebrews</h3>
              <div className="home-chapter-mini-grid">
                {Array.from({ length: 13 }, (_, index) => index + 1).map((chapter) => (
                  <Link key={chapter} href={`/hebrews/${chapter}`} aria-label={`Hebrews chapter ${chapter}`}>
                    <span>Hebrews</span><strong>Chapter {chapter}</strong>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
