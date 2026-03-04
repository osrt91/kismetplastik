const ts = require('./node_modules/typescript');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const outFile = path.join(dir, 'tsc-api-output.txt');

try {
  const configPath = path.join(dir, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  if (configFile.error) {
    fs.writeFileSync(outFile, 'CONFIG ERROR: ' + ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
    process.exit(0);
  }

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dir);
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  let output = '';
  if (diagnostics.length === 0) {
    output = 'SUCCESS: 0 errors\n';
  } else {
    output = 'ERRORS: ' + diagnostics.length + ' total\n\n';
    diagnostics.forEach(function(d) {
      if (d.file) {
        var pos = d.file.getLineAndCharacterOfPosition(d.start);
        var msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
        var fn = path.relative(dir, d.file.fileName);
        output += fn + '(' + (pos.line + 1) + ',' + (pos.character + 1) + '): error TS' + d.code + ': ' + msg + '\n';
      } else {
        output += ts.flattenDiagnosticMessageText(d.messageText, '\n') + '\n';
      }
    });
  }

  fs.writeFileSync(outFile, output);
} catch (e) {
  fs.writeFileSync(outFile, 'SCRIPT ERROR: ' + (e.message || String(e)) + '\n' + (e.stack || ''));
}
