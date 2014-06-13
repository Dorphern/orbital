
Orbital = require('../')
assert  = require('chai').assert
  
Reactive = Orbital.Reactive

describe 'Reactive', ->
  
  react = null

  beforeEach ->
    react = new Reactive()


  it 'can init with a value', ->
    r = new Reactive(4)
    assert(r.get() == 4)

  describe 'get()', ->
    it 'changes when set', ->
      initVal = react.get()
      react.set(5)
      assert(react.get() == 5 && initVal != react.get())

  describe 'onchange()', ->
    it 'calls all bound methods', ->
      somevar = null
      react.onchange((v) -> somevar = v)
      react.set(100)
      assert(somevar == 100)

  describe 'lift()', ->
    it 'lifts a function', ->
      area = Reactive.lift((w, h) -> w * h)
      width = new Reactive(3)
      height = new Reactive(5)
      areaLifted = area(width, height)
      assert(areaLifted.get() == 15, "should equal 15")
      width.set(5)
      assert(areaLifted.get() == 25, "should equal 25")
      height.set(10)
      assert(areaLifted.get() == 50, "should equal 50")


  describe 'map()', ->
    it 'lifts itself immediately', ->
      v = new Reactive('one two three four five six')
      asList = v.map((t) -> t.split(' '))
      assert.sameMembers(asList.get(),
        ['one', 'two', 'three', 'four', 'five', 'six'])

      v.set('first second third')
      assert.sameMembers(asList.get(), ['first', 'second', 'third'])
      
