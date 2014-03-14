$(document).ready(function(){


	var str = $("#hdnSession").html();

	var arr = str.split("~");
	var len = arr.length;
	if(len <2){
		return;
	}

	var tabStr = "";
	for(var i=len-2;i>=0;i--){

		var sess = arr[i];
		var broke = sess.split("::");
		tabStr += "<tr>";
		tabStr += "<td>";
		tabStr += broke[0];
		tabStr += "</td>";
		tabStr += "<td>";
		tabStr += broke[1];
		tabStr += "</td>";
		tabStr += "<tr>";

	}

	$("#myTab").append(tabStr);


});