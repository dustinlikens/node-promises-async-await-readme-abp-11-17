# Node Promises with `async` and `await`

## Objectives

1. Understand the asynchronous nature of Javascript.
2. Use a `Promise` to create an asynchronous handler.
3. Use `await` and `async` to handle asynchronous code.

## Asynchronous Javascript

Javascript is an asynchronous language which means that code does not execute linearly and if one line of code has logic that might not resolve immediately, rather than wait for that resolution, the interpreter will continue to evaluate the rest of the code.

**File: synchronousExample.js**
```js
function getData(){
  console.log("2. Returning instantly available data.")
  return [{name: "Avi"}, {name: "Grace"}]
}

function main(){
  console.log("1. Starting Script")
  const data = getData()
  console.log(`3. Data is currently ${JSON.stringify(data)}`)
  console.log("4. Script Ended")    
}

main();
```

In the script above, we have our main program wrapped in a function `main` which we envoke immediately after defining it. The `console.log`s represent the linearity of the script. When we execute it, the output will be:

```
// ♥ node synchronousExample.js 
1. Starting Script
2. Returning instantly available data.
3. Data is currently [{"name":"Avi"},{"name":"Grace"}]
4. Script Ended
```

As you can see, the script executes entirely linearly. Since the data in `getData` is instantly available, javascript doesn't have to wait for anything and everything just works.

*Note: `JSON.stringify(data)` just makes it so that the data object log nicely as: `[{"name":"Avi"},{"name":"Grace"}]`*

However often in javascript, data is coming from a source not instantly available, either an HTTP request via AJAX or a Database request. We're going to simulate having to wait for data using the [`setTimeout`](https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args) function in javascript. `setTimeout` accepts a callback function that it will execute after a delay you specific.

**`setTimeout Example`**
```js
console.log("The next message will appear after 1000 milliseconds")
setTimeout(function(){
  console.log("We just waited 1000 milliseconds")
}, 1000)
```

If we add a `setTimeout` to the `getData` function, everything goes wrong.

**File: asynchronousExample.js**
```js
function getData(){
  console.log("2. Getting data from internet, please wait.")
  return setTimeout(function(){
    console.log("3. Returning data from internet after 1000 milliseconds.")
    return [{name: "Avi"}, {name: "Grace"}]
  }, 1000)
}

function main(){
  console.log("1. Starting Script")
  const data = getData()
  console.log(`4. Data is currently ${data}`)
  console.log("5. Script Ended")    
}

main();
```

The goal is the same, to have `getData` return the JSON data, but this time, only after 1000 milliseconds. Running this script produces a timeline of issues.

```
// ♥ node asynchronousExample.js 
1. Starting Script
2. Getting data from internet, please wait.
4. Data is currently [object Object]
5. Script Ended
3. Returning data from internet after 1000 milliseconds.
```

We can see that the execution order is no longer linear. Javascript did not wait for the call to `getData` to fully resolve before continuing to interpret the rest of the program. We wanted `data` to be our JSON object, but instead, we got some unidentified Javascript object. The script thought it ended before it actually did and finally, the `data` was returned, much too late, in fact, we never even really see it available in `main`.

This is the asynchronous nature of javascript and to remedy it so that our scripts can wait for data to be returned we need to learn about `Promise`s.

## A Javascript `Promise`

In Javascript, we can wrap code that takes time to execute in something called a `Promise`. A `Promise` is almost exactly what it sounds like, a special object that promises to do something and resolve correctly, but just not right now. It helps us handle situations where we need to wait for something to occur and then provide a resolution.

The basic syntax of a `Promise` is as follows:

```js
new Promise(function(resolve) { resolve("Return Value") } );
```

We instantiate an instance of `Promise`, passing the constructor our callback function of what the promise is promising to do. The argument that callback takes, `resolve`, is a special function that is called when the promise is done. Instead of using `return` in a promise to specify what the promise should return, we use `resolve`, saying this is the end of my promise, considered it fullfilled.

We can attach code to execute upon the resolution of a promise using the `then` function on an unresolved promise. Here's an example.

**File: promiseExampleWithThen.js**
```js
let myFirstPromise = new Promise(function(resolve){
  // We call resolve(...) when what we were doing asynchronously was successful
  // In this example, we use setTimeout(...) to simulate async code. 
  setTimeout(function(){
    resolve("Success!"); // Yay! Everything went well!
  }, 1000);
});

myFirstPromise.then(function(returnValueOfPromise){
  // returnValueOfPromise is whatever we passed in the resolve(...) function above.
  console.log("Yay! " + returnValueOfPromise);
});
```


The `then` callback is cumbersome as our code ends up nesting functionality within multiple layers of callbacks. If we were to use a `Promise` and `then`, our initial script would look like:

**File: synchronousPromise.js**
```js
function getData(){
  console.log("2. Getting data from internet, please wait.")
  return new Promise(function(resolve){
    setTimeout(function(){
      console.log("3. Returning data from internet.")
      resolve([{name: "Avi"}, {name: "Grace"}])
    }, 1000)
  })
}

function main(){
  console.log("1. Starting Script")
  getData().then(function(data){
    console.log(`4. Data is currently ${JSON.stringify(data)}`)
    // The entire rest of our program would have to be nested
    // within this callback for `data` to be fully available.
    console.log("5. Script Ended")
  })
}

main()
```

Running that code produces the desired result:

```
// ♥ node synchronousPromise.js 
1. Starting Script
2. Getting data from internet, please wait.
3. Returning data from internet.
4. Data is currently [{"name":"Avi"},{"name":"Grace"}]
5. Script Ended
```

Rather than use callbacks with `then` to resolve a promise, Node 8 introduces a better pattern called `async` and `await`.

## `async` and `await`

If you want to force your code to run synchrnously and wait for a promise to resolve before continuing you can use `async` and `await`. If a function returns a promise, you can tell your code to wait for it to resolve before continuing to run the rest of the program.

Here's the simple promise example re-written with `async` and `await`:

**File: asyncAwaitPromiseExample.js**
```js
let myFirstPromise = new Promise(function(resolve){
  setTimeout(function(){
    resolve("Success!");
  }, 1000);
});

(async function(){
  let returnValueOfPromise = await myFirstPromise;
  console.log("Yay! " + returnValueOfPromise);
})()
```
