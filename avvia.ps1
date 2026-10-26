# LearnHarness (fork italiano) — aggiorna da upstream e avvia.
#
# 1. Scarica le novità del repo originale (upstream = amosblomqvist/learnharness).
# 2. Le unisce nel branch `italiano` (le nostre modifiche restano sopra).
#    Se c'è un conflitto annulla l'unione e avvia la versione attuale.
# 3. Aggiorna il fork su GitHub (main = copia dell'originale, italiano = nostro).
# 4. Reinstalla le dipendenze solo se package-lock.json è cambiato.
# 5. Avvia l'app su http://localhost:3000 e apre il browser.
#
# Uso: doppio clic su "LearnHarness.cmd", oppure  powershell -File avvia.ps1 [-NoUpdate]

param([switch]$NoUpdate)

$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

function Say($text, $color = "Gray") { Write-Host $text -ForegroundColor $color }

function Update-Fork {
	if (git status --porcelain) {
		Say "Ci sono modifiche locali non salvate in git: salto l'aggiornamento." Yellow
		return
	}
	$branch = git rev-parse --abbrev-ref HEAD
	if ($branch -ne "italiano") {
		Say "Sei sul branch '$branch', non 'italiano': salto l'aggiornamento." Yellow
		return
	}

	Say "Controllo gli aggiornamenti di LearnHarness..."
	git fetch --quiet upstream main
	if ($LASTEXITCODE -ne 0) { Say "Rete non disponibile: avvio la versione attuale." Yellow; return }

	$new = [int](git rev-list --count HEAD..upstream/main)
	if ($new -eq 0) { Say "Già aggiornato." Green; return }

	$lockBefore = git rev-parse HEAD:package-lock.json
	Say "$new novità dall'originale: le unisco al branch italiano..."
	git merge --no-edit --quiet upstream/main
	if ($LASTEXITCODE -ne 0) {
		git merge --abort
		Say "Conflitto con le nostre modifiche: unione annullata, avvio la versione attuale." Red
		Say "Apri Claude Code in questa cartella e chiedi di risolvere il merge di upstream/main." Red
		return
	}
	Say "Unione riuscita." Green

	git push --quiet origin upstream/main:main italiano 2>$null
	if ($LASTEXITCODE -ne 0) { Say "Push sul fork non riuscito (lo riprovo al prossimo avvio)." Yellow }

	if ((git rev-parse HEAD:package-lock.json) -ne $lockBefore) {
		Say "Dipendenze cambiate: npm ci..."
		npm ci --no-audit --no-fund
	}
}

if (-not $NoUpdate) {
	try { Update-Fork } catch { Say "Aggiornamento non riuscito: $($_.Exception.Message)" Yellow }
}
if (-not (Test-Path node_modules)) { npm ci --no-audit --no-fund }

Say "Avvio LearnHarness su http://localhost:3000 (chiudi questa finestra per fermarlo)." Cyan
Start-Job { Start-Sleep 8; Start-Process "http://localhost:3000" } | Out-Null
npm run dev
