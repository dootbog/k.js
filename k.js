
export const curry = fn => {
  return function partial(...xs) {
    return xs.length >= fn.length
      ? fn.apply(this, xs)
      :  (...ys) => partial.apply(this, xs.concat(ys))
  }
}

export const assertEq    = curry((a, b) => console.assert(a === b))
export const assertTrue  = assertEq(true)
export const assertFalse = assertEq(false)

export const both = curry((a, b) => a ? b : a)
assertEq(1)(both(1)(1))
assertEq(0)(both(0, ''))
assertTrue(both(true, true))
assertFalse(both(false, true))
assertFalse(both(true, false))
assertFalse(both(false, false))

export const notBoth = curry((a, b) => ! (a && b))
assertTrue(notBoth(0)(0))
assertFalse(notBoth(1)(1))

export const neither = curry((a, b) => ! (a || b))
assertTrue(neither(0)(0))
assertFalse(neither(1,0))

export const either = curry((a, b) => a ? a : b)
assertTrue(either(true, false))
assertTrue(either(false, true))
assertFalse(either(false, false))

export const isFn = a => !!(a && a.constructor && a.call && a.apply)
assertTrue(isFn(()=>1))
assertFalse(isFn({}))
assertTrue(isFn(String))
assertFalse(isFn(JSON))

export const type = a => both(isNaN(a), 'number' === typeof(a)) ? 'nan' : isFn(a) ? a.constructor.name.toLowerCase() : ({}).toString.call(a).slice(8, -1).toLowerCase()
assertEq('null')(type(null))
assertEq('undefined')(type(undefined))
assertEq('nan')(type(NaN))
assertEq('object')(type({}))
assertEq('array')(type([]))
assertEq('number')(type(0))
assertEq('number')(type(new Number(1)))
assertEq('string')(type(''))
assertEq('string')(type(new String('Hello')))
assertEq('boolean')(type(true))
assertEq('boolean')(type(new Boolean(false)))
assertEq('function')(type(()=>1))
assertEq('function')(type(function(){}))
assertEq('function')(type(Number))
assertEq('math')(type(Math))
assertEq('json')(type(JSON))
assertEq('regexp')(type(/a/))
assertEq('generatorfunction')(type(function *() {yield;}))
assertEq('weakmap')(type(new WeakMap()))
assertEq('map')(type(new Map()))
assertEq('error')(type(new ReferenceError()))
assertEq('date')(type(new Date()))

export const first = curry(a => a[0])
assertEq(1)(first([1,2]))
assertEq('h')(first('hi'))

export const car = first

export const init = a => a.slice(0, -1)
assertEq([1,2].length)(init([1,2,3]).length)
assertEq('Hell')(init('Hello'))

export const tail = a => a.slice(1)
assertEq([2,3].length)(tail([1,2,3]).length)
assertEq('ello')(tail('Hello'))

export const cdr = tail

export const last = curry(a => a[a.length-1])
assertEq(2)(last([0,1,2]))

export const add = curry((a, b) => a + b)
assertEq(2)(add(1, 1))
assertEq(2)(add(1)(1))

export const at = curry((a, b) => String(a).split('.').length===1 ? b[a] : a.split('.').reduce((xs, i) => xs && xs[i], b))
assertEq(1)(at(0)([1,2]))
assertEq('e')(at(1)('hello'))
assertTrue(at('active')({active:true, name: 'test'}))

export const call = curry((k, v) => (...xs) => v[k](...xs))
assertEq(Math.abs(-1))(call('abs')(Math)(-1))

export const compose = (...fs) => fs.reduce((f, g) => (...xs) => f(g(...xs)))
assertEq(3)(compose(add(1), add(1))(1))

export const drop = curry((n, a) => a.slice(n < 1 ? n : n * -1))
assertEq(3)(drop(3)([1,2,3,4,5,6]).length)
assertEq([4,5,6].toString())(drop(3)([1,2,3,4,5,6]).toString())
assertEq('World')(drop(5)('Hello World'))

export const eq = curry((a, b) => a === b)
assertTrue(eq(1, 1))
assertTrue(eq('1', '1'))
assertTrue(eq()(1)(1))
assertFalse(eq(1, 0))
assertFalse(eq(1, '1'))

export const fold = curry((f, xs) => tail(xs).reduce(f, first(xs)))
assertEq(6)(fold(add)([1,2,3]))

export const foldr = curry((f, xs) => tail(xs).reduceRight(f, first(xs)))
assertEq(6)(foldr(add)([1,2,3]))

export const forget = curry((xs, y) => xs.reduce((yy, k) => (({[k]: v, ...ys}) => ys)(yy), y))
assertEq('{"a":1,"c":3}')(JSON.stringify(forget(['b','d'], {a:1,b:2,c:3,d:4})))

export const only = curry((xs, y) => xs.reduce((yy, v) => ({...yy, [v] : y[v] }), {[xs[0]]: y[xs[0]]}))
assertEq('{"a":1,"c":3}')(JSON.stringify(only(['a','c'], {a:1,b:2,c:3,d:4})))

export const remove = curry((k, xs) => [...xs.slice(0, k),...xs.slice(k + 1)])
assertEq('["a","b","c"]')(JSON.stringify(remove('b', ['a','b','c'])))

export const insert = curry((k,v,xs) => [...xs.slice(0, k), v, ...xs.slice(k)])
assertEq('["a","b","x","c"]')(JSON.stringify(insert(2, 'x', ['a','b','c'])))

export const gt = (a, b) => b ? a > b : left => left > a
assertTrue(gt(2, 1))
assertTrue(gt(1)(2))
assertFalse(gt(1, 2))

export const gte = (a, b) => b ? a >= b : left => left >= a
assertTrue(gte(2, 1))
assertTrue(gte(1)(2))
assertTrue(gte(2, 2))
assertTrue(gte(2)(2))
assertFalse(gte(1, 2))

export const has = curry((x, y) => x in y)
assertTrue(has(1)([2,3,1]))
assertTrue(has('name')({active:1,name:'Test'}))

export const lt = (a, b) => !!b ? a < b : left => left < a
assertTrue(lt(1, 2))
assertTrue(lt(2)(1))
assertFalse(lt(2, 1))

export const lte = (a, b) => !!b ? a <= b : left => left <= a
assertTrue(lte(1, 2))
assertTrue(lte(2, 2))
assertFalse(lte(3, 2))

export const map = curry((f, xs) => xs.map(f))
assertEq("2,4,6")(map(x=>x*2)([1,2,3]).toString())

export const max = (...xs) => eq(1, xs.length) && eq('array', type(first(xs))) ? Math.max(...first(xs)) : Math.max(...xs)
assertEq(Math.max(1,3,2))(max(1,3,2))

export const min = (...xs) => eq(1, xs.length) && eq('array', type(first(xs))) ? Math.min(...first(xs)) : Math.min(...xs)
assertEq(Math.min(1,3,2))(min(1,3,2))

export const no = () => false
assertFalse(no())

export const not = curry(a => !a)
assertTrue(not(false))
assertFalse(not(true))

export const pipe = (...fs) => fs.reduce((f, g) => (...xs) => g(f(...xs)))
assertEq(3)(pipe(add(1), add(1))(1))

export const put = (k, v, a) => eq('array')(type(a)) ? gt(k,0) ? [...a.slice(0, k), ...v, ...a.slice(k+1)] : [...v, ...a.slice(k+1)] : {...a, [k]:v}
assertEq('a,2,3')(put(0,"a",[1,2,3]).toString())
assertEq('1,a,3')(put(1,"a",[1,2,3]).toString())
assertEq('1,2,a')(put(2,"a",[1,2,3]).toString())
assertEq('1,a,b,3')(put(1,["a","b"],[1,2,3]).toString())
assertEq('4,2,3')(put(0,[4],[1,2,3]).toString())
assertEq('{"a":1,"d":4}')(JSON.stringify(put('d',4,{a:1})))
assertEq('{"a":2}')(JSON.stringify(put('a',2,{a:1})))

export const range = curry((a, b) => Array.from({length: b}, (v, k) => k + a))
assertEq('1,2,3,4,5')(range(1,5).toString())

export const reverse = a => [...a].reverse()
assertEq('3,2,1')(reverse([1,2,3]).toString())

export const sort = a => [...a].sort()
assertEq('1,2,3')(sort([3,1,2]).toString())

export const spread = curry((a, b) => eq('array')(type(b)) ? [...a, ...b] : { ...a, ...b })
assertEq('{"a":1,"b":2}')(JSON.stringify(spread({a:1}, {b:2})))
assertEq('{"a":2,"b":2}')(JSON.stringify(spread({a:1}, {a:2,b:2})))
assertEq('["a","b"]')(JSON.stringify(spread(["a"], ["b"])))

export const take = curry((i, a) => a.slice(0, i))
assertEq(3)(take(3)([1,2,3,4,5,6]).length)
assertEq("1,2,3")(take(3)([1,2,3,4,5,6]).toString())
assertEq('Hell')(take(4)('Hello World'))

export const truthy = a => !!a
assertTrue(truthy('yes'))
assertTrue(truthy(true))
assertTrue(truthy([]))
assertFalse(truthy(''))
assertFalse(truthy(0))
assertFalse(truthy(false))

export const yes = () => true
assertTrue(yes())

export function observable(x) {
  const F = []
  const signal = x => F.forEach(f => f(x))
  function observer(y) {
    if (arguments.length && y !== x) {
      x = y
      signal(y)
    }
    return x
  }
  observer.observe = f => F.push(f)
  return observer
}
assertEq('function')(type(observable()))
assertEq(1)(observable(1)())

export function effect(f, xs) {
  var a = observable(f());
  xs.forEach(x => x.observe(() => a(f())))
  return a
}

/*
DOM section
*/
export const q = (a, b) => !b && 'string'===type(a) ? document.querySelector(a) : a.querySelector(b)
export const Q = (a, b) => !b && 'string'===type(a) ? document.querySelectorAll(a) : a.querySelectorAll(b)

export const e = curry((a, b, c) => {
  const x = document.createElement(a)
  if (eq(type(b))('object')) {
    map((xs) => x.setAttribute(first(xs), last(xs)))(Object.entries(b))
  }
  type(c).includes('element')
    ? x.append(c)
    : eq('array')(type(c))
      ? x.append(...c)
      : x.appendChild(document.createTextNode(c))
  return x
})
assertEq('Test')(e('div')({})('Test').innerHTML)
assertEq('app')(e('div')({id:'app'})('').id)
