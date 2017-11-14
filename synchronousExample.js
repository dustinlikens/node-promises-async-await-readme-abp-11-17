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