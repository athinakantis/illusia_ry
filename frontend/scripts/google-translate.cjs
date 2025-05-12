const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

async function autoTranslate() {
  // 1. Load your English catalog
  const enPath = path.resolve('public/locales/en/translations.json');
  const enCatalog = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // 2. Prepare Finnish catalog
  const fiCatalog = {};

  for (const [namespace, entries] of Object.entries(enCatalog)) {
    fiCatalog[namespace] = {};
    for (const [key, value] of Object.entries(entries)) {
      // Skip untranslated or empty defaults if desired
      const textToTranslate = value || key;
      // 3. Translate to Finnish
      /*  
         translate(text, { to: 'fi' })
         returns a promise resolving to { text: 'tallenna', from: { language: { iso: 'en' } } }
      */
      const res = await translate(textToTranslate, { to: 'fi' });
      fiCatalog[namespace][key] = res.text;
    }
  }

  // 4. Write the Finnish JSON
  const fiPath = path.resolve('public/locales/fi/translations.json');
  fs.writeFileSync(fiPath, JSON.stringify(fiCatalog, null, 2), 'utf8');
  console.log('✅ Finnish translations updated!');
}

autoTranslate().catch(console.error);