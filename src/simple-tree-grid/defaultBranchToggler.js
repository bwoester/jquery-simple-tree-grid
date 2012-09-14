
goog.provide('bwoester.simpleTreeGrid.DefaultBranchToggler');

/**
 * @constructor
 */
bwoester.simpleTreeGrid.DefaultBranchToggler = function() {
}

/**
 * @private
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.simpleTreeGrid_ = null;

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.init = function( simpleTreeGrid )
{
  var self = this;

  self.simpleTreeGrid_ = simpleTreeGrid;

  simpleTreeGrid.element.children('tbody').click( function(eventObject) {
    var $row = $(eventObject.target).closest('tr');
    var $icon = $row.find('td:first > i:first');
    if (eventObject.target == $icon[0]) {
      simpleTreeGrid.toggle( $row );
    }
  });

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
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.decorate = function( $row )
{
  var rowData = $row.data( this.simpleTreeGrid_.widgetName );

  if (rowData.expanded === bwoester.Ternary.TRUE) {
    this.decorateExpanded( $row );
  } else if (rowData.expanded === bwoester.Ternary.FALSE) {
    this.decorateCollapsed( $row );
  } else /* if (rowData['expanded'] === bwoester.ternary.UNKNOWN) */ {
    this.decorateUnknown( $row );
  }
}

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.decorateCollapsed = function( $row ) {
  $row.children('td:first').prepend( '<i class="icon-plus"></i>' );
}

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.decorateExpanded = function( $row ) {
  $row.children('td:first').prepend( '<i class="icon-minus"></i>' );
}

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.decorateUnknown = function( $row ) {
  this.decorateCollapsed( $row );
}

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.removeDecoration = function( $row ) {
  $row.find('td:first > i:first').remove();
}
