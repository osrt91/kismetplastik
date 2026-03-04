const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { join } = require('path');

const dir = 'C:/Users/osrt91/Desktop/Proje/kismetplastik-new';
const outFile = createWriteStream(join(dir, 'tsc-v3-out.txt'));

const proc = spawn('node', ['node_modules/typescript/lib/tsc.js', '--noEmit'], {
  cwd: dir,
  shell: true,
});

proc.stdout.on('data', (data) => outFile.write(data));
proc.stderr.on('data', (data) => outFile.write(data));

proc.on('close', (code) => {
  outFile.write('\n---EXIT CODE: ' + code + '---\n');
  outFile.end();
});

proc.on('error', (err) => {
  outFile.write('\n---ERROR: ' + err.message + '---\n');
  outFile.end();
});
