var total=0,level=1, standardExp, exp, size=160;

var port = chrome.extension.connect({
    name: "Sample Communication"
});
//audio
var myAudio =new Audio(chrome.runtime.getURL("cat_meow.wav")),
    cat_levelup = new Audio(chrome.runtime.getURL("cat_levelup.wav"))
;


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "something_completed") {
            //  To do something
            console.log("hello");
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    }
);


/*function startTimer(duration, display, totalDisplay) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        
        

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //display.text(minutes + ":" + seconds);
        totalDisplay.text(total+"");
        

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);

}*/

function calculateLevel(level){
    chrome.extension.sendMessage({exp: "saveLevel", Lev: level},function(){
        console.log("sended "+level);
    });

}

$(function(){

    var fiveMinutes = 60 * 0.1;

    var otherWindows = chrome.extension.getBackgroundPage();
    
    var percentExp=0;

   /* chrome.storage.onChanged.addListener(function(changes,area){
        console.log(" 212 ss "+area + "  sd "+ changes );
        for(var keys in changes){
            console.log(keys);
        }
    });*/

    myAudio.play();

    setInterval(function(){
        console.log("masdfasdfffds");
        chrome.storage.sync.get(['exp','standardExp','level'],function(savedData){
            exp=savedData.exp;
            standardExp=savedData.standardExp;
            level=savedData.level;
            console.log(exp+"  wowwowwow   "+standardExp);
            percentExp=(((exp/standardExp)-1)*(-1))*100;
            console.log("percent"+percentExp);
            chrome.storage.sync.set({'Per':percentExp});
        });
    },1000);
    

    
    //처음 시작할때 초기화 Initialize Program
    chrome.runtime.onMessage.addListener(function(message){
        if(message.exp=="Initialize"){
            console.log("Initialize Start!");
            level=message.Lev;
            exp=message.Exper;
            console.log("Initialize level = " + level);
            $('#level').text("Level : " + level);
            $('#blank').val("Hello! "+message.Email);
        }
    });



    //타이머 시작 start timer
    $('#startTimer').click(function(){
        port.postMessage("Hi BackGround");
        port.onMessage.addListener(function(msg) {
            otherWindows.backgroundFunction(fiveMinutes);
            console.log("message recieved" + msg);
        });
        $('#startTimer').prop('disabled',true);
    });

    //매초 마다 갱신하는 부분
    chrome.runtime.onMessage.addListener(function(message){
        if(message.exp=="Timer"){
            $('#startTimer').hide();
            if(total==null){
                console.log('total is null');
                total=0;
            }
            else{
                total = message.Tot;
            }

            $('#total').text(total+"");
            console.log(message.Min+":"+message.Sec);
            
            $('#time').text(message.Min+":"+message.Sec);
            $('#level').text("Level : " + message.Lev);
            $('#exp').text("Exp needed : "+ exp);


        }
        else{
            console.log("Failed");
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    });
    
    


/*    $('#loadData').click(function(){
        chrome.storage.sync.get(['total','level'], function(savedData){
            total = savedData.total;
            level = savedData.level;
            chrome.stoarge.sync.set({'total' : total,'level' : level});
                
            $('#total').text(total+"");
        });
    });*/

    $('#saveTotal').click(function(){
        chrome.storage.sync.get(['total'], function(savedData){
            var newTotal=0,
                newLevel= level;
            

            if(savedData.total){
                newTotal += parseInt(savedData.total);
            }


            chrome.storage.sync.set({'total':total},function(){
                
                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title:'Data Saved!!',
                        message:"Your data got saved!"
                    };
                    chrome.notifications.create('Notif',notifOptions);
            });
        });
    });
    //Use Button 토탈 사용
    $('#useTotal').click(function(){
        if(total>=exp){
            total=total - exp;
            exp=0;
            level+=1;
            if(exp==0){
                standardExp*=1.98;
                exp = parseInt(standardExp);
                chrome.storage.sync.get(['exp'],function(savedData){
                    console.log("new Exp : "+savedData.exp );
                });
            }
            calculateLevel(level);
            //레벨업 음악
            cat_levelup.play();
        }
        else if(total<exp){
            exp= exp - total;
            total = 0;
            chrome.storage.sync.set({'exp':exp});
            chrome.storage.sync.get(['exp'],function(savedData){
                console.log("new Exp : "+savedData.exp );
            });
        }
        else{
            console.log("Failed");
        }
        


        chrome.extension.sendMessage({exp: "Used", Tot: total},function(){
            var notifOption = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title:'Used!!',
                message:"You used your data!"
            };
            chrome.notifications.create('Notif',notifOption);
        });

        chrome.storage.sync.set({'level': level,'exp': exp , 'standardExp': standardExp,'Per':percentExp});

        
    });

    //resize popup
    $('#resizePopup').click(function(){
        if(size==160){
            $('body').animate({
                width : '+=140px'
            }, 150);
            size=300;
            console.log("size :"+size);
        }
        else if(size==300){
            $('body').animate({
                width : '-=140px'
            }, 150);
            size=160;
            console.log("size :"+size);
        }
    });
});
