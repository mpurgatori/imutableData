
var util = {
	getSha1: function(text) {

		var crypto = require('crypto');
		var shasum = crypto.createHash('sha1');
		shasum.update(text);
		return shasum.digest('hex');
	}
}


var ListNode = function(value, next) {
	this.value = value;
	this.next = next || null;
	this.id = util.getSha1(value);

}


ListNode.prototype.toString = function() {
	var ids = [];
	var currentNode = this;
	while(currentNode) {
		ids.push(currentNode.id);
		currentNode = currentNode.next;
	}
	return "[" + ids.join(" ") + "]";
}

ListNode.prototype.toStringShort = function() {
	var ids = [];
	var currentNode = this;
	while(currentNode) {
		ids.push(currentNode.id);
		currentNode = currentNode.next;
	}
	return "[" + ids.map(function(id) { return id.slice(0, 6); }).join(" ") + "]";
}


ListNode.prototype.length = function() {
	var length = 0;
	var currentNode = this;
	while(currentNode) {
		length++;
		currentNode = currentNode.next;
	}
	return length;
};

ListNode.prototype.shiftNode = function(value) {
	return new ListNode(value, this);
}

ListNode.prototype.remove = function(id) {
	if(this.id == id) {
		return this.next.remove(id);
	} else if(this.next == null) {
		return this;
	} else {
		var remainingList = this.next.remove(id);
		if(this.next == remainingList) {
			return this;
		} else {
			return remainingList.shiftNode(this.value);
		}
	}
};

ListNode.prototype.append = function(otherList) {
	// base case
	// if the next is null in the current list, have the otherList push ourselves
	if(this.next == null) {
		return otherList.shiftNode(this.value);

	// recursion
	// (a b c).append(d e) sub problem is (b c).append(d e).shiftNode(this.value)
	} else {
		var newList = this.next.append(otherList);
		return newList.shiftNode(this.value);
	}
};




exports.util = util;
exports.ListNode = ListNode;