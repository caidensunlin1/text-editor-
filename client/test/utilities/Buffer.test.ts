
import { expect,describe, beforeEach, test}  from '@jest/globals';
import { Buffer } from "../../src/utilities/Buffer";
import { NegativeIndexException } from '../../src/exceptions/utilities/Rope/NegativeIndexException';

let buffer: Buffer;

beforeEach(()=> {
    buffer =new Buffer();
})

describe("testing buffer", () => {
    test("test add" ,test_add),
    test("test remove", test_remove),
    test("test flush", test_flush)
}
);

function test_add(){
    console.log(buffer.size);
    buffer.add("taco");
    console.log(buffer.size)
    expect(buffer.size).toBe(4);
    buffer.add("bell");
    expect(buffer.size).toBe(8);
}

function test_remove(){
    expect(()=> buffer.remove(10)).toThrow(NegativeIndexException)
    buffer.add("tacobell");
    expect(buffer.size).toBe(8);
    buffer.remove(7)
    expect(buffer.size).toBe(1);
}

function test_flush(){
    const words: string = "This is some sentence";
    buffer.add(words);
    expect(buffer.flush()).toBe(words);
    expect(buffer.size).toBe(0);
}