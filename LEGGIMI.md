# LearnHarness — fork italiano

Fork personale di [amosblomqvist/learnharness](https://github.com/amosblomqvist/learnharness) (AGPL-3.0).

## Avvio

Doppio clic su **`LearnHarness.cmd`**. Lo script (`avvia.ps1`):

1. scarica le novità dell'originale e le unisce al branch `italiano`;
2. aggiorna il fork su GitHub (`main` = copia dell'originale, `italiano` = nostro);
3. reinstalla le dipendenze solo se sono cambiate;
4. avvia l'app su http://localhost:3000 e apre il browser.

Se l'unione va in conflitto, la annulla e avvia la versione attuale. `LearnHarness.cmd -NoUpdate` salta l'aggiornamento.

## Le nostre modifiche (branch `italiano`)

| File | Cosa fa |
|---|---|
| `src/agent/language.ts` + una riga in `src/agent/models.ts` | Ogni richiesta ai modelli (insegnante, verifica, pratica, sub-agent, estrazione del grafo) riceve l'istruzione di scrivere in italiano. `LH_LANGUAGE=off` la spegne, `LH_LANGUAGE=English` cambia lingua. |
| `components/dictation.tsx` | Dettatura Deepgram in italiano (`language=it`). |
| `tests/language.test.ts` | Test dell'istruzione di lingua. |
| `.npmrc` | Su Windows gli script npm girano con Git Bash. |
| `avvia.ps1`, `LearnHarness.cmd`, `LEGGIMI.md` | Avvio e aggiornamento automatico. |

Le modifiche sono piccole e in file separati, così gli aggiornamenti dell'originale si uniscono senza conflitti.

## Primo avvio

Impostazioni → **Providers** → collega **ChatGPT** (login nel browser di questo PC). Poi in **Models** scegli i modelli per gli slot `strong`, `cheap` e `vision`.
Facoltativi: chiave **Tavily** o **Brave** per la ricerca web, **Deepgram** per la dettatura.

## Test su Windows

`npm test`: 13 test dell'originale falliscono su Windows anche senza le nostre modifiche (permessi dei file, script di rilascio per macOS e Linux).

⚠️ Su Windows alcuni test scrivono sessioni finte nella cartella `data/` vera. Lanciali con una cartella temporanea: `LH_DATA_DIR="$TEMP/lh-test" npm test`.
