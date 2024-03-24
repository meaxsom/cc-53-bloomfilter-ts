export default class BufferBuilder {
    private static kNumberSize = 4;

    private m_buffers: Buffer[] = [];

    constructor() {
    }

    public add(inValue: string) : BufferBuilder {
        this.m_buffers.push(Buffer.from(inValue));
        return this;
    }

    public addAsFloat(inValue: number) : BufferBuilder{
        let theBuffer = Buffer.alloc(BufferBuilder.kNumberSize);
        theBuffer.writeFloatBE(inValue);
        this.m_buffers.push(theBuffer);
        return this;
    }

    public addAsInt(inValue: number) : BufferBuilder{
        let theBuffer = Buffer.alloc(BufferBuilder.kNumberSize);
        theBuffer.writeInt32BE(inValue);
        this.m_buffers.push(theBuffer);
        return this;
    }

    public addAsInts(inValues: number[]) : BufferBuilder {
        for (var i=0; i<inValues.length; i++)
            this.addAsInt(inValues[i]);

        return this;
    }

    public build() : Buffer {
        return Buffer.concat(this.m_buffers);
    }
}