#!/bin/bash

#consts
PM2_CFG=/var/www/Server/pm2cfg/UnagiAPI.json
APP_NAME=UnagiAPI
MONGODB_SERVICE=mongod.service
NGINX_SERVICE=nginx.service

#get api server current status
pm2 describe $APP_NAME &>/dev/null 
APP_RUNNING=$?

#get mongodb and nginx current status
MONGODB_STATUS="`systemctl is-active $MONGODB_SERVICE`"
NGINX_STATUS="`systemctl is-active $NGINX_SERVICE`"

echo
echo "********************************************"

#check if mongodb and nginx are up , then starts api
if [ $MONGODB_STATUS = "active" ] && [ $NGINX_STATUS = "active" ]
then
    echo "NginX and MongoDB Running"
    echo "Starting Api..."

    #check if api is already in pm2 list or not
    if [ "${APP_RUNNING}" = "1" ]
    then
        pm2 start $PM2_CFG
    else
        pm2 start $APP_NAME
    fi
else
    echo "Cant start api : "
    echo "Mongodb Status ${MONGODB_STATUS}"
    echo "NginX Status ${NGINX_STATUS}"
    echo "First run api-prepare"
fi

echo "********************************************"
echo