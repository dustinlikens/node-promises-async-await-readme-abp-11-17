# Node Module Exports Readme

## Objectives

1. Export a Javascript Object to `module`
2. `require` an export from another file.

## What is a Node Module?

A module represents single, exportable, unit of code. You can think of a module as a unit of code that is defined in one file but can be loaded into another.

**File: greeting.js**
```js
const sayHello = function(){
  console.log("Hello, World!")
}
```

The file `greeting.js` defines a constant `sayHello` that is a function to log `Hello, World!`. Should any other part of our application require this utility, `greeting.js` must make it explicitly available by exporting it into a global object that Node makes available to the entire process called `module`.

Within any Node application, the `module` object contains information about the current scope and environment.

**File: greeting.js**
```js
const sayHello = function(){
  console.log("Hello, World!")
}

console.log(module.filename);  
console.log(module.id);  
console.log(module.exports);  
```

If we ran that file through Node we would see:
```
~/node-module-exports-readme/greeting.js
.
{}
```

As you can see, `module` is an object like any other in javascript, with properties relating to the current application process. The full [`module` documentation](https://nodejs.org/api/modules.html) is available.

What we care most about is the `exports` property of `module`.

## `module.exports`

In the example above, our `greeting.js` defines a unit of work, the `sayHello` `function`.

**File: greeting.js**
```js
const sayHello = function(){
  console.log("Hello, World!")
}
```

If we had another file in our application, `cli.js`, that wanted to load and use the `sayHello` function, 2 things would need to happen.

1. `greeting.js` must explicitly export the function `sayHello` to `module.exports`.
2. `cli.js` must `require('greeting.js')` and give the exported function a local reference.

### Exporting to `module.exports`.

To export `sayHello`, or any other object in javascript, and make it available to the larger node application, we use `module.exports` in the following manner.

**File: greeting.js**
```js
const sayHello = function(){
  console.log("Hello, World!")
}

module.exports = sayHello
```

The last line `module.exports = sayHello` allows this file to load `sayHello` into the main module of any other file that `require`s it.

### Requiring from `module.exports`

In `cli.js`, to load and use the exported function `sayHello`, we would use the CommonJS `require` syntax.

**File: cli.js**
```js
const sayHello = require('./greeting.js')

sayHello() // Hello, World!
```

We supply a path to the `greeting.js` file relative to `cli.js`. Because that file defines the export to be the `sayHello` function, `require` will automatically take that main export and assign it locally to `sayHello` in `cli.js`. We could have called the local reference to the export from `greeting.js` anything, but it makes sense to name it the same if possible.

![Module Exports](https://cl.ly/ngj3/Image%202017-11-13%20at%205.07.38%20PM.png)

## Advanced Exports and Requires

There is more advanced usage of exports and requires but this simple single export and require is enough for now.

## Resources

* [Understanding module.exports in Node](https://www.sitepoint.com/understanding-module-exports-exports-node-js/)
* [How to use module.exports](http://stackabuse.com/how-to-use-module-exports-in-node-js/)
* [Understanding module.exports in Node](https://www.sitepoint.com/understanding-module-exports-exports-node-js/)

