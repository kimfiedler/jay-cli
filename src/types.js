// @flow
const yargs = require("yargs");

export type Yargs = typeof yargs;
export type Config = {
  get: (key: string) => any,
  set: (key: string, value: any) => void
};

export type Extension = {
  buildCommand(yargs: Yargs, config: Config): Yargs
};
