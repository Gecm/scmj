set MAIN_JS=%~dp0\majiang_server\majiang_server.js
set CONFIG=%~dp0\configs_local2.js
call node.exe %MAIN_JS% %CONFIG%
pause