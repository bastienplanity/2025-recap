const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// Lire le fichier data.json
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data.json"), "utf8")
);

// Helper Handlebars pour convertir les sauts de ligne en <br />
Handlebars.registerHelper("nl2br", function (text) {
  if (!text) return "";
  return new Handlebars.SafeString(text.replace(/\n/g, "<br />"));
});

// Les KPIs ne sont plus groupés, chaque KPI prend 100% de largeur

// Lire le template Handlebars
const templateSource = fs.readFileSync(
  path.join(__dirname, "template.hbs"),
  "utf8"
);

// Compiler le template
const template = Handlebars.compile(templateSource);

// Générer le MJML
const mjml = template(data);

// Écrire le template généré
fs.writeFileSync(path.join(__dirname, "template.mjml"), mjml, "utf8");
console.log("✅ Template MJML généré depuis template.hbs et data.json !");
