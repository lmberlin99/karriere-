@echo off
chcp 65001 >nul
title Квест ИПУ — HTTPS сервер
cd /d "%~dp0"
echo Запускаю HTTPS-сервер для квеста.
echo Адрес для iPad:  https://192.168.31.66:8443/
echo Не закрывайте это окно, пока квест не закэшируется на iPad.
echo.
python "%~dp0https_server.py"
pause