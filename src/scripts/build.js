const mjml = require("mjml");
const fs = require("fs");
const path = require("path");

const mjmlPath = path.join(__dirname, "..", "mail", "mjml", "2025_recap.mjml");
const dataShortPath = path.join(__dirname, "..", "data", "data_short.json");
const dataLongPath = path.join(__dirname, "..", "data", "data_long.json");
const linksFrPath = path.join(__dirname, "..", "data", "links_fr.json");
const i18nFrPath = path.join(__dirname, "..", "data", "i18n_fr.json");
const outputDir = path.join(__dirname, "..", "mail", "html");

function replaceVariables(
  html,
  data,
  shouldDisplayDynamicKPIs = "",
  futureSectionPaddingTop = "20"
) {
  let result = html;

  // Replace shouldDisplayDynamicKPIs first (before other variables)
  result = result.replace(
    /\{\{shouldDisplayDynamicKPIs\}\}/g,
    shouldDisplayDynamicKPIs
  );

  // Replace futureSectionPaddingTop
  result = result.replace(
    /\{\{futureSectionPaddingTop\}\}/g,
    futureSectionPaddingTop
  );

  // Replace Handlebars variables (i18n first, then data)
  // This allows variables like {{pct_online_appts}} inside i18n strings to be replaced
  if (data) {
    // First pass: replace all variables
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      result = result.replace(regex, data[key]);
    });
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

  // Generate fr_short.html
  const dataShort = JSON.parse(fs.readFileSync(dataShortPath, "utf8"));
  const dataShortWithLinks = { ...dataShort, ...linksFr, ...i18nFr };
  const shortHtml = replaceVariables(
    compiledHtml,
    dataShortWithLinks,
    "",
    "20"
  );
  fs.writeFileSync(path.join(outputDir, "fr_short.html"), shortHtml, "utf8");
  console.log("✅ fr_short.html généré");

  // Generate fr_long.html
  const dataLong = JSON.parse(fs.readFileSync(dataLongPath, "utf8"));
  const dataLongWithLinks = { ...dataLong, ...linksFr, ...i18nFr };
  const longHtml = replaceVariables(compiledHtml, dataLongWithLinks, "", "20");
  fs.writeFileSync(path.join(outputDir, "fr_long.html"), longHtml, "utf8");
  console.log("✅ fr_long.html généré");

  // Generate fr_no_dynamic.html (without dynamic KPIs and disclaimer)
  // Remove the entire dynamic section completely using HTML comments as markers
  let noDynamicHtml = compiledHtml;

  // Remove everything between START_DYNAMIC_SECTION and END_DYNAMIC_SECTION
  noDynamicHtml = noDynamicHtml.replace(
    /<!-- START_DYNAMIC_SECTION -->[\s\S]*?<!-- END_DYNAMIC_SECTION -->/gi,
    ""
  );

  // Replace variables (no data, but include links and i18n)
  noDynamicHtml = replaceVariables(
    noDynamicHtml,
    { ...linksFr, ...i18nFr },
    "",
    "0"
  );

  // Remove any remaining Handlebars variables
  noDynamicHtml = noDynamicHtml.replace(/\{\{[^}]+\}\}/g, "");

  fs.writeFileSync(
    path.join(outputDir, "fr_no_dynamic.html"),
    noDynamicHtml,
    "utf8"
  );
  console.log(
    "✅ fr_no_dynamic.html généré (sections dynamiques complètement supprimées)"
  );
} catch (error) {
  console.error("❌ Erreur lors de la compilation:", error.message);
  process.exit(1);
}
