#!/bin/sh

# Option to be invoked on and name of the main executable
MAIN_OPTION="server"
MAIN_FILE_NAME="engine.sh"


# Get the path of this file and resolve symbolic links
THIS_FILE_PATH="$0"
while [ -h "$THIS_FILE_PATH" ] ; do
  ls=`ls -ld "$THIS_FILE_PATH"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    THIS_FILE_PATH="$link"
  else
    THIS_FILE_PATH=`dirname "$THIS_FILE_PATH"`/"$link"
  fi
done


# Get the directory this file is included in
THIS_DIRECTORY_PATH=`dirname "$THIS_FILE_PATH"`


# Check if main file exists
if [ ! -x "$THIS_DIRECTORY_PATH"/"$MAIN_FILE_NAME" ]; then
	echo "Main file does not exist or execution not permitted: $THIS_DIRECTORY_PATH"/"$MAIN_FILE_NAME"
	echo "Cannot start \"$MAIN_FILE_NAME\" with option \"$MAIN_OPTION\""
	exit 1
fi


# Execute main file with option
exec "$THIS_DIRECTORY_PATH"/"$MAIN_FILE_NAME" "$MAIN_OPTION" "$@"
