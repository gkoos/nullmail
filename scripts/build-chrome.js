import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Create build directory
const buildDir = path.join(projectRoot, 'dist', 'chrome');
fs.mkdirSync(buildDir, { recursive: true });

// Copy extension files
const extensionDir = path.join(projectRoot, 'extension');
const filesToCopy = ['background.js', 'icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'];

filesToCopy.forEach(file => {
  fs.copyFileSync(
    path.join(extensionDir, file),
    path.join(buildDir, file)
  );
});

// Copy Chrome manifest (V3)
fs.copyFileSync(
  path.join(extensionDir, 'manifest-v3.json'),
  path.join(buildDir, 'manifest.json')
);

console.log('Chrome extension built in dist/chrome/');