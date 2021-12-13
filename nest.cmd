@ECHO off
SETLOCAL

node_modules\.bin\nest.cmd %*

ENDLOCAL
EXIT /b %errorlevel%
