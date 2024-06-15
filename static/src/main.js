
const {main} = require("./funcs.js");
async function run(){

    main();

  
  
  setTimeout(()=>{
    run();
  }
,120000);
}
console.log("Bot started ============================")
run();