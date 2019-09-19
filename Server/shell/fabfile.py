from fabric.api import local, env, run

#setting ssh hostname and username
env.hosts = ['45.55.213.147']
env.user = 'root'

#executing server shell scripts
def api_prepare():
    run('/var/www/Server/shell/api-prepare.sh')

def api_start():
    run('/var/www/Server/shell/api-start.sh')

def api_stop():
    run('/var/www/Server/shell/api-stop.sh')

def api_hardstop():
    run('/var/www/Server/shell/api-hardstop.sh')

def api_reload():
    run('/var/www/Server/shell/api-reload.sh')

def api_status():
    run('/var/www/Server/shell/api-status.sh')

def api_restart():
    run('/var/www/Server/shell/api-restart.sh')

def api_update():
    run('/var/www/Server/shell/api-update.sh')