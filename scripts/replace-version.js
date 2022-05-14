const fs = require('fs');

function replaceVersionPlaceholder(version) {
  const staticJsFilesPath = './build/static/js';
  const versionPlaceholder = '%_VERSION_%';

  const isMainFile = (file) => file.startsWith('main.') && file.endsWith('.js');
  const [ mainJsFile ] = fs.readdirSync(staticJsFilesPath).filter(isMainFile);
  const filePath = `${staticJsFilesPath}/${mainJsFile}`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const replaced = fileContent.replace(versionPlaceholder, version);

  fs.writeFileSync(filePath, replaced, 'utf-8');
}

const version = process.env.VERSION;

if (version) {
  replaceVersionPlaceholder(version);
}
