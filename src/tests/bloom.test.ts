import  Bloom from "../bloom";

let kTestSize = 34578;
let kTestFPProbability = 0.05;
let kBitArraySize = 215601;
let kHashCount = 4;
let kAddedHashWord = "A"
let kMissingHashWord = "AB"

test('test getSize', () => {
    expect(Bloom.getSize(kTestSize, kTestFPProbability)).toBe(kBitArraySize);
  });

  test('test getHashCount', () => {
    expect(Bloom.getHashCount(kBitArraySize, kTestSize)).toBe(kHashCount);
  });

  test('test add and isSet', () => {
    let theBloom=new Bloom(kTestSize, kTestFPProbability);
    theBloom.add(kAddedHashWord);
    expect(theBloom.isSet(kAddedHashWord)).toBe(true);
    expect(theBloom.isSet(kMissingHashWord)).toBe(false);
  });


