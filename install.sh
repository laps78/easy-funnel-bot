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
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y && echo "INSTALL.SH: Системные репозитории успешно обновлены."

# install node-js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install nodejs -y && node_version=$(node -v) && npm_version=$(npm -v) && echo "INSTALL.SH: NODEJS установлен (node v. $node_version, npm v. $npm_version)."

cd easy-funnel-bot && npm i && echo "INSTALL.sh: npm-зависимости установлены."

# create bot user
#clear
echo "============================================================"
echo "|| СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ НА СЕРВЕРЕ      <<< L.A.P.S. Lab ||"
echo "||--------------------------------------------------------||"
echo "|| Будет создан пользователь funnel_bot, будет предложено ||"
echo "|| ввести и подтвердить UNIX пароль, а также заполнить    ||"
echo "|| дополнительную информацию о пользователе. Обязательно  ||"
echo "|| требуется точно ввести и повторить пароль, остальные   ||"
echo "|| данные можно не указывать - просто нажимайте [enter].  ||"
echo "============================================================"
adduser funnel_bot && echo "Пользователь funnel_bot создан"

pwd
ls -A

# create env & set api tokens
#clear
touch .env && place=$(pwd) && echo "INSTALL.sh: .env создан в директории. ($place))"
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
echo "TG_API_KEY=$TG_TOKEN" > .env && echo "INSTALL.sh: telegram api токен установлен."
echo "" >> .env && echo "Пустая строка в конце файла задана." && echo "Переменные окружения записаны."

# copy files to user home path
mv /root/easy-funnel-bot/* /home/funnel_bot/ && echo "Файлы перенесены в директорию пользователя бота."
chown funnel_bot:funnel_bot /home/funnel_bot/ && echo "Права на управление файлами переданы пользователю"

# switch to non-root user & configure user environment
runuser -l funnel_bot -c "export PATH=$HOME/.local/bin:$PATH" && echo "INSTALL.SH: HOME path установлено"



# mv /easy-funnel-bot/.env /home/funnel-bot/.env && echo "Файл окружения перенесен в корневую папку приложения."
# chown funnel_bot:funnel_bot /home/funnel-bot/.env && echo "Права на файл окружения переданы пользователю бота."

#runuser -l funnel_bot -c "pm2 start /home/funnel_bot/easy-funnel-bot/index.js" && echo "INSTALL.SH: pm2 для index.js запущен успешно."

# install daemon systemctl service
cat > /etc/systemd/system/easy-funnel-bot.service << EOF
[Unit]
Description=L.A.P.S. Lab funnel Bot v0.1
After=syslog.target
After=network.target

[Service]
Type=simple
User=funnel_bot
Group=funnel_bot
WorkingDirectory=/home/funnel_bot/
ExecStart=node index.js
OOMScoreAdjust=-100
RestartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload && systemctl enable easy-funnel-bot && systemctl start easy-funnel-bot && echo "Демон настроен и активирован";

# final commands
#clear
echo "Установка завершена."
echo "запрос текущего состояния бота:"
systemctl status easy-funnel-bot
