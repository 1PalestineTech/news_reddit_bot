
const {main,links} = require("./funcs.js");
async function run(){

    main(links);

  
  
  setTimeout(()=>{
    run();
  }
,30000);
}
console.log("Bot started ============================")
run();