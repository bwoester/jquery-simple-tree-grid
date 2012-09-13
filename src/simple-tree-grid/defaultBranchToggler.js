
goog.provide('bwoester.simpleTreeGrid.DefaultBranchToggler');

/**
 * @constructor
 */
bwoester.simpleTreeGrid.DefaultBranchToggler = function() {
}

/**
 * @public
 */
bwoester.simpleTreeGrid.DefaultBranchToggler.prototype.init = function( simpleTreeGrid ) {

  simpleTreeGrid.element.children('tbody').dblclick( function(eventObject) {
    simpleTreeGrid.toggle( $(eventObject.target).closest('tr') );
  });

}
