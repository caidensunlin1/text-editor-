import { IndexNotInRopeException } from '../../src/exceptions/utilities/IndexNotInRopeException';
import {Rope} from '../../src/utilities/Rope';
import { beforeEach, expect, test, describe} from '@jest/globals';


let text: Rope;  
let bigRope: Rope; 
beforeEach(()=> {
    text = new Rope("start");

});

describe("Test Search", ()=> {
    test("search finds correct value",search_finds_correct_value),
    test("search finds right value", search_finds_right_value),
    test("test for index not in rope exception", search_outOfBounds_Index_throws_IndeNotFoundException)
})

function search_finds_correct_value() {
    expect(text.left).toBe(null);
    expect(text.right).toBe(null);
    expect(text.substring).toBe("start")
    expect(text.search(3)).toBe("r");
}

function search_finds_right_value(){
    let temp:Rope = new Rope("_hi");
    // console.log(temp.leftCount);
    text = text.concatiante(temp);

    expect(text.left?.leftCount).toBe(5);
    expect(text.right?.leftCount).toBe(3);

    // expect(text.leftCount).toBe(5);

    expect(text.left?.substring).toBe("start");
    expect(text.right?.substring).toBe("_hi");
    expect(text.search(6)).toBe("h");
}

function search_outOfBounds_Index_throws_IndeNotFoundException(){
    expect(() => text.search(100)).toThrow(IndexNotInRopeException);
}


/**
example rope from  https://medium.com/underrated-data-structures-and-algorithms/rope-data-structure-e623d7862137
//              (17)
//             /    \
//          (11)    (6)
//         /   \    / \
//       (6)   (4)  L5 L6 
//      /  \   / \
//     L1  L2 L3  L4 
//
//   L1: (6)|"hello_"
//   L2: (5)|"i_am_"
//   L3: (4)|"a_ro"
//   L4: (2)|"pe"
//   L5: (6)|"_data_"
//   L6: (9)|"structure"
//
// The complete string reads: "hello_i_am_a_rope_data_structure".
*/
function populateBigRope(){

    bigRope = new Rope("hello_");
    bigRope = bigRope.concatiante(new Rope("i_am_"));
    bigRope = bigRope.concatiante(new Rope("a_ro").concatiante(new Rope("pe")))
    bigRope = bigRope.concatiante(new Rope("_data_").concatiante(new Rope("structure")));
}


describe("Test Join", ()=> {
    test("test concatinate works",concatiante_works)
})

function concatiante_works(){
    populateBigRope()
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


// function concatiante_makes_balanced_trees(){
    
// }


describe("Test Report", ()=> {
    test("Report gets the entire string",report_all),
    test("Report gets substring inbetween string",report_inbetween),
    test("Report gets a substring in the same leaf", same_leaf_with_report),
    test("Report gets a substring where i is not start of rope", starting_index_inbetween_leaf_from_report),
    test("Report throws error when index is out of bounds", report_IndexNotInRopeException)
})

function report_all(){
    populateBigRope();
    expect(bigRope.string).toBe("hello_i_am_a_rope_data_structure");
}

function report_inbetween(){
    populateBigRope();
    expect(bigRope.report(11,22)).toBe("a_rope_data_");
}

function same_leaf_with_report(){
    populateBigRope();
    expect(bigRope.report(11,14)).toBe("a_ro");
}

function starting_index_inbetween_leaf_from_report(){
    let word: string = "taco";
    console.log(word.slice(0,100));
    populateBigRope();
    expect(bigRope.report(13,16)).toBe("rope");
    expect(bigRope.report(18,32)).toBe("data_structure");
}

function report_IndexNotInRopeException(){
    expect(()=> bigRope.report(100,1000)).toThrow(IndexNotInRopeException);
}

