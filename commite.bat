@echo off
echo Iniciando o processo de commit e push automatizado

:: Substitua as linhas abaixo com suas informações
set REPO_PATH=C:\Users\Gabriel\Documents\GitHub\Auto-Vagas
set COMMIT_MESSAGE=testeCommit

:: Navegue para o diretório do repositório
cd %REPO_PATH%

:: Adicione todos os arquivos às mudanças
git add -A

:: Faça o commit com a mensagem especificada
git commit -m "%COMMIT_MESSAGE%"

:: Faça o push para a branch desejada (substitua "main" pelo nome da sua branch)
git push origin main

echo Processo concluído