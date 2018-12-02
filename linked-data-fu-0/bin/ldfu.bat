@ECHO OFF

REM Starts up Linked Data-Fu and passes on all command line arguments.
REM
REM Sets the standard values for the logging configuration and the ldfu.home and ldfu.base directories.
REM Does not have the "kill on OutOfMemoryException" functionality from the Linux shell script.
REM If you want to add java arguments (-Dsome.thing=else), you have to edit this file.

java -cp %~dp0\..\lib\* -Dldfu.home=%~dp0\.. -Dldfu.base=%~dp0\.. -Djava.util.logging.config.file=%~dp0\..\conf\logging.properties edu.kit.aifb.datafu.standalone.MainCmdLine %* 

