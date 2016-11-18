'use strict';

const expect = require('chai').expect;
const listModule = require('../list');

const listUtil = listModule.util;
const ListNode = listModule.ListNode;

function markImmutableDataStructure(linkedNode) {
  linkedNode._next = linkedNode.next;
  linkedNode.changed = false;
  Object.defineProperty(linkedNode, 'next', {
    set: function(value) { 
      this._next = value;
      this.changed = true;
    },
    get: function(value) { 
      return this._next;
    }
  });
}

function hasImmutableChanged(linkedNode) {
  if (linkedNode === null) {
    return false
  } else if (linkedNode.changed === true || linkedNode.changed === undefined) {
    return true;
  } else {
    return hasImmutableChanged(linkedNode.next);
  }
}

describe('Functional Lists', function () {

  let value1, value2, value3, value4,
    ln1, ln2, ln3, ln4;

  function hasAnyImmutableChanged() {
    for (let linkedNode of [ln1, ln2, ln3, ln4]) {
      return hasImmutableChanged(linkedNode);
    }
  }

  beforeEach(function () {
    value1 = 'my first node';
    value2 = 'my second node';
    value3 = 'my third node';
    value4 = 'my fourth node';

    ln1 = new ListNode(value1);
    ln2 = new ListNode(value2, ln1);
    ln3 = new ListNode(value3, ln2);
    ln4 = new ListNode(value4, ln3);

    for (let linkedNode of [ln1, ln2, ln3, ln4]) {
      markImmutableDataStructure(linkedNode);
    }

  });

  describe('linkedNode constructor function', function() {
    it('has a constructor function that sets a value property to the inputted "value" and defaults a "next" property to null', function () {
      // store the value
      expect(ln1.value).to.equal(value1);

      // if no second parameter is passed, set next to null
      expect(ln1.next).to.equal(null);

    });

    it('has a constructor function that takes another ListNode', function () {
      // ln2.next should equal ln (not value, but by reference)
      expect(ln2.next).to.equal(ln1);
    });

    it('has a constructor function that sets an id based on the value', function () {
      // a ListNode's id property should equal the SHA1(value)
      expect(ln1.id).to.equal(listUtil.getSha1(value1));
      expect(ln1.id).to.not.be.equal(undefined);
    });  
  });

  describe('toString', function() {
     it('returns a space-delimited list of ids surrounded by square brackets: [id1 id2]', function () {
       let ln1_sha = listUtil.getSha1(value1);
       let ln2_sha = listUtil.getSha1(value2);

       expect(ln1.toString()).to.equal('[' + ln1_sha + ']');
       expect(ln2.toString()).to.equal('[' + ln2_sha + ' ' + ln1_sha + ']');
       expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('length', function() {
    it('returns the number of nodes in the list', function () {
      expect(ln1.length()).to.equal(1);
      expect(ln4.length()).to.equal(4);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('prepend', function() {
    it('returns a new ListNode that holds the inputted value at the front and points to the original listNode', function () {
      let ln5 = ln4.prepend('my new node value');
      expect(ln5.next).to.equal(ln4);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('append', function() {
    it('has an append(otherList) function ', function () {
      // creates a new list that is the nodes of the originalList and all the nodes in otherList
      
      // each node from the original list will need to be a copy, but each node from the otherList
      // should remain the same

      // e.g. (a b c).append(d e) => (a' b' c' d e)
      // note a' b' c' reads "a prime, b prime, c prime" - in that a, b, c are copies of
      // the original a, b, c.

      let new_appended_ln = ln4.append(ln2);

      expect(new_appended_ln.length()).to.equal(6);
      expect(new_appended_ln.next.next.next.next).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  })
 
  describe('remove', function() {
    it('returns a new ListNode without the node with the id', function () {
      // you may assume that ids are unique (so you'll only ever remove at most one node)
      // be careful to not change the original linked list though!

      let new_ln4 = ln4.remove(ln3.id);

      expect(new_ln4.next).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  })


  describe('splitAt', function() {
    it('returns a list only contains nodes upto the node with id', function () {
      // e.g. (a b c d e).splitAt(c) => (a' b')
      let splitLN4 = ln4.splitAt(ln2.id);

      expect(splitLN4.length()).to.equal(2);
      expect(splitLN4.next.next).to.be.null;
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  })

  describe('find', function() {
    it('returns the sublist that starts with a node with id', function () {
      let ln2_from_ln4 = ln4.find(ln2.id);
      expect(ln2_from_ln4).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  }

  describe('insertAt', function() {
    it('returns a new list with the new node added', function () {
      // e.g. (a b c d e).insertAt(c, (f, g, h)) would return (a' b' f' g' h' c d e) as a new list
      // the original list's (c d e) should be the same as the new lists (c d e) in terms of object equality

      // this example takes
      // (4 3 2 1).insertAt(2, (3 2 1)) => (4' 3' 3' 2' 1' 2 1)
      let ln4_with_ln3_at_ln2 = ln4.insertAt(ln2.id, ln3);
      expect(ln4_with_ln3_at_ln2.length()).to.equal(7);

      // make sure we didn't use the original ln3
      expect(ln4_with_ln3_at_ln2.next.next).to.not.equal(ln3);
      expect(ln3.length()).to.equal(3);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  })

  describe('commonAncestor', function() {
    it('return the nearest ancestor (shared node) of the two lists and returns it', function () {
      let ln2_branch = ln2.prepend('test node 1').prepend('Test node 2');
      expect(ln4.commonAncestor(ln2_branch)).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });  
  })
});
