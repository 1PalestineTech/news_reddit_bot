function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function Start(){
  
    fetch("./get_data")
.then(x =>{
    x.text().then(o=>{
        data=JSON.parse(o);

        for(e of data.instances){
            
                if(e.name==getCookie("file") && e.flag==true){
                    alert("Bot is ON")
                    break;
                }
            else if(e.name==getCookie("file") && e.flag==false){
                let flag=document.getElementById("bot_data")
                flag.value='start'
                document.getElementById("bot_form").submit();
                break;
        
            }
        }
        
    })})
}
function Stop(){
        fetch("./get_data")
    .then(x =>{
        x.text().then(o=>{
            data=JSON.parse(o);
            for(e of data.instances){
            
                if(e.name==getCookie("file") && e.flag==false){
                    alert("Bot is OFF")
                    break;
                }
            else if(e.name==getCookie("file") && e.flag==true){
                let flag=document.getElementById("bot_data")
                flag.value='stop'
                document.getElementById("bot_form").submit();
                break;
        
            }
        }

        
    
    
    })})
        }
function Restart(){
            fetch("./restart");
        
        alert("Bot Restarted ")
            }
            
function Clear(){
            document.getElementById("check-url").innerHTML="";

        }

function Save_backup(){
            fetch("../save_backup")
        .then((e)=> alert("backup saved"));
    }