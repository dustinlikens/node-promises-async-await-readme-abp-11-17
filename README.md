# Node Promises with `async` and `await`

## Objectives

1. Understand the asynchronous nature of JavaScript.
2. Use a `Promise` to create an asynchronous handler.
3. Use `await` and `async` to handle asynchronous code.

## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/j8yHLlJpXwc?rel=0&modestbranding=1" frameborder="0" allowfullscreen></iframe><p><a href="https://www.youtube.com/watch?v=j8yHLlJpXwc">Asynchronous Javascript with Promises, then(), await, and async</a></p>

I highly recommend watching that video and then going through the README and trying to follow the examples. This is a hard one, it's okay if you don't fully get the implementation, but just understand the problem and that it is solved through Promises.

## Asynchronous JavaScript

JavaScript is an asynchronous language which means that code does not execute linearly. If one line of code has logic that might not resolve immediately, rather than wait for that resolution, the interpreter will continue to evaluate the rest of the code.

**File: [synchronousExample.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/synchronousExample.js)**
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

*Note: `JSON.stringify(data)` just makes it so that the our data object logs nicely as: `[{"name":"Avi"},{"name":"Grace"}]`*

In javascript, whenever data is coming from a source not instantly available, either from an HTTP request via AJAX or a Database request. We're going to simulate having to wait for data using the [`setTimeout`](https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args) function in JavaScript. `setTimeout` accepts a callback function that it will execute after a delay you specify.

**`setTimeout Example`**
```js
console.log("The next message will appear after 1000 milliseconds")
setTimeout(function(){
  console.log("We just waited 1000 milliseconds")
}, 1000)
```

If we add a `setTimeout` to the `getData` function, everything goes wrong.

**File: [asynchronousExample.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/asynchronousExample.js)**
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

We can see that the execution order is no longer linear. JavaScript did not wait for the call to `getData` to fully resolve before continuing to interpret the rest of the program. We wanted `data` to be our JSON object, but instead, we got some unidentified JavaScript object. The script thought it ended before it actually did and finally, the `data` was returned, much too late, in fact, we never even really see it available in `main`.

This is the asynchronous nature of JavaScript and to remedy it so that our scripts can wait for data to be returned we need to learn about `Promise`s.

## A JavaScript `Promise`

In JavaScript, we can wrap code that takes time to execute in something called a `Promise`. A `Promise` is almost exactly what it sounds like, a special object that promises to do something and resolve correctly, but just not right now. It helps us handle situations where we need to wait for something to occur and then provide a resolution.

The basic syntax of a `Promise` is as follows:

```js
new Promise(function(resolve) { resolve("Return Value") } );
```

We instantiate an instance of `Promise`, passing the constructor our callback function of what the promise is promising to do. The argument that callback takes, `resolve`, is a special function that is called when the promise is done. Instead of just using `return` in a promise to specify what the promise should return, we invoke the `resolve` function, saying this is the end of my promise, considered it fullfilled. You don't always have to explicitly state a return of the resolve function (i.e. `return resolve()` inside of the Promise unless you want the new Promise function to complete upon calling resolve. 

We can attach code to execute upon the resolution of a promise using the `then` function on an unresolved promise. Here's an example.

**File: [promiseExampleWithThen.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/promiseExampleWithThen.js)**
```js
const myFirstPromise = new Promise(function(resolve){
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

**File: [synchronousPromise.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/synchronousPromise.js)**
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

**File: [asyncAwaitPromiseExample.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/asyncAwaitPromiseExample.js)**
```js
const myFirstPromise = new Promise(function(resolve){
  setTimeout(function(){
    resolve("Success!");
  }, 1000);
});

async function main(){
  const returnValueOfPromise = await myFirstPromise;
  console.log("Yay! " + returnValueOfPromise);
}

main()
```

First, any code that will use the `await` keyword must be wrapped within a function that is explicitly declared to be `async`. We accomplish this by declaring the `main` function with the syntax of `async function main(){}`. The `async` keyword before a function declaration marks it as asynchronous, and within it we can use the `await` keyword to wait for a promise to resolve.

To wait for our promise to resolve and get the resolution as a return value from it, we just use the `await` keyword in-front of the promise.

That looks way better than using the `then` callback style.

Our full program would look like:

**File: [awaitExample.js](https://github.com/learn-co-curriculum/node-promises-async-await-readme/blob/master/awaitExample.js)**
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

async function main(){
  console.log("1. Starting Script")
  const data = await getData()
  console.log(`4. Data is currently ${JSON.stringify(data)}`)
  console.log("5. Script Ended")
}

main()
```

That program will output:

```
node awaitExample.js 
1. Starting Script
2. Getting data from internet, please wait.
3. Returning data from internet.
4. Data is currently [{"name":"Avi"},{"name":"Grace"}]
5. Script Ended
```

That is the preferred way to handle asynchronous code after Node 8, with `await` being used infront of a Promise within a function marked as `async`.
