/**
 * @see "http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/"
 */

// the semi-colon is a safety net against concatenated scripts and/or other
// plugins are not closed properly.
;

goog.require('goog.structs.TreeNode');

/**
 * @param {function (new:jQuery, (Object|null|string)=, (Object.<(function (jQuery.event=): ?|string)>|null)=): jQuery} $
 * @param {!Window} window
 * @param {!HTMLDocument} document
 * @param {?=} undefined
 */
(function ( $, window, document, undefined ) {

// define your widget under a namespace of your choice
//  with additional parameters e.g.
// $.widget( "namespace.widgetname", (optional) - an
// existing widget prototype to inherit from, an object
// literal to become the widget's prototype );

$.widget( "bwoester.simpleTreeGrid" , {

  //Options to be used as defaults
  options: {
    /**
     * Used to build model. For example ['id', 'name'] will result in models
     * with id and name attribute.
     */
    columns: [],
    /**
     * Used to initialize tree grid from existing, fully expanded table.
     * @todo - could be an initilaizer plugin
     */
    depthList: []
  },

  _rootNode: null,

  /**
   * Setup widget (eg. element creation, apply theming bind events etc.)
   * @this {jQuery.bwoester.simpleTreeGrid}
   */
  _create: function () {

    this._rootNode = new goog.structs.TreeNode( '_root', null );

    var lastNode  = this._rootNode;
    var lastDepth = -1;
    var self = this;
    var rows = this.element.find('> tbody > tr');

    rows.each( function(i)
    {
      var row   = $(this);
      var model = {};

      row.children('td').each(function(n)
      {
        // TODO: we don't want the displayed value in our models. Instead, we
        //       need the raw data (iso formatted date time string vs.
        //       localized display)
        //       - provide encode/ decode methods for columns
        //       - or provide more raw data to the initializer
        //       - or plugin? For simple use case (read only, no lazy loading)
        //         it is okay...
        model[ self.options.columns[n] ] = $(this).text();
      });

      var node  = new goog.structs.TreeNode( null, model );
      var depth = self.options.depthList[i];

      // Depth increased. Add new node as child of lastNode
      if (depth > lastDepth)
      {
        lastNode.addChild( node );
      }
      // Depth remains the same. Add new node as sibling of lastNode
      else if (depth === lastDepth)
      {
        lastNode.getParent().addChild( node );
      }
      // Depth decreased. Add new node as sibling of lastNode's parent
      else /* if (depth < lastDepth) */
      {
        lastNode.getParent().getParent().addChild( node );
      }

      // attach the node to the row.
      row.data( self.widgetName, {
        'node'    : node,
        'expanded': true  // TODO not necessarily right. Maybe better introduce tri-state.
      });

      lastNode  = node;
      lastDepth = depth;
    });

    this.element.children('tbody').dblclick( function(eventObject) {
      self.toggle( $(eventObject.target).closest('tr') );
    });

    // TODO: tree built, care for toggle branches

    // _create will automatically run the first time
    // this widget is called. Put the initial widget
    // setup code here, then you can access the element
    // on which the widget was called via this.element.
    // The options defined above can be accessed
    // via this.options this.element.addStuff();
  },

  // Destroy an instantiated plugin and clean up
  // modifications the widget has made to the DOM
  destroy: function () {

      // this.element.removeStuff();
      // For UI 1.8, destroy must be invoked from the
      // base widget
      $.Widget.prototype.destroy.call(this);
      // For UI 1.9, define _destroy instead and don't
      // worry about
      // calling the base widget
  },

  // TODO another extension point for plugins:
  // - hide children?
  // - remove them from DOM?
  // - apply effects?
  toggle: function( rows ) {
    var self = this;
    rows.each( function(n) {
      var row     = $(this);
      var rowData = row.data( self.widgetName );

      if (rowData['expanded']) {
        self._collapse( row );
      } else {
        self._expand( row );
      }
    });
  },

  _collapse: function( row ) {
    var rowData = row.data( this.widgetName );
    var node    = rowData['node'];
    var i       = 0;

    (function hideNextRow() {

      row = row.next();

      var columns = row.children('td');
      columns.wrapInner('<div style="display: block;" />');

      var divs = row.find('> td > div');
      $.when( divs.slideUp( 'fast') ).then(function()
      {
        row.hide();
        divs.contents().unwrap();

        // TODO fix - need recursive child count
        //      what about already hidden rows? (collapsed sub branches)
        if (++i < node.getChildCount()) {
          hideNextRow();
        } else {
          rowData['expanded'] = false;
        }
      });

    })();

//    row = row.next();
//    for (var i = 0; i < node.getChildCount(); i++) {
//      row.hide('fast');
//      row = row.next();
//    }

  },

  _expand: function( row ) {
    var rowData = row.data( this.widgetName );
    var node    = rowData['node'];

    row = row.next();
    for (var i = 0; i < node.getChildCount(); i++) {
      row.show('fast');
      row = row.next();
    }

    rowData['expanded'] = true;
  },

  /**
   * @this {jQuery.bwoester.simpleTreeGrid}
   */
  methodB: function ( event ) {
      //_trigger dispatches callbacks the plugin user
      // can subscribe to
      // signature: _trigger( "callbackName" , [eventObject],
      // [uiObject] )
      // eg. this._trigger( "hover", e /*where e.type ==
      // "mouseenter"*/, { hovered: $(e.target)});
      var value = 42;
      this._trigger('methodA', event, {
          key: value
      });
  },

  methodA: function ( event ) {
      var value = 42;
      this._trigger('dataChanged', event, {
          key: value
      });
  },

  // Respond to any changes the user makes to the
  // option method
  _setOption: function ( key, value ) {
    switch (key)
    {
    case "someValue":
        //this.options.someValue = doSomethingWith( value );
        break;
    default:
        this.options[ key ] = value;
        break;
    }

    // For UI 1.8, _setOption must be manually invoked
    // from the base widget
    $.Widget.prototype._setOption.apply( this, arguments );
    // For UI 1.9 the _super method can be used instead
    // this._super( "_setOption", key, value );
  }
});

})( jQuery, window, document );
