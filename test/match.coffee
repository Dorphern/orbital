
Comet   = require('../')
assert  = require('chai').assert
  
Match = Comet.Match

describe 'Match', ->
  
  describe 'check()', ->
    it 'can check Strings', ->
      assert.isTrue(Match.check('native String', String))
      assert.isFalse(Match.check(false, String))
    
    it 'can check Numbers', ->
      assert.isTrue(Match.check(3289, Number))
      assert.isFalse(Match.check(false, Number))

    it 'can check Boolean', ->
      assert.isTrue(Match.check(true, Boolean))
      assert.isTrue(Match.check(false, Boolean))
      assert.isFalse(Match.check(3234, Boolean))
    
    it 'can check Functions', ->
      someFunc = (-> )
      assert.isTrue(Match.check(someFunc, Function))
      assert.isFalse(Match.check(false, Function))
    
    it 'can check Undefined', ->
      undef = undefined
      def = 1
      assert.isTrue(Match.check(undef, Match.Undefined))
      assert.isFalse(Match.check(def, Match.Undefined))

    it 'can check Null', ->
      assert.isTrue(Match.check(null, Match.Null))
      assert.isFalse(Match.check(2398, Match.Null))
    
    it 'can check Nullables', ->
      undef = undefined
      assert.isTrue(Match.check(null, Match.Nullable(String)))
      assert.isTrue(Match.check('somestring', Match.Nullable(String)))
      assert.isTrue(Match.check(undef, Match.Nullable(Match.Undefined)))
      assert.isFalse(Match.check(234, Match.Nullable(String)))

    it 'can check Arrays', ->
      assert.isTrue(Match.check([], [String]))
      assert.isTrue(Match.check([2, 4], []))
      assert.isTrue(Match.check([2, 'somestring'], []))
      assert.isTrue(Match.check([2, 'str'], Array))
      assert.isTrue(Match.check(['one', 'two'], [String]))
      assert.isTrue(Match.check(['one', 'two'], Array(String)))

      assert.isFalse(Match.check([2, 5], [String]))
      assert.isFalse(Match.check([2, 'str'], [String]))
      assert.isFalse(Match.check('somestr', [String]))

    it 'can check Tuples', ->
      args = ['somestr', 123]
      assert.isTrue(Match.check(args, Match.Tuple(String, Number)))
      assert.isFalse(Match.check(args, Match.Tuple(Number)))
      assert.isFalse(Match.check(args, Match.Tuple(Number, String)))
      assert.isFalse(Match.check(args, Match.Tuple(String, Number, Boolean)))
      assert.isFalse(Match.check(args, Match.Tuple()))
    
    it 'can check instances of classes', ->
      Cls1 = (-> )
      Cls2 = (-> )
      inst1 = new Cls1()
      inst2 = new Cls2()
      
      assert.isTrue(Match.check(inst1, Match.InstanceOf(Cls1)))
      assert.isTrue(Match.check(inst1, Match.InstanceOf(Object)))
      assert.isFalse(Match.check(inst1, Match.InstanceOf(inst1)))
      assert.isFalse(Match.check(inst1, Match.InstanceOf(Cls2)))


    it 'can check Objects', ->
      obj =
        str: "somestr"
        num: 123
        bool: true

      assert.isTrue(Match.check(obj, {
        str: String,
        num: Number,
        bool: Boolean
      }))

      assert.isFalse(Match.check(obj, {
        str: Function,
        num: Number,
        bool: Boolean
      }))

      assert.isFalse(Match.check(obj, {
        num: Number,
        bool: Boolean
      }))
      
      
    it 'can mix Tuple, Arrays and Object testing', ->
      obj =
        one: [2, 4, 6]
        two: ["string", 4, true]
        three: { one: 3, two: true }

      assert.isTrue(Match.check(obj, {
        one: [Number],
        two: Match.Tuple(String, Number, Boolean),
        three: { one: Number, two: Boolean }
      }))
      
      assert.isFalse(Match.check(obj, {
        one: [Number],
        two: Match.Tuple(String, Number, Boolean),
        three: { one: Number, two: String }
      }))

      assert.isFalse(Match.check(obj, {
        one: [Number],
        three: { one: Number, two: Boolean }
      }))

  
  describe 'checkTuple()', ->
    args = ['somestr', 123]
    assert.isTrue(Match.checkTuple(args, [String, Number]))
    assert.isFalse(Match.checkTuple(args, [Number, String]))



