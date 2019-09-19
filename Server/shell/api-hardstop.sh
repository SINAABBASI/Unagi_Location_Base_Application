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
    pm2 delete ${APP_NAME}
else
    echo "Couldnt find API proccess in pm2 list"
fi

#stops nginx and mongodb services
echo "Stoppping MongoDB And NginX..."
systemctl stop ${MONGODB_SERVICE}
systemctl stop ${NGINX_SERVICE}

echo "********************************************"
echo