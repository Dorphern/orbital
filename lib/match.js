
var Match = {};

Match.check = function(value, type) {
  var checkMethod = findCheckMethod(type);
  return checkMethod !== null && checkMethod(value, type);
};

Match.checkTuple = function(value, types) {
  if (!isArray(types)) 
    throw new Error('Second argument has to be an array');
  return Match.check(value, Match.Tuple.apply(null, types));
};

/* Type Checks
 *==================================================*/
var Check = {};

Check.String = function(v) {
  return typeof(v) === 'string'; 
}; 

Check.Number = function(v) {
  return typeof(v) === 'number';
};

Check.Boolean = function(v) {
  return typeof(v) === 'boolean';
};

Check.Function = function(v) {
  return typeof(v) === 'function';
};

Check.Undefined = function(v) {
  return typeof(v) === 'undefined';
};

Check.Null = function(v) {
  return v === null;
};

Check.Any = function() {
  return true;
};

Check.Object = function(value, type) {
  var typeLength = 0, valueLength = 0;
  for (var key in type) {
    if (typeof value[key] === 'undefined') return false;
    if (Match.check(value[key], type[key]) === false) return false;
    typeLength++;
  }
  for (var key in value) valueLength++;
  if (typeLength !== valueLength) return false;
  return true;
};

Check.Array = function(v, type) {
  if (type.length > 1) 
    throw new Error('You can\'t check for multiple types in arrays');
  if (isArray(v) === false) return false;

  // if the length of either the type or value is 0 we don't need to check
  if (v.length === 0 || type.length === 0 || type === Array) return true;
  var innerType = type[0];
  for (var i = 0; i < v.length; i++) {
    if (Match.check(v[i], innerType) === false) return false;
  }
  return true;
};

Check.Tuple = function(args) {
  var types = arguments || [];

  return function(values) {
    if (types.length !== values.length || !isArray(values)) return false;
    for (var i = 0; i < types.length; i++) {
      if ( !Match.check(values[i], types[i]) ) return false;
    }
    return true;
  };
}

// Makes a typecheck accept null as an alternative
Check.Nullable = function(type) {
  return function(value) {
    return typeIndex.Null(value) || 
      Match.check(value, type);
  };
};

Check.InstanceOf = function(type) {
  return function(value) {
    return typeof type !== 'undefined' && typeof type === 'function'
      && value instanceof type;
  };
};


/* Helper Checking Methods
 * ===============================================*/
var isArray = function(v) {
  return typeof(v) === 'object' && v.constructor.name === 'Array';
};

var isObject = function(v) {
  return typeof(v) === 'object' && !isArray(v);
};

/* Type Index
 * ===============================================*/
var typeIndex = {
  String: Check.String,
  Number: Check.Number,
  Boolean: Check.Boolean,
  Function: Check.Function,
  Undefined: Check.Undefined,
  Null: Check.Null,
  Object: Check.Object,
  Array: Check.Array
};

var findCheckMethod = function(type) {
  var checkMethod = null;
  var typeName = typeof(type) !== 'undefined' && type.name; 
  if (isArray(type)) typeName = 'Array';
  else if (isObject(type)) typeName = 'Object';
  if (typeof type === 'undefined') 
    throw new Error('Type is undefined');
  if (typeIndex[typeName]) {
    checkMethod = typeIndex[typeName];
  } else if (typeof(type) === 'function') {
    checkMethod = type;
  }
  return checkMethod;
};


// Exposing custom check methods
Match.Undefined = Check.Undefined;
Match.Null = Check.Null;
Match.Any = Check.Any;
Match.Nullable = Check.Nullable;
Match.Tuple = Check.Tuple;
Match.InstanceOf = Check.InstanceOf;


module.exports = Match;

