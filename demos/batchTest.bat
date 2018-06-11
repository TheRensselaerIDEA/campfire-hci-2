@echo off
SET rel_path = images/target2.png

echo Current working directory is %CD%
echo Arg 0 is %0
echo Changing dir..



echo opening local file %rel_path%
start %rel_path%

pause
exit 0
