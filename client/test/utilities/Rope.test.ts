import { IndexNotInRopeException } from '../../src/exceptions/utilities/IndexNotInRopeException';
import {Rope} from '../../src/utilities/Rope';
import { expect, test, describe} from '@jest/globals';
import { makeUnbalancedTree, makeUnbalancedTreeWithLargeStrings, populateBigRope } from './RopeTestHelper';
import { MAX_LENGTH, REBALANCE_COEFFICENT } from '../../src/utilities/constants';

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