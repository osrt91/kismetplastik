import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const result = execSync('node node_modules/typescript/lib/tsc.js --noEmit', {
    cwd: 'C:/Users/osrt91/Desktop/Proje/kismetplastik-new',
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 120000,
  });
  writeFileSync('C:/Users/osrt91/Desktop/Proje/kismetplastik-new/tsc-result.txt', 'SUCCESS\n' + result);
} catch (e) {
  const output = (e.stdout || '') + '\n' + (e.stderr || '');
  writeFileSync('C:/Users/osrt91/Desktop/Proje/kismetplastik-new/tsc-result.txt', 'ERRORS (exit ' + e.status + '):\n' + output);
}
