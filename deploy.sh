#!/bin/bash

# === Конфигурация ===
APP_NAME="my-next-app"
APP_DIR="/var/www/$APP_NAME"
REPO_DIR="$APP_DIR/repo"
NEXT_DIR="$APP_DIR/app"
PORT=3000
DOMAIN="your-domain.com"

# === Обновление исходников ===
echo "🔄 Обновление исходников..."
cd $REPO_DIR || exit 1
git pull origin main || exit 1

# === Установка зависимостей и билд ===
echo "📦 Установка зависимостей и билд..."
cd $REPO_DIR || exit 1
yarn install --frozen-lockfile || exit 1
yarn build || exit 1

# === Перезапуск приложения ===
echo "🚀 Перезапуск приложения..."
pm2 delete $APP_NAME || true
pm2 start "yarn start" --name $APP_NAME --cwd $REPO_DIR --env production

# === Конфигурация nginx ===
echo "🛠 Настройка Nginx..."
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
cat <<EOF | sudo tee $NGINX_CONF
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

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/$APP_NAME
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Деплой завершён."
