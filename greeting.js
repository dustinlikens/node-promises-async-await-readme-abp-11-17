const sayHello = function(){
  console.log("Hello, World!")
}

console.log(module.filename);  
console.log(module.id);  
console.log(module.exports);  

module.exports = sayHello