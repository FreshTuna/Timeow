var total,level,exp,standardExp;
var key;


chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
         console.log("message recieved" + msg);
         port.postMessage("Hi Popup.js");
    });
});


chrome.runtime.sendMessage({

    msg: "something_completed", 
    data: {
        subject: "Loading",
        content: "Just completed!"
    }
});

//get Id 아이디 받기
chrome.identity.getProfileUserInfo(function(data){
    if(data.email ==null || data.id ==null){
        console.log("not login properly");
    }
    console.log(data.email);
    console.log(data.id);
    key = data.email;
});


chrome.storage.sync.get(['total'], function(savedData){
    if(savedData.total==null){
        console.log("total : null");
        total=0;
    }
    else if(savedData.total<1){
        console.log("total : 0");
        total =0;
    }
    else{
        console.log("total : savedData");
        total = savedData.total;
    }
});


//켜졌을때 초기화   initialize function   
chrome.extension.onConnect.addListener(function(port){  
    if(level==null){
        chrome.storage.sync.get(['level','exp','standardExp'],function(savedData){
            var n1=1;
            if(savedData.level==null){
                console.log("level : null");
                chrome.storage.sync.set({'level': n1,'exp': n1,'standardExp':n1});
                chrome.storage.sync.get(['level','exp','standardExp'],function(savedData){
                    console.log("l : "+savedData.level+"e: "+savedData.exp);
                });
            }
            else{
                console.log("level : " + level);
            }

            chrome.storage.sync.get(['level','exp','standardExp'],function(savedData){
                level = parseInt(savedData.level);
                exp = parseInt(savedData.exp);
                standardExp = parseInt(savedData.standardExp);
                console.log("level made"+level+"exp made"+exp);
                chrome.extension.sendMessage({ exp: "Initialize",Lev: level,Exper:exp,Email : key});
            });

        });
    }
});

//응답 
chrome.runtime.onMessage.addListener(function(message){
    if(message.exp=="Used"){
        console.log("booooooooooooom");
        
        total= message.Tot;
        chrome.storage.sync.get(['exp','standardExp'],function(savedData){
            exp=savedData.exp;
            standardExp=savedData.standardExp;
            console.log(exp+ " sadf   "+standardExp );
        });

    }

    if(message.exp=="saveLevel"){
        console.log("message : "+ message.Lev);
        var newLevel= message.Lev;
        chrome.storage.sync.get(['level'], function(savedData){
            if(!savedData.level){
                chrome.storage.sync.set({'level':newLevel},function(){
                    console.log("level :            "+newLevel);
                });
            }
            else{
                chrome.storage.sync.set({'level': newLevel},function(){
                    console.log("level :            changed : "+ newLevel);
                });

            }
            chrome.storage.sync.get(['level'],function(savedData){
                level = savedData.level;
                console.log("wagwagwdsfa :" +savedData.level);
            });
        });

    }

});

function backgroundFunction(duration, timeDisplay){
    var timer = duration, minutes, seconds;
    var index=0;

    setInterval(function () {
        
        

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        if(++index>9){
            if (--timer < 0) {
                timer = duration;
                total++;
                chrome.storage.sync.set({'total': total});
            }
            index=0;
        }


        chrome.extension.sendMessage({exp :"Timer", Min: minutes ,Sec: seconds ,Tot: total, Lev:level}, function(){});


        return timer;
    }, 100);
    
}



// badge 
/*
chrome.storage.onChanged.addListener(function(changes, total){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});
*/

