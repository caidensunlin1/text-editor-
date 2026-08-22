import { EmptyRopeException } from '../exceptions/utilities/EmptyRopeException';
import { IndexNotInRopeException } from '../exceptions/utilities/IndexNotInRopeException';
import { NoSubstringException } from '../exceptions/utilities/NoSubstringException';
export class Rope{

    private _left: Rope | null;
    private _right: Rope | null;
    private _leftCount: number=0;
    private _substring: string | null; 


    constructor(substring: string);
    constructor(left: Rope, right: Rope);
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

    /**
     * Finds the ith postion charcter in the rope. 
     * @param {number} i 
     * @returns {string}
     */
    search(i:number){

        /**
         * @param {Rope} s
         * @param {number} j
         * @returns {string}
         */
        function dfs(s:Rope,j:number){ 
            // left case 
            if (j < s.leftCount && s.left !== null){ 
                return dfs(s.left,j);
            } // right case 
            else if(j> s.leftCount && s.right !== null){
                console.log("went right");
                return dfs(s.right,j-s.leftCount); // postion of char is in
            } // relation to s.right is j-s.leftCount
            else if (s.left === null && s.right === null 
                && s.substring !== null && j< s.leftCount && j >=0){
                return s.substring[j];
            }
            else{
                console.log(`${j}`);
                throw new IndexNotInRopeException(i,j,s.substring?.length ??0);
            }
            // else if(j> s.leftCount || j <0){
            //     console.log(`${j}`);
            //     throw new IndexNotInRopeException(i,j,s.substring?.length ??0);
            // }
            // else{
            //     throw new NoSubstringException();
            // }
        }
        return dfs(this,i);
    }
    
    /**
     * Joins current rope with s into a single rope. 
     * @param {Rope | null} s 
     * @returns {Rope}
     */
    concatiante(s: Rope | null){
        if( s !== null){
            let newLeftCount: number = this.totalStringLength();
            let newRope: Rope = new Rope(this,s);
            newRope.leftCount = newLeftCount;
            return newRope
        }
        else{
            throw new EmptyRopeException();
        }
    }

    /** Finds the length of the string that the rope holds.
     * @returns {number}
     */
    totalStringLength(){
        let sum:number = this.leftCount;
        if(this.left !== null) {
            dfsSum(this.right);
        }

        /**
         * @param {Rope | null} s 
         * @returns {void}
         */
        function dfsSum(s:Rope | null){
            if (s !== null){
                sum += s.leftCount;
                dfsSum(s.right);
            } 
        }
        console.log("What that leftCount should be: " + sum);
        return sum;
    }

    /**
     * Cuts the given rope into two ropes: 
     * s1 from [0,i] and s2 from (i,n-1]. Then 
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
    insert(i:number,s: Rope | null){

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
        

        /**
         * @param {nodeIndex} number
         * @param {Rope} s 
         * @returns {void}
         */
        function dfs(s:Rope,nodeIndex: number){

            // if(i<= nodeIndex && nodeIndex <=j){
            //     if(s.left !== null) dfs(s.left,s.left.leftCount);
            //     if(s.right !== null) dfs(s.right,nodeIndex +s.right.leftCount);
            // }
            // else if(i <= nodeIndex){
            //     if(s.right !== null) dfs(s.right,nodeIndex +s.right.leftCount);
            // }
            // else if(j <= nodeIndex){
            //     if(s.left !== null) dfs(s.left,s.left.leftCount);
            // }
        
        }

        
        dfs(this,this.leftCount);
        return partitions.join("");
    }



}   