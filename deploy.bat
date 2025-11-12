@echo off
echo ========================================
echo      Clippr Application Deployment
echo ========================================

REM Set variables - Update these paths according to your setup
set TOMCAT_HOME=C:\apache-tomcat-10.1.48
set PROJECT_DIR=D:\Zoho-Assignments\clippr-app
set APP_NAME=clippr

echo.
echo Current directory: %CD%
echo Project directory: %PROJECT_DIR%
echo Tomcat directory: %TOMCAT_HOME%

REM Check if Tomcat directory exists
if not exist "%TOMCAT_HOME%" (
    echo ERROR: Tomcat directory not found at %TOMCAT_HOME%
    echo Please update TOMCAT_HOME variable in this script
    pause
    exit /b 1
)

REM Check if project directory exists
if not exist "%PROJECT_DIR%" (
    echo ERROR: Project directory not found at %PROJECT_DIR%
    echo Please update PROJECT_DIR variable in this script
    pause
    exit /b 1
)

REM Change to project directory
cd /d "%PROJECT_DIR%"

echo.
echo ========================================
echo Step 1: Stopping Tomcat Server...
echo ========================================

REM Stop Tomcat if running
tasklist /fi "imagename eq java.exe" | find /i "java.exe" > nul
if %errorlevel% == 0 (
    echo Found Java processes, attempting to stop Tomcat...
    call "%TOMCAT_HOME%\bin\shutdown.bat"
    timeout /t 10 /nobreak > nul

    REM Force kill if still running
    tasklist /fi "imagename eq java.exe" | find /i "java.exe" > nul
    if %errorlevel% == 0 (
        echo Force stopping Tomcat processes...
        taskkill /f /im java.exe 2>nul
        timeout /t 5 /nobreak > nul
    )
    echo Tomcat stopped successfully.
) else (
    echo Tomcat is not running.
)

echo.
echo ========================================
echo Step 2: Cleaning Maven Project...
echo ========================================

call mvn clean
if %errorlevel% neq 0 (
    echo ERROR: Maven clean failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 3: Compiling Project...
echo ========================================

call mvn compile
if %errorlevel% neq 0 (
    echo ERROR: Maven compile failed!
    echo Please check the compilation errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 4: Building WAR Package...
echo ========================================

call mvn package
if %errorlevel% neq 0 (
    echo ERROR: Maven package failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 5: Cleaning Tomcat webapps...
echo ========================================

REM Remove existing application from webapps
if exist "%TOMCAT_HOME%\webapps\%APP_NAME%" (
    echo Removing existing %APP_NAME% directory...
    rmdir /s /q "%TOMCAT_HOME%\webapps\%APP_NAME%"
)

if exist "%TOMCAT_HOME%\webapps\%APP_NAME%.war" (
    echo Removing existing %APP_NAME%.war file...
    del /q "%TOMCAT_HOME%\webapps\%APP_NAME%.war"
)

REM Clean Tomcat work directory
if exist "%TOMCAT_HOME%\work\Catalina\localhost\%APP_NAME%" (
    echo Cleaning Tomcat work directory...
    rmdir /s /q "%TOMCAT_HOME%\work\Catalina\localhost\%APP_NAME%"
)

REM Clean Tomcat temp directory
if exist "%TOMCAT_HOME%\temp\*" (
    echo Cleaning Tomcat temp directory...
    del /q "%TOMCAT_HOME%\temp\*" 2>nul
)

echo.
echo ========================================
echo Step 6: Deploying WAR file...
echo ========================================

REM Check if WAR file was created
if not exist "target\%APP_NAME%.war" (
    echo ERROR: WAR file not found at target\%APP_NAME%.war
    pause
    exit /b 1
)

REM Copy WAR file to Tomcat webapps
echo Copying %APP_NAME%.war to Tomcat webapps...
copy "target\%APP_NAME%.war" "%TOMCAT_HOME%\webapps\"
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy WAR file to Tomcat webapps
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 7: Starting Tomcat Server...
echo ========================================

REM Start Tomcat
echo Starting Tomcat server...
start "Tomcat" /b call "%TOMCAT_HOME%\bin\startup.bat"

REM Wait for deployment
echo Waiting for application deployment...
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo Step 8: Checking Deployment Status...
echo ========================================

REM Check if application directory was created (indicates successful deployment)
set RETRY_COUNT=0
:CHECK_DEPLOYMENT
if exist "%TOMCAT_HOME%\webapps\%APP_NAME%" (
    echo SUCCESS: Application deployed successfully!
    echo Application is available at: http://localhost:8080/%APP_NAME%
    goto DEPLOYMENT_SUCCESS
)

set /a RETRY_COUNT+=1
if %RETRY_COUNT% lss 6 (
    echo Waiting for deployment... (%RETRY_COUNT%/5)
    timeout /t 10 /nobreak > nul
    goto CHECK_DEPLOYMENT
)

echo WARNING: Application directory not found after 60 seconds
echo Please check Tomcat logs for deployment status
goto DEPLOYMENT_WARNING

:DEPLOYMENT_SUCCESS
echo.
echo ========================================
echo     DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Application URL: http://localhost:8080/%APP_NAME%
echo Tomcat Manager: http://localhost:8080/manager
echo.
echo Next Steps:
echo 1. Configure OAuth credentials in config.properties
echo 2. Set up MySQL database using database-schema.sql
echo 3. Update database connection settings
echo.
goto END

:DEPLOYMENT_WARNING
echo.
echo ========================================
echo     DEPLOYMENT STATUS UNCERTAIN
echo ========================================
echo.
echo Please check:
echo 1. Tomcat logs at: %TOMCAT_HOME%\logs\
echo 2. Check if port 8080 is available
echo 3. Verify MySQL database is running
echo.

:END
echo Press any key to open application in browser...
pause > nul
start http://localhost:8080/%APP_NAME%

echo.
echo Deployment script completed.
pause
