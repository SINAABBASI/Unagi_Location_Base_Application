#!/bin/bash


#consts
APP_NAME=UnagiAPI
API_PATH=/var/www/Server

#get api server current status
pm2 describe $APP_NAME &>/dev/null 
APP_RUNNING=$?

echo
echo "********************************************"

if [ "${APP_RUNNING}" = "0" ]
then
    echo "Stopping API..."
    pm2 stop ${APP_NAME}
fi

cd ${API_PATH}
echo "Pulling latest version from git , master branch"
if git pull
then
    echo "checking and installing new dependencies..."
    if npm install
    then 
        if [ "$1" = "--no-run" ]
        then
            echo "API is not starting because --no-run argument is passed"
        else
            if [ "${APP_RUNNING}" = "0" ]
            then
                echo "Starting API..."
                pm2 start ${APP_NAME}
            else   
                echo "Couldnt start API , UnagiAPI not found in pm2 proccess list"
            fi
        fi
    else
        echo "an error occurred while checking and installing new deps (npm)."
    fi
else
    echo "an error occurred while pulling from git."
fi


echo "********************************************"
echo