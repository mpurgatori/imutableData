
'use strict';

const expect = require('chai').expect;
const listModule = require('../list');

const listUtil = require('../util');
const ListNode = listModule.ListNode;

function markImmutableDataStructure(listNode) {
  listNode._next = listNode.next;
  listNode.changed = false;
  Object.defineProperty(listNode, 'next', {
    set: function(value) {
      this._next = value;
      this.changed = true;
    },
    get: function(value) {
      return this._next;
    }
  });
}

function hasImmutableChanged(listNode) {
  if (listNode === null) {
    return false
  } else if (listNode.changed === true || listNode.changed === undefined) {
    return true;
  } else {
    return hasImmutableChanged(listNode.next);
  }
}

describe('Functional Lists', function () {

  let value1, value2, value3, value4, ln1, ln2, ln3, ln4;

  function hasAnyImmutableChanged() {
    return [ln1, ln2, ln3, ln4].some(hasImmutableChanged);
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

    [ln1, ln2, ln3, ln4].forEach(markImmutableDataStructure);

  });

  describe('ListNode constructor function', function() {
    it('has a constructor function that sets a value property to the inputted "value" and defaults a "next" property to null', function () {
      // store the value
      expect(ln1.value).to.equal(value1);

      // if no second parameter is passed, set next to null
      expect(ln1.next).to.equal(null);

    });

    it('takes in a listNode as its second parameter and points the first listNode to it', function () {
      // ln2.next should equal ln (not value, but by reference)
      expect(ln2.next).to.equal(ln1);
    });

    it('assigns a id property based on the inputted value', function () {
      // a ListNode's id property should equal the SHA1(value)
      expect(ln1.id).to.equal(listUtil.getSha1(value1));
      expect(ln1.id).to.not.be.equal(undefined);
    });
  });

  describe('toString', function() {
     it('returns a space-delimited list of ids surrounded by square brackets: [id1 id2]', function () {
       const ln1_sha = listUtil.getSha1(value1);
       const ln2_sha = listUtil.getSha1(value2);

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
      expect(ln1.prepend('my new node value').next).to.equal(ln1);
      expect(ln4.prepend('my new node value').next).to.equal(ln4);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('append', function() {
    it('combines two lists together, returning the listNode pointing to the start of the list', function () {
      // creates a new list that is the nodes of the originalList and all the nodes in otherList

      // each node from the original list will need to be a copy, but each node from the otherList
      // should remain the same

      // e.g. (a b c).append(d e) => (a' b' c' d e)
      // note a' b' c' reads "a prime, b prime, c prime" - in that a, b, c are copies of
      // the original a, b, c.

      expect(ln4.append(ln2).length()).to.equal(6);
      expect(ln4.append(ln2).next.next.next.next).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  })

  describe('remove', function() {
    it('returns a copy of the list if the id does not exist', function () {
      // In a performant implementation, we would return a reference the original list,
      // but this will be easier to implement
      // e.g. (a b c d e).splitAt(c) => (a' b')

      expect(ln4.remove('fake id').length()).to.equal(4);
      expect(ln4.remove('fake id')).to.not.equal(ln4);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });

    it('returns a new ListNode without the node with the id', function () {
      // you may assume that ids are unique (so you'll only ever remove at most one node)
      // be careful to not change the original linked list though!

      expect(ln4.remove(ln3.id).length()).to.equal(3);
      expect(ln4.remove(ln3.id).next).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });


  describe('splitAt', function() {
    it('returns a copy of the list if the id does not exist', function () {
      // e.g. (a b c d e).splitAt(c) => (a' b')

      expect(ln4.splitAt('fake id').length()).to.equal(4);
      expect(ln4.splitAt('fake id')).to.not.equal(ln4);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });

    it('returns a list that only contains nodes up to the node with id', function () {
      // e.g. (a b c d e).splitAt(c) => (a' b')

      expect(ln4.splitAt(ln2.id).length()).to.equal(2);
      expect(ln4.splitAt(ln2.id).next.next).to.be.null;
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('find', function() {
    it('returns null if the id does not exist', function () {
      // e.g. (a b c d e).splitAt(c) => (a' b')
      expect(ln1.find('fake id')).to.equal(null);
      expect(ln4.find('fake id')).to.equal(null);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });

    it('returns the sublist that starts with a node with id', function () {
      for (const listNode of [ln1, ln2, ln3, ln4]) {
        expect(ln4.find(listNode.id)).to.equal(listNode);
      }
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('insertAt', function() {
    it('returns a copy of the list if the inputted id does not exist', function () {
      // e.g. (a b c d e).insertAt(c, (f, g, h)) would return (a' b' f' g' h' c d e) as a new list
      // the original list's (c d e) should be the same as the new lists (c d e) in terms of object equality

      // In a performant implementation, we would return a reference the original list,
      // but this will be easier to implement

      // this example takes
      // (4 3 2 1).insertAt(2, (3 2 1)) => (4' 3' 3' 2' 1' 2 1)
      expect(ln4.insertAt('fake id', ln3).length()).to.equal(3);
      expect(ln2.insertAt('fake id', ln3)).to.not.equal(ln2)
    });

    it('returns a new list with the inputted list added immediately before the inputted id', function () {
      // e.g. (a b c d e).insertAt(c, (f, g, h)) would return (a' b' f' g' h' c d e) as a new list
      // the original list's (c d e) should be the same as the new lists (c d e) in terms of object equality

      // this example takes
      // (4 3 2 1).insertAt(2, (3 2 1)) => (4' 3' 3' 2' 1' 2 1)
      expect(ln4.insertAt(ln2.id, ln3).length()).to.equal(7);
      expect(ln2.insertAt(ln1.id, ln3).next.next.next.next).to.equal(ln1)
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });

  describe('intersection', function() {
    it('return null if the two lists do not have an intersecting node', function () {
      expect(ln4.intersection(new ListNode('new node'))).to.equal(null);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });

    it('find and return the first shared node of the two lists', function () {
      let ln2_branch = ln2.prepend('test node 1').prepend('Test node 2');
      expect(ln4.intersection(ln2_branch)).to.equal(ln2);
      expect(hasAnyImmutableChanged()).to.equal(false);
    });
  });
});
