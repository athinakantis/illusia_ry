## Translation Workflow

To streamline localization, we've added NPM scripts to extract and translate UI text automatically:

1. **Extract keys to JSON**  
   ```bash
   npm run extract:i18n
   ```
   Runs i18next-parser against your codebase, extracting all `t()` calls and `<Trans>` defaults into `public/locales/en/translations.json`.

2. **Translate to Finnish**  
   ```bash
   npm run translate:fi
   ```
   Runs our custom script (`scripts/google-translate.cjs`), which reads the English JSON and uses Google Translate to populate `public/locales/fi/translations.json`.

3. **One-step automation**  
   ```bash
   npm run i18n:all
   ```
   Combines extraction and translation in a single command.

## How to Use

- After pulling the latest code, run `npm run i18n:all` to update both English and Finnish catalogs.
- Review the generated JSON files in `public/locales/{en,fi}/translations.json`.
- Commit any meaningful new translation entries.

## Troubleshooting

- If keys are missing, ensure your components use `t('key', { defaultValue: '…' })` or `<Trans defaults="…">`.
- If translations are stale, delete the old `translations.json` and rerun `npm run i18n:all`.
- For CI integration, add `npm run i18n:all` as a pre-build step.

## Further Improvements

- Consider moving to an official Translate API for production.
- Implement caching or batch requests in `google-translate.cjs` to avoid rate limits.