import { loadHebrews } from "./hebrews-content-utils.mjs";

const chapters = loadHebrews();
const errors = [];
let verseTotal = 0;

const emptyVerseFields = [
  "explanation",
  "historicalBackground",
  "literaryContext",
  "theologicalInsight",
  "structuralNotes",
  "relatedConnection",
  "application"
];
const emptyCommentaryFields = [
  "exegesis",
  "historicalBackground",
  "technicalNotes",
  "theologicalInsight",
  "structuralNotes",
  "otherCommentaryInsights",
  "application"
];
const allowedReviewStatuses = new Set(["verified-seed", "needs-source-review", "placeholder"]);

function validatePrivateFieldsAreEmpty(value, field, errors) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => validatePrivateFieldsAreEmpty(entry, `${field}[${index}]`, errors));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    const childField = `${field}.${key}`;
    if (key === "sources" || key === "reviewFlags") {
      if (!Array.isArray(child)) errors.push(`${childField} must be an array`);
      else if (child.length) errors.push(`${childField} must remain empty`);
      continue;
    }
    if (key === "sourceAudit") {
      if (!child || typeof child !== "object" || Array.isArray(child)) {
        errors.push(`${childField} must be an object of empty arrays`);
      } else {
        for (const [category, values] of Object.entries(child)) {
          if (!Array.isArray(values)) errors.push(`${childField}.${category} must be an array`);
          else if (values.length) errors.push(`${childField}.${category} must remain empty`);
        }
      }
      continue;
    }
    validatePrivateFieldsAreEmpty(child, childField, errors);
  }
}

for (const { chapterNumber, expectedVerses, path, content } of chapters) {
  if (content.chapterNumber !== chapterNumber) errors.push(`${path}: chapterNumber must be ${chapterNumber}`);
  if (content.verses.length !== expectedVerses) errors.push(`${path}: expected ${expectedVerses} verses, found ${content.verses.length}`);
  if (!content.title?.trim() || !content.summary?.trim() || !content.literaryContext?.trim()) {
    errors.push(`${path}: title, summary, and literaryContext must be populated`);
  }

  verseTotal += content.verses.length;
  content.verses.forEach((verse, index) => {
    const expectedReference = `Hebrews ${chapterNumber}:${index + 1}`;
    if (verse.verse !== expectedReference) errors.push(`${path}: found ${verse.verse}; expected ${expectedReference}`);
    if (!verse.bibleText?.trim()) errors.push(`${expectedReference}: missing KJV text`);
    if (!verse.commentary?.detailedExplanation?.trim()) errors.push(`${expectedReference}: missing detailed commentary`);
    if (!allowedReviewStatuses.has(verse.reviewStatus)) errors.push(`${expectedReference}: invalid reviewStatus ${verse.reviewStatus}`);

    for (const field of emptyVerseFields) {
      if (verse[field]?.trim()) errors.push(`${expectedReference}: public prose must remain in commentary.detailedExplanation; ${field} is populated`);
    }
    for (const field of emptyCommentaryFields) {
      if (verse.commentary[field]?.trim()) errors.push(`${expectedReference}: commentary.${field} must remain empty`);
    }
    if (verse.wordNotes.length > 2) errors.push(`${expectedReference}: wordNotes may contain at most two entries`);
    const wordNoteTerms = new Set();
    verse.wordNotes.forEach((note, noteIndex) => {
      const label = `${expectedReference}: wordNotes[${noteIndex}]`;
      if (!note.term?.trim()) errors.push(`${label}.term must be populated`);
      else if (wordNoteTerms.has(note.term.trim())) errors.push(`${label}.term duplicates another Word / Phrase Note`);
      else wordNoteTerms.add(note.term.trim());
      if (!note.explanation?.trim() || note.explanation.trim().length < 40) errors.push(`${label}.explanation must contain substantive contextual explanation`);
      const hasGreek = /[\u0370-\u03ff\u1f00-\u1fff]/u.test(note.term);
      if (hasGreek && !/[([](?=[^)\]]*\p{Script=Latin})[\p{Script=Latin}\p{Mark}'’ .,/;:·…–—-]+[)\]]/u.test(note.term)) {
        errors.push(`${label}.term must pair Greek text with a transliteration`);
      }
      const scriptureReferences = new Set();
      for (const reference of note.scriptureReferences) {
        if (!/^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d+:\d+(?:[-–]\d+)?$/.test(reference)) {
          errors.push(`${label}.scriptureReferences contains an invalid reference: ${reference}`);
        }
        if (scriptureReferences.has(reference)) errors.push(`${label}.scriptureReferences contains a duplicate reference: ${reference}`);
        scriptureReferences.add(reference);
      }
    });
  });

  validatePrivateFieldsAreEmpty(content, path, errors);
}

if (verseTotal !== 303) errors.push(`Expected 303 total verses, found ${verseTotal}`);

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`Content validation passed: ${chapters.length} chapters and ${verseTotal} complete KJV/commentary records.`);
