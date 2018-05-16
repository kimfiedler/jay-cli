// @flow
const yargs = require("yargs");
const paths = require("./paths");
const fs = require("fs-extra");
const _get = require("lodash/get");
const _set = require("lodash/set");

const updateExportedObject = require("update-exported-object");

const DEFAULT_CONFIG = {
  extensions: []
};

function writeDefaultConfig() {
  const defaultConfigString = `module.exports = ${JSON.stringify(
    DEFAULT_CONFIG,
    null,
    2
  )}
`;

  write(defaultConfigString);
}

function ensureConfigFileExists() {
  if (!fs.existsSync(paths.configFile)) {
    writeDefaultConfig();
  }
}

function requireConfig() {
  ensureConfigFileExists();
  return require(paths.configFile);
}

function requireConfigFailed(err) {
  console.log("Error loading config file.");
  throw err;
}

function read() {
  try {
    return requireConfig();
  } catch (err) {
    requireConfigFailed(err);
  }
}

function write(config) {
  fs.writeFileSync(paths.configFile, config);
}

function get(key: string) {
  const config = read();

  const userValue = _get(config, key);

  if (typeof userValue === "undefined") {
    return _get(DEFAULT_CONFIG, key);
  } else {
    return userValue;
  }
}

function parseValue(value: any) {
  if (
    typeof value === "string" &&
    value.startsWith('"') &&
    value.endsWith('"')
  ) {
    return JSON.parse(value.substring(1, value.length - 1));
  }

  return value;
}

function set(key: string, value: any) {
  ensureConfigFileExists();

  const src = fs.readFileSync(paths.configFile);
  const newSrc = updateExportedObject(src, obj => {
    _set(obj, key, parseValue(value));
  });

  write(newSrc);
}

module.exports = {
  get,
  set
};
