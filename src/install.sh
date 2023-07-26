#!/bin/bash

# safety instructions: stop script on errors
set -o errexit
set -o nounset
set -o pipefail

# initial actions
clear
echo "Запуск скрипта установщика бота на сервер ubuntu..."
echo "***********************************************************************"
echo "* ______   _______   ________  ________        ______        ______   *"
echo "* ___  /   ___    |  ___  __ \ __  ___/        ___  / ______ ___  /_  *"
echo "* __  /    __  /| |  __  /_/ / _____ \         __  /  _  __  /_  __ \ *"
echo "* _  /______  ___ |___  ____/______/ /__       _  /___/ /_/ /_  /_/ / *"
echo "* /_____/(_)_/  |_|(_)_/    _(_)____/_(_)      /_____/\__,_/ /_.___/  *"
echo "*                                                                     *"
echo "***********************************************************************"

echo "L.A.P.S. GPT TELEGRAM BOT ATOMATIC INSTALLER FOR SPRINTBOX v0.1:"
echo "init..."

# install required system packages
# run standard system updates
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y && echo "Системные репозитории успешно обновлены."

# install node-js
# download the distribution
wget https://nodejs.org/dist/v4.2.3/node-v4.2.3-linux-x64.tar.gz;

# place the downloaded distribution
mkdir node
tar xvf node-v*.tar.?z --strip-components=1 -C ./node
mkdir node/etc
echo 'prefix=/usr/local' > node/etc/npmrc
mv node /opt/
chown -R root: /opt/node

# make symbolic links
$ ln -s /opt/node/bin/node /usr/local/bin/node
$ ln -s /opt/node/bin/npm /usr/local/bin/npm

# create bot user
clear
echo "============================================================"
echo "|| СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ НА СЕРВЕРЕ      <<< L.A.P.S. Lab ||"
echo "||--------------------------------------------------------||"
echo "|| Будет создан пользователь funnel_bot. Вам будет предложено||"
echo "|| ввести и подтвердить UNIX пароль, а также заполнить    ||"
echo "|| дополнительную информацию о пользователе. Обязательно  ||"
echo "|| требуется точно ввести и повторить пароль, остальные   ||"
echo "|| данные можно не указывать - просто нажимайте [enter].  ||"
echo "============================================================"
adduser funnel_bot && echo "Пользователь gpt_bot создан"

# switch to non-root user & configure user environment
#sudo apt install python3-virtualenv -y && echo "python3-virtualenv установлен"
runuser -l funnel_bot -c "export PATH=$HOME/.local/bin:$PATH" && echo "HOME path установлено"
#runuser -l gpt_bot -c "virtualenv --system-site-packages node" && echo "Виртуальное окружение NODE.js установлено"
runuser -l funnel_bot -c "cd ~ && npm i" && echo "Требуемые модули библиотек npm подключены."

# additions from support tickets
mv /root/laps-gpt-install/gpt-bot.py /home/gpt_bot/gpt-bot.py
chown gpt_bot:gpt_bot /home/gpt_bot/gpt-bot.py

# create env & set api tokens
clear
touch .env
echo "============================================================"
echo "|| ПОДКЛЮЧЕНИЕ К API OPENAI              <<< L.A.P.S. Lab ||"
echo "||--------------------------------------------------------||"
echo "||                                 _____                  ||"  
echo "|| ________________________________ ___{_}                ||"
echo "|| _  __ \__  __ \  _ \_  __ \  __  /_  /                 ||"              
echo "|| / /_/ /_  /_/ /  __/  / / / /_/ /_  /                  ||"             
echo "|| \____/_  .___/\___//_/ /_/\__,_/ /_/                   ||"            
echo "||       /_/                                              ||"  
echo "||********************************************************||"
echo "|| Введите токен, полученный на сайте openai.com:         ||"
echo "============================================================"
read OPENAI_TOKEN
clear
echo ""
echo "============================================================"
echo "|| ПОДКЛЮЧЕНИЕ К API TELEGRAM            <<< L.A.P.S. Lab ||"
echo "||--------------------------------------------------------||"
echo "||  _____     ______                                      ||"
echo "||  __  /________  /___________ _____________ _______ ___ ||"
echo "|| _  __/  _ \_  /_  _ \_  __  /_  ___/  __  /_  __  __ \ ||"
echo "|| / /_ /  __/  / /  __/  /_/ /_  /   / /_/ /_  / / / / / ||"
echo "|| \__/ \___//_/  \___/_\__, / /_/    \__,_/ /_/ /_/ /_/  ||"
echo "||                     /____/                             ||"
echo "||********************************************************||"
echo "|| Введите токен, полученный в Telegram от @botFather:    ||"
echo "============================================================"
read TG_TOKEN
echo "OPENAI_TOKEN=$OPENAI_TOKEN" > .env && echo "openai токен установлен"
echo "TG_TOKEN=$TG_TOKEN" >> .env && echo "telegram токен установен" && echo "Переменные окружения записаны."

mv /root/.env /home/gpt_bot/.env && echo "Файл окружения перенесен в корневую папку приложения."
chown gpt_bot:gpt_bot /home/gpt_bot/.env && echo "Права на файл окружения переданы пользователю бота."

# install daemon systemctl service
cat > /etc/systemd/system/laps-gpt-bot.service << EOF
[Unit]
Description=L.A.P.S. GPT Bot v1.1
After=syslog.target
After=network.target

[Service]
Type=simple
User=gpt_bot
Group=gpt_bot
WorkingDirectory=/home/gpt_bot
ExecStart=python3 gpt-bot.py
OOMScoreAdjust=-100
RestartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload && systemctl enable laps-gpt-bot && systemctl start laps-gpt-bot && echo "Демон настроен и активирован";

# final commands
clear
echo "Установка завершена."
echo "запрос текущего состояния бота:"
systemctl status laps-gpt-bot
