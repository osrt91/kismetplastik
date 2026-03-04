const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

const dir = 'C:/Users/osrt91/Desktop/Proje/kismetplastik-new';
const outFile = join(dir, 'tsc-check-output.txt');

try {
  const result = execSync(
    'node node_modules/typescript/lib/tsc.js --noEmit',
    {
      cwd: dir,
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      timeout: 180000,
    }
  );
  writeFileSync(outFile, 'SUCCESS: 0 errors\n' + (result || ''));
} catch (e) {
  const stdout = e.stdout || '';
  const stderr = e.stderr || '';
  writeFileSync(outFile, 'EXIT CODE: ' + e.status + '\n\n' + stdout + '\n---STDERR---\n' + stderr);
}
