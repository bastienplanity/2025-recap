const mjml = require("mjml");
const fs = require("fs");
const path = require("path");

const mjmlPath = path.join(__dirname, "..", "mail", "mjml", "2025_recap.mjml");
const dataShortPath = path.join(__dirname, "..", "data", "data_short.json");
const dataLongPath = path.join(__dirname, "..", "data", "data_long.json");
const dataShortDePath = path.join(
  __dirname,
  "..",
  "data",
  "data_short_de.json"
);
const dataLongDePath = path.join(__dirname, "..", "data", "data_long_de.json");
const linksFrPath = path.join(__dirname, "..", "data", "links_fr.json");
const i18nFrPath = path.join(__dirname, "..", "data", "i18n_fr.json");
const linksDePath = path.join(__dirname, "..", "data", "links_de.json");
const i18nDePath = path.join(__dirname, "..", "data", "i18n_de.json");
const outputDir = path.join(__dirname, "..", "mail", "html");

function replaceVariables(
  html,
  data,
  futureSectionPaddingTop = "20"
) {
  let result = html;

  // Replace futureSectionPaddingTop
  result = result.replace(
    /\{\{futureSectionPaddingTop\}\}/g,
    futureSectionPaddingTop
  );

  // Replace Handlebars variables (i18n first, then data)
  // This allows variables like {{pct_online_appts}} inside i18n strings to be replaced
  if (data) {
    // Multiple passes to handle nested variables (e.g., {{pct_online_appts}} inside i18n strings)
    let previousResult = "";
    let iterations = 0;
    const maxIterations = 10; // Safety limit to avoid infinite loops

    while (result !== previousResult && iterations < maxIterations) {
      previousResult = result;
      iterations++;

      Object.keys(data).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        result = result.replace(regex, data[key]);
      });
    }

    if (iterations >= maxIterations) {
      console.warn("⚠️  Maximum iterations reached in replaceVariables");
    }
  }

  return result;
}

try {
  // Compile MJML to HTML
  const mjmlTemplate = fs.readFileSync(mjmlPath, "utf8");
  const { html: compiledHtml, errors } = mjml(mjmlTemplate, {
    minify: false,
    validationLevel: "soft",
  });

  if (errors.length > 0) {
    console.warn("⚠️  MJML warnings:");
    errors.forEach((error) => console.warn(`  - ${error.message}`));
  }

  // Load links and i18n for French templates
  const linksFr = JSON.parse(fs.readFileSync(linksFrPath, "utf8"));
  const i18nFr = JSON.parse(fs.readFileSync(i18nFrPath, "utf8"));

  // Load links and i18n for German templates
  const linksDe = JSON.parse(fs.readFileSync(linksDePath, "utf8"));
  const i18nDe = JSON.parse(fs.readFileSync(i18nDePath, "utf8"));

  // ===== FRENCH TEMPLATES =====
  // Generate fr_short.html
  const dataShort = JSON.parse(fs.readFileSync(dataShortPath, "utf8"));
  const dataShortWithLinks = { ...dataShort, ...linksFr, ...i18nFr };
  const shortHtml = replaceVariables(
    compiledHtml,
    dataShortWithLinks,
    "20"
  );
  fs.writeFileSync(path.join(outputDir, "fr_short.html"), shortHtml, "utf8");
  console.log("✅ fr_short.html généré");

  // Generate fr_long.html
  const dataLong = JSON.parse(fs.readFileSync(dataLongPath, "utf8"));
  const dataLongWithLinks = { ...dataLong, ...linksFr, ...i18nFr };
  const longHtml = replaceVariables(compiledHtml, dataLongWithLinks, "20");
  fs.writeFileSync(path.join(outputDir, "fr_long.html"), longHtml, "utf8");
  console.log("✅ fr_long.html généré");

  // Generate fr_no_dynamic.html (without dynamic KPIs and disclaimer)
  let noDynamicHtmlFr = compiledHtml;
  noDynamicHtmlFr = noDynamicHtmlFr.replace(
    /<!-- START_DYNAMIC_SECTION -->[\s\S]*?<!-- END_DYNAMIC_SECTION -->/gi,
    ""
  );
  noDynamicHtmlFr = replaceVariables(
    noDynamicHtmlFr,
    { ...linksFr, ...i18nFr },
    "0"
  );
  noDynamicHtmlFr = noDynamicHtmlFr.replace(/\{\{[^}]+\}\}/g, "");
  fs.writeFileSync(
    path.join(outputDir, "fr_no_dynamic.html"),
    noDynamicHtmlFr,
    "utf8"
  );
  console.log(
    "✅ fr_no_dynamic.html généré (sections dynamiques complètement supprimées)"
  );

  // ===== GERMAN TEMPLATES =====
  // Generate de_short.html
  const dataShortDe = JSON.parse(fs.readFileSync(dataShortDePath, "utf8"));
  const dataShortDeWithLinks = { ...dataShortDe, ...linksDe, ...i18nDe };
  const shortHtmlDe = replaceVariables(
    compiledHtml,
    dataShortDeWithLinks,
    "20"
  );
  fs.writeFileSync(path.join(outputDir, "de_short.html"), shortHtmlDe, "utf8");
  console.log("✅ de_short.html généré");

  // Generate de_long.html
  const dataLongDe = JSON.parse(fs.readFileSync(dataLongDePath, "utf8"));
  const dataLongDeWithLinks = { ...dataLongDe, ...linksDe, ...i18nDe };
  const longHtmlDe = replaceVariables(
    compiledHtml,
    dataLongDeWithLinks,
    "20"
  );
  fs.writeFileSync(path.join(outputDir, "de_long.html"), longHtmlDe, "utf8");
  console.log("✅ de_long.html généré");

  // Generate de_no_dynamic.html (without dynamic KPIs and disclaimer)
  let noDynamicHtmlDe = compiledHtml;
  noDynamicHtmlDe = noDynamicHtmlDe.replace(
    /<!-- START_DYNAMIC_SECTION -->[\s\S]*?<!-- END_DYNAMIC_SECTION -->/gi,
    ""
  );
  noDynamicHtmlDe = replaceVariables(
    noDynamicHtmlDe,
    { ...linksDe, ...i18nDe },
    "0"
  );
  noDynamicHtmlDe = noDynamicHtmlDe.replace(/\{\{[^}]+\}\}/g, "");
  fs.writeFileSync(
    path.join(outputDir, "de_no_dynamic.html"),
    noDynamicHtmlDe,
    "utf8"
  );
  console.log(
    "✅ de_no_dynamic.html généré (sections dynamiques complètement supprimées)"
  );
} catch (error) {
  console.error("❌ Erreur lors de la compilation:", error.message);
  process.exit(1);
}
