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
bwoester.simpleTreeGrid.BranchDecorator.registeredStyles_ = [];

/**
 * @private
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.simpleTreeGrid_ = null;

/**
 * Html string to insert at the beginning of the first column of the row.
 * Should visualize a collapsed branch. Might be a "+".
 * @public
 * @type {string}
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.collapsedDecoration = ''
  + '<div class="simpleTreeGrid-collapsedRow"></div>';

/**
 * Html string to insert at the beginning of the first column of the row.
 * Should visualize an expanded branch. Might be a "-".
 * @public
 * @type {string}
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.expandedDecoration = ''
  + '<div class="simpleTreeGrid-expandedRow"></div>';

/**
 * jQuery selector to match the decoration. Will be used to remove decoration
 * when the branch is toggled as well as to bind a "clicked" event handler to
 * the decoration.
 * @public
 * @type {string}
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.decorationSelector = ''
  + 'div.simpleTreeGrid-collapsedRow:first,'
  + 'div.simpleTreeGrid-expandedRow:first';

/**
 * @public
 */
bwoester.simpleTreeGrid.BranchDecorator.prototype.init = function( simpleTreeGrid )
{
  var self = this;

  self.simpleTreeGrid_ = simpleTreeGrid;

  var style = this.getStyle();
  if (bwoester.simpleTreeGrid.BranchDecorator.registeredStyles_.indexOf(style) === -1)
  {
    bwoester.simpleTreeGrid.BranchDecorator.registeredStyles_.push( style );
    $('head').append( style );
  }

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
bwoester.simpleTreeGrid.BranchDecorator.prototype.getStyle = function()
{
  var style = ''
  + '<style type="text/css">'
  + '  div.simpleTreeGrid-collapsedRow {'
  + '    display: inline-block;'
  + '    vertical-align: middle;'
  + '    margin-right: 2px;'
  + '    border-color: transparent transparent transparent #AAA;'
  + '    border-style: solid;'
  + '    border-width: 6px;'
  + '    height: 0;'
  + '    width: 0;'
  + '    cursor: pointer;'
  + '  }'
  + ''
  + '  div.simpleTreeGrid-collapsedRow:hover {'
  + '    border-color: transparent transparent transparent #777;'
  + '  }'
  + ''
  + '  div.simpleTreeGrid-expandedRow {'
  + '    display: inline-block;'
  + '    vertical-align: middle;'
  + '    margin-right: 6px;'
  + '    border-color: transparent #AAA #AAA transparent;'
  + '    border-style: solid;'
  + '    border-width: 5px;'
  + '    height: 0;'
  + '    width: 0;'
  + '    cursor: pointer;'
  + '  }'
  + ''
  + '  div.simpleTreeGrid-expandedRow:hover {'
  + '    border-color: transparent #777 #777 transparent;'
  + '  }'
  + '</style>';

  return style;
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
    .prepend( self.collapsedDecoration )
    .children( self.decorationSelector )
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
    .prepend( self.expandedDecoration )
    .children( self.decorationSelector )
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
  var selector = 'td:first > ' + this.decorationSelector;
  $row.find(selector).remove();
}
