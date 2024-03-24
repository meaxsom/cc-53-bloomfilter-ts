import BufferBuilder from "../bufferBuilder";

const kTestString = 'CCDM';
const kTestIntNumber = 83257;
const kTestFloatNumber = 0.05;

test('test add(string)', () => {
    let theBuffer = new BufferBuilder().add(kTestString).build()
    expect(theBuffer.toString()).toBe(kTestString);
  });

  test('test addAsInt(number)', () => {
    let theBuffer = new BufferBuilder().addAsInt(kTestIntNumber).build()
    expect(theBuffer.readInt32BE()).toBe(kTestIntNumber);
  });

  test('test addAsFloat(number)', () => {
    let theBuffer = new BufferBuilder().addAsFloat(kTestFloatNumber).build()
    
    // the floating point is never exactly the same, so we'll read it back in and fix the decimal
    // just to make sure we're getting a good aproximation
    expect(Number(theBuffer.readFloatBE().toFixed(2))).toBe(kTestFloatNumber);
  });


