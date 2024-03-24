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

    public addAsUInt(inValue: number) : BufferBuilder{
        let theBuffer = Buffer.alloc(BufferBuilder.kNumberSize);
        theBuffer.writeUInt32BE(inValue);
        this.m_buffers.push(theBuffer);
        return this;
    }

    public addAsUInts(inValues: number[]) : BufferBuilder {
        for (var i=0; i<inValues.length; i++)
            this.addAsUInt(inValues[i]);

        return this;
    }

    public build() : Buffer {
        return Buffer.concat(this.m_buffers);
    }
}