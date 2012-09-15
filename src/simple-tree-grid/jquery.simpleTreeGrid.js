/**
 * @see "http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/"
 */

// the semi-colon is a safety net against concatenated scripts and/or other
// plugins are not closed properly.
;

// To calculate/ refresh/ update the dependency file, use
//
// > cd jquery-simple-tree-grid\src
// jquery-simple-tree-grid\src> python.exe closure-library\closure\bin\build\depswriter.py \
// jquery-simple-tree-grid\src> --root_with_prefix="simple-tree-grid ../../../simple-tree-grid" \
// jquery-simple-tree-grid\src> > simple-tree-grid\deps.js


goog.require('bwoester.Factory');
goog.require('bwoester.simpleTreeGrid.BranchDecorator');
goog.require('bwoester.simpleTreeGrid.BranchToggler');
goog.require('bwoester.simpleTreeGrid.RowData');
goog.require('bwoester.TreeNode');



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
    model: {
      id: undefined
    },
    /**
     * Property name of the models id. Defaults to 'id', but could also be
     * something like 'absolutePath' for filenames.
     */
    modelIdProperty: 'id',
    /**
     * Used to build model. For example ['id', 'name'] will result in models
     * with id and name attribute.
     */
    columns: [],
    /**
     * Used to initialize tree grid from existing, fully expanded table.
     * @todo - could be an initilaizer plugin
     */
    depthList: [],

    components: {
      /**
       * Plugin that decorates collapsed/ expanded branches with visual hints.
       * If not set, bwoester.simpleTreeGrid.BranchDecorator will be used as
       * default. This class will use twitter bootstrap's markup for +/- icons.
       * (an empty i-element with a certain class is inserted at the beginning
       * of the first column of the row)
       */
      branchDecorator: {
        'class': 'bwoester.simpleTreeGrid.BranchDecorator'
      },

      /**
       * Component that toggles the branches.
       * If not set, bwoester.simpleTreeGrid.BranchToggler will be used as
       * default. This class shows and hides branches by detaching and
       * re-inserting related rows. This way, there are no problems with
       * striped tables, where it is important that collapsed branches always
       * contain an even number of children (to ensure the collapsed branch and
       * his next sibling will be displayed in different colors).
       * However, alternative implementations might choose to toggle branches
       * by only hiding and showing rows while leaving them in the DOM.
       */
      branchToggler: {
        'class': 'bwoester.simpleTreeGrid.BranchToggler'
      }
    }

  },

  _rootNode: null,
  _idCounter: 0,
  _rows: {},

  _getId: function() {
    return this._idCounter++;
  },

  /**
   * Setup widget (eg. element creation, apply theming bind events etc.)
   * @this {jQuery.bwoester.simpleTreeGrid}
   */
  _create: function () {

    var self = this;

    this._rootNode = new bwoester.TreeNode( '_root', null );

    for (var componentId in this.options.components)
    {
      var config    = this.options.components[ componentId ];
      var className = config['class'];
      var component = bwoester.Factory.create( className );

      delete config['class'];
      for (var propertyId in config) {
        component[ propertyId ] = config[ propertyId ];
      }

      component.init( self );

      this.options.components[ componentId ] = component;
    }

    // TODO: delegate work to a Reader (html -> data structure)
    var lastNode  = this._rootNode;
    var lastDepth = -1;
    var rows      = this.element.find('> tbody > tr');

    var $rows = [];
    rows.each( function(i, row) {
      $rows.push( $(row) );
    });

    var aExpandedNodes = [];
    $($rows).each( function(i, $row)
    {
      // Create a new model. Extend from options.model to make sure the new
      // model has all properties and default values that have been specified
      // by the user.
      var model = $.extend( {}, self.options.model );

      // read data from table cells and fill model
      $row.children('td').each( function(n,td)
      {
        // TODO: we don't want the displayed value in our models. Instead, we
        //       need the raw data (iso formatted date time string vs.
        //       localized display)
        //       - provide encode/ decode methods for columns
        //       - or provide more raw data to the initializer
        //       - or plugin? For simple use case (read only, no lazy loading)
        //         it is okay...
        model[ self.options.columns[n] ] = $(td).text();
      });

      // ensure the model has an id, generate one if it was not provided in
      // table cells.
      if (model[ self.options.modelId ] == undefined) {
        model[ self.options.modelIdProperty ] = self._getId();
      }

      var node  = new bwoester.TreeNode( null, model );
      var depth = self.options.depthList[i];

      // Depth increased. Add new node as child of lastNode
      // Flag lastNode as being expanded
      if (depth > lastDepth)
      {
        lastNode.addChild( node );
        aExpandedNodes.push( i - 1 );
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

      var rowData = new bwoester.simpleTreeGrid.RowData();
      rowData.modelIdProperty = self.options.modelIdProperty;
      rowData.dataNode        = node;
      rowData.expanded        = bwoester.Ternary.UNKNOWN;

      // attach the node to the row.
      $row.data( self.widgetName, rowData );

      lastNode  = node;
      lastDepth = depth;
    });

    // aExpandedNodes[0] will always be -1, our root node, which is expanded
    // we don't support toggling the root node, so we start at index 1
    for (var i = 1; i < aExpandedNodes.length; ++i)
    {
      var rowIndex  = aExpandedNodes[i];
      var $row      = $rows[rowIndex];
      var rowData   = $row.data( self.widgetName );

      rowData.expanded = bwoester.Ternary.TRUE;
    }

    // Insert rows in the _rows hash, for accessing them by id.
    // TODO: this prevents the tree grid from displaying graphs. Every data
    //       node can only be associated with one row...
    $($rows).each( function(index,$row) {
      var rowData = $row.data( self.widgetName );
      self._rows[ rowData.getId() ] = $row[0];
    });

    // The exiting rows have been prepared. Fire newRow event for each, to
    // allow plugins to do their work.
    $($rows).each( function(index,$row) {
      self.element.trigger( 'newRow.simpleTreeGrid', [ $row ] );
    });

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

  toggle: function( $rows ) {
    var self = this;
    $rows.each( function(index,row) {
      self.element.trigger( 'toggle.simpleTreeGrid', [ row ] );
    });
  },

  getRowByNode: function( node ) {
    var model = node.getValue();
    return this.getRowByModel( model );
  },

  getRowByModel: function( model ) {
    var id = model[ this.options.modelIdProperty ];
    return this.getRowById( id );
  },

  getRowById: function( id ) {
    return this._rows[ id ];
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
