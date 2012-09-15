goog.provide('bwoester.Factory');



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



/**
 * @constructor
 */
bwoester.Factory = function() {
}

///////////////////////////////////////////////////////////////////////////////

/**
 * @private
 * @see "http://stackoverflow.com/questions/1366127/instantiate-a-javascript-object-using-a-string-to-define-the-class-name#answer-2441972"
 */
bwoester.Factory.prototype.stringToFunction_ = function(str)
{
  var arr = str.split(".");

  var fn = (window || this);
  for (var i = 0, len = arr.length; i < len; i++) {
    fn = fn[arr[i]];
  }

  if (typeof fn !== "function") {
    throw new Error("function not found");
  }

  return  fn;
};

///////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 */
bwoester.Factory.FactoryCreatedInstance = function() {};

///////////////////////////////////////////////////////////////////////////////

/**
 * @private
 */
bwoester.Factory.instance_ = null;

///////////////////////////////////////////////////////////////////////////////

/**
 * @public
 */
bwoester.Factory.instance = function() {
  if (!bwoester.Factory.instance_) {
    bwoester.Factory.instance_ = new bwoester.Factory();
  }
  return bwoester.Factory.instance_;
}

///////////////////////////////////////////////////////////////////////////////

/**
 * @public
 */
bwoester.Factory.create = function( className, opt_args )
{
  var fn = bwoester.Factory.instance().stringToFunction_( className );

  // @see "http://stackoverflow.com/questions/1959247/javascript-apply-on-constructor-throwing-malformed-formal-parameter#answer-4019664"
  var applySecond = function()
  {
    return function( ctor, args )
    {
      bwoester.Factory.FactoryCreatedInstance.prototype = ctor.prototype;
      var instance = new bwoester.Factory.FactoryCreatedInstance();
      ctor.apply( instance, args );
      return instance;
    }
  }();

  return applySecond( fn, opt_args );
}

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
