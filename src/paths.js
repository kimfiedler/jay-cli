// @flow

const os = require("os");
const path = require("path");
const fs = require("fs-extra");

const homedir = os.homedir();
const jayDirectory = path.join(homedir, ".jay");
const extensionsDir = path.join(jayDirectory, "exts");

try {
  fs.ensureDirSync(jayDirectory);
} catch (err) {
  console.error("Unable to create directory for configuration");
  process.exit(1);
}

try {
  fs.ensureDirSync(extensionsDir);
} catch (err) {
  console.error("Unable to create directory for extensions");
  process.exit(1);
}

const paths = {
  jayDirectory,
  extensionsDir,
  configFile: path.join(jayDirectory, "jay.config.js")
};

module.exports = paths;
