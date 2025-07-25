#!/bin/bash

# Laravel Development Server with Custom PHP Configuration
# This script starts the Laravel development server with increased file upload limits

echo "🚀 Starting Laravel Development Server with Enhanced File Upload Support"
echo "=================================================================="
echo ""

# Check if php_upload.ini exists
if [ ! -f "php_upload.ini" ]; then
    echo "❌ php_upload.ini not found. Please run this script from the project root."
    exit 1
fi

# Display current configuration
echo "📋 PHP Configuration:"
echo "   - upload_max_filesize: 15M"
echo "   - post_max_size: 20M"
echo "   - max_execution_time: 300s"
echo "   - memory_limit: 256M"
echo ""

# Start the server
echo "🌐 Starting server at http://127.0.0.1:8001"
echo "   Press Ctrl+C to stop the server"
echo ""

# Use custom PHP configuration
php -c php_upload.ini artisan serve --host=127.0.0.1 --port=8001
