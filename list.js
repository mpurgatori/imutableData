'use strict';

const crypto = require('crypto');

const util = {
  getSha1: function (data) {
    return crypto
      .createHash('sha1')
      .update(data)
      .digest('hex');
  }
};

function ListNode (value, next) {
  this.value = value;
  this.next = next || null;
  this.id = util.getSha1(value);
}

ListNode.prototype.toString = function (acc) {
  acc = acc || [];
  acc.push(this.id);

  if (!this.next) return '[' + acc.join(' ') + ']';
  else return this.next.toString(acc);
};

ListNode.prototype.length = function () {
  if (!this.next) return 1;
  else return 1 + this.next.length();
};

ListNode.prototype.prepend = function (value) {
  return new ListNode(value, this);
};

ListNode.prototype.append = function (list) {
  if (!this.next) return new ListNode(this.value, list);
  else return new ListNode(this.value, this.next.append(list));
};

ListNode.prototype.remove = function (id) {
  if (this.id === id) return this.next;
  else if (!this.next) return this;
  else return new ListNode(this.value, this.next.remove(id));
};

ListNode.prototype.splitAt = function (id) {
  if (this.id === id) return null;
  else if (!this.next) return null;
  else return new ListNode(this.value, this.next.splitAt(id));
};

ListNode.prototype.find = function (id) {
  if (this.id === id) return this;
  else if (!this.next) return null;
  else return this.next.find(id);
};

ListNode.prototype.insertAt = function (id, list) {
  if (this.id === id) return list.append(this);
  else if (!this.next) return null;
  else return new ListNode(this.value, this.next.insertAt(id, list));
};

ListNode.prototype.intersection = function (list) {
  if (list.find(this.id)) return this;
  else if (!this.next) return null;
  else return this.next.intersection(list);
};

module.exports = { util: util, ListNode: ListNode };