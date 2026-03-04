const ts = require('./node_modules/typescript');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) {
  fs.writeFileSync(path.resolve(__dirname, 'type-errors.txt'), 'CONFIG ERROR: ' + ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  return;
}

const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, __dirname);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

let output = '';
if (diagnostics.length === 0) {
  output = 'SUCCESS: 0 errors\n';
} else {
  output = `ERRORS: ${diagnostics.length} total\n\n`;
  diagnostics.forEach(d => {
    if (d.file) {
      const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
      const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
      const fileName = path.relative(__dirname, d.file.fileName);
      output += `${fileName}(${line + 1},${character + 1}): error TS${d.code}: ${message}\n`;
    } else {
      output += ts.flattenDiagnosticMessageText(d.messageText, '\n') + '\n';
    }
  });
}

fs.writeFileSync(path.resolve(__dirname, 'type-errors.txt'), output);
console.log('Done. Check type-errors.txt');
