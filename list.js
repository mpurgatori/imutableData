'use strict';

// Destructured assignment! Whoa! This "extracts" getSha1 from the util's exports object!
const {
    getSha1
} = require('./util');

function ListNode(value, next) {
    this.value = value;
    this.next = next || null;
    this.id = getSha1(this.value);
}

ListNode.prototype.toString = function() {
    if (this.next) {
        return `[${this.id} ${this.next.id}]`;
    }
    else {
        return `[${this.id}]`;
    }
};

ListNode.prototype.length = function(){
  var counter = 1;
  function findLength(node){
    if (node.next === null){
      return counter;
    }
    counter++;
    return findLength(node.next);
  }
  return findLength(this);
};

ListNode.prototype.prepend = function(value){
  return new ListNode(value, this);
};




module.exports = {
    ListNode
};
// Yow! Even more destructured assignment
// This is the same as: module.exports = { ListNode: ListNode };
