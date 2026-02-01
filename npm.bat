@echo off
REM Change directory to where your package.json (and node_modules) is located
cd src/app/

REM Check if the node_modules directory exists
if not exist node_modules (
    echo node_modules folder not found. Running npm install...
    npm install
    if errorlevel 1 (
        echo npm install failed. Exiting.
        goto :eof
    )
    echo npm install complete.
) else (
    echo node_modules folder found. Proceeding with dev command.
)

REM Run the development script
npm run dev