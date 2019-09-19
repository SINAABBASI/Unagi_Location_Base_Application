#!/bin/bash

#consts
APP_NAME=UnagiAPI
MONGODB_SERVICE=mongod.service
NGINX_SERVICE=nginx.service

#get api server current status
pm2 describe $APP_NAME &>/dev/null 
APP_RUNNING=$?

echo
echo "********************************************"

#check if api is in list , then stops api
if [ "${APP_RUNNING}" = "0" ]
then
    echo "Stopping API..."
    pm2 stop ${APP_NAME}
    #check if "-a" argument is passed
    if [ "$1" = "-a" ]
    then
        echo "Restarting mongodb service..."
        systemctl restart ${MONGODB_SERVICE}
        echo "Restarting nginx service...."
        systemctl restart ${NGINX_SERVICE}
    fi
    echo "Starting API..."
    pm2 start ${APP_NAME}
else
    echo "Couldnt find API proccess in pm2 list"
fi


echo "********************************************"
echo