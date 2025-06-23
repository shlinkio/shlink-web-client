import chalk from 'chalk';
import AdmZip from 'adm-zip';
import fs from 'fs';

function zipDist(version) {
  const fileBaseName = `shlink-web-client_${version}_dist`;
  const versionFileName = `./dist/${fileBaseName}.zip`;

  console.log(chalk.cyan(`Generating dist file for version ${chalk.bold(version)}...`));
  const zip = new AdmZip();

  try {
    if (fs.existsSync(versionFileName)) {
      fs.unlinkSync(versionFileName);
    }

    zip.addLocalFolder('./build', fileBaseName);
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
