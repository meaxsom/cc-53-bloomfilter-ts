import fs from 'fs';

import * as log4js from "log4js";

import { BitArray } from "typescript-algorithms-and-datastructures";

import BufferBuilder from './bufferBuilder';

// a class for a bloom filter
export default class Bloom {
    private static kLogger = log4js.getLogger();
    private static kDefaultSize = 100;

    private static kFileHeader = 'CCBF';
    private static kFileVersion = 1;

    private m_count : number = 0;
    private m_FPProbability : number = 0.0
    private m_size: number = 0;
    private m_hashCount: number = 0;

    // see: https://blake-wood-bst.medium.com/typescript-definite-assignment-operator-2ae02506c783
    private m_bitArray!: BitArray;
    private m_hasher: any = require('murmurhash')

    // inItem: either a number or string.
    //      if number, it's the count,
    //      if it's a string, it's the path to a file
    // inFPProbability:  False Positive probability as a floating point number, e.g 0.05
    constructor(inItem: number, inFPProbability: number);
    constructor(inItem: string, inFPProbability: number);
    constructor(inItem: any, inFPProbability: number) {
        if (typeof inItem == 'number')
            this.intialize(Number(inItem), inFPProbability);
        else if (typeof inItem == 'string') {
            this.initializeByFile(String(inItem), inFPProbability);
        } else
            this.intialize(Bloom.kDefaultSize, inFPProbability);

    }

    private intialize(inCount: number, inFPProbability: number) {
        this.m_count = inCount;
        // fix this at 2 decimal points
        this.m_FPProbability=Number(inFPProbability.toFixed(2)); 
        this.m_size=this.getSize()
        this.m_hashCount = this.getHashCount();
        
        // create the bitarray and set all values to zero
        this.m_bitArray = new BitArray(this.m_size).reset()
    }

    private initializeByFile(inFile: string, inFPProbability: number) {
        // read in the entire file and split it
        const readFileLines = (inFilename: string): string[] => {
            var result : string[] = [];
            try {
                const theFileData = fs.readFileSync(inFilename, 'utf8');
                result = theFileData.split('\n');
            } catch(theErr) {
                Bloom.kLogger.error(theErr);
            }

            return result;
        };

        let theLines = readFileLines(inFile);
        this.intialize(theLines.length, inFPProbability);

        // add each item from the file into the filter
        theLines.forEach( (theLine ) => {
            this.add(theLine);
        });
    }

    // convenience method to get at testable getSize algorithm
    private getSize(): number {
        return Bloom.getSize(this.m_count, this.m_FPProbability);
    }

    /*
    Returns the size of bit array to used using the following:
        m = -(inCount * lg(inFPProbability)) / (lg(2)^2) 
    See: https://en.wikipedia.org/wiki/Bloom_filter
    */
    public static getSize(inCount: number, inFPProbability: number): number {
        let result = -(inCount * Math.log(inFPProbability))/(Math.log(2) ** 2)
        return Math.trunc(result); // it's BS that TypeScript doesn't support int vs float!!
    }

    // convenience method to get at testable getSize algorithm
    private getHashCount(): number {
        return Bloom.getHashCount(this.m_size, this.m_count)
    }

    /*
    Return the hash function(k) to be used using the following:
        k = (inBitArraySize/inItemCount) * lg(2)   
    */
    public static getHashCount(inBitArraySize: number, inItemCount: number): number {
        let result = (inBitArraySize/inItemCount) * Math.log(2);
        return Math.trunc(result);
    }

    // generate the bit index for the number and the seed
    private getBitIndex(inValue: string, inSeed: number): number {
        return this.m_hasher.v3(inValue, inSeed) % this.m_size;
    }

    // set the right bits for this to be included
    public add(inValue: string) {
        for (var i = 0; i<this.m_hashCount; i++) {
            let theIndex=this.getBitIndex(inValue, i);
            this.m_bitArray.set(theIndex, true);
        }
    }

    public isSet(inValue: string) : boolean {
        var result = true;

        // all the bits have to be set for it to be in
        for (var i = 0; i<this.m_hashCount; i++) {
            let theIndex = this.getBitIndex(inValue, i);
            if (!this.m_bitArray.get(theIndex)) {
                result=false;
                break;
            }
        }
        return result;
    }

    public writeFilter(inOutFileName: string) : boolean {
        var result : boolean = false;

        try {
            // this is an array of numbers (UInt32) where each element is the bit position that is set
            let theIndexes = this.m_bitArray.getIndexes();

            let theBuilder = new BufferBuilder();
            let theBufferData = theBuilder.add(Bloom.kFileHeader)
                .addAsUInt(Bloom.kFileVersion)
                .addAsUInt(this.m_count)
                .addAsFloat(this.m_FPProbability)
                .addAsUInt(this.m_hashCount)
                .addAsUInt(this.m_size)
                .addAsUInt(theIndexes.length)
                .addAsUInts(theIndexes)
                .build();

            fs.writeFileSync(inOutFileName, theBufferData);
            
            result=true;
            
        } catch (theErr) {
            Bloom.kLogger.error(theErr);
        }

        return result;
    }

    // read the bloom filte file and repopulate the bitarray
    // return the filled out bloom object
    public static readFilter(inFileName: string) : Bloom {
        var result! : Bloom;

        try {
            const theBuffer = fs.readFileSync(inFileName);


            // should be our header string
            let theSignature = theBuffer.toString('utf-8', 0, 4);
            let theVersion = theBuffer.readUInt32BE(4);

            // make sure this is our type of file
            if (Bloom.kFileHeader == theSignature && Bloom.kFileVersion == theVersion) {
                let theCount = theBuffer.readUInt32BE(8);

                // fix at 2 decimal.. hopefully we won't have lost much
                let thePercent = Number(theBuffer.readFloatBE(12).toFixed(2));

                result = new Bloom(theCount, thePercent);

                let theHashCount = theBuffer.readUInt32BE(16);
                let theSize = theBuffer.readUInt32BE(20);
                let theSetBitsCount = theBuffer.readUInt32BE(24);

                // determine if the filter has been reconstituted correctly...
                if (result.m_size == theSize && result.m_hashCount == theHashCount) {
                    // theSetBitsCount is the number of bits that are set in the bit array
                    // the subsequent values in the buffer are UInt32 numbers representing the bit positions that were set in the filter
                    let theByteCount = theSetBitsCount * 4;
                    for (var i=28; i < theByteCount; i+=4) {
                        let theSetBitNumber = theBuffer.readUInt32BE(i);
                        result.m_bitArray.set(theSetBitNumber, true);
                    }
                }
            }
        } catch(theErr) {
            this.kLogger.error(theErr);
        }
        return result;
    }
}