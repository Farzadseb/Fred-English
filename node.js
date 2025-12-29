{
  "name": "english-with-fred",
  "version": "1.0.0",
  "description": "برنامه آموزش زبان انگلیسی با آزمون‌های تعاملی",
  "main": "index.html",
  "scripts": {
    "start": "npx serve .",
    "dev": "npx live-server .",
    "build": "echo 'Build complete'",
    "test": "echo 'No tests yet'",
    "deploy": "echo 'Deploying to server...'",
    "pwa": "npx pwa-asset-generator ./icon.png ./icons",
    "lint": "npx eslint *.js",
    "format": "npx prettier --write ."
  },
  "keywords": [
    "english",
    "learning",
    "quiz",
    "pwa",
    "javascript",
    "education"
  ],
  "author": "English with Fred <09017708544>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/english-with-fred.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/english-with-fred/issues"
  },
  "homepage": "https://github.com/yourusername/english-with-fred#readme",
  "devDependencies": {
    "serve": "^14.0.0",
    "live-server": "^1.2.2",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "pwa": {
    "name": "English with Fred",
    "short_name": "EnglishFred",
    "theme_color": "#4F46E5",
    "background_color": "#F8FAFC"
  },
  "browserslist": [
    "last 2 versions",
    "not dead",
    "not IE 11"
  ]
}
