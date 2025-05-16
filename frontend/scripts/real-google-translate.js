
import fs from 'fs';
import path from 'path';
import { v2 } from '@google-cloud/translate';
const { Translate } = v2;

async function autoTranslate() {
  const translateClient = new Translate();
  const enPath = path.resolve('public/locales/en/translations.json');
  const fiPath = path.resolve('public/locales/fi/translations.json');

  const enCatalog = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const existingFiCatalog = fs.existsSync(fiPath)
    ? JSON.parse(fs.readFileSync(fiPath, 'utf8'))
    : {};

  const fiCatalog = {};

  for (const [ns, entries] of Object.entries(enCatalog)) {
    fiCatalog[ns] = {};
    for (const [key, value] of Object.entries(entries)) {
      // Use cache if available
      if (existingFiCatalog[ns]?.[key]) {
        fiCatalog[ns][key] = existingFiCatalog[ns][key];
      } else if (value) {
        // Official API handles batching up to 5k code points per call
        const [translation] = await translateClient.translate(value, 'fi');
        fiCatalog[ns][key] = translation;
      } else {
        fiCatalog[ns][key] = '';
      }
    }
  }

  fs.writeFileSync(fiPath, JSON.stringify(fiCatalog, null, 2), 'utf8');
  console.log('✅ Finnish translations updated!');
}

autoTranslate().catch(console.error);