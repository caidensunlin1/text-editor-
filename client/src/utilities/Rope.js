class Rope{
    left; 
    right; 
    substring;
    leftCount = 0 

    /**
     * 
     * @param {Rope} left 
     * @param {Rope} right 
     * @param {string} substring
     * @param {number} leftCount
     */
    constructor(left,right, leftCount,substring= null){
        this.left = left; 
        this.right = right;
        this.substring = substring;
        this.leftCount = leftCount;
    }

    /**
     * Finds the ith postion charcter in the rope. 
     * @param {number} i 
     * @returns {string}
     */
    search(i){

    }

    /**
     * Joins both ropes together.  // may change later so that it adds a rope to the current Rope instead. 
     * @param {Rope} s1 
     * @param {Rope} s2 
     * @returns {void}
     */
    concatiante(s1,s2){

    }

    /**
     * Cuts the given rope into two ropes: 
     * s1 from [0,i) and s2 from [i,n-1]. Then 
     * it returns an array of the two given ropes. 
     * @param {number} i 
     * @param {Rope} s 
     * @returns {Array<Rope>}
     */
    split(i,s){

    }

    /**
     * Places the new given Rope at the ith index. 
     * @param {number} i 
     * @param {Rope} s 
     */
    insert(i,s){

    }

    /**
     * Removes the string from [i,j].
     * @param {number} i 
     * @param {number} j 
     */
    delete(i,j){

    }

    /**
     * Gives the string from [i,j]. 
     * @param {number} i 
     * @param {number} j 
     * @returns {string}
     */
    report(i,j){

    }

}   