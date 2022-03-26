// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const AdmZip = require('adm-zip');
const fs = require('fs');

function zipDist(version) {
  const versionFileName = `./dist/shlink-web-client_${version}_dist.zip`;

  console.log(chalk.cyan(`Generating dist file for version ${chalk.bold(version)}...`));
  const zip = new AdmZip();

  try {
    if (fs.existsSync(versionFileName)) {
      fs.unlink(versionFileName);
    }

    zip.addLocalFolder('./build', `shlink-web-client_${version}_dist`);
    zip.writeZip(versionFileName);
    console.log(chalk.green('Dist file properly generated'));
  } catch (e) {
    console.log(chalk.red('An error occurred while generating dist file'));
    console.log(e);
  }
  console.log();
}

const version = process.env.VERSION;

if (version) {
  zipDist(version);
}
