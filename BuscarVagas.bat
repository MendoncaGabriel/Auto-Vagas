@echo off
echo Iniciando o script de commit em segundo plano...
echo.

start /min "" "C:\Users\Gabriel\Documents\GitHub\Auto-Vagas\commite.bat"

timeout /t 300 /nobreak > nul

echo Aguardando 5 minutos...

start /min node "C:\Users\Gabriel\Documents\GitHub\Auto-Vagas\index.js"

echo Script concluído.
