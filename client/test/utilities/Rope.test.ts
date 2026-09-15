import { IndexNotInRopeException } from '../../src/exceptions/utilities/IndexNotInRopeException';
import {Rope} from '../../src/utilities/Rope';
import { expect, test, describe} from '@jest/globals';
import { areRopesEqual, makeUnbalancedTree, 
    makeUnbalancedTreeWithLargeStrings, populateBigRope } from './RopeTestHelper';
import { MAX_LENGTH, REBALANCE_COEFFICENT } from '../../src/utilities/Constants';
import { NegativeIndexException } from '../../src/exceptions/utilities/NegativeIndexException';
import { InvalidRageForRopeException } from '../../src/exceptions/utilities/InvalidRageForRopeException';



describe("Test Search", ()=> {
    test("search finds correct value",search_finds_correct_value),
    test("search finds right value", search_finds_right_value),
    test("test for index not in rope exception", 
        search_outOfBounds_Index_throws_IndeNotFoundException)
})

function search_finds_correct_value() {
    let smallRope:Rope = new Rope("start");
    expect(smallRope.left).toBe(null);
    expect(smallRope.right).toBe(null);
    expect(smallRope.substring).toBe("start")
    expect(smallRope.search(3)).toBe("r");
}

function search_finds_right_value(){
    let smallRope: Rope = new Rope("start");
    smallRope = smallRope.concatenate(new Rope("_hi"));

    expect(smallRope.left?.leftCount).toBe(5);
    expect(smallRope.right?.leftCount).toBe(3);

    expect(smallRope.left?.substring).toBe("start");
    expect(smallRope.right?.substring).toBe("_hi");
    expect(smallRope.search(6)).toBe("h");
}

function search_outOfBounds_Index_throws_IndeNotFoundException(){
    let smallRope: Rope = new Rope("start");
    expect(() => smallRope.search(100)).toThrow(IndexNotInRopeException);
}

describe("Test Join", ()=> {
    test("concatenate works",concatenate_works),
    test("concatenate balances rope correctly", concatenate_makes_balanced_trees),
    test("512 max threshold is met",concatenate_makes_leafs_equal_to_the_max_length)
})

function concatenate_works(){
    let bigRope: Rope = populateBigRope();
    // test that some of the parent nodes are correct
    expect(bigRope.leftCount).toBe(17);
    expect(bigRope.left?.leftCount).toBe(11);
    expect(bigRope.left?.right?.leftCount).toBe(4);
    expect(bigRope.right?.leftCount).toBe(6);

    let L1: Rope |null|undefined= bigRope.left?.left?.left;
    let L2: Rope |null|undefined= bigRope.left?.left?.right;
    let L3: Rope |null|undefined= bigRope.left?.right?.left;
    let L4: Rope |null|undefined =bigRope.left?.right?.right;
    let L5: Rope |null|undefined =bigRope.right?.left;
    let L6: Rope |null|undefined = bigRope.right?.right; 

    //test the leaf node values
    expect(L1?.leftCount).toBe(6); expect(L1?.substring).toBe("hello_");
    expect(L2?.leftCount).toBe(5); expect(L2?.substring).toBe("i_am_");
    expect(L3?.leftCount).toBe(4); expect(L3?.substring).toBe("a_ro");
    expect(L4?.leftCount).toBe(2); expect(L4?.substring).toBe("pe");
    expect(L5?.leftCount).toBe(6); expect(L5?.substring).toBe("_data_");
    expect(L6?.leftCount).toBe(9); expect(L6?.substring).toBe("structure");
}


function concatenate_makes_balanced_trees(){
    let unbalancedRope: Rope = makeUnbalancedTree();
    const message: string = "hello_world";
    expect(unbalancedRope.string).toBe(message);
    expect(unbalancedRope.leftCount).toBe(message.length);
}

function concatenate_makes_leafs_equal_to_the_max_length(){
    let unbalancedRope: Rope = makeUnbalancedTreeWithLargeStrings();
    const len: number = unbalancedRope.length;

    expect(unbalancedRope.leafTotal).toBe(4);
    expect(unbalancedRope.leftCount).toBe(1024);
    expect(len).toBe(MAX_LENGTH*3 + 146 + Math.ceil(REBALANCE_COEFFICENT * Math.log2(len))-3);

    let L1: Rope |null|undefined= unbalancedRope.left?.left;
    let L2: Rope |null|undefined= unbalancedRope.left?.right;
    let L3: Rope |null|undefined= unbalancedRope.right?.left;
    let L4: Rope |null|undefined= unbalancedRope.right?.right;
    
    expect(L1?.leftCount).toBe(MAX_LENGTH);
    expect(L2?.leftCount).toBe(MAX_LENGTH);
    expect(L3?.leftCount).toBe(MAX_LENGTH);
    expect(L4?.leftCount).toBe(len%MAX_LENGTH);

}

describe("Test Report", ()=> {
    test("Report gets the entire string",report_all),
    test("Report gets substring inbetween string",report_inbetween),
    test("Report gets a substring in the same leaf", same_leaf_with_report),
    test("Report gets a substring where i is not start of rope", 
        starting_index_inbetween_leaf_from_report),
    test("Report throws error when index is out of bounds", report_IndexNotInRopeException)
})

function report_all(){
    let bigRope: Rope= populateBigRope();
    expect(bigRope.string).toBe("hello_i_am_a_rope_data_structure");
}

function report_inbetween(){
    let bigRope: Rope= populateBigRope();
    expect(bigRope.report(11,22)).toBe("a_rope_data_");
}

function same_leaf_with_report(){
    let bigRope: Rope= populateBigRope();
    expect(bigRope.report(11,14)).toBe("a_ro");
}

function starting_index_inbetween_leaf_from_report(){
    let bigRope: Rope= populateBigRope();
    expect(bigRope.report(13,16)).toBe("rope");
    expect(bigRope.report(18,32)).toBe("data_structure");
}

function report_IndexNotInRopeException(){
    let bigRope: Rope= populateBigRope();
    expect(()=> bigRope.report(100,1000)).toThrow(IndexNotInRopeException);
}

describe("Test leafTotal", ()=> {
    test("leafTotal is correct",leaf_count_is_correct)
});

function leaf_count_is_correct(){
    let unbalancedRope: Rope = makeUnbalancedTree();
    expect(unbalancedRope.leafTotal).toBe(1);
    let bigRope: Rope = populateBigRope();
    expect(bigRope.leafTotal).toBe(6);
}

describe("Test Splitting", () => {
    test("Split at last charcter", split_at_the_last_charcter_of_leaf),
    test("Split inbetween charcter of leaf", split_inbetween_charcter_of_leaf),
    test("Split does not change the original object", split_keeps_rope_the_same),
    test("Split the rope on single node",split_rope_on_single_node)
});

function split_at_the_last_charcter_of_leaf(){
    let bigRope: Rope =populateBigRope();
    const subString: String = "hello_i_am_";

    // splits it contain the substring
    const ropeSplit: [Rope | null, Rope | null] = 
    bigRope.split(Math.floor(subString.length-1)); 

    let r1: Rope = ropeSplit[0]!;
    let r2: Rope = ropeSplit[1]!;
    

    //We should have r1 be : 
    //              (11)
    //             /
    //           (6)   
    //          /     \
    //    6|hello_  5|i_am_
    //
    expect(r1.leftCount).toBe(11);
    expect(r1.left?.leftCount).toBe(6);
    expect(r1.left?.left?.substring).toBe("hello_");
    expect(r1.left?.right?.substring).toBe("i_am_");

    //Likewise, r2: 
    //                            (6)
    //                      /            \
    //                    (4)              (6)
    //                 /       \        /      \ 
    //            4|a_ro       2|pe   6|_data_   9|structure
    //
    expect(r2.leftCount).toBe(6);
    expect(r2.left?.leftCount).toBe(4);
    expect(r2.left?.left?.substring).toBe("a_ro");
    expect(r2.left?.right?.substring).toBe("pe");
    expect(r2.right?.leftCount).toBe(6);
    expect(r2.right?.left?.substring).toBe("_data_");
    expect(r2.right?.right?.substring).toBe("structure");

    // case that includes the whole string. 
    const ropeSplit2: [Rope | null, Rope | null] = 
    bigRope.split(bigRope.length-1); 

    let r3: Rope = ropeSplit2[0]!;
    let r4: Rope = ropeSplit2[1]!;
    expect(r3.length).toBe(bigRope.length);
    expect(r4).toBe(null);
}


function split_inbetween_charcter_of_leaf(){
    let largeRope: Rope = makeUnbalancedTreeWithLargeStrings();

    const ropeSplit: [Rope | null, Rope | null] =  
    largeRope.split(Math.floor(largeRope.length*(3/4))); 

    let r1: Rope = ropeSplit[0]!;
    let r2: Rope = ropeSplit[1]!; 
    

    expect(r1.leftCount).toBe(1024);
    expect(r1.depth).toBe(2);
    expect(r1.left?.leftCount).toBe(512);
    expect(r1.left?.depth).toBe(1);
    expect(r1.left?.left?.leftCount).toBe(512);
    expect(r1.left?.right?.leftCount).toBe(512);
    expect(r1.right?.leftCount).toBe(252);

    expect(r2.leftCount).toBe(260);
    expect(r2.depth).toBe(1);
    expect(r2.left?.leftCount).toBe(260);
    expect(r2.right?.leftCount).toBe(165);


    let bigRope:Rope = populateBigRope();

    const ropeSplit2: [Rope | null, Rope | null] =  
    bigRope.split(Math.floor(bigRope.length*(3/7))); 

    let r3: Rope = ropeSplit2[0]!;
    let r4: Rope = ropeSplit2[1]!;

    expect(r3.leftCount).toBe(14);
    expect(r3.depth).toBe(3);
    expect(r3.left?.leftCount).toBe(11);
    expect(r3.left?.left?.leftCount).toBe(6);
    expect(r3.left?.left?.left?.leftCount).toBe(6);
    expect(r3.left?.left?.right?.leftCount).toBe(5);
    expect(r3.left?.right?.leftCount).toBe(3);

    expect(r4.leftCount).toBe(3);
    expect(r4.depth).toBe(2);
    expect(r4.left?.leftCount).toBe(1);
    expect(r4.left?.left?.leftCount).toBe(1);
    expect(r4.left?.right?.leftCount).toBe(2);
    expect(r4.right?.leftCount).toBe(6);
    expect(r4.right?.left?.leftCount).toBe(6);
    expect(r4.right?.right?.leftCount).toBe(9);
}


function split_keeps_rope_the_same(){
    // Test splits around bigRope
    let bigRope: Rope =populateBigRope();

    let bigRopeCopy: Rope = bigRope.copy();
    bigRope.split(Math.floor(bigRope.length/2));

    expect(areRopesEqual(bigRope,bigRopeCopy)).toBe(true);

    bigRope.split(Math.floor(bigRope.length/4));
    expect(areRopesEqual(bigRope,bigRopeCopy)).toBe(true);

    bigRope.split(0);
    expect(areRopesEqual(bigRope,bigRopeCopy)).toBe(true);

    bigRope.split(bigRope.length-1);
    expect(areRopesEqual(bigRope,bigRopeCopy)).toBe(true);

    let unbalancedRope: Rope = makeUnbalancedTreeWithLargeStrings();
    let unbalancedRopeCopy: Rope = unbalancedRope.copy();
    unbalancedRope.split(Math.floor(unbalancedRope.length/2));

    expect(areRopesEqual(unbalancedRope,unbalancedRopeCopy)).toBe(true);

    unbalancedRope.split(Math.floor(unbalancedRope.length/4));
    expect(areRopesEqual(unbalancedRope,unbalancedRopeCopy)).toBe(true);
}

function split_rope_on_single_node(){
    let unbalancedRope: Rope = makeUnbalancedTree();
    const HALF: number = Math.floor(unbalancedRope.length/2);

    const ropeSplit: [Rope | null, Rope | null] =  
    unbalancedRope.split(HALF);

    let r1: Rope = ropeSplit[0]!;
    let r2: Rope = ropeSplit[1]!; 
    
    expect(r1.leftCount).toBe(HALF+1);
    expect(r2.leftCount).toBe(HALF);
}


describe("Testing insertion", ()=> {
    test("Inserting in the middle", insertion_in_middle),
    test("inserting in the end", insertion_in_end),
    test("insertion when unbalanced", insertion_when_unbalanced),
    test("inserting inbetween a substring", insertion_inbetween_substring),
    test("inserting for a single rope", insertion_between_single_rope)
});

function insertion_in_middle(){
    let bigRope: Rope = populateBigRope();

    const DEPTH: number = bigRope.depth;
    const LEFT_Count: number = bigRope.leftCount;
    const LENGTH: number = bigRope.length;

    const NEW_STRING: string = "_(which is a tree)_";
    const I: number = bigRope.left!.length-1; 
    bigRope =bigRope.insert(I,NEW_STRING);

    // expect that the contents do not change. 
    let L1: Rope |null|undefined= bigRope.left?.left?.left;
    let L2: Rope |null|undefined= bigRope.left?.left?.right;
    let L3: Rope |null|undefined= bigRope.left?.right?.left;
    let L5: Rope |null|undefined =bigRope.right?.left;
    let L6: Rope |null|undefined = bigRope.right?.right; 

    expect(L1?.leftCount).toBe(6); expect(L1?.substring).toBe("hello_");
    expect(L2?.leftCount).toBe(5); expect(L2?.substring).toBe("i_am_");
    expect(L3?.leftCount).toBe(4); expect(L3?.substring).toBe("a_ro");
    expect(L5?.leftCount).toBe(6); expect(L5?.substring).toBe("_data_");
    expect(L6?.leftCount).toBe(9); expect(L6?.substring).toBe("structure");

    // // test the contents that should change. 
    expect(bigRope.depth).toBe(DEPTH+1);
    expect(bigRope.leftCount).toBe(LEFT_Count+NEW_STRING.length);
    expect(bigRope.length).toBe(LENGTH+NEW_STRING.length);

    expect(bigRope.left?.right?.right?.leftCount).toBe(2);
    expect(bigRope.left?.right?.right?.left?.leftCount).toBe(2);
    expect(bigRope.left?.right?.right?.right?.substring).toBe(NEW_STRING);
}

/**
 *Test the case where it just concatiantes at the end of the string. 
 */
function insertion_in_end(){
    let bigRope: Rope = populateBigRope();
    const LENGTH: number = bigRope.length; 
    const New_String: string = ",and_I_think_that_is_cool.";
    const DEPTH: number = bigRope.depth;
    const LEFT_Count = bigRope.leftCount;

    bigRope = bigRope.insert(bigRope.length-1, New_String);

    // Test that the contents of the rope are unchanged except for the end. 
    let L1: Rope |null|undefined= bigRope.left?.left?.left;
    let L2: Rope |null|undefined= bigRope.left?.left?.right;
    let L3: Rope |null|undefined= bigRope.left?.right?.left;
    let L4: Rope |null|undefined =bigRope.left?.right?.right;
    let L5: Rope |null|undefined =bigRope.right?.left; 

    expect(L1?.leftCount).toBe(6); expect(L1?.substring).toBe("hello_");
    expect(L2?.leftCount).toBe(5); expect(L2?.substring).toBe("i_am_");
    expect(L3?.leftCount).toBe(4); expect(L3?.substring).toBe("a_ro");
    expect(L4?.leftCount).toBe(2); expect(L4?.substring).toBe("pe");
    expect(L5?.leftCount).toBe(6); expect(L5?.substring).toBe("_data_");

    // //Test the changed part of the rope 
    expect(bigRope.right?.right?.right?.substring).toBe(New_String);
    expect(bigRope.length).toBe(LENGTH+New_String.length);
    expect(bigRope.depth).toBe(DEPTH);
    expect(bigRope.leftCount).toBe(LEFT_Count);
}

function insertion_when_unbalanced(){
    let bigRope: Rope = populateBigRope();
    let n:number = bigRope.length;
    // bigRope.printAll()
    
    for(let i =0; i < Math.floor(REBALANCE_COEFFICENT*Math.log2(n)-1);i++)
        bigRope = bigRope.insert(n+i-1,"a");
    
   
    expect(bigRope.leftCount).toBe(n+Math.floor(REBALANCE_COEFFICENT*Math.log2(n)-1));
    expect(bigRope.left).toBe(null);
    expect(bigRope.right).toBe(null);
}

function insertion_inbetween_substring(){
    let largeStringRope: Rope = makeUnbalancedTreeWithLargeStrings();
    let middle:string = "Yo_Querio_TacoBell";
    const DEPTH: number = largeStringRope.depth;
    const LENGTH: number = largeStringRope.length;
    const LEFT_Count: number = largeStringRope.leftCount;
    largeStringRope = largeStringRope.insert(255,middle);

    expect(largeStringRope.depth).toBe(DEPTH+2);
    expect(largeStringRope.leftCount).toBe(LEFT_Count+middle.length);
    expect(largeStringRope.length).toBe(LENGTH+middle.length);
    expect(largeStringRope.left?.depth).toBe(DEPTH+1);

    expect(largeStringRope.left?.left?.left?.left?.leftCount).toBe(256);
    expect(largeStringRope.left?.left?.left?.right?.substring).toBe(middle);
    expect(largeStringRope.left?.left?.right?.leftCount).toBe(256);
}

function insertion_between_single_rope(){
    const left: string = "Single";
    const middle: string = "_Ahhh";
    const right: string  = "_Rope";

    let single: Rope = new Rope(left+right);
    single = single.insert(left.length-1,middle);

    expect(single.leftCount).toBe(left.length+middle.length);
    expect(single.left?.left?.substring).toBe(left);
    expect(single.left?.right?.substring).toBe(middle);
    expect(single.right?.substring).toBe(right);
}


describe("Testing delete",()=> {
    test("delete throws exception",delete_throws_exception),
    test("delete gives correct string",delete_gives_correct_string),
    test("delete when rope is single",delete_when_rope_is_single),
    test("delete whe start and end is the same",delete_when_start_and_end_is_the_same)
});

function delete_throws_exception(){
    let bigRope: Rope = populateBigRope();
    expect(() => bigRope.delete(-5,10)).toThrow(NegativeIndexException);
    expect(() => bigRope.delete(5,-10)).toThrow(NegativeIndexException);
    expect(() => bigRope.delete(20,5)).toThrow(InvalidRageForRopeException);
    expect(() => bigRope.delete(500,1000)).toThrow(IndexNotInRopeException);
    expect(() => bigRope.delete(10,1000)).toThrow(IndexNotInRopeException);
}

function delete_gives_correct_string(){
    let bigRope: Rope = populateBigRope();
    let expectedStr: string = "hello_data_structure"; 
    bigRope = bigRope.delete(6,17);

    expect(bigRope.string).toBe(expectedStr);
    expect(bigRope.leftCount).toBe(6);
    expect(bigRope.left?.leftCount).toBe(6)
    expect(bigRope.left?.left?.substring).toBe("hello_");
    expect(bigRope.right?.leftCount).toBe(5);
    expect(bigRope.right?.left?.substring).toBe("data_");
    expect(bigRope.right?.right?.substring).toBe("structure");


    bigRope = populateBigRope();
    expectedStr = "data_structure";
    bigRope = bigRope.delete(0,17);
    
    expect(bigRope.string).toBe(expectedStr);
    expect(bigRope.leftCount).toBe(5);
    expect(bigRope.left?.substring).toBe("data_");
    expect(bigRope.right?.substring).toBe("structure");


    bigRope= populateBigRope();
    expectedStr = "hello";
    bigRope = bigRope.delete(5,31);

    expect(bigRope.string).toBe(expectedStr);
    expect(bigRope.leftCount).toBe(5);
    expect(bigRope.left?.substring).toBe("hello");
}

function delete_when_start_and_end_is_the_same(){
    // case in which the substring has its first char removed.
    let bigRope: Rope = populateBigRope(); 
    let n: number = bigRope.length;
    bigRope = bigRope.delete(11,11);
    expect(bigRope.length).toBe(n-1);
    expect(bigRope.string).toBe("hello_i_am__rope_data_structure");

    //case in which there is one char in the substring. 
    let cat: string = "_cat_in_the_hat";
    let rope: Rope = new Rope("a").concatenate(new Rope(cat));
    rope = rope.delete(0,0);

    expect(rope.leftCount).toBe(0);
    expect(rope.left?.substring).toBe(null);
    expect(rope.length).toBe(cat.length);
    expect(rope.string).toBe(cat);
    expect(rope.search(0)).toBe("_"); // doesn't affect search ability. 
    expect(rope.search(1)).toBe("c");

    //case in which i is the last char of the substring. 
    rope = rope.delete(rope.length-1,rope.length-1);
    expect(rope.length).toBe(cat.length-1);
    expect(rope.right?.substring).toBe("_cat_in_the_ha");
    expect(rope.right?.leftCount).toBe(cat.length-1);

    // case in which the center value is deleted. 
    bigRope = populateBigRope();
    bigRope = bigRope.delete(21,21);
    expect(bigRope.length).toBe(n-1);
    expect(bigRope.right?.leftCount).toBe(5);
    expect(bigRope.right?.left?.substring).toBe("_dat_");
}

function delete_when_rope_is_single(){
    let str: string = "here_are_some_words";
    let single: Rope = new Rope(str);
    single =single.delete(5,10);
    let n: number = str.slice(0,5).length + str.slice(11,str.length).length;
    expect(single.length).toBe(n);
    single = single.delete(3,3);
    expect(single.length).toBe(n-1);
}
