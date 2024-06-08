

const {main,links} = require("./funcs.js");
async function run(){
  main(links);
  setTimeout(() => {
    run();
}, 120000);
}
run();