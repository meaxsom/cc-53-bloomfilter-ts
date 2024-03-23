import { Command } from 'commander';
import * as log4js from "log4js";

import Bloom  from './bloom';

const kDefaultProbabilty    = 0.05;

log4js.configure({
    appenders: { fileAppender: { type: "file", filename: "logs/bloom-filter.log" } },
    categories: { default: { appenders: ["fileAppender"], level: "debug" } },
  });

const theCmdLine = new Command()
    .option('-b, --build <string>', 'a file path to a dicionary file')
    .option('-p, --prob <number>', 'the bloom percent probability number as a decimal. Default is ' + kDefaultProbabilty, String(kDefaultProbabilty));


theCmdLine.parse(process.argv);
let theProbability = Number(theCmdLine.getOptionValue('prob'))

var theBloomFilter : Bloom;
if (theCmdLine.getOptionValue('build')) {
    theBloomFilter = new Bloom(theCmdLine.getOptionValue('build'), theProbability);
}