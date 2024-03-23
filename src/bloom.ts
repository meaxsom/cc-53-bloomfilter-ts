import { BitArray } from "typescript-algorithms-and-datastructures";

// a class for a bloom filter
export default class Bloom {

    private m_count : number = 0;
    private m_FPProbability : number = 0.0
    private m_size: number = 0;
    private m_hashCount: number = 0;
    private m_bitArray: BitArray;
    private m_hasher: any = require('murmurhash')

    // inCount: the number of object to be insterted into the filter as an whole number, e.g. 240351
    // inFPProbability:  False Positive probability as a floating point number, e.g 0.05
    constructor(inCount: number, inFPProbability: number){
        this.m_count=inCount;
        this.m_FPProbability=inFPProbability;
        this.m_size=this.getSize()
        this.m_hashCount = this.getHashCount();
        
        
        // create the bitarray and set all values to zero
        this.m_bitArray = new BitArray(this.m_size).reset()
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
    static getSize(inCount: number, inFPProbability: number): number {
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
    static getHashCount(inBitArraySize: number, inItemCount: number): number {
        let result = (inBitArraySize/inItemCount) * Math.log(2);
        return Math.trunc(result);
    }

    // generate the bit index for the number and the seed
    private getBitIndex(inValue: string, inSeed: number): number {
        return this.m_hasher.v3(inValue, inSeed) % this.m_size;
    }

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
}