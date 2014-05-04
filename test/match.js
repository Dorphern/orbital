
var Comet = require('../'),
    assert = require('chai').assert;
  
var Match = Comet.Match;

describe('Match', function() {
  
  describe('check()', function() {
    it('can check Strings', function() {
      assert.isTrue(Match.check('native String', String));
      assert.isFalse(Match.check(false, String));
    });
    
    it('can check Numbers', function() {
      assert.isTrue(Match.check(3289, Number));
      assert.isFalse(Match.check(false, Number));
    });

    it('can check Boolean', function() {
      assert.isTrue(Match.check(true, Boolean));
      assert.isTrue(Match.check(false, Boolean));
      assert.isFalse(Match.check(3234, Boolean));
    });
    
    it('can check Functions', function() {
      function someFunc() {}
      assert.isTrue(Match.check(someFunc, Function));
      assert.isFalse(Match.check(false, Function));
    });
    
    it('can check Undefined', function() {
      var undef, def = 1;
      assert.isTrue(Match.check(undef, Match.Undefined));
      assert.isFalse(Match.check(def, Match.Undefined));
    });

    it('can check Null', function() {
      assert.isTrue(Match.check(null, Match.Null));
      assert.isFalse(Match.check(2398, Match.Null));
    });

    it('can check Nullables', function() {
      var undef;
      assert.isTrue(Match.check(null, Match.Nullable(String)));
      assert.isTrue(Match.check('somestring', Match.Nullable(String)));
      assert.isTrue(Match.check(undef, Match.Nullable(Match.Undefined)));
      assert.isFalse(Match.check(234, Match.Nullable(String)));
    });
  });
});

