#!/bin/bash

#consts
APP_NAME=UnagiAPI
MONGODB_SERVICE=mongod.service
NGINX_SERVICE=nginx.service

#get api server current status
pm2 describe $APP_NAME &>/dev/null 
APP_RUNNING=$?

#get mongodb and nginx current status
MONGODB_STATUS="`systemctl is-active $MONGODB_SERVICE`"
NGINX_STATUS="`systemctl is-active $NGINX_SERVICE`"

#logging mongodb and nginx service status
echo 
echo
echo "********************************************"
echo "MongoDB service status : ${MONGODB_STATUS}"
echo "NginX service status : ${NGINX_STATUS}"
echo "********************************************"
echo

#check if api is already in pm2 list or not
if [ "${APP_RUNNING}" = "0" ]
then
    pm2 describe $APP_NAME
else
    echo "Couldnt find UngagiAPI in pm2 proccess list"
    echo
fi
