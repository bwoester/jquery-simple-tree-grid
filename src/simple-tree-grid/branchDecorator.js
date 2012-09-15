goog.provide('bwoester.simpleTreeGrid.BranchDecorator');

goog.require('bwoester.simpleTreeGrid.IComponent');
goog.require('bwoester.Ternary');



/**
 * @constructor
 * @implements {bwoester.simpleTreeGrid.IComponent}
 */
bwoester.simpleTreeGrid.BranchDecorator = function() {
}

/**
 * @private
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.simpleTreeGrid_ = null;

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.init = function( simpleTreeGrid )
{
  var self = this;

  self.simpleTreeGrid_ = simpleTreeGrid;

  simpleTreeGrid.element.bind( 'newRow.simpleTreeGrid', function( e, $row ) {
    self.decorate( $row );
  });

  simpleTreeGrid.element.bind( 'collapsed.simpleTreeGrid', function( e, $row ) {
    self.removeDecoration( $row );
    self.decorateCollapsed( $row );
  });

  simpleTreeGrid.element.bind( 'expanded.simpleTreeGrid', function( e, $row ) {
    self.removeDecoration( $row );
    self.decorateExpanded( $row );
  });
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.decorate = function( $row )
{
  var rowData = $row.data( this.simpleTreeGrid_.widgetName );

  if (rowData.expanded === bwoester.Ternary.TRUE) {
    this.decorateExpanded( $row );
  } else if (rowData.expanded === bwoester.Ternary.FALSE) {
    this.decorateCollapsed( $row );
  } else /* if (rowData['expanded'] === bwoester.Ternary.UNKNOWN) */ {
    this.decorateUnknown( $row );
  }
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.decorateCollapsed = function( $row )
{
  var self = this;
  $row.children('td:first')
    .prepend( '<i class="icon-plus" style="cursor: pointer;"></i>' )
    .children( 'i:first' )
      .click( function(eventObject) {
        self.simpleTreeGrid_.toggle( $row );
      });
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.decorateExpanded = function( $row ) {
  var self = this;
  $row.children('td:first')
    .prepend( '<i class="icon-minus" style="cursor: pointer;"></i>' )
    .children( 'i:first' )
      .click( function(eventObject) {
        self.simpleTreeGrid_.toggle( $row );
      });
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.decorateUnknown = function( $row ) {
  this.decorateCollapsed( $row );
}

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.removeDecoration = function( $row ) {
  $row.find('td:first > i:first').remove();
}
