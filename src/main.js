#!/usr/bin/env node

// @flow

const argv = require("yargs");
const parseArgs = require("minimist");
const minimist = require("minimist");
const config = require("./config");
const { installAndRequire } = require("install-and-require");
import type { Extension } from "./types";
const paths = require("./paths");

function buildCommands(extensions) {
  argv
    .recommendCommands()
    .demandCommand(1, "What do you want to do?")
    .option("force-install", {
      desc: "Force (re)installation of extensions"
    });

  initializeExtensions(extensions);
}

function getExtensions(forceInstall) {
  const configExtension = require("./config-ext");
  const extensionsExtension = require("./extensions-ext");
  const extensions: Array<Function> = installAndRequire(
    config.get("extensions"),
    paths.extensionsDir,
    forceInstall
  );

  return [configExtension, extensionsExtension, ...extensions];
}

function initializeExtensions(extensions: Array<Extension>) {
  extensions.map(extension => extension.buildCommand(argv, config));
}

function main() {
  // check for force-install option with minimist to keep yargs happy.
  const forceInstall = parseArgs(process.argv)["force-install"] === true;
  const extensions = getExtensions(forceInstall);

  buildCommands(extensions);

  argv.argv;
}

main();
