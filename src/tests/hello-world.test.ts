import  helloWorld  from "../hello-world";

test('expects Hello World', () => {
    expect(helloWorld()).toBe("Hello World!");
  });
