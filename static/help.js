function Start(){
  
    fetch("./get_data")
.then(x =>{
    x.text().then(o=>{
        data=JSON.parse(o);
        for(i of data.instances){
            
                if(e.SUB_REDDIT==getCookie("file") && e.flag==true){
                    alert("Bot is ON")
                    return ;
                }
            else{
                let flag=document.getElementById("bot_data")
                flag.value='start'
                document.getElementById("bot_form").submit();
                return ;
        
            }
        }
        
    })})
}
function Stop(){
        fetch("./get_data")
    .then(x =>{
        x.text().then(o=>{
            data=JSON.parse(o);
            for(i of data.instances){
            
                if(e.SUB_REDDIT==getCookie("file") && e.flag==false){
                    alert("Bot is OFF")
                    return ;
                }
            else{
                let flag=document.getElementById("bot_data")
                flag.value='stop'
                document.getElementById("bot_form").submit();
                return ;
        
            }
        }

        
    
    
    })})
        }
function Clear(){
            document.getElementById("check-url").innerHTML="";

        }
       