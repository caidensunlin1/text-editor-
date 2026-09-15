import { EmptyRopeException } from '../exceptions/utilities/EmptyRopeException';
import { IndexNotInRopeException } from '../exceptions/utilities/IndexNotInRopeException';
import { InvalidRageForRopeException } from '../exceptions/utilities/InvalidRageForRopeException';
import { MaxLengthException } from '../exceptions/utilities/MaxLengthException';
import { NegativeIndexException } from '../exceptions/utilities/NegativeIndexException';
import { MAX_LENGTH, REBALANCE_COEFFICENT } from './Constants';


export class Rope{

    // This is the max depth the rope should ever allowed to be
    // given that it would take an extrem amount of memory and no one 
    // would ever need a text editor with that many charcters. 
    static MAX_DEPTH: number =40; 
    
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
            if(leftOrSubstring.length <= MAX_LENGTH){
                this._leftCount = leftOrSubstring.length; 
            }
            else{
                throw new MaxLengthException(leftOrSubstring.length);
            }
        }
        else{
            this._left= leftOrSubstring;
            this._right = right ?? null;
            this._substring = null;
            this._leftCount = leftOrSubstring.leftCount;
        }
    }

    get left(): Rope| null{
        return this._left;
    }

    get right(): Rope| null{
        return this._right;
    }

    get leftCount(): number{
        return this._leftCount;
    }

    get substring(): string | null{
        return this._substring;
    }

    get depth(): number{
        return this._depth;
    }

    /**
     * Returns the entire string that the rope holds.
     * @returns {string}
     */
    get string(): string{
        return this.report(0,this.length-1)
    }

    /**
     *  Returns the entire length of the string that the rope contains.
     * @returns {number}
     */
    get length(): number{
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

    get leafTotal(): number{
        function dfs(r:Rope | null) : number{
            if(r === null) return 0;
            if(r.left === null && r.right === null) return 1;

            return dfs(r.left) + dfs(r.right);
            
        }
        return dfs(this);
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
     * @throws {IndexNotInRopeException}
     */
    search(i:number): string{ 
        /**
         * @param {Rope}r
         * @param {number} j
         * @returns {string}
         */
        function dfs(r:Rope,j:number):string{ 
            // left case 
            if (j <r.leftCount &&r.left !== null){ 
                return dfs(r.left,j);
            } // right case 
            else if(j>=r.leftCount &&r.right !== null){
                return dfs(r.right,j-r.leftCount); // postion of char is in
            } // relation tor.right is j-s.leftCount
            else if (r.left === null && r.right === null 
                &&r.substring !== null && j<r.leftCount && j >=0){
                return r.substring[j]!;
            }
            throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
        }
        return dfs(this,i);
    }
    
    /**
     * Joins current rope with r into a single rope. 
     * @param {Rope | null} r 
     * @returns {Rope}
     */
    concatenate(r: Rope | null): Rope{ 
        if( r !== null){
            let newLeftCount: number = this.length; 
            let newDepth: number = Math.max(this.depth,r.depth) +1;
            let newRope: Rope = new Rope(this,r);
            newRope.leftCount = newLeftCount;
            newRope.depth = newDepth;

            let totalCount: number =  newLeftCount + r.length;
            if(newDepth < REBALANCE_COEFFICENT* Math.log2(totalCount)){
                
                return newRope;
            }
            else{
                return Rope.rebalance(newRope);
            }
        }
        else{
            throw new EmptyRopeException();
        }
    }

     /**
     * This reconstructs a balanced rope when the given thresold of REBALANCE_COEFFICENT*log(n)
     * is broken from a rope being concatnated. 
     * @param r 
     * @returns {Rope}
     * @interal 
     * {@link concatenate}
     */
    private static rebalance(r: Rope): Rope{
        let substrings: string[] = [];
        Rope.listOfSubstrings(r,substrings);
        return Rope.createBalancedRope(Rope.createLeafs(substrings));
    }

    /**
     * Takes the given rope and yeilds a list of substrings
     * from all of its leafs. 
     * @internal 
     * @param r 
     * @returns {void}
     * {@link rebalance}
     */
    private static listOfSubstrings(r:Rope, substrings: string[]):void{
        if(r.left !== null && r.right !== null){
            this.listOfSubstrings(r.left,substrings);
            this.listOfSubstrings(r.right,substrings);
        }
        else if(r.left !== null){
            this.listOfSubstrings(r.left,substrings);
        }
        else if (r.right !== null){
            this.listOfSubstrings(r.right,substrings);
        }
        else if (r.string !== null){
            substrings.push(r.string);
        }
    }

    /**
     * Takes the given list of substrings and concatinates each substring 
     * such that the length of each leaf with exception of the last one 
     * contains a substring that is 512 charcters long. 
     * @returns {Rope[]}
     * @internal 
     * {@link rebalance}
     */
    private static createLeafs(substrings: string[]):Rope[]{
        let leafList: Rope[] = [];

        let start: number = 0; 
        let startSub: number = 0; 
        let count: number = 0; 

        for(let end =0; end <substrings.length; end++){
            let substring:string = substrings[end]!;
            if(MAX_LENGTH -count > substring.length && end !== substrings.length-1){// adds substring
                count += substring.length;  
            }
            else{ // makes leaf node having the substring from [start[startSub],end[endSub]]
                // with endsub being exclusive. 

                let endSub: number = MAX_LENGTH -count 
                let resultString: string;

                // case in which start and end are in the same substring
                if(start === end){
                    resultString = substring[start]!.slice(startSub,endSub);
                }
                else{ // slices the start partition, then everything in middle
                        // ,and then it finalizes with the end peice of the string. 
                    //  console.log(`substring at ${end}: ${substrings[end]}`)
                        resultString =[
                    substrings[start]!.slice(startSub),
                    ... (end-start > 1 ? substrings.slice(start+1,end) : ""),
                    substrings[end]!.slice(0,endSub)].join("");
                }
                
                leafList.push(new Rope(resultString));

                if(endSub +1 < substring.length-1){ // Part of the substring hasen't been added yet.
                    startSub = endSub; 
                    count = substring.length - endSub;
                    start = end; 
                } // entire substring has been added. 
                else{
                    start = end+1;
                    startSub = 0;
                    count = 0;
                }
            }
        }
        return leafList;
    }

    /**
     * Takes the list of ropes and combines them from the leaf level and
     * works its way up until it eachs the first level. 
     * @param ropeList 
     * @returns {Rope}
     * @internal 
     * {@link rebalance}
     */
    private static createBalancedRope(ropeList: Rope[]): Rope{ 
        if(ropeList.length === 1){                        
            let balancedRope: Rope = ropeList[0]!;
            Rope.LeftSumForEachNode(balancedRope);
            return balancedRope;
        }

        const SIZE = Math.floor(ropeList.length/2); 
        let parentRopeList: Rope[] = Array(SIZE).fill(null);
        let j: number = 0; 
        
        for(let i = 0; i< ropeList.length-1; i+=2){
            parentRopeList[j] = Rope.combine(ropeList[i]!,ropeList[i+1]!);
            j+=1;
        }

        if (ropeList.length % 2 === 1) parentRopeList[SIZE-1] = 
            Rope.combine(parentRopeList.at(-1)!,ropeList.at(-1)!);

        return Rope.createBalancedRope(parentRopeList);
    }


    /**
     * Here for optimzation purposes to combine two ropes without 
     * accounting for leftCount. 
     * @param r1 
     * @param r2
     * @internal
     * {@link createBalancedRope}
     * @returns {Rope}
     */
    private static combine(r1:Rope,r2:Rope) :Rope{
        let newRope: Rope = new Rope(r1,r2);
        newRope.depth = Math.max(r1.depth!,r2.depth!) +1;
        return newRope;
    }

    /**
     * Computes the leftCount for each node in O(n) time. 
     * @internal 
     * {@link rebalance}
     */
    public static LeftSumForEachNode(r:Rope): void{
        let stack: number[] = [];

        /**
         * Traverses the rope, and adds up the leafCount when popping up. 
         * @param rope 
         * @returns {void}
         */
        function dfs(rope:Rope| null){
            if( rope === null){
                return
                }
            else if(rope.left === null && rope.right === null){
                stack.push(rope.leftCount);
            }
            dfs(rope.left);
            rope.leftCount = stack[stack.length-1]!;
            dfs(rope.right);
            add(stack.length);
        }

        function add(len:number):void{
            if(len >=2){
                let top: number = stack.pop()!;
                stack[len-2]!+= top; 
            }
        }

        dfs(r.left);
        add(stack.length);
        if(stack.length)  r.leftCount = stack.pop()!;
        dfs(r.right);
    }

    /**
     * Cuts the given rope into two ropes: 
     * r1 from [0,i] and r2 from (i,n-1]. Then 
     * it returns an array of the two given ropes. 
     * @param {number} i 
     * @returns {Rope[]}
     */
    split(i:number): [Rope|null,Rope|null]{
        if(i<0) throw new NegativeIndexException(i);
        // Makes a shallow copy of the root of the root. 
        let leftRope: Rope| null = Object.assign(Object.create(Rope.prototype),this);
        let rightPeices: Rope[] =[];
    
         // leftNode can't be null.
        Rope.addLeafs(leftRope!,i,rightPeices); 
       
        if(leftRope!.right !== null ){
            leftRope!.right =Rope.compression(leftRope!.right);
            leftRope!.depth = Math.max(leftRope!.right!.depth,leftRope!.left!.depth) +1;
        }
        else if(leftRope!.left !== null){
           leftRope!.left = Rope.compression(leftRope!.left);
            // updates the leftCount given values may be missing
           leftRope!.leftCount = leftRope!.left!.length; 
           leftRope!.depth = leftRope!.left!.depth +1;
        }

        const rightRope: Rope| null = Rope.unifyRight(rightPeices);
        
        return [leftRope,rightRope];
    }
    
     /**
     * Adds the leafs that belong to the leftRope, and sets the nodes 
     * that do not belong to the leftRope to null. While also adding the right children 
     * to the rightPeices with the last part of the strings being added first. 
     * @param r 
     * @param j 
     * @internal 
     * {@link split}
     */
    private static addLeafs(r:Rope,i:number,rightPeices: Rope[]){

        function dfs(cur:Rope,j:number){
            // left case 
            if (j <cur.leftCount &&cur.left !== null){ 
                if(cur.right !== null) rightPeices.push(cur.right);
                cur.left = Object.assign(Object.create(Rope.prototype),cur.left);
                cur.right = null
                dfs(cur.left!,j);
            } // right case 
            else if(j>=cur.leftCount &&cur.right !== null){
                cur.right = Object.assign(Object.create(Rope.prototype),cur.right);
                dfs(cur.right!,j-cur.leftCount); // postion of char is in
            } // relation to cur.right is j-s.leftCount
            else if (cur.left === null && cur.right === null 
                &&cur.substring !== null && j<cur.leftCount && j >=0){
                if(j === cur.leftCount-1){ // case in which i contains the whole substring
                    cur= Object.assign(Object.create(Rope.prototype),cur);
                }
                else{ // case in which 
                    const s1: string = cur.substring.slice(0,j+1);
                    const s2: string = cur.substring.slice(j+1,cur.leftCount);
                    cur.substring = s1; 
                    cur.leftCount = s1.length;
                    rightPeices.push(new Rope(s2));
                }
            }
            else{
                throw new IndexNotInRopeException(i,j,cur.substring?.length ??0);
            }
           
        }
        dfs(r,i);
    }

    /**
     * Goes back and removes the unessary nodes from the left node, while 
     * also updating the leftCount of the root if nessary.
     * @param r 
     * @internal 
     * {@link split}
     */
    private static compression(r: Rope| null): Rope| null{
        if(r === null) return null;

        if(r.right !== null){
                r.right = this.compression(r.right);
            }
        else if(r.left !== null){ // removes unessary node. 
            return this.compression(r.left);
        }
        return r; 
    }

    /**
     * Takes the right peices of the right Rope and returns one given rope. 
     * @returns {Rope |null}
     * @internal 
     * {@link split}
     */
    private static unifyRight(rightPeices: Rope[]): Rope |null{
        while(rightPeices.length >=2) 
            rightPeices[rightPeices.length-2] = 
            this.combineWithLeftCount(rightPeices.pop()!,rightPeices[rightPeices.length-1]!);  
        return (rightPeices.length === 1)? rightPeices.pop()!: null;
    }   

    /**
     * Accounts for leftCount. 
     * @param r1 
     * @param r2 
     * @returns {Rope}
     */
    private static combineWithLeftCount(r1:Rope,r2:Rope) :Rope{
        let newRope: Rope = new Rope(r1,r2);
        newRope.leftCount =  r1.length; 
        newRope.depth = Math.max(r1.depth!,r2.depth!) +1;
        return newRope;
    }

    /**
     * Places the new given Rope at the ith index. 
     * @param {number} i 
     * @param {Rope} s 
     * @returns {void}
     */
    insert(i:number,s: string): Rope{
        if(s.length ===0 ||null) throw new EmptyRopeException();
        const LEN: number = s.length;

        let stack: Rope[] = [];

        /**
         * @param {Rope}r
         * @param {number} j
         * @returns {Rope}
         */
        function dfs(r:Rope,j:number){
            // left case 
            if (j <r.leftCount &&r.left !== null){ 
                r.leftCount += LEN;
                stack.push(r);
                dfs(r.left,j);
            } // right case 
            else if(j>=r.leftCount &&r.right !== null){
                r.depth = (r.left !==null)? Math.max(r.left.depth+1,r.right.depth+2): r.depth+1;
                stack.push(r);
                dfs(r.right,j-r.leftCount);
            } 
            else if (r.left === null && r.right === null 
                &&r.substring !== null && j<r.leftCount && j >=0){
                    let substring: string = r.substring;
                if(j <substring.length-1){
                    let left: Rope = new Rope(substring.slice(0,j+1));
                    let middle: Rope = new Rope(s);
                    let right: Rope = new Rope(substring.slice(j+1,substring.length));

                    r.left = Rope.combine(left,middle);
                    r.right = right; 
                    r.substring = null;
                    r.depth =2; 
                }
                else{

                    let left: Rope = Object.assign(Object.create(Rope.prototype),r);
                    let right: Rope = new Rope(s);

                    r.left= left;
                    r.right = right; 
                    r.substring = null; 
                    r.depth=1; 
                }
                updateDepth();
            }
            else{
                throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            }
        }
        
        function updateDepth(): void{
            while(stack.length){
                let r: Rope = stack.pop()!;
                if(r.left !==null){
                    r.depth = (r.right !==null)? 
                        Math.max(r.left.depth,r.right.depth)+1 : r.depth+1;
                }
                else if(r.right !== null){
                    r.depth = r.depth +1; 
                }
            }
        }

        dfs(this,i);

        const TOTAL_LEN: number = LEN + this.length;
        if(this.depth > REBALANCE_COEFFICENT*Math.log2(TOTAL_LEN)){
            return Rope.rebalance(this);
        }
        return this; 
    }
    

    /**
     * Removes the string from [i,j].
     * @param {number} i 
     * @param {number} j 
     */
    delete(i:number,j:number): Rope{
        if (i <0) throw new NegativeIndexException(i);
        if (j< 0) throw new NegativeIndexException(j);
        if (j-i < 0)  throw new InvalidRageForRopeException(i, j);
        
        if(i ==j){
            this.removeSingleString(i);
            return this; 
        }
        else if(i !==0){ 
            const firstSplit: [Rope|null,Rope|null] = this.split(i-1);
            let r1: Rope| null = firstSplit[0];
            let r2: Rope |null = firstSplit[1];
    
            //updates what is taken out of the second split to fix the issue, through (i-j).
            const secondSplit: [Rope|null,Rope|null] = r2!.split(j-i);
            
            let r4: Rope| null = secondSplit[1];
            
            // test edge case for when j is at the end of the rope. 
            let combinedRope: Rope = (r4 ===null)? r1!: r1!.concatenate(r4);

            return combinedRope; 
        }
        else{// if i is zero than there is nothing to attach to so only one split can be done. 
            const firstSplit: [Rope|null,Rope|null] = this.split(j);
            let r2: Rope |null = firstSplit[1];
            return r2!; 
        }
    }

    /**
     * Use for the case when only one string needs to removed. 
     * @param i 
     * @internal 
     * {@link delete}
     */
    private removeSingleString(i:number){
   
        function dfs(r:Rope,j:number){
            // left case 
            if (j <r.leftCount &&r.left !== null){  
                r.leftCount--; 
                dfs(r.left,j);
            } // right case 
            else if(j>=r.leftCount &&r.right !== null){
                dfs(r.right,j-r.leftCount); // postion of char is in
            } // relation tor.right is j-s.leftCount
            else if (r.left === null && r.right === null 
                &&r.substring !== null && j<r.leftCount && j >=0){
                let substring: string = r.substring;

                if(j!==0){ 
                    r.substring = (substring.length-1 !== i)?
                        substring.slice(0,j) +substring.slice(j+1,substring.length)
                        : substring.slice(0,j); 
                }
                else{
                    r.substring = (substring.length !==1)? 
                        substring.slice(1,substring.length): null;
                } 

                r.leftCount--; 
            }
            else{
                  throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            } 
        }

        dfs(this,i);
    }

    /**
     * Gives the string from [i,j]. 
     * @param {number} i 
     * @param {number} j 
     * @returns {string}
     */
    report(i:number,j:number):string{
        let partitions: string[] = [];
        let charLeft: number = j-i +1;
        if (i <0) throw new NegativeIndexException(i);
        if (j< 0) throw new NegativeIndexException(j);
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
            else if(j>=r.leftCount &&r.right !== null){
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

    /**
     * Performs DFS and prints all node
     * @returns {void}
     */
    printAll(): void{
        function dfs(r:Rope| null){
            if(r === null) return; 

            if (r.substring !== null){
                console.log(`substring: ${r.substring} |leftCount: ${r.leftCount} |depth: ${r.depth}|`);
            }
            else{
                 console.log(`leftCount: ${r.leftCount} |depth: ${r.depth}|`);
            }
            dfs(r.left); dfs(r.right);
        }
        dfs(this);
    }

    /**
     * Used to make a given copy of a given Rope.
     */
    copy(): Rope{
        const ropeCopy: Rope = Object.assign(Object.create(Rope.prototype),this);
        function dfs(cur:Rope ){
            if(cur.left !== null){
                cur.left = Object.assign(Object.create(Rope.prototype),cur.left);
                dfs(cur.left!);
            }
            if(cur.right !== null){
                cur.right = Object.assign(Object.create(Rope.prototype),cur.right);
                dfs(cur.right!);
            }
        }
        dfs(ropeCopy)
        return ropeCopy;
    }
}   