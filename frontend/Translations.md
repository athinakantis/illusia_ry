## Translation Workflow

To streamline localization, Ive added NPM scripts to extract and translate UI text automatically:

1. **Extract keys to JSON**  
   ```bash
   npm run extract:i18n
   ```
   Runs i18next-parser against your codebase, extracting all `t()` calls and `<Trans>` defaults into `public/locales/en/translations.json`.
   **Note:** If you have changed the text for a component in the app, delete that line from the `en/translations.json`(or delete the whole file) and then run `extract:i18n` again.

2. **Translate to Finnish**  
   ```bash
   npm run translate:fi
   ```
   Runs our custom script (`scripts/google-translate.cjs`), which reads the English JSON and uses Google Translate to populate `public/locales/fi/translations.json`.

   **Note:** Running `npm run translate:fi` should not cost anything but dont run it too often. I have been banned already for running it more than once in a day. I dont think it costs us any money but use it with caution still.

3. **One-step automation**  
   ```bash
   npm run i18n:all
   ```
   Combines extraction and translation in a single command.

## How to Use

- After pulling the latest code, run `npm run i18n:all` to update both English and Finnish catalogs.
- To update only the Finnish catalog, run `npm run translate:fi`. This step requires Google Cloud credentials and may incur API charges; please ask the project owner for access and cost approval.
- Review the generated JSON files in `public/locales/{en,fi}/translations.json`.
- Commit any meaningful new translation entries.

## Troubleshooting

- If keys are missing, ensure your components use `t('key', { defaultValue: '…' })` or `<Trans defaults="…">`.
- If translations are stale, delete the old `translations.json` and rerun `npm run i18n:all`.
- For CI integration, add `npm run i18n:all` as a pre-build step.

## Further Improvements

- Consider moving to an official Translate API for production.
- Implement caching or batch requests in `google-translate.cjs` to avoid rate limits.