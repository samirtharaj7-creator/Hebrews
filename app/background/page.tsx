import type { Metadata } from "next";
import { BookOpen, CalendarDays, MapPinned, Users } from "lucide-react";
import { getBackgroundContent, type BackgroundBlock, type BackgroundFact } from "@/lib/background";

export const metadata: Metadata = {
  title: "Introduction to the Book of Hebrews",
  description: "Explore the authorship, date, audience, literary form, biblical world, structure, and purpose of Hebrews."
};

function FactIcon({ icon }: { icon: BackgroundFact["icon"] }) {
  if (icon === "location") return <MapPinned className="h-5 w-5" />;
  if (icon === "period") return <CalendarDays className="h-5 w-5" />;
  if (icon === "mission") return <Users className="h-5 w-5" />;
  return <BookOpen className="h-5 w-5" />;
}

function BackgroundBlockView({ block, sectionTitle }: { block: BackgroundBlock; sectionTitle: string }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "subsection") {
    return (
      <section className="background-subsection">
        <h3>{block.title}</h3>
        {block.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
    );
  }
  return (
    <div className="background-table-wrap" role="region" aria-label={`${sectionTitle}: ${block.title}`} tabIndex={0}>
      <table className="background-data-table">
        <caption className="sr-only">{block.title}</caption>
        <thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0]}>{row.map((cell, index) => <td key={`${index}-${cell.slice(0, 24)}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BackgroundPage() {
  const content = getBackgroundContent();
  return (
    <main className="background-page hebrews-background-page">
      <section className="background-hero" aria-labelledby="background-title">
        <div className="background-hero-copy">
          <p className="background-kicker"><BookOpen className="h-4 w-4" />Introduction</p>
          <h1 id="background-title">{content.title}</h1>
          <p className="background-subtitle">{content.subtitle}</p>
        </div>
      </section>
      <section className="background-section-nav" aria-label="Introduction page sections">
        <div className="background-section-nav-scroll"><nav>
          {content.sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>
          ))}
        </nav></div>
      </section>
      <section className="background-shell" aria-label="Introduction to Hebrews">
        <div className="background-study">
          <section className="background-summary" aria-labelledby="background-reading-lens">
            <p id="background-reading-lens" className="background-section-label">Reading Lens</p>
            {content.readingLens.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="background-fact-grid" aria-label="Hebrews introduction facts">
            {content.facts.map((fact) => (
              <article key={fact.label} className="background-fact-card"><FactIcon icon={fact.icon} /><h2>{fact.label}</h2><p>{fact.value}</p></article>
            ))}
          </section>
          <div className="background-section-list">
            {content.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="background-section">
                <span className="background-section-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="background-section-body">
                  <span className="background-scope">{section.scope}</span><h2>{section.title}</h2>
                  {section.blocks.map((block, blockIndex) => <BackgroundBlockView key={`${section.id}-${block.type}-${blockIndex}`} block={block} sectionTitle={section.title} />)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
