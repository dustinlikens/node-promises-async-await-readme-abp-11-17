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