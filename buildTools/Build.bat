@echo off
cd ..
set /p PLATFORM_TO_BUILD="Platform: "

set APP_ICON=./app.ico
set SOURCE_DIR=.
set OUTPUT_DIR=./build
set APP_NAME=Dragoncord

echo.
echo Dragoncord Build Tool
echo Building...
echo.
npx electron-packager %SOURCE_DIR% %APP_NAME% --platform=%PLATFORM_TO_BUILD% --icon=%APP_ICON% --out=%OUTPUT_DIR% --asar --ignore