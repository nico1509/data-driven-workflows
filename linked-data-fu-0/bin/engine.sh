#!/bin/sh

# Do not modify this file.
# All variables listed in the following may be added temporarily at command line or persistent in "$LDFU_ENVS_FILE_NAME" in the binaries directory.

# LDFU_HOME
# 	The Linked Data-Fu home directory which will be used as root for all subsequent paths.
#	By default the home directory is the parent directory of the executed file.

# LDFU_BASE
#	A custom Linked Data-Fu base directory which will be used as root for all dynamic data, e.g. configuration, logging, or temporary files.
#	By default the base directory is the Linked Data-Fu home directory.

# LDFU_CFG
#	A custom configuration directory which will be use for all configuration files.
#	By default the configuration directory is the "cfg" directory in the Linked Data-Fu base directory.

# LDFU_ERR
#	A custom error directory which will be used for all error files.
#	By default the output directory is the "log" directory in the Linked Data-Fu base directory.

# LDFU_ERR_NAME
#	A custom error file name which will be use for the default error file.
#	By default the output file name is "ldfu.err".

# LDFU_OUT
#	A custom output directory which will be used for all output files.
#	By default the output directory is the "log" directory in the Linked Data-Fu base directory.

# LDFU_OUT_NAME
#	A custom output file name which will be use for the default output file.
#	By default the output file name is "ldfu.out".

# LDFU_TMP
#	A custom temporary directory which will be used for all temporary files.
#	By default the temporary directory is the "tmp" directory in the Linked Data-Fu base directory.

# LDFU_DEBUG
#	Switch on debug output of the bash scripts.
#	By default false.

# JAVA_CLASSPATH
# 	Custom Java class path entries which will be added when starting Linked Data-Fu.
#	By default no custom Java class path entries are added.

# JAVA_OPTS
#	Custom Java optional arguments which will be added when starting Linked Data-Fu.
#	By default no optional Java arguments are added.

alias errcho='>&2 echo'


LDFU_HOME_VARIABLE_NAME="LDFU_HOME"
LDFU_BASE_VARIABLE_NAME="LDFU_BASE"
LDFU_CFGS_VARIABLE_NAME="LDFU_CONF"
LDFU_OUTS_VARIABLE_NAME="LDFU_OUT"
LDFU_TMPS_VARIABLE_NAME="LDFU_TMP"

LDFU_BINS_DIRECTORY_NAME="bin"
LDFU_CFGS_DIRECTORY_NAME="conf"
# FIXME Commented as long as not required
#LDFU_DOCS_DIRECTORY_NAME="docs"
LDFU_LIBS_DIRECTORY_NAME="lib"
# FIXME Commented as long as not required
#LDFU_MODS_DIRECTORY_NAME="jars"
LDFU_OUTS_DIRECTORY_NAME="logs"
# FIXME Commented as long as not required
#LDFU_TMPS_DIRECTORY_NAME="tmp"

LDFU_ENVS_FILE_NAME="env.sh"
LDFU_OUTS_FILE_NAME="ldfu.out"




# FIXME TFT. Evaluate if required
# Check if operating system is Cygwin, Mac OS X or OS 400
os_is_cyg=false
os_is_osx=false
os_is_400=false
case "`uname`" in
	CYGWIN*) os_is_cyg=true;;
	Darwin*) os_is_osx=true;;
	OS400*) os_is_400=true;;
esac


# Check if executed from a console
exec_is_tty=false
if [ "`tty`" != "not a tty" ]; then
	exec_is_tty=true
fi




# Get the execution directory path which is at this point still the current directory
EXECUTION_DIRECTORY_PATH="`pwd`"


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
THIS_DIRECTORY_PATH="`dirname "$THIS_FILE_PATH"`"





# Check LDFU_HOME and LDFU_BASE which could be set in as environment variable.
# Set the home directory to default path if not set by the user, or
if [ -z "$LDFU_HOME" ]; then
	
	# Set the home directory to parent directory of the directory containing the current file.
	LDFU_HOME_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH/.." > /dev/null; pwd`

# Set the home directory to the path provided by the user.
else
	
	# Switch to the directory containing this file to be able to test a relative path
	cd "$THIS_DIRECTORY_PATH"
	
	# Check if the path provided by the user exists and exit gracefully if not.
	if [ ! -d "$LDFU_HOME" ]; then
		errcho "Home directory \"$LDFU_HOME\" does not exist!"
		errcho "Check $LDFU_HOME_VARIABLE_NAME environment variable."
		exit 1
	fi
	
	# Set the home directory to the user provided path which may be relative to this file.
	LDFU_HOME_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH" > /dev/null; cd "$LDFU_HOME" > /dev/null; pwd`
	
fi


# Set the base directory to default path if not set by the user, or
if [ -z "$LDFU_BASE" ]; then
	
	# Set the base directory to the home directory.
	LDFU_BASE_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH"
	
# Set the home directory to the path provided by the user.
else
	
	# Switch to the directory containing this file to be able to test a relative path
	cd "$THIS_DIRECTORY_PATH"
	
	# Check if the path provided by the user exists and exit gracefully if not.
	if [ ! -d "$LDFU_BASE" ]; then
		errcho "Base directory \"$LDFU_BASE\" does not exist!"
		errcho "Check $LDFU_BASE_VARIABLE_NAME environment variable."
		exit 1
	fi
	
	# Set the base directory to the user provided path which may be relative to this file.
	LDFU_BASE_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH" > /dev/null; cd "$LDFU_BASE" > /dev/null; pwd`
	
fi




# Include environment variables set by the user in "$LDFU_ENVS_FILE_NAME" in the binaries directory.
if [ -r "$LDFU_BASE_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME" ]; then
	if [ $LDFU_DEBUG ] && [ $exec_is_tty ] ; then
		errcho "Found custom \"$LDFU_ENVS_FILE_NAME\" in $LDFU_BASE_VARIABLE_NAME=\"$LDFU_BASE_DIRECTORY_PATH\" directory."
		errcho "Loaded \"$LDFU_BASE_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME\"."
		errcho
	fi
	. "$LDFU_BASE_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME"
elif [ -r "$LDFU_HOME_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME" ]; then
	if [ $LDFU_DEBUG ] && [ $exec_is_tty ] ; then
		errcho "Found custom \"$LDFU_ENVS_FILE_NAME\" in $LDFU_HOME_VARIABLE_NAME=\"$LDFU_BASE_DIRECTORY_PATH\" directory."
		errcho "Loaded \"$LDFU_HOME_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME\"."
		errcho
	fi
	. "$LDFU_HOME_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME/$LDFU_ENVS_FILE_NAME"
fi




# Check LDFU_HOME and LDFU_BASE again which could be set in the configuration file.
# Set the home directory to default path if not set by the user, or
if [ -z "$LDFU_HOME" ]; then
	
	# Set the home directory to parent directory of the directory containing the current file.
	LDFU_HOME_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH/.." > /dev/null; pwd`

# Set the home directory to the path provided by the user.
else
	
	# Switch to the directory containing this file to be able to test a relative path
	cd "$THIS_DIRECTORY_PATH"
	
	# Check if the path provided by the user exists and exit gracefully if not.
	if [ ! -d "$LDFU_HOME" ]; then
		errcho "Home directory \"$LDFU_HOME\" does not exist!"
		errcho "Check $LDFU_HOME_VARIABLE_NAME environment variable."
		exit 1
	fi
	
	# Set the home directory to the user provided path which may be relative to this file.
	LDFU_HOME_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH" > /dev/null; cd "$LDFU_HOME" > /dev/null; pwd`
	
fi


# Set the base directory to default path if not set by the user, or
if [ -z "$LDFU_BASE" ]; then
	
	# Set the base directory to the home directory.
	LDFU_BASE_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH"
	
# Set the home directory to the path provided by the user.
else
	
	# Switch to the directory containing this file to be able to test a relative path
	cd "$THIS_DIRECTORY_PATH"
	
	# Check if the path provided by the user exists and exit gracefully if not.
	if [ ! -d "$LDFU_BASE" ]; then
		errcho "Base directory \"$LDFU_BASE\" does not exist!"
		errcho "Check $LDFU_BASE_VARIABLE_NAME environment variable."
		exit 1
	fi
	
	# Set the base directory to the user provided path which may be relative to this file.
	LDFU_BASE_DIRECTORY_PATH=`cd "$THIS_DIRECTORY_PATH" > /dev/null; cd "$LDFU_BASE" > /dev/null; pwd`
	
fi




# Set the binaries directory which is always located in home directory.
LDFU_BINS_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH/$LDFU_BINS_DIRECTORY_NAME"
if [ ! -d "$LDFU_BINS_DIRECTORY_PATH" ]; then
	errcho "Binaries directory does not exist: $LDFU_BINS_DIRECTORY_PATH"
	errcho "Check \"$LDFU_BINS_DIRECTORY_NAME\" directory in home directory"
	exit 1
fi

# Set the configurations directory is either in a user-defined base directory or by default in the home directory.
if [ -z "$LDFU_CFG" ] ; then
	LDFU_CFGS_DIRECTORY_PATH="$LDFU_BASE_DIRECTORY_PATH/$LDFU_CFGS_DIRECTORY_NAME"
else
	LDFU_CFGS_DIRECTORY_PATH=$LDFU_CFG
fi
if [ ! -d "$LDFU_CFGS_DIRECTORY_PATH" ]; then
	errcho "Configurations directory does not exist: $LDFU_CFGS_DIRECTORY_PATH"
	errcho "Check $LDFU_CFGS_VARIABLE_NAME environment variable or \"$LDFU_CFGS_DIRECTORY_NAME\" directory in base or home directory"
	exit 1
fi


# FIXME Commented as long as not required
## Set the documents directory which is always located in home directory.
#LDFU_DOCS_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH/$LDFU_DOCS_DIRECTORY_NAME"
#if [ ! -d "$LDFU_DOCS_DIRECTORY_PATH" ]; then
#	errcho "Documentations directory does not exist: $LDFU_DOCS_DIRECTORY_PATH"
#	errcho "Check \"$LDFU_DOCS_DIRECTORY_NAME\" directory in home directory"
#	exit 1
#fi

# Set the libraries directory which is always located in home directory.
LDFU_LIBS_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH/$LDFU_LIBS_DIRECTORY_NAME"
if [ ! -d "$LDFU_LIBS_DIRECTORY_PATH" ]; then
	errcho "Libraries directory does not exist: $LDFU_LIBS_DIRECTORY_PATH"
	errcho "Check \"$LDFU_LIBS_DIRECTORY_NAME\" directory in home directory"
	exit 1
fi


# FIXME Commented as long as not required
## Set the mods directory which is always located in home directory.
#LDFU_MODS_DIRECTORY_PATH="$LDFU_HOME_DIRECTORY_PATH/$LDFU_MODS_DIRECTORY_NAME"
#if [ ! -d "$LDFU_MODS_DIRECTORY_PATH" ]; then
#	errcho "Modules directory does not exist: $LDFU_MODS_DIRECTORY_PATH"
#	errcho "Check \"$LDFU_MODS_DIRECTORY_NAME\" directory in home directory"
#	exit 1
#fi


# Set the output directory wich is either a user-defined output directory, in a user-defined base directory or by default in the home directory.
#if [ -z "$LDFU_OUT" ] ; then
#	LDFU_OUTS_DIRECTORY_PATH="$LDFU_BASE_DIRECTORY_PATH/$LDFU_OUTS_DIRECTORY_NAME"
#else
#	LDFU_OUTS_DIRECTORY_PATH=$LDFU_OUT
#fi
#if [ ! -d "$LDFU_OUTS_DIRECTORY_PATH" ]; then
#	errcho "Output directory does not exist: $LDFU_OUTS_DIRECTORY_PATH"
#	errcho "Check $LDFU_OUTS_VARIABLE_NAME environment variable or \"$LDFU_OUTS_DIRECTORY_NAME\" directory in base or home directory"
#	exit 1
#fi


# FIXME Commented as long as not required
## Set the loggings directory which is either in a user-defined loggings directory, in a user-defined base directory or by default in the home directory.
#if [ -z "$LDFU_TMP" ] ; then
#	LDFU_TMPS_DIRECTORY_PATH="$LDFU_BASE_DIRECTORY_PATH/$LDFU_TMPS_DIRECTORY_NAME"
#else
#	LDFU_TMPS_DIRECTORY_PATH=$LDFU_TMP
#fi
#if [ ! -d "$LDFU_TMPS_DIRECTORY_PATH" ]; then
#	errcho "Temporary directory does not exist!"
#	errcho "Check $LDFU_TMPS_VARIABLE_NAME environment variable or \"$LDFU_TMPS_DIRECTORY_NAME\" directory in base or home directory"
#	exit 1
#fi




# Set the output file name which is either in a user-defined output file name or the default output file name.
if [ -z "$LDFU_OUT_NAME" ] ; then
	LDFU_OUT_FILE_PATH="$LDFU_OUTS_DIRECTORY_PATH/$LDFU_OUTS_FILE_NAME"
else
	LDFU_OUT_FILE_PATH="$LDFU_OUTS_DIRECTORY_PATH/$LDFU_OUT_NAME"
fi




# FIXME TFT. Evaluate if required
# Classpath separator should not be in LDFU_HOME_DIRECTORY_PATH or LDFU_BASE_DIRECTORY_PATH as it is not excaped by Java.
case $CATALINA_HOME in
  *:*) errcho "Using CATALINA_HOME:   $CATALINA_HOME";
       errcho "Unable to start as CATALINA_HOME contains a colon (:) character";
       exit 1;
esac
case $CATALINA_BASE in
  *:*) errcho "Using CATALINA_BASE:   $CATALINA_BASE";
       errcho "Unable to start as CATALINA_BASE contains a colon (:) character";
       exit 1;
esac


# Add a colon to an existing Java class path. The following will act as if there is no Java class path already set.
if [ ! -z "$JAVA_CLASSPATH" ] ; then
	JAVA_CLASS_PATH="$JAVA_CLASSPATH":
fi

join() {
	# Shell path expansion with custom separator.
	# Necessary because otherwise we can't tell spaces
	# in paths from spaces separating files when 
	# constructing the classpath.
	# http://stackoverflow.com/a/3436177/4469267
    local IFS=$1
    shift
    echo "$*"
}

# Add libraries and modules to Java class path
JAVA_CLASS_PATH="$JAVA_CLASS_PATH"$(join ':' "$LDFU_LIBS_DIRECTORY_PATH"/*.jar)

# FIXME Commented as long as not required
#JAVA_CLASS_PATH="$JAVA_CLASS_PATH"$(echo $LDFU_MODS_DIRECTORY_PATH/*.jar | tr ' ' ':')


# Add user-defined optional Java arguments
if [ ! -z "$JAVA_OPTS" ] ; then
	JAVA_OPTIONAL_ARGUMENTS="$JAVA_OPTS "
fi


# Add optional Java arguments
JAVA_OPTIONAL_ARGUMENTS="$JAVA_OPTIONAL_ARGUMENTS-XX:OnOutOfMemoryError=\"kill -9 %p\"" # -XX:+UseCompressedOops" #-XX:+UseParallelGC -XX:+UseParallelOldGC"


# Add optional Java HTTP proxy
if [ -n "$http_proxy" ] ; then
	JAVA_OPTIONAL_ARGUMENTS="$JAVA_OPTIONAL_ARGUMENTS -Dhttp.proxyHost=$(echo $http_proxy | sed 's/http:\/\/\(\S*\):.*/\1/')"
	JAVA_OPTIONAL_ARGUMENTS="$JAVA_OPTIONAL_ARGUMENTS -Dhttp.proxyPort=$(echo $http_proxy | sed 's/http:\/\/.*:\(\S*\)/\1/' | tr -d "/")"
fi

# Add optional Java argument for logging properties
LOGPROP="$LDFU_CFGS_DIRECTORY_PATH/logging.properties"
if [ -r "$LOGPROP" ]; then
	if $os_is_cyg ; then
		LOGPROP=$(cygpath -w "$LOGPROP")
	fi
	JAVA_OPTIONAL_ARGUMENTS="$JAVA_OPTIONAL_ARGUMENTS -Djava.util.logging.config.file=\"$LOGPROP\""
fi

# Set Java main class dependend on option or output usage information
JAVA_MAIN_CLASS=""
if [ "$1" = "ldfu" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.standalone.MainCmdLine"
	shift
elif [ "$1" = "server" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.web.api.WebApiCommandLine"
	shift
#elif [ "$1" = "consolidate" ] ; then
#	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.standalone.ConsolidateCmdLine"
#	shift
elif [ "$1" = "tree-gen" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.datasets.standalone.SynthTreeCmdLine"
	shift
elif [ "$1" = "tree-server" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.datasets.standalone.SynthTreeServer"
	shift
elif [ "$1" = "crud-server" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.webapps.controllers.WebappCrudController"
	shift
elif [ "$1" = "lubm-gen" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.datasets.standalone.LubmDataCmdLine"
	shift
elif [ "$1" = "lubm-bench" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.standalone.LubmBenchmark"
	shift
elif [ "$1" = "lookup-bench" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.standalone.LookupBenchmark"
	shift
elif [ "$1" = "warc-parser" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.datasets.standalone.WarcParserCmdLine"
	shift
elif [ "$1" = "warc-server" ] ; then
	JAVA_MAIN_CLASS="edu.kit.aifb.datafu.datasets.standalone.WarcMirrorServer"
	shift
elif [ "$1" = "execute" ] ; then
	shift
	if [ "$1" ] ; then
		JAVA_MAIN_CLASS="$1"
		shift
	else
		errcho "Usage: engine.sh execute java_main_class [ arguments ]"
		exit 1
	fi
fi



# Construct the user arguments array handed over to Java
JAVA_USER_ARGUMENTS=""

# On Cygwin, treat all arguments starting with "/", "./, "../", or "~/" as path and replace those with the Windows path.
if $os_is_cyg; then
	
	for argument in $@; do
		if [[ $argument == /* ]] || [[ $argument == ./* ]] || [[ $argument == ../* ]] || [[ $argument == ~/* ]]; then
			JAVA_USER_ARGUMENTS+="\"$(cygpath -w "$argument")\" "
		else
			JAVA_USER_ARGUMENTS+="$argument "
		fi
	done
	
# Else do not modify the arguments
else
	JAVA_USER_ARGUMENTS=$@
fi

# On Cygwin, convert Unix paths that are submitted to Java to Windows paths:
# * The class path
# * As value of a parameter (-Dkey=value)
if $os_is_cyg; then
	JAVA_CLASS_PATH=$(cygpath -pw "$JAVA_CLASS_PATH")
	LDFU_BASE_DIRECTORY_PATH=$(cygpath -w "$LDFU_BASE_DIRECTORY_PATH")
	LDFU_HOME_DIRECTORY_PATH=$(cygpath -w "$LDFU_HOME_DIRECTORY_PATH")
	if [ "$LDFU_TMPS_DIRECTORY_PATH" ]; then
		LDFU_TMPS_DIRECTORY_PATH=$(cygpath -w "$LDFU_TMPS_DIRECTORY_PATH")
	fi
fi


# Output variables if in console
if [ $LDFU_DEBUG ] && [ $exec_is_tty ] ; then
	errcho "User defined variables"
	errcho -en "\t"
	errcho "LDFU_HOME=$LDFU_HOME"
	errcho -en "\t"
	errcho "LDFU_BASE=$LDFU_BASE"
	errcho -en "\t"
	errcho "LDFU_OUT=$LDFU_OUT"
	errcho -en "\t"
	errcho "LDFU_OUT_NAME=$LDFU_OUT_NAME"
	errcho -en "\t"
	errcho "LDFU_TMP=$LDFU_TMP"
	errcho -en "\t"
	errcho "JAVA_CLASSPATH=$JAVA_CLASSPATH"
	errcho -en "\t"
	errcho "JAVA_OPTS=$JAVA_OPTS"
	errcho
	errcho "Execution related variables"
	errcho -en "\t"
	errcho "THIS_FILE_PATH_UNRESOLVED=$0"
	errcho -en "\t"
	errcho "THIS_FILE_PATH=$THIS_FILE_PATH"
	errcho -en "\t"
	errcho "THIS_DIRECTORY_PATH=$THIS_DIRECTORY_PATH"
	errcho -en "\t"
	errcho "EXECUTION_DIRECTORY_PATH=$EXECUTION_DIRECTORY_PATH"
	errcho
	errcho "Derived Linked Data-Fu directory path variables"
	errcho -en "\t"
	errcho "LDFU_HOME_DIRECTORY_PATH=$LDFU_HOME_DIRECTORY_PATH"
	errcho -en "\t"
	errcho "LDFU_BASE_DIRECTORY_PATH=$LDFU_BASE_DIRECTORY_PATH"
	errcho -en "\t"
	errcho "LDFU_BINS_DIRECTORY_PATH=$LDFU_BINS_DIRECTORY_PATH"
	errcho -en "\t"
	errcho "LDFU_CFGS_DIRECTORY_PATH=$LDFU_CFGS_DIRECTORY_PATH"
	# FIXME Commented as long as not required
	#	errcho -en "\t"
	#	errcho "LDFU_DOCS_DIRECTORY_PATH=$LDFU_DOCS_DIRECTORY_PATH"
	errcho -e "\tLDFU_LIBS_DIRECTORY_PATH=$LDFU_LIBS_DIRECTORY_PATH"
	# FIXME Commented as long as not required
	#	errcho -en "\t"
	#	errcho "LDFU_MODS_DIRECTORY_PATH=$LDFU_MODS_DIRECTORY_PATH"
	errcho -en "\t"
	errcho "LDFU_OUTS_DIRECTORY_PATH=$LDFU_OUTS_DIRECTORY_PATH"
	# FIXME Commented as long as not required
	#	errcho -en "\t"
	#	errcho "LDFU_TMPS_DIRECTORY_PATH=$LDFU_TMPS_DIRECTORY_PATH"
	errcho
	errcho "Derived Linked Data-Fu file path variables"
	errcho -en "\t"
	errcho "LDFU_OUT_FILE_PATH=$LDFU_OUT_FILE_PATH"
	errcho
	errcho "Derived Java variables"
	errcho -en "\t"
	errcho "JAVA_CLASS_PATH=$JAVA_CLASS_PATH"
	errcho -en "\t"
	errcho "JAVA_OPTIONAL_ARGUMENTS=$JAVA_OPTIONAL_ARGUMENTS"
	errcho -en "\t"
	errcho "JAVA_MAIN_CLASS=$JAVA_MAIN_CLASS"
	errcho -en "\t"
	errcho "JAVA_USER_ARGUMENTS=$JAVA_USER_ARGUMENTS"
	errcho
fi




# Change back to the directory the command was executed from
cd "$EXECUTION_DIRECTORY_PATH"




# Execute
if [ ! -z $JAVA_MAIN_CLASS ]; then
	eval "java" $JAVA_OPTIONAL_ARGUMENTS \
		-classpath "\"$JAVA_CLASS_PATH\"" \
		-Dldfu.home="\"$LDFU_HOME_DIRECTORY_PATH\"" \
		-Dldfu.base="\"$LDFU_BASE_DIRECTORY_PATH\"" \
		\"$JAVA_MAIN_CLASS\" "$JAVA_USER_ARGUMENTS" #\
	#>> "$LDFU_OUT_FILE_PATH" 2>&1 "&"
# DOES NOT WORK UNDER LINUX, WHY F$#@ WITH THE TMP DIR AT ALL?
#			-Djava.io.tmpdir="\"$LDFU_TMPS_DIRECTORY_PATH\"" \

else
	errcho "Usage: engine.sh ( commands ... )"
	errcho "Commands:"
	errcho
	errcho -e "\tldfu\t\tStart Linked Data-Fu"
#	errcho -e "\tserver\t\tStart Linked Data-Fu Server"
	errcho
	errcho -e "\ttree-gen\tStart Data Gen"
	errcho -e "\ttree-server\tStart Data Server"
	errcho
	errcho -e "\tlubm-gen\tStart LUBM Gen"
	errcho -e "\tlubm-bench\tStart LUBM Bench"
	errcho
	errcho -e "\twarc-parser\tStart WARC Parser"
	errcho -e "\twarc-server\tStart WARC Server"
	exit 1
fi
