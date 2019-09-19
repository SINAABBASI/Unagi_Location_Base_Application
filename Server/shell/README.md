**api-prepare** -- starts ngninx and mongodb service  
**api-start** -- checks for ngninx and mongodb then starts the api from json thorugh pm2   
**api-stop** -- stops API, MongoDB and NginX  
**api-hardstop** -- deletes API from pm2 list , stops ngninx and mongodb  
**api-reload** -- reloads API only without delay  
**api-status** -- logs mongodb, nginx and API status  
**api-restart** -- restarts API ans also nginx and mongodb if "a" was passed as an argument (./api-restart.sh a)  
**api-update** -- stops API , pull latest master version, installing new dependenices if available , starts API (if --no-run wasnt passed)  