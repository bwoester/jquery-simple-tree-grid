goog.provide('bwoester.simpleTreeGrid.BranchToggler');

goog.require('bwoester.simpleTreeGrid.IComponent');
goog.require('bwoester.Ternary');



/**
 * @constructor
 * @implements {bwoester.simpleTreeGrid.IComponent}
 */
bwoester.simpleTreeGrid.BranchToggler = function() {
}

/**
 * @private
 */
bwoester.simpleTreeGrid.BranchToggler.prototype.simpleTreeGrid_ = null;

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchToggler.prototype.init = function( simpleTreeGrid )
{
  var self = this;

  self.simpleTreeGrid_ = simpleTreeGrid;

  simpleTreeGrid.element.bind( 'toggle.simpleTreeGrid', function( e, row ) {
    self.toggle( row );
  });
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchToggler.prototype.toggle = function( row )
{
  var $row    = $(row);
  var rowData = $row.data( this.simpleTreeGrid_.widgetName );

  // if expanded, collapse
  if (rowData.expanded === bwoester.Ternary.TRUE) {
    this._collapse( $row );
  // if not expanded, expand
  } else if (rowData.expanded === bwoester.Ternary.FALSE) {
    this._expand( $row );
  // If we don't know, try to expand. This gives the widget a chance to
  // lazy load children, even if it wasn't provided with infos about
  // children
  } else /* if (rowData['expanded'] === bwoester.Ternary.UNKNOWN) */ {
    this._expand( $row );
  }
}

/**
 * Collapse all rows that contain to the branch. This includes sub branches.
 * @private
 */
bwoester.simpleTreeGrid.BranchToggler.prototype._collapse = function( $row )
{
  var self    = this;
  var rowData = $row.data( this.simpleTreeGrid_.widgetName );
  var node    = rowData.dataNode;

  node.forEachDescendant( function(node){
    var row = self.simpleTreeGrid_.getRowByNode( node );
    $(row).detach();
  });

  rowData.expanded = bwoester.Ternary.FALSE;

  this.simpleTreeGrid_.element.trigger( 'collapsed.simpleTreeGrid', [ $row ] );
}

 /**
  * Expand rows that belong to the branch. For sub branches, check their
  * expanded flag.
  * @private
  */
bwoester.simpleTreeGrid.BranchToggler.prototype._expand = function( $row )
{
  var self = this;

  var $insertTarget = $row;

  (function insertChildren( $row )
  {
    var rowData = $row.data( self.simpleTreeGrid_.widgetName );
    var node    = rowData.dataNode;

    node.forEachChild( function(child){
      var childRow   = self.simpleTreeGrid_.getRowByNode( child );
      var $childRow  = $(childRow);

      $childRow.insertAfter( $insertTarget );
      $insertTarget = $childRow;

      var childRowData = $childRow.data( self.simpleTreeGrid_.widgetName );
      if (childRowData.expanded === bwoester.Ternary.TRUE) {
        insertChildren( $childRow );
      }
    });

  })( $row );

  var rowData = $row.data( self.simpleTreeGrid_.widgetName );
  rowData.expanded = bwoester.Ternary.TRUE;

  self.simpleTreeGrid_.element.trigger( 'expanded.simpleTreeGrid', [ $row ] );
}
