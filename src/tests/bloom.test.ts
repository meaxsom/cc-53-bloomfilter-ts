import  Bloom from "../bloom";

let kTestSize = 34578;
let kTestFPProbability = 0.39;
let kBitArraySize = 215601;
let kHashCount = 4;
let kAddedHashWord = "A"
let kMissingHashWord = "AB"
let kTestFile = 'src/resources/dict.txt'
let kTestOutputFile = 'src/resources/test-words.bf'

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

  test('test initialization by file', () => {
    let theBloom=new Bloom(kTestFile, kTestFPProbability);
    expect(theBloom.isSet(kAddedHashWord)).toBe(true);
    expect(theBloom.isSet(kMissingHashWord)).toBe(false);
  });

  test ('test writing bloom data to file', () => {
    let theBloom=new Bloom(kTestFile, kTestFPProbability);
    expect(theBloom.writeFilter(kTestOutputFile)).toBe(true);
  });

