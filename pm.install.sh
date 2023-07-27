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
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y && node_version=$(node -v) && npm_version=$(npm -v) && echo "INSTALL.SH: NODEJS установлен (node v. $node_version, npm v. $npm_version)."
sudo npm install pm2 -g && pm2_version=$(npm view pm2) && echo "pm2 установлен: $pm2_version"

# install npm deps
cd easy-funnel-bot && npm install && echo "INSTALL.sh: npm-зависимости установлены."
npm install dotenv && dotenv_view=$(npm view dotenv)
echo "$dotenv_view доустановлен"

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

# Auto tests
npm test && echo "Тестирование jest успешно."

# deamon set
sudo pm2 start index.js --name "easy-funnel-bot" --watch && sudo pm2 startup && sudo pm2 save && echo "pm2 watcher установлен"

echo "Установка завершена."
pm2 restart

echo "запрос текущего состояния бота:"
pm2 monit
