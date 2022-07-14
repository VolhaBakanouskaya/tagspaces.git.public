const fs = require('fs-extra');
const pathLib = require('path');
const shell = require('shelljs');
const packageJson = require('../package.json');

/**
 * check only if index.js exist - TODO check installed version
 * @deprecated TODO replace this from @tagspaces/dynamic-packages-loading
 * @param npmPackage
 * @returns {boolean}
 */
function isInstalled(npmPackage) {
  try {
    const path = require.resolve('@tagspaces/tagspaces-platforms');
    if (
      !fs.existsSync(path) ||
      !fs.existsSync(pathLib.join(path, '..', 'node_modules'))
    ) {
      return false;
    }
    const data = fs.readFileSync(path, 'utf8');
    return data.indexOf(npmPackage) !== -1; // fs.existsSync(path)
    // process.moduleLoadList.indexOf("NativeModule " + npmPackage) >= 0 ||
  } catch (e) {
    return false;
  }
}

let install = false;
if (process.env.PD_PLATFORM === 'electron') {
  if (!isInstalled('@tagspaces/tagspaces-common-electron')) {
    install = true;
  }
} else if (process.env.PD_PLATFORM === 'node') {
  if (
    !isInstalled('@tagspaces/tagspaces-common-node') ||
    isInstalled('@tagspaces/tagspaces-common-electron')
  ) {
    install = true;
  }
} else if (process.env.PD_PLATFORM === 'web') {
  if (!isInstalled('@tagspaces/tagspaces-common-aws')) {
    install = true;
  }
} else if (process.env.PD_PLATFORM === 'webdav') {
  if (!isInstalled('@tagspaces/tagspaces-common-webdav')) {
    install = true;
  }
} else if (process.env.PD_PLATFORM === 'cordova') {
  if (!isInstalled('@tagspaces-common-cordova')) {
    install = true;
  }
}
shell.exec('npm -v');

/**
 * If the installed tagspaces-platforms changed (with deleted node_modules) npm install will not update it -> change version or delete the tagspaces-platforms folder
 * @type {string}
 */
const cmd =
  'npm install @tagspaces/tagspaces-platforms@' + // --force --foreground-scripts
  stripFromStart(
    packageJson.dependencies['@tagspaces/tagspaces-platforms'],
    '^'
  );
if (install) {
  if (shell.exec(cmd).code !== 0) {
    shell.echo(
      'Error: Install ' + process.env.PD_PLATFORM + ' platform failed'
    );
    shell.exit(1);
  }
  const cmd2 =
    'npm run-script --prefix ./node_modules/@tagspaces/tagspaces-platforms postinstall';
  if (shell.exec(cmd2).code !== 0) {
    shell.echo('Error: PostInstall ' + process.env.PD_PLATFORM + ' platform');
    shell.exit(1);
  }
}

function stripFromStart(input, character) {
  if (input.startsWith(character)) {
    return input.substr(character.length);
  }
  return input;
}

/* if (process.env.PD_PLATFORM === 'electron') {
  if (!isInstalled('@tagspaces/tagspaces-common-electron')) {
    npm.load(er => {
      if (er) {
        console.log('err:', er);
        return;
      }
      npm.commands.run(['postinstall-electron'], err => {
        if (err) {
          console.log('err:', err);
        }
      });
      npm.on('log', message => {
        console.log('npm:' + message);
      });
    });
  }
} else if (process.env.PD_PLATFORM === 'node') {
  if (!isInstalled('@tagspaces/tagspaces-common-node') || isInstalled('@tagspaces/tagspaces-common-electron')) {
    npm.load(er => {
      if (er) {
        console.log('err:', er);
        return;
      }
      npm.commands.run(['postinstall-node'], err => {
        if (err) {
          console.log('err:', err);
        }
      });
      npm.on('log', message => {
        console.log('npm:' + message);
      });
    });
  }
} else if (process.env.PD_PLATFORM === 'web') {
  if (!isInstalled('@tagspaces/tagspaces-common-aws')) {
    npm.load(er => {
      if (er) {
        console.log('err:', er);
        return;
      }
      npm.commands.run(['postinstall-web'], err => {
        if (err) {
          console.log('err:', err);
        }
      });
      npm.on('log', message => {
        console.log('npm:' + message);
      });
    });
  }
} else if (process.env.PD_PLATFORM === 'cordova') {
  if (!isInstalled('@tagspaces-common-cordova')) {
    npm.load(er => {
      if (er) {
        console.log('err:', er);
        return;
      }
      npm.commands.run(['postinstall-cordova'], err => {
        if (err) {
          console.log('err:', err);
        }
      });
      npm.on('log', message => {
        console.log('npm:' + message);
      });
    });
  }
} */
