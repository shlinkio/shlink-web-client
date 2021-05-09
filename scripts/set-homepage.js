const argv = process.argv.slice(2);
const [ homepage ] = argv;

if (!homepage) {
  throw new Error('Homepage has to be provided as the first arg for this script');
}

const packageJsonPath = `${__dirname}/../package.json`;
const packageJson = require(packageJsonPath);
const fs = require('fs');

packageJson.homepage = homepage;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
