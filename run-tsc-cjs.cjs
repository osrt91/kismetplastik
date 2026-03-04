const { execSync } = require('child_process');
const { writeFileSync } = require('fs');

try {
  const result = execSync('node node_modules/typescript/lib/tsc.js --noEmit', {
    cwd: 'C:/Users/osrt91/Desktop/Proje/kismetplastik-new',
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 180000,
  });
  writeFileSync('C:/Users/osrt91/Desktop/Proje/kismetplastik-new/tsc-cjs-out.txt', 'SUCCESS\n' + (result || ''));
} catch (e) {
  const output = (e.stdout || '') + '\n---STDERR---\n' + (e.stderr || '');
  writeFileSync('C:/Users/osrt91/Desktop/Proje/kismetplastik-new/tsc-cjs-out.txt', 'ERRORS (exit ' + e.status + '):\n' + output);
}
