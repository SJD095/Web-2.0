/*
13331233    孙中阳
2016.11.15  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//获取各个组件
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

//创建一个保存用户的array
var user_array = new Array();

//创建服务器，并监听8000号端口
var http_server = http.createServer(function(req, res)
{
	if(req.url == '/')
	{
		res.writeHead(200, {"Content-type": "text/html"});
		res.end(fs.readFileSync('sign_up.html'));
	}
	else if(req.url == "/css/sign_up.css")
	{
		res.writeHead(200, {"Content-type": "text/css"});
		res.end(fs.readFileSync("css/sign_up.css"));
	}
	else if(req.url == "/css/information.css")
	{
		res.writeHead(200, {"Content-type": "text/css"});
		res.end(fs.readFileSync("css/information.css"));
	}
	else if(req.url == "/js/jquery.js")
	{
		res.writeHead(200, {"Content-type": "text/javascript"});
		res.end(fs.readFileSync("js/jquery.js"));
	}
	else if(req.url == "/js/sign_up.js")
	{
		res.writeHead(200, {"Content-type": "text/javascript"});
		res.end(fs.readFileSync("js/sign_up.js"));
	}
	else if(req.url == "/search")
	{
		var post = "";

	    req.on('data', function(chunk)
	    {
	        post += chunk;
	    });

	    req.on('end', function()
	    {
	        post = querystring.parse(post);

	        check(post["k"], post["c"], res);
	    });
	}
	else if(req.url == "/submit")
	{
		var post = "";

	    req.on('data', function(chunk)
	    {
	        post += chunk;
	    });

	    req.on('end', function()
	    {
	        post = querystring.parse(post);
	        console.log(post);
	        var obj = {};
	        obj["name"] = post["username"];
	        obj["studentid"] = post["id"];
	        obj["phone"] = post["phone"];
	        obj["email"] = post["email"];

	        user_array.push(obj);

	        show_information(obj, res);
	    });
	}
	else
	{
		var username = querystring.parse(url.parse(req.url).query).username;
		for(var i = 0; i < user_array.length; i++)
		{
			var obj = user_array[i];
			if(obj["name"] == username)
			{
				show_information(obj, res);
			}
		}

		res.writeHead(200, {"Content-type": "text/html"});
		res.end(fs.readFileSync('sign_up.html'));
	}

}).listen(8000);

//检查某个输入是否有重复
function check(key, content, res)
{
	for(var i = 0; i < user_array.length; i++)
	{
		var obj = user_array[i];
		if(obj[key] == content)
		{
			res.end("invalid");
			return;
		}
	}
	res.end("valid");
}

//生成并加载个人信息页面
function show_information(user, res)
{
	var user_information_html = "<!DOCTYPE html> <html lang=\"en\"> <head> <title>User Information</title> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /> <meta name=\"keywords\" content=\"user information\"> <meta name=\"description\" content=\"Homework 8 for Modern Web Programming class\"> <meta name=\"generator\" content=\"Coda 2.5.7\"> <link href=\"css/information.css\" type=\"text/css\" rel=\"stylesheet\" /> </head> <body> <h1>Information</h1> <form> <div class=\"form_body\"> <label>Username</label> <input type=\"text\" value=\""  + user["name"] + "\" readonly> <label>Student Id</label> <input type=\"text\" value=\"" + user["studentid"] + "\" readonly><label>Phone</label> <input type=\"text\" value=\"" + user["phone"] + "\" readonly><label>Email</label> <input type=\"text\" value=\"" + user["email"] + "\" readonly> </div> <div class=\"footer\"> <a href=\"http://localhost:8000\"><button type=\"button\" id=\"submit\">Back</button></a> </div> </form> </body> </html>";

	res.writeHead(200, {"Content-type": "text/html"});
	res.end(user_information_html);
}
