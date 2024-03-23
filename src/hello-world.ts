import { Command } from 'commander';
import * as log4js from "log4js";

const cmdLine = new Command();

export default function helloWorld(inMessage = "Hello World!") {
    return inMessage;
}

log4js.configure({
    appenders: { hello: { type: "file", filename: "logs/hello-world.log" } },
    categories: { default: { appenders: ["hello"], level: "debug" } },
  });

  const logger = log4js.getLogger();

cmdLine
    .option('-f, --flag', 'a flag option')
    .option('-v, --value <char>', 'an option with a value');

cmdLine.parse(process.argv);
if (cmdLine.getOptionValue('flag')) {
    logger.debug("flag was on the command line");
    console.log("a flag was set");
}

let theMessage : string = cmdLine.getOptionValue('value');
logger.debug("command line message was: " + theMessage);

console.log(helloWorld(theMessage));
