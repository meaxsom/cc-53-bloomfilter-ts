import { Command } from 'commander';
import * as log4js from "log4js";

import Bloom  from './bloom';

const kDefaultProbabilty    = 0.05;

// configure log4js
log4js.configure({
    appenders: { fileAppender: { type: "file", filename: "logs/bloom-filter.log" } },
    categories: { default: { appenders: ["fileAppender"], level: "debug" } },
  });

// set up the command line
const theCmdLine = new Command()
    .option('-b, --build [string]', 'a file path to a dicionary file')
    .option('-p, --prob [number]', 'the bloom percent probability number as a decimal. Used only wth "build"', String(kDefaultProbabilty))
    .arguments('<bloomfile> [args...]');

theCmdLine.parse(process.argv);

// process a build command or run the bloom filter on some supplied words
if (theCmdLine.getOptionValue('build')) {
    let theProbability = Number(theCmdLine.getOptionValue('prob'))
    let theBloomFilter = new Bloom(theCmdLine.getOptionValue('build'), theProbability);
    let theOutputFile = theCmdLine.args[0];
    if (theOutputFile)
        theBloomFilter.writeFilter(theOutputFile);
} else {
    let theArgs = theCmdLine.args;
    if (theArgs.length > 0) {
        let theBloomFilter = Bloom.readFilter(theArgs[0]);
        if (theBloomFilter) {
            console.log("These words are spelt wrong:");

            for (var i=1; i<theArgs.length; i++) {
                if (!theBloomFilter.isSet(theArgs[i]))
                    console.log("\t" + theArgs[i]);
            }
        }
    }
}
