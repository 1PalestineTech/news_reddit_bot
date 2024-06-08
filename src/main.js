

const {main,links} = require("./funcs.js");
function run(){
  main(links)
  setTimeout(() => {
    main(links);
}, 180000);
}
run();