@echo off
rem Doppio clic: aggiorna il fork da upstream e avvia LearnHarness.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0avvia.ps1" %*
