# Memory Issue Solutions for npm run build

## Problem
The `npm run build` command gets "Killed" on the server due to insufficient memory. This is common on shared hosting environments.

## 🎯 Recommended Solution: Upload Pre-built Assets

Since the assets are already built locally, **upload them instead of building on server**:

### Step 1: Verify Local Build
```bash
# On your local machine (already done)
ls -la public/build/
# Should show manifest.json and assets folder
```

### Step 2: Upload Build Files
**Via cPanel File Manager:**
1. Navigate to your domain's public folder
2. Create `build` folder if it doesn't exist
3. Upload entire contents of local `public/build/` to server `public/build/`

**Via FTP/SFTP:**
```bash
# Upload build directory
scp -r public/build/ user@server:/path/to/public/
```

### Step 3: Use No-Build Deployment Script
```bash
# Make script executable
chmod +x deploy-without-build.sh

# Run deployment without building
./deploy-without-build.sh
```

## 🔧 Alternative Solutions (if you must build on server)

### Solution 1: Increase Memory Limit
```bash
# Try with more memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# For very limited environments
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Minimum memory approach
NODE_OPTIONS="--max-old-space-size=1024" npm run build
```

### Solution 2: Build in Chunks
Create `vite.config.memory.js`:
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        // Reduce memory usage
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split large libraries
                    react: ['react', 'react-dom'],
                    antd: ['antd'],
                    charts: ['chart.js', 'react-chartjs-2'],
                    icons: ['@ant-design/icons'],
                    inertia: ['@inertiajs/react']
                }
            }
        },
        // Use less memory-intensive minifier
        minify: 'esbuild',
        target: 'es2015',
        // Reduce parallelism
        terserOptions: {
            parallel: 1
        }
    }
});
```

Then build with:
```bash
npx vite build --config vite.config.memory.js
```

### Solution 3: Swap File (if you have root access)
```bash
# Create swap file (requires root)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Build with swap
npm run build

# Remove swap after build
sudo swapoff /swapfile
sudo rm /swapfile
```

### Solution 4: Build with Docker (if available)
```dockerfile
# Dockerfile.build
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

```bash
# Build in container
docker build -f Dockerfile.build -t twa-build .
docker run --rm -v $(pwd)/public:/app/public twa-build cp -r /app/public/build /app/public/
```

## 🚨 Why This Happens

### Common Causes:
1. **Limited RAM**: Shared hosting typically has 512MB-1GB RAM limits
2. **Memory-intensive build**: Vite + React + Ant Design requires significant memory
3. **Large dependency tree**: Many JavaScript dependencies consume memory during build
4. **Concurrent processes**: Other processes using server memory

### Memory Usage During Build:
- **Node.js base**: ~50MB
- **Vite bundler**: ~200-500MB
- **React compilation**: ~100-300MB
- **Ant Design processing**: ~200-400MB
- **Total needed**: ~1-2GB for comfortable build

## 📊 Server Memory Check

Check your server's available memory:
```bash
# Check total memory
free -h

# Check memory usage
top -o %MEM

# Check Node.js memory limit
node -e "console.log(process.memoryUsage())"
```

## ✅ Best Practices for cPanel Deployment

### 1. Build Locally (Recommended)
- Build on your development machine
- Upload only the compiled assets
- Faster deployment, no server memory issues

### 2. Use CI/CD Pipeline
- GitHub Actions can build and deploy
- No server resources used for building
- Automated deployment process

### 3. Optimize Dependencies
```bash
# Remove dev dependencies in production
npm ci --only=production

# Use lighter alternatives where possible
# Consider replacing heavy libraries
```

### 4. Monitor Resource Usage
```bash
# Check during build
watch -n 1 'free -h && ps aux --sort=-%mem | head -10'
```

## 🎯 Recommended Workflow

1. **Develop locally** with full build capabilities
2. **Build assets locally** using `npm run build`
3. **Commit built assets** to repository (or use CI/CD)
4. **Deploy to server** without building
5. **Run PHP-only deployment** script

This approach:
- ✅ Avoids memory issues
- ✅ Faster deployment
- ✅ More reliable
- ✅ Works on any hosting environment
- ✅ Reduces server load

## 🔍 Troubleshooting

If you still need to build on server:

### Check Memory Before Build:
```bash
echo "Available memory:"
free -h
echo "Disk space:"
df -h
echo "Node version:"
node --version
echo "NPM version:"
npm --version
```

### Monitor Build Process:
```bash
# Run build with memory monitoring
(npm run build &) && watch -n 1 'ps aux | grep node'
```

### Alternative Build Commands:
```bash
# Try different approaches
npx vite build --mode production
NODE_ENV=production npx vite build
npm run build -- --no-minify
```

The **recommended solution is to upload pre-built assets** rather than building on the server, especially for cPanel hosting environments.