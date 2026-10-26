# LearnHarness — fork italiano di Federico

@AGENTS.md

Fork personale di `amosblomqvist/learnharness`. Remoti: `origin` = `federicoiancu-ai/learnharness` (nostro), `upstream` = originale di Amos (solo lettura).

- Si lavora sul branch **`italiano`** (default del fork). `main` resta copia esatta di `upstream/main`: non committare lì.
- Modifiche piccole e in file separati, per non creare conflitti con gli aggiornamenti quotidiani di upstream. Elenco delle nostre modifiche in `LEGGIMI.md`: aggiornalo quando ne aggiungi una.
- Push solo su `origin`. Mai PR o push verso upstream senza richiesta esplicita.
- L'italiano è iniettato in ogni richiesta ai modelli da `src/agent/language.ts` (agganciato in `src/agent/models.ts`); la dettatura in `components/dictation.tsx`.
- Windows: i test vanno lanciati con una cartella dati temporanea, altrimenti alcuni scrivono sessioni finte in `data/`: `LH_DATA_DIR="$TEMP/lh-test" npm test`. 13 test falliscono su Windows anche su upstream (permessi file, script di rilascio): non sono regressioni.
- `data/`, `auth.json` e `chatgpt-credentials.json` sono dati e segreti dell'utente: non cancellarli, non committarli.
- Avvio: `LearnHarness.cmd` (aggiorna da upstream e lancia `npm run dev` su http://localhost:3000). Il server in dev si ricarica da solo dopo le modifiche.
- Rispondi a Federico in italiano.
