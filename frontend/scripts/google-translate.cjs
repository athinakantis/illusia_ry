const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Load existing Finnish translations for caching
const fiPath = path.resolve('public/locales/fi/translations.json');
let existingFiCatalog = {};
if (fs.existsSync(fiPath)) {
  try {
    existingFiCatalog = JSON.parse(fs.readFileSync(fiPath, 'utf8'));
  } catch (e) {
    console.warn('Could not parse existing Finnish catalog, starting fresh.');
    existingFiCatalog = {};
  }
}

async function autoTranslate() {
  // 1. Load your English catalog
  const enPath = path.resolve('public/locales/en/translations.json');
  const enCatalog = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // 2. Prepare Finnish catalog
  const fiCatalog = {};

  for (const [namespace, entries] of Object.entries(enCatalog)) {
    // Initialize namespace cache
    const namespaceCache = existingFiCatalog[namespace] || {};
    fiCatalog[namespace] = {};
    for (const [key, value] of Object.entries(entries)) {
      // Use cached translation if available
      if (namespaceCache[key]) {
        fiCatalog[namespace][key] = namespaceCache[key];
      } else {
        // Translate English text to Finnish
        const textToTranslate = value;
        const res = await translate(textToTranslate, { to: 'fi' });
        fiCatalog[namespace][key] = res.text;
      }
    }
  }

  // 4. Write the Finnish JSON
  fs.writeFileSync(fiPath, JSON.stringify(fiCatalog, null, 2), 'utf8');
  console.log('✅ Finnish translations updated!');
}

autoTranslate().catch(console.error);