'use strict';

// Destructured assignment! Whoa! This "extracts" getSha1 from the util's exports object!
const { getSha1 } = require('./util'); 

function ListNode (value, next) {}
/* want to use ES6? Try writing this as a class:
class ListNode {

  constructor (value, next) {}
}
*/


module.exports = { ListNode }; 
// Yow! Even more destructured assignment
// This is the same as: module.exports = { ListNode: ListNode };
