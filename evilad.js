function listener(event){
 document.getElementById("test").innerHTML = "received: "+event.data;

}

if (window.addEventListener){
  addEventListener("message", listener, false)
} else {
  attachEvent("onmessage", listener);
}

function postmessagetoparent(){
	parent.postMessage("document.cookie","*");
}
