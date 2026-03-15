# 1. PHPと拡張機能のセットアップ
FROM php:8.4-fpm-alpine

# 必要なパッケージのインストール
RUN apk add --no-cache \
    nginx \
    nodejs \
    npm \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git

# PHP拡張のインストール（Supabase/PostgreSQL用）
RUN docker-php-ext-install pdo_pgsql gd zip

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの設定
WORKDIR /var/www

# プロジェクトファイルのコピー
COPY . .

# PHPライブラリのインストール
RUN composer install --no-dev --optimize-autoloader

# フロントエンド（React/Vite）のビルド
RUN npm install
RUN npm run build

# 権限の設定
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Nginxの設定（後述するファイルをコピーするか、簡易的に設定）
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# ポートの開放
EXPOSE 80

# 起動コマンド
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]