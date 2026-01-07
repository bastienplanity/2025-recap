const mjml = require("mjml");
const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "template.mjml");
const outputPath = path.join(__dirname, "output.html");

try {
  const template = fs.readFileSync(templatePath, "utf8");
  const { html, errors } = mjml(template, {
    minify: false,
    validationLevel: "soft",
  });

  if (errors.length > 0) {
    console.warn("⚠️  MJML warnings:");
    errors.forEach((error) => console.warn(`  - ${error.message}`));
  }

  fs.writeFileSync(outputPath, html, "utf8");
  console.log("✅ Template HTML généré depuis template.mjml !");
  console.log(`📄 Fichier: ${outputPath}`);
} catch (error) {
  console.error("❌ Erreur lors de la compilation:", error.message);
  process.exit(1);
}
