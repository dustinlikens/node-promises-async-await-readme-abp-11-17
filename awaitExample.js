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