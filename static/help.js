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
        x.text().then(o=>{
            data=JSON.parse(o);
            
            
            if(data.flag==false){
            alert("Bot is OFF")
        }else{

            let flag=document.getElementById("bot_data")
            flag.value='stop'
            document.getElementById("bot_form").submit();
    
        }
    
    
    })
        
        
    
    
    })
        }
        function Clear(){
            document.getElementById("check-url").innerHTML="";

        }
        /*
        function Check(){
            let link = document.getElementById("link").value

            const options = {
                headers: {

                    "Content-Type": "application/json",
                
                  },
                method: 'POST',
                body: '{"link":"http://theconversation.edu.au/articles"}'
            };
            fetch( './check_url', options )
                .then( response => response.text() )
                .then( response => {
                    document.getElementById("check-url").innerHTML=response;
                } );


        }*/