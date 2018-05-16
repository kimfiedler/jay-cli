// @flow
import type { Yargs, Config } from "./types";
const pipe = require("lodash/fp/pipe");
const curry = require("lodash/fp/curry");
const paths = require("./paths");
const { installAndRequire, listInstalled } = require("install-and-require");

function getExtensions(config): Array<string> {
  return config.get("extensions");
}

function setExtensions(config, extensions) {
  config.set("extensions", extensions);
}

function buildInstallCommand(config: Config, yargs: Yargs) {
  return yargs.command(
    ["install <extension>", "i"],
    "Install an extension",
    {},
    curry(handleInstall)(config)
  );
}

function handleInstall(config, { extension }) {
  const extensions = getExtensions(config);
  if (extensions.indexOf(extension) !== -1) {
    console.log("Extension is already installed.");
    process.exit(1);
  }

  const newExtensions = [...extensions, extension];
  setExtensions(config, newExtensions);
  installAndRequire(newExtensions, paths.extensionsDir, true);
}

function buildRemoveCommand(config: Config, yargs: Yargs) {
  return yargs.command(
    ["remove <extension>", "rm"],
    "Remove an extension",
    {},
    curry(handleRemove)(config)
  );
}

function handleRemove(config, { extension }) {
  const extensions = getExtensions(config);
  const newExtensions = extensions.filter(value => value !== extension);
  if (extensions.length === newExtensions.length) {
    console.log("Extension is not installed.");
    process.exit(1);
  }

  setExtensions(config, newExtensions);
  installAndRequire(newExtensions, paths.extensionsDir, true);
}

function buildListCommand(config: Config, yargs: Yargs) {
  return yargs.command(
    ["list", "ls"],
    "List installed extensions",
    {},
    curry(handleList)(config)
  );
}

function printInstallExtension(extension) {
  if (extension.installed) {
    console.log(`${extension.name}@${extension.version} - ${extension.path}`);
  } else {
    console.log(`${extension.name} - not installed.`);
  }
}

function handleList(config) {
  const extensions = getExtensions(config);

  const installed = listInstalled(extensions, paths.extensionsDir);
  installed.forEach(printInstallExtension);
}

function buildRecommend(yargs: Yargs) {
  return yargs.recommendCommands();
}

function buildCommand(yargs: Yargs, config: Config) {
  const builder = pipe(
    buildRecommend,
    curry(buildInstallCommand)(config),
    curry(buildRemoveCommand)(config),
    curry(buildListCommand)(config)
  );
  return yargs.command(
    ["extensions <command>", "ext"],
    "Manage extensions",
    builder
  );
}

module.exports = {
  buildCommand
};
