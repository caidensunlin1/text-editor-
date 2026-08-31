import { EmptyRopeException } from '../exceptions/utilities/EmptyRopeException';
import { IndexNotInRopeException } from '../exceptions/utilities/IndexNotInRopeException';
import { InvalidRageForRopeException } from '../exceptions/utilities/InvalidRageForRopeException';

export class Rope{
    // Maxmum length that a substring should be allowed
    // so that it can reduce the overall depth of the tree 
    // as well as keeping making concatenating and deleting 
    // in log(n) time.
    static MAX_LENGTH: number = 512; 
    // This is the max depth the rope should ever allowed to be
    // given that it would take an extrem amount of memory and no one 
    // would ever need a text editor with that many charcters. 
    static MAX_DEPTH: number =40; 
    //Increases threshold by 50% before the rope has to rebalance.
    static REBALANCE_THRESHOLD_COEFFICENT: number =1.5; 

    private _left: Rope | null;
    private _right: Rope | null;
    private _leftCount: number=0;
    private _substring: string | null; 
    private _depth: number =0; 

    constructor(substring: string); //leaf
    constructor(left: Rope, right: Rope); //parent
    constructor(leftOrSubstring: Rope | string,right?: Rope){
        if(typeof leftOrSubstring === "string"){
            this._left = null;
            this._right= null;
            this._substring = leftOrSubstring;
            this._leftCount = leftOrSubstring.length;
        }
        else{
            this._left= leftOrSubstring;
            this._right = right ?? null;
            this._substring = null;
            this._leftCount = leftOrSubstring.leftCount;
        }
    }

    get left(){
        return this._left;
    }

    get right(){
        return this._right;
    }


    get leftCount(){
        return this._leftCount;
    }

    get substring(){
        return this._substring;
    }

    get depth(){
        return this._depth;
    }

    /**
     * Returns the entire string that the rope holds.
     * @returns {string}
     */
    get string(){
        return this.report(0,this.length-1)
    }

    /**
     *  Returns the entire length of the string that the rope contains.
     * @returns {number}
     */
    get length(){
        let sum:number = this.leftCount;
        if(this.left !== null) {
            dfsSum(this.right);
        }

        /**
         * @param {Rope | null} r 
         * @returns {void}
         */
        function dfsSum(r:Rope | null){
            if (r !== null){
                sum += r.leftCount;
                dfsSum(r.right);
            } 
        }
        return sum;
    }

    private set left(left: Rope | null){
        this._left = left; 
    }
    
    private set right(right:Rope | null){
        this._right = right; 
    }

    private set leftCount(leftCount: number){
        this._leftCount = leftCount;
    }
    
    private set substring(substring: string | null){
        this._substring = substring; 
    }

    private set depth(depth: number){
        this._depth = depth;
    }

    /**
     * Finds the ith postion charcter in the rope. 
     * @param {number} i 
     * @returns {string}
     */
    search(i:number){ 
        /**
         * @param {Rope}r
         * @param {number} j
         * @returns {string}
         */
        function dfs(r:Rope,j:number){ 
            // left case 
            if (j <r.leftCount &&r.left !== null){ 
                return dfs(r.left,j);
            } // right case 
            else if(j>r.leftCount &&r.right !== null){
                return dfs(r.right,j-r.leftCount); // postion of char is in
            } // relation tor.right is j-s.leftCount
            else if (r.left === null && r.right === null 
                &&r.substring !== null && j<r.leftCount && j >=0){
                return r.substring[j];
            }
            else{
                throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            }
        }
        return dfs(this,i);
    }
    
    /**
     * Joins current rope with r into a single rope. 
     * @param {Rope | null} r 
     * @returns {Rope}
     */
    concatiante(r: Rope | null){ // check that if 

        if( r !== null){
            let newLeftCount: number = this.length; 
            let newDepth: number = Math.max(this.depth,r.depth) +1;
            let newRope: Rope = new Rope(this,r);
            newRope.leftCount = newLeftCount;

            let totalCount: number =  newLeftCount + r.length;
            if(newDepth < Rope.REBALANCE_THRESHOLD_COEFFICENT* Math.log2(totalCount)){
                
                return newRope
            }
            else{
                return this.rebalance(newRope);
            }
        }
        else{
            throw new EmptyRopeException();
        }
    }

    /**
     * 
     * @param r 
     * @returns {Rope}
     */
    private rebalance(r: Rope){
        let substrings: string[] = [];

        /**
         * Takes the given rope and yeilds a list of substrings
         * from all of its leafs.
         * @param currRope 
         * @returns {string[]}
         */
        function listOfSubstrings(currRope:Rope){
            if(currRope.left !== null && currRope.right !== null){
                listOfSubstrings(currRope.left);
                listOfSubstrings(currRope.right);
            }
            else if(currRope.left !== null){
                listOfSubstrings(currRope.left);
            }
            else if (currRope.right !== null){
                listOfSubstrings(currRope.right);
            }
            else if (currRope.string !== null){
                substrings.push(currRope.string);
            }
        }
       

        /**
         * Takes the given list of substrings and concatinates each substring 
         * such that the length of each leaf with exception of the last one 
         * contains a substring that is 512 charcters long. 
         * @returns {Rope[]}
         */
        function createLeafs(){
            let leafList: Rope[] = [];

            let start: number = 0; 
            let startSub: number = 0; 
            let count: number = 0; 

            for(let end =0; end <substrings.length; end++){
                let substring:string = substrings[end]!;
                if(Rope.MAX_LENGTH -count > substring.length){
                    count += substring.length;  
                }
                else{
                    let endSub: number = Rope.MAX_LENGTH -count 
                    let resultString: string;

                    // case in which start and end are in the same substring
                    if(start === end){
                        resultString = substring[start]!.slice(startSub,endSub);
                    }
                    else{ // slices the start partition, then everything in middle
                         // and then it finalizes with the end peice of the string. 
                         resultString =[
                        substring[start]!.slice(startSub),
                      ... (end-start > 1 ? substrings.slice(start+1,end) : ""),
                      substring[end]!.slice(0,endSub)].join("");
                    }
                     
                    leafList.push(new Rope(resultString));

                    start = end+1; 
                    startSub = endSub +1 < substring.length-1 ? endSub:0;
                    count = 0; 
                }
            }
            return leafList;
        }

        /**
         * Takes the list of ropes and combines them from the leaf level and
         * works its way up until it eachs the first level. 
         * @param ropeList 
         * @returns {Rope}
         */
        function createBalancedRope(ropeList: Rope[]){
            if(ropeList.length == 2){
                return combine(ropeList[0]!,ropeList[1]!);
            }

            const SIZE = Math.ceil(ropeList.length/2); 
            let parentRopeList: Rope[] = Array(SIZE).fill(null);
            let j: number = 0; 
            for(let i = 0; i< ropeList.length; i+=2){
                parentRopeList[j] = combine(ropeList[i]!,ropeList[i+1]!);
                j+=1;
            }

            if (ropeList.length % 2 === 1) parentRopeList[SIZE-1] = 
            combine(parentRopeList.at(-1)!,ropeList.at(-1)!);

            createBalancedRope(parentRopeList);
        }

        /**
         * Here for optimzation purposes 
         * @param r1 
         * @param r2 
         * @returns {Rope}
         */
        function combine(r1:Rope,r2:Rope){
            let newRope: Rope = new Rope(r1,r2);
            newRope.leftCount =  r1.length;
            newRope.depth = Math.max(r1.depth,r2.depth) +1;
            return newRope;
        }
        
        listOfSubstrings(r);
        return createBalancedRope(createLeafs());
    }


    /**
     * Cuts the given rope into two ropes: 
     * r1 from [0,i] and r2 from (i,n-1]. Then 
     * it returns an array of the two given ropes. 
     * @param {number} i 
     * @returns {Array<Rope>}
     */
    split(i:number){

    }

    /**
     * Places the new given Rope at the ith index. 
     * @param {number} i 
     * @param {Rope} s 
     * @returns {void}
     */
    insert(i:number,r: Rope | null){

    }

    /**
     * Removes the string from [i,j].
     * @param {number} i 
     * @param {number} j 
     */
    delete(i:number,j:number){

    }

    /**
     * Gives the string from [i,j]. 
     * @param {number} i 
     * @param {number} j 
     * @returns {string}
     */
    report(i:number,j:number){
        let partitions: string[] = [];
        let charLeft: number = j-i +1;
        if (charLeft <= 0)  throw new InvalidRageForRopeException(i, j);
        
        function dfs(r:Rope,start:number){
            // left case 
            if (start <r.leftCount &&r.left !== null){ 
                if(r.leftCount - start < charLeft && r.right !== null){
                    dfs(r.left,start);
                    // right call because, there are more chars left 
                    dfs(r.right,0); //outside of the left  calls window. 
                }else{
                    dfs(r.left,start);
                } 
            } // right case 
            else if(j>r.leftCount &&r.right !== null){
                  dfs(r.right,start-r.leftCount); // postion of char is in
                  // relation tor.right is j-s.leftCount
            } 
            else if (r.left === null && r.right === null 
                && r.substring !== null && start<r.leftCount){

                let subString: string = r.substring;
                let len: number = subString.length;
                let end: number = start + Math.min(charLeft,len-start);
                charLeft -= (end-start); 
                partitions.push(subString.slice(start,end));
            }
            else{
                throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            }
        }
        dfs(this,i);
        return partitions.join("");
    }

}   