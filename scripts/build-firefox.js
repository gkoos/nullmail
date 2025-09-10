import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Create build directory
const buildDir = path.join(projectRoot, 'dist', 'firefox');
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

// Copy Firefox manifest (V2)
fs.copyFileSync(
  path.join(extensionDir, 'manifest-v2.json'),
  path.join(buildDir, 'manifest.json')
);

console.log('Firefox extension built in dist/firefox/');