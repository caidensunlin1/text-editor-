import { REBALANCE_COEFFICENT } from "../../src/utilities/Constants";
import { Rope } from "../../src/utilities/Rope";

const asciiLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * @returns {Rope}
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
export function populateBigRope(): Rope{
    let r:Rope = new Rope("hello_");
    r = r.concatenate(new Rope("i_am_"));
    r = r.concatenate(new Rope("a_ro").concatenate(new Rope("pe")))
    r = r.concatenate(new Rope("_data_").concatenate(new Rope("structure")));
    return r
}

/**
 * @returns {Rope}
 * Creates a tree with depth: d = 7, a string of size: n=11, 
 * with the following balancing inequality if d > 2log(n)
 * => 7 >2log(11) => 7 >6.92, so we rebalance. So it should end 
 * up as a single node: (11) | "hello_world".
 */
export function makeUnbalancedTree() :Rope{
    let s: string[] = ["h","e","l","l","o","_","wor","ld"];
    let r: Rope = concatenateAllRopes(s);
    return r;
}


/**
 * Should end up with a tree with 4 leafs and should look like:
 *                         (1028)
 *                      /         \
 *                   (512)           (512)
 *                  /    \        /         \
 *            (L1|512)  (L2|512) (L3|512)  (L4|165) 
 */
export function makeUnbalancedTreeWithLargeStrings() :Rope{
    let s: string[] = [randomString(455),randomString(395),
        randomString(457),randomString(375)];

    let r: Rope = concatenateAllRopes(s);
    const n: number = r.length;

    for(let i= 0; i< Math.ceil(REBALANCE_COEFFICENT * Math.log2(n))-3; i++){
        r = r.concatenate(new Rope("a"));
    }
    return r;
}

function randomString(len:number): string{
    let str: String[] = Array(len).fill(null);
    for(let i =0; i < len; i++){
        str[i] = randomChoice(asciiLetters);
    }
    return str.join("");
}

function randomChoice(str:string): string{
    return str[Math.floor(Math.random() * str.length)]!;
}

function concatenateAllRopes(ropes: string[]): Rope{
    let r: Rope = new Rope(ropes[0]!);
    for(let i=1; i<ropes.length;i++)
        r= r.concatenate(new Rope(ropes[i]!));
    return r;
}

/**
 * Used to test that split does not change the values of a given rope. 
 */
export function areRopesEqual(r1: Rope| null, r2: Rope |null): boolean{
    if(r1=== null && r2 === null){
        return true;
    }
    else if(r1!.leftCount === r2!.leftCount && r1!.string === r2!.string){
        return true && areRopesEqual(r1!.left,r2!.left) && areRopesEqual(r1!.right,r2!.right);
    }
    else{
        return false;
    }
}

