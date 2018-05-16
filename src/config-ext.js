// @flow
import type { Yargs, Config } from "./types";
const paths = require("./paths");
const editor = require("editor");
const curry = require("lodash/fp/curry");
const pipe = require("lodash/fp/pipe");

function buildEditCommand(config: Config, yargs: Yargs) {
  return yargs.command("edit", "Edit configuration", {}, handleEdit);
}

function handleEdit() {
  editor(paths.configFile, 1, 1);
}

function buildGetCommand(config: Config, yargs: Yargs) {
  return yargs.command(
    "get <key>",
    "Get value for key",
    {},
    curry(handleGetCommand)(config)
  );
}

function handleGetCommand(config: Config, { key }) {
  const value = config.get(key);

  if (typeof value === "undefined") {
    console.log("No configuration with given key.");
  } else if (typeof value === "string") {
    console.log(value);
  } else {
    console.log(JSON.stringify(value, null, 2));
  }
}

function buildSetCommand(config: Config, yargs: Yargs) {
  return yargs.command(
    "set <key> <value>",
    "Set value for key",
    {},
    curry(handleSetCommand)(config)
  );
}

function handleSetCommand(config: Config, { key, value }) {
  config.set(key, value);
}

const BUILDERS = [buildEditCommand, buildGetCommand, buildSetCommand];

function buildRecommend(yargs: Yargs) {
  return yargs.recommendCommands();
}

function buildCommand(yargs: Yargs, config: Config) {
  const builder = pipe(
    buildRecommend,
    curry(buildGetCommand)(config),
    curry(buildSetCommand)(config),
    curry(buildEditCommand)(config)
  );

  return yargs.command(
    ["config <command>", "cfg"],
    "Manage configuration",
    builder
  );
}

module.exports = {
  buildCommand
};
