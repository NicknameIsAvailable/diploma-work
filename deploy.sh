#!/bin/bash

# === Конфигурация ===
APP_NAME="diploma-work"
APP_DIR="/var/www/$APP_NAME"
REPO_SOURCE_DIR="$PWD"
PORT=3000
DOMAIN="metrostroy-schedule"

# === Проверка и установка утилит ===
install_if_missing() {
  if ! command -v "$1" &> /dev/null; then
    echo "📦 Установка $1..."
    eval "$2"
  else
    echo "✅ $1 уже установлен"
  fi
}

sudo apt update

install_if_missing git "sudo apt install git -y"
install_if_missing curl "sudo apt install curl -y"
install_if_missing node "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install nodejs -y"
install_if_missing pnpm "npm install -g pnpm"
install_if_missing pm2 "npm install -g pm2"
install_if_missing nginx "sudo apt install nginx -y && sudo systemctl enable nginx && sudo systemctl start nginx"

# === Копирование проекта, если нужно ===
if [ ! -d "$APP_DIR" ]; then
  echo "📁 Копирование проекта в $APP_DIR"
  sudo mkdir -p "$APP_DIR"
  sudo cp -r "$REPO_SOURCE_DIR"/* "$APP_DIR"
  sudo chown -R $USER:$USER "$APP_DIR"
else
  echo "📁 Проект уже есть в $APP_DIR"
fi

# === Переход в директорию ===
cd "$APP_DIR" || exit 1

# === Обновление исходников ===
if [ -d .git ]; then
  echo "🔄 git pull..."
  git pull origin main || exit 1
else
  echo "⚠️  Не git-проект. Пропускаем обновление."
fi

# === Установка зависимостей и билд ===
echo "📦 Установка зависимостей и билд..."
pnpm install --frozen-lockfile || exit 1
pnpm build || exit 1

# === Перезапуск приложения ===
echo "🚀 Перезапуск приложения через PM2..."
pm2 delete $APP_NAME || true
pm2 start "pnpm start" --name $APP_NAME --cwd "$APP_DIR" --env production
pm2 save

# === Настройка Nginx ===
echo "🛠 Конфигурация nginx..."
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$APP_NAME"
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Деплой завершён!"