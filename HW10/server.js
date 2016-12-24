/*
13331233    孙中阳
2016.12.15  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//获取各个组件
var express = require('express');
var cookieParser = require('cookie-parser')
var mongodb = require('mongodb')

var app = express();
app.use(cookieParser())
app.use(express.static('public'));

var crypto = require('crypto');

var bodyParser = require('body-parser');
var session = require('express-session');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('hw10', server, {safe:true})

var script = ""

app.use(session(
{
	secret: '13579',
	name: 'hw10',
	cookie: {maxAge: 8000000},
	resave: false,
	saveUninitialized: true,
	username: 'None'
}));

var coll

db.open(function(err,db)
{
	if(!err)
	{
		db.collection('user',{safe:true},function(err, collection)
		{
			coll = collection
		});
	}
	else
	{
		console.log(err);
	}
});

app.get('/', function (req, res)
{
	console.log(req.session.username)
	if(req.session.username != 'None' && req.session.username != undefined)
	{

		coll.find({"name" : req.session.username}).toArray(function(err, result)
		{
			if(err)
			{
				console.log('Error:'+ err);
				return;
			}

			if(req.query.username == req.session.username)
			{
				if(result.length != 0)
				{

					show_information(result[0], res);
				}
				else
				{
					res.redirect('/')
				}
			}
			else
			{
				if(req.query.username != undefined)
					{
						script = "<script type=\"text/javascript\">alert('只能够访问自己的数据')</script>"
					}
				res.redirect('/?username=' + req.session.username)
			}
		});
   	}
   	else
	{
		res.sendFile( __dirname + "/" + "sign_in.html" );
	}
})

app.post('/login', urlencodedParser, function (req, res)
{
	coll.find({"name" : req.body.username}).toArray(function(err, result)
		{
			if(err)
			{
				console.log('Error:'+ err);
				return;
			}

			if(result.length != 0)
			{
				var hasher=crypto.createHash("md5");
				hasher.update(req.body.password);
				var hashmsg = hasher.digest('hex');

				if(hashmsg == result[0]["password"])
				{
					req.session.username = req.body.username;
					show_information(result[0], res);
				}
				else
				{
					res.send("<!DOCTYPE html> <html lang='en'> <head> <title>Sign in</title> <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> <meta name='keywords' content='sign in'> <meta name='description' content='Homework 10 for Modern Web Programming class'> <meta name='generator' content='Coda 2.5.7'> <link href='css/sign_in.css' type='text/css' rel='stylesheet' /> <script  src='js/jquery.js' type='text/javascript'></script> <script  src='js/sign_in.js' type='text/javascript'></script> </head> <body> <script type=\'text/javascript\'>alert('错误的用户名或者密码')</script> <h1>Sign in</h1> <form id='information_form' method='post' name='form' action='http://localhost:8000/login'> <div class='form_body'> <label for='username'>Username</label> <input id='name_input' type='text' name='username' placeholder='USERNAME' required='required' /> <p id = 'name_msg'></p> <label for='password'>Password</label> <input id='password_input' type='password' name='password' placeholder='PASSWORD' required='required' /> <div class='footer'> <a href='/regist'><button type='button' id='sign_up'>Sign up</button></a> <button type='submit' id='sign_in'>Sign in</button> </div> </form> </body> </html>")
				}
			}
			else
			{
				res.redirect('/')
			}
		});
})

app.get('/regist', function (req, res)
{
   res.sendFile( __dirname + "/" + "sign_up.html" );
})

app.post('/search', urlencodedParser, function (req, res)
{
	check(req.body.k, req.body.c, res);
})

app.post('/submit', urlencodedParser, function (req, res)
{
	var hasher=crypto.createHash("md5");
	hasher.update(req.body.password);
	var hashmsg=hasher.digest('hex');

	var user_insert = {"name" : req.body.username, "studentid" : req.body.id, "password" : hashmsg, "phone" : req.body.phone, "email" : req.body.email};

	coll.insert(user_insert,{safe:true},function(err,result)
	{
		console.log(result)
	});

	req.session.username = req.body.username;
    show_information(user_insert, res);
})

app.get('/logout', function (req, res)
{
	req.session.username = 'None'
	res.sendFile( __dirname + "/" + "sign_in.html" );
	res.redirect('/')
})

var server = app.listen(8000, function ()
{
})

//检查某个输入是否有重复
function check(key, content, res)
{

	var searchSQL = {key : content}
	switch(key)
	{
		case "name":
			var searchSQL = {"name" : content}
			break;
		case "studentid":
			var searchSQL = {"studentid" : content}
			break;
		case "phone":
			var searchSQL = {"phone" : content}
			break;
		case "email":
			var searchSQL = {"email" : content}
			break;
	}

	coll.find(searchSQL).toArray(function(err, result)
	{
		if(err)
		{
			console.log('Error:'+ err);
			return;
		}

		if(result.length != 0)
		{
			res.send("invalid")
		}
		else
		{
			res.send("valid")
		}
	});
}

//生成并加载个人信息页面
function show_information(user, res)
{
	var user_information_html = "<!DOCTYPE html> <html lang=\"en\"> <head> <title>User Information</title> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /> <meta name=\"keywords\" content=\"user information\"> <meta name=\"description\" content=\"Homework 8 for Modern Web Programming class\"> <meta name=\"generator\" content=\"Coda 2.5.7\"> <link href=\"css/information.css\" type=\"text/css\" rel=\"stylesheet\" /> </head> <body>" + script + "<h1>Information</h1> <form> <div class=\"form_body\"> <label>Username</label> <input type=\"text\" value=\""  + user["name"] + "\" readonly> <label>Student Id</label> <input type=\"text\" value=\"" + user["studentid"] + "\" readonly><label>Phone</label> <input type=\"text\" value=\"" + user["phone"] + "\" readonly><label>Email</label> <input type=\"text\" value=\"" + user["email"] + "\" readonly> </div> <div class=\"footer\"> <a href=\"http://localhost:8000/logout\"><button type=\"button\" id=\"logout\">Log out</button></a> </div> </form> </body> </html>";

	script = ""

	res.send(user_information_html);
}
