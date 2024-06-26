# Coding Challenge 53: Bloom Filter

## Background

Challenge #53 is for a [Bloom Filter](https://codingchallenges.fyi/challenges/challenge-bloom/). 

### Stretch Challenge

Complete the challenge using [TypeScript](https://www.typescriptlang.org/) under [Node](https://nodejs.org/en) and use [Jest](https://jestjs.io/) for [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- I've poked around with TypeScript but not used if for anything serious. A chance to stretch myself a bit
- Node - like TypeScript I've fooled around with but nothing serious
- Jest will be new to me although TDD will not be.

- Things that I see as challenges in this tool chain adoption w/the project
    - File I/O, especially binary file formatting. My impressions is the "out of the box" file I/O in TypeScript is text oriented. I expect to find some difficulties there.
    - Hash functions: may have to write my own if they are not exposed in the underlying Javascript engine
    - Lerning Jest: totally new framework for TDD althoguth I'm used to JUnit and Python unit testing frameworks

## Toolchain
- VSCode
- a devcontainer in which to run node, TypeScript tools, jest, etc.


## Step 0
- set up development enviornment (lots of init'ing)
    - use VS code
    - node + typescript + jest + npm, etc in a dev container
    - init git
    - init node project `npm init` - `package.json` file
    - init typescript project - `tsconfig.json` file
        `npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true`
- for a logging framework I'm used to Log4J from Java so [log4js-node](https://github.com/log4js-node/log4js-node) seems like a good choice. Installed as part of the project (`npm install log4js`)
- for a command line processor I've become enamored with Python's `argparse` and [Commander.js](https://github.com/tj/commander.js) looks very similar - also installed locally (`npm install commander`)
- evidently jest w/typescript requires another install: `npm i -D ts-jest @types/jest`

- Last but not write a sample "hello-world" script to test out logging, command line processing and the build process
    - run tests with `nmp t`
    - build with `npm run build`

- Generated `dict.txt` file from my Mac using suggested command

## Step 1

> use test driven development (TDD) to develop the Bloom filter data structure

.. which means...

> Determine the number of items that are likely to be stored and the probability of false positives you system can tolerate then use that to determine the memory requirements and number of has functions needed

- [Python implmentation of a bloom filter](https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/) was helpful for understand the inputs required to detetermine the items needed

A `Bloom` object in TypeScript where we'll start for our TDD

- Had to work through the difference between `export` and `export default` and the syntax difference in importing syntax
- Ended up using [TypeScript-Algorithms-and-Data-Structures](https://github.com/sularome/TypeScript-Algorithms-and-Data-Structures) to hold the bitarray vs writing one myself
- And [murmurhash](https://github.com/perezd/node-murmurhash) for the hash algo, since it was recomended in a chat I had with [Phind](https://www.phind.com)

## Step 2

Bummer that Typescript doesn't allow an easy way to overload a constructor directly. Use the `any` approach and have 2 different initializations methods. This meant that my Bloom bit array couldn't be initialized until I read the file, which meant that typescript couldn't see the `BitArray` being initialized. Solved is using the [Definite Assignment Operator `!`](https://blake-wood-bst.medium.com/typescript-definite-assignment-operator-2ae02506c783)

I'll have to figure out how to handle opening the saved bloom file when I get to it

## Step 3

> save the Bloom filter to disk

Supposed to be a binary file of our own format. Needs:
    - some sort of header identifier
    - the number of hashs used
    - the size of the bit array
    - the count and possibly the percentage (although after initialization those are not really needed)

- Created a "BufferBuilder" class to take care of generating buffers and writing out the data. Used "builder" pattern.
    - the size of the output file is actually "larger" than the input file. By shrinking the probability factor the bloom file gets smaller.

## Step 4

> load the Bloom filter from disk. You’ll need to read the header - you should validate the file is of the type and version expected.

- had to understand how the BitArray `getIndexes()` worked. Returns an array of UIn32 numbers where each element in the array is a bit that is "on". So, when reading back in, needed to read each one and repopulate the BitArray bit-number by bit-number.
    - would be nice to have a serialize, unserialize to just pass in/out the internal datastructure as a `Buffer`

## Step 5

> test words provided on the command line to see if they’re probably spelt right

Did this as a part of step-4 branch since it was relatively minor

## Summary

- I understand Bloom Filters much better!
- TypeScript isn't bad
    - feels a lot like C/Java.. I had no problem with the "typing". It's one of the things I miss in most scripting languages
    - but I forgot to compile before running sometimes
    - Build and testing process can get a bit awkward, but it may be that I don't have the tool chain quite right yet
    - wish Gradle worked with npm .. may have to try [this](https://github.com/gradlets/gradle-typescript) next time
- The BitArray class I leveraged needs serialization support vs writing out all the bits that were set as UInt32s. I could have done something with that but that wasn't the point of the exercise.
- The logging system felt a lot like Log4J and would probably use again
- Continue to love the Commander command line processor. Feels like Python's implementation. Would be nice to have a Java version like that instead of using `GetArgs`. I'll have to look for one.
- Phind got me through a lof of implmentation questions regarding Typescript. Much better than hunting through StackOverflow/Blog posts.


## Resources
- [How to Setup a TypeScript + Node.js Project](https://khalilstemmler.com/blogs/typescript/node-starter-project/)
- [Build a Command Line Application with Node.js](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs)
- [How to Test TypeScript with Jest](https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d)
- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [log4js-node](https://www.npmjs.com/package/log4js)
- [Setting up Jest w/TypeScript](https://blog.logrocket.com/testing-typescript-apps-using-jest/)
- [Cannot use import statement outside a module](https://stackoverflow.com/questions/61781271/jest-wont-transform-the-module-syntaxerror-cannot-use-import-statement-outsi) - helped solve TypeScript with Jest problems


