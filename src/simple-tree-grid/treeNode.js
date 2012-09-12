
goog.provide('bwoester.TreeNode');

goog.require('goog.structs.TreeNode');



/**
 * @constructor
 * @extends goog.structs.TreeNode
 */
bwoester.TreeNode = function( key, value ) {
  goog.structs.TreeNode.call( this, key, value );
}

goog.inherits( bwoester.TreeNode, goog.structs.TreeNode );

/**
 * @type {number}
 * @private
 */
bwoester.TreeNode.prototype.recursiveChildCount_ = 0;

/**
 * @return {number} The number of children and grand children.
 */
bwoester.TreeNode.prototype.getRecursiveChildCount = function() {
  return this.recursiveChildCount_;
}

/**
 * @param {!bwoester.TreeNode} child Orphan child node.
 * @param {number} index The position to insert at.
 * @override
 */
bwoester.TreeNode.prototype.addChildAt = function(child, index) {
  this.recursiveChildCount_ += (child.getRecursiveChildCount() + 1);
  goog.base( this, 'addChildAt', child, index );
};

/**
 * Removes the child node at the given index.
 * @param {number} index The position to remove from.
 * @return {bwoester.TreeNode} The removed node if any.
 * @override
 */
bwoester.TreeNode.prototype.removeChildAt = function(index) {
  var removedChild = goog.base( this, 'removeChildAt', index );
  if (removedChild instanceof bwoester.TreeNode) {
    this.recursiveChildCount_ -= (removedChild.getRecursiveChildCount() + 1);
  }
  return removedChild;
};

/**
 * Removes all child nodes of this node.
 * @override
 */
bwoester.TreeNode.prototype.removeChildren = function() {
  this.recursiveChildCount_ -= this.getRecursiveChildCount();
  goog.base( this, 'removeChildren' );
};
