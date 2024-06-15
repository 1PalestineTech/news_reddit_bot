
const {main,links} = require("./funcs.js");
async function run(){

    main(links);

  
  
  setTimeout(()=>{
    run();
  }
,120000);
}
console.log("Bot started ============================")
run();