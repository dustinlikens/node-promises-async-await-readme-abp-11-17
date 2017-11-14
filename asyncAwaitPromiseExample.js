let myFirstPromise = new Promise(function(resolve){
  setTimeout(function(){
    resolve("Success!");
  }, 1000);
});

async function main(){
  let returnValueOfPromise = await myFirstPromise;
  console.log("Yay! " + returnValueOfPromise);
}

main()
