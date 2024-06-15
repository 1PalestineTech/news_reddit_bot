function Start(){
  
    fetch("./get_data")
.then(x =>{
    x.text().then(o=>{
        data=JSON.parse(o);
        
        
        if(data.flag==true){
        alert("Bot is ON")
    }else{
        let flag=document.getElementById("bot_data")
        flag.value='start'
        document.getElementById("bot_form").submit();

    }


})
    
    


})
    }

    function Stop(){
        let flag=document.getElementById("bot_data")
            flag.value='stop'
        fetch("./get_data")
    .then(x =>{
        console.log(x.text().then(o=>{
            data=JSON.parse(o);
            
            
            if(data.flag==false){
            alert("Bot is OFF")
        }else{

            let flag=document.getElementById("bot_data")
            flag.value='stop'
            document.getElementById("bot_form").submit();
    
        }
    
    
    }))
        
        
    
    
    })
        }