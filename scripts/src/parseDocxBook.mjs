import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

const INPUT = join(ROOT, "attached_assets", "Capital_That_Serves_Life_1783154417084.docx");
const OUTPUT = join(ROOT, "artifacts", "book-reader", "src", "data", "book.json");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripAnchor(html) {
  return html.replace(/<a id="[^"]*"><\/a>/g, "").trim();
}

function normalizeChapterTitle(title) {
  return title.replace(/^(Chapter \d+|Prologue|Conclusion)\s*[—–-]\s*/, "$1: ");
}

function extractParagraphs(html) {
  const paragraphs = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(html)) !== null) {
    const inner = match[1].trim();
    if (!inner) continue;
    paragraphs.push(inner);
  }
  return paragraphs;
}

function parseDocxHtml(html) {
  const bookTitle = "Capital That Serves Life";
  const bookSubtitle = "Recovering Moral Economy in an Age of Extraction";

  // Strip everything before the first chapter heading (title page / TOC label)
  const firstH2Idx = html.indexOf("<h2>");
  if (firstH2Idx === -1) {
    console.error("No <h2> chapter headings found!");
    process.exit(1);
  }
  const mainContent = html.slice(firstH2Idx);

  const h2Regex = /<h2>([\s\S]*?)<\/h2>/g;
  const h2Matches = [...mainContent.matchAll(h2Regex)];

  const chapters = [];
  const warnings = [];

  for (let i = 0; i < h2Matches.length; i++) {
    const rawTitle = stripAnchor(h2Matches[i][1]);
    const chapterTitle = normalizeChapterTitle(rawTitle);
    const chapterStart = h2Matches[i].index + h2Matches[i][0].length;
    const chapterEnd = i + 1 < h2Matches.length ? h2Matches[i + 1].index : mainContent.length;
    const chapterContent = mainContent.slice(chapterStart, chapterEnd);

    const chapterSlug = slugify(chapterTitle);
    const chapter = { slug: chapterSlug, title: chapterTitle, sections: [] };

    const h3Regex = /<h3>([\s\S]*?)<\/h3>/g;
    const h3Matches = [...chapterContent.matchAll(h3Regex)];

    if (h3Matches.length === 0) {
      const paragraphs = extractParagraphs(chapterContent);
      if (paragraphs.length > 0) {
        chapter.sections.push({ slug: chapterSlug + "-intro", title: null, paragraphs });
      } else {
        warnings.push(`Chapter "${chapterTitle}" has no sections and no intro paragraphs.`);
      }
    } else {
      const beforeFirst = chapterContent.slice(0, h3Matches[0].index);
      const introParagraphs = extractParagraphs(beforeFirst);
      if (introParagraphs.length > 0) {
        chapter.sections.push({ slug: chapterSlug + "-intro", title: null, paragraphs: introParagraphs });
      }

      const usedSlugs = new Set();
      for (let j = 0; j < h3Matches.length; j++) {
        const sectionTitle = stripAnchor(h3Matches[j][1]);
        const sectionStart = h3Matches[j].index + h3Matches[j][0].length;
        const sectionEnd = j + 1 < h3Matches.length ? h3Matches[j + 1].index : chapterContent.length;
        const sectionContent = chapterContent.slice(sectionStart, sectionEnd);

        let sectionSlug = chapterSlug + "-" + slugify(sectionTitle);
        if (usedSlugs.has(sectionSlug)) {
          let n = 2;
          while (usedSlugs.has(`${sectionSlug}-${n}`)) n++;
          warnings.push(`Duplicate section title "${sectionTitle}" in chapter "${chapterTitle}" — de-duplicated slug.`);
          sectionSlug = `${sectionSlug}-${n}`;
        }
        usedSlugs.add(sectionSlug);

        const paragraphs = extractParagraphs(sectionContent);
        if (paragraphs.length === 0) {
          warnings.push(`Section "${sectionTitle}" in chapter "${chapterTitle}" has no paragraphs.`);
        }
        chapter.sections.push({ slug: sectionSlug, title: sectionTitle, paragraphs, subsections: [] });
      }
    }

    chapters.push(chapter);
  }

  return { book: { title: bookTitle, subtitle: bookSubtitle, chapters }, warnings };
}

console.log("Converting DOCX to HTML via mammoth...");
const result = await mammoth.convertToHtml({ path: INPUT });
console.log(`Converted ${result.value.length} chars of HTML`);
if (result.messages.length > 0) {
  console.log(`Mammoth messages (${result.messages.length}):`);
  result.messages.slice(0, 10).forEach((m) => console.log(`  [${m.type}] ${m.message}`));
}

writeFileSync(join(ROOT, "attached_assets", "_docx_convert_debug.html"), result.value, "utf-8");

console.log("\nParsing structure...");
const { book, warnings } = parseDocxHtml(result.value);

console.log(`\nParsed ${book.chapters.length} chapters`);
book.chapters.forEach((ch) => {
  console.log(`  ${ch.slug}: "${ch.title}" (${ch.sections.length} sections)`);
});

if (warnings.length > 0) {
  console.log(`\n${warnings.length} WARNINGS:`);
  warnings.forEach((w) => console.log("  - " + w));
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(book, null, 2), "utf-8");
console.log(`\nWritten to: ${OUTPUT}`);
