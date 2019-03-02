var id = 'bar';
var bar = new ProgressBar.Line(document.getElementById(id), {
    strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1400,
  color: '#FFEA82',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {width: '100%', height: '100%'},
  from: {color: '#FFEA82'},
  to: {color: '#ED6A5A'},
  step: (state, bar) => {
    bar.path.setAttribute('stroke', state.color);
  }
});
var percent=0;

bar.animate(0.0);


$(function(){
    chrome.storage.onChanged.addListener(function(changes,area){
        console.log(" 212 ss "+area + "  sd "+ changes );
        for(var keys in changes){
            console.log(keys);
            if(changes.Per){
                chrome.storage.sync.get(['Per'],function(savedData){ 
                    console.log("s  : "+ savedData.Per);
                    percent = parseInt(savedData.Per);
                    console.log(percent);
                    bar.animate(percent/100);
                });
            }
            if(changes.level){
                console.log("level uyp!!!!!!!!!!!!!!!");
                bar.animate(1.0);
                setTimeout(function(){bar.animate(0.0)},1400);
            }
        }
    });
    chrome.storage.sync.get(['Per'],function(savedData){
        if(savedData.Per){    
            percent = parseInt(savedData.Per);
            bar.animate(percent/100);
        }
    });
});
