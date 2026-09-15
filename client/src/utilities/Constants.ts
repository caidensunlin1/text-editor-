
/**
 * Maxmum length of a substring in a Rope, and the threshold in which the 
 * buffer will flush into Rope. 
 * This is done to reduce the overall depth of the Rope in order to keep 
 * concatenating and delting in O(log(n))
 */
export const MAX_LENGTH: number = 512; 

/**
 * Increases threshold by 100% before the rope has to rebalance.
 */
export const REBALANCE_COEFFICENT: number =2; 

