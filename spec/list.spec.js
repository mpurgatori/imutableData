'use strict';

const expect = require('chai').expect;
const listModule = require('../list');

const listUtil = listModule.util;
const ListNode = listModule.ListNode;


xdescribe('Utilities object', function () {

  // use the Node crypto library to compute SHA1
  // http://stackoverflow.com/a/6984262
  it('should have a getSha1 function', function () {
    let sha = listUtil.getSha1('arbitrary text');
    expect(sha).to.equal('6ffa282ca37f30f3482e1958b8126af36df775d0');
  });
});

xdescribe('Functional Lists', function () {

  let value1, value2, value3, value4,
    ln1, ln2, ln3, ln4;

  beforeEach(function () {
    value1 = 'my first node';
    value2 = 'my second node';
    value3 = 'my third node';
    value4 = 'my fourth node';

    ln1 = new ListNode(value1);
    ln2 = new ListNode(value2, ln1);
    ln3 = new ListNode(value3, ln2);
    ln4 = new ListNode(value4, ln3);

  });

  it('has a basic constructor function', function () {
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

  it('has a toString method that outputs a space-delimited list of ids surrounded by square brackets: [id1 id2]', function () {
    let ln1_sha = listUtil.getSha1(value1);
    let ln2_sha = listUtil.getSha1(value2);

    expect(ln1.toString()).to.equal('[' + ln1_sha + ']');
    expect(ln2.toString()).to.equal('[' + ln2_sha + ' ' + ln1_sha + ']');
  });

  it('has a length() function that returns the number of nodes', function () {
    expect(ln1.length()).to.equal(1);
    expect(ln4.length()).to.equal(4);
  });

  it('has a shiftNode(value) method that returns a new ListNode holding value at the front', function () {
    let ln5 = ln4.shiftNode('my new node value');
    expect(ln5.next).to.equal(ln4);
  });

  it('has an append(otherList) function ', function () {
    // creates a new list that is the nodes of the originalList and all the nodes in otherList
    
    // each node from the original list will need to be a copy, but each node from the otherList
    // should remain the same

    // e.g. (a b c).append(d e) => (a' b' c' d e)
    // note a' b' c' reads "a prime, b prime, c prime" - in that a, b, c are copies of
    // the original a, b, c.

    let orig_ln4 = ln4;
    let orig_ln2 = ln2;

    let new_appended_ln = ln4.append(ln2);

    // make sure ln4 and ln2 didn't change
    expect(orig_ln4).to.equal(ln4);
    expect(orig_ln2).to.equal(ln2);

    expect(new_appended_ln.length()).to.equal(6);
    expect(new_appended_ln.next.next.next.next).to.equal(ln2);
  });

  it('has a remove(id) function that returns a new ListNode without the node with the id', function () {
    // you may assume that ids are unique (so you'll only ever remove at most one node)
    // be careful to not change the original linked list though!
    let ln4_orig = ln4;
    let new_ln4 = ln4.remove(ln3.id);

    expect(ln4_orig).to.equal(ln4);
    expect(new_ln4.next).to.equal(ln2);
  });

  it('has a splitAt(id) function that returns a list only contains nodes upto the node with id', function () {
    // e.g. (a b c d e).splitAt(c) => (a' b')
    let orig_ln4 = ln4;
    let splitLN4 = ln4.splitAt(ln2.id);

    expect(splitLN4.length()).to.equal(2);
    expect(splitLN4.next.next).to.be.null;
    expect(orig_ln4).to.equal(ln4);
  });

  it('has a find(id) function that returns the sublist that starts with a node with id', function () {
    let ln2_from_ln4 = ln4.find(ln2.id);
    expect(ln2_from_ln4).to.equal(ln2);
  });

  it('has an insertAt(id, list) that returns a new list', function () {
    // e.g. (a b c d e).insertAt(c, (f, g, h)) would return (a' b' f' g' h' c d e) as a new list
    // the original list's (c d e) should be the same as the new lists (c d e) in terms of object equality

    // this example takes
    // (4 3 2 1).insertAt(2, (3 2 1)) => (4' 3' 3' 2' 1' 2 1)
    let ln4_with_ln3_at_ln2 = ln4.insertAt(ln2.id, ln3);
    expect(ln4_with_ln3_at_ln2.length()).to.equal(7);

    // make sure we didn't use the original ln3
    expect(ln4_with_ln3_at_ln2.next.next).to.not.equal(ln3);
    expect(ln3.length()).to.equal(3);
  });

  it('has a commonAncestor(list) function that finds the same node (by reference) in the two lists', function () {
    let ln2_branch = ln2.shiftNode('test node 1').shiftNode('Test node 2');
    expect(ln4.commonAncestor(ln2_branch)).to.equal(ln2);
  });
});
