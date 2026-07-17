#!/bin/bash
set -e

# Copy .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install Composer dependencies if vendor folder doesn't exist
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Generate APP_KEY if it's empty
if grep -q "^APP_KEY=$" .env; then
    echo "Generating APP_KEY..."
    php artisan key:generate --no-interaction
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

echo "Starting FrankenPHP..."
# Execute the original command passed to the container
exec "$@"
