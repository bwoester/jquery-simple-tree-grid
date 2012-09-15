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
 * @private
 * @type {number}
 */
bwoester.TreeNode.prototype.recursiveChildCount_ = 0;

/**
 * @public
 * @return {number} The number of children and grand children.
 */
bwoester.TreeNode.prototype.getRecursiveChildCount = function() {
  return this.recursiveChildCount_;
}

/**
 * @private
 * @param {number}
 */
bwoester.TreeNode.prototype.increaseRecursiveChildCount_ = function(i) {
  this.recursiveChildCount_ += i;
  var parent = this.getParent();
  if (parent) {
    parent.increaseRecursiveChildCount_( i );
  }
}

/**
 * @private
 * @param {number}
 */
bwoester.TreeNode.prototype.decreaseRecursiveChildCount_ = function(i) {
  this.increaseRecursiveChildCount_( 0 - i );
}

/**
 * @param {!bwoester.TreeNode} child Orphan child node.
 * @param {number} index The position to insert at.
 * @override
 */
bwoester.TreeNode.prototype.addChildAt = function(child, index) {
  this.increaseRecursiveChildCount_( child.getRecursiveChildCount() + 1 );
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
    this.decreaseRecursiveChildCount_( removedChild.getRecursiveChildCount() + 1 );
  }
  return removedChild;
};

/**
 * Removes all child nodes of this node.
 * @override
 */
bwoester.TreeNode.prototype.removeChildren = function() {
  this.decreaseRecursiveChildCount_( this.getRecursiveChildCount() );
  goog.base( this, 'removeChildren' );
};
