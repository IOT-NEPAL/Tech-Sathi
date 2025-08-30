@echo off
echo Cleaning Tech Sathi for GitHub upload...
echo.

echo Removing unnecessary folders...
echo 1. Removing node_modules (this may take a while)...
rmdir /s /q node_modules 2>nul
if exist node_modules (
    echo node_modules still exists - please delete manually
    echo Right-click on node_modules folder and select Delete
    pause
) else (
    echo node_modules removed successfully!
)

echo.
echo 2. Removing dist folder (will be rebuilt on GitHub)...
rmdir /s /q dist 2>nul
echo dist folder removed!

echo.
echo 3. Removing package-lock.json (not needed for GitHub)...
del package-lock.json 2>nul
echo package-lock.json removed!

echo.
echo 4. Creating clean GitHub structure...
echo.
echo Your project is now clean for GitHub!
echo.
echo Files to upload to GitHub:
echo - src/ (source code)
echo - public/ (if exists)
echo - index.html
echo - package.json
echo - vite.config.js
echo - tailwind.config.js
echo - postcss.config.js
echo - README.md
echo - .gitignore
echo
echo DO NOT upload:
echo - node_modules/ (too big)
echo - dist/ (will be built on GitHub)
echo - package-lock.json (not needed)
echo - start.bat (Windows only)
echo
echo Press any key to exit...
pause >nul
