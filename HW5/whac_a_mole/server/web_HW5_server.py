#!/usr/bin/python
# -*- coding: UTF-8 -*-

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import json

#设置服务端端口号（default=端口号）
from tornado.options import define, options
define("port", default=15001, help="run on the given port", type=int)

rank = [];

class rankingHandler(tornado.web.RequestHandler):
    def get(self):
	global rank;
	result = [];
	rank.sort(key = lambda x:x[1], reverse=True);
	#rank.sort(reverse = True);
	print rank;
        for tuples in rank:
            result.append(({ "name" :tuples[0], "score": tuples[1]}));
	self.set_header("Access-Control-Allow-Origin", "*");
        self.write(json.dumps(result));

class updateHandler(tornado.web.RequestHandler):
    def post(self):
	global rank;
	b = self.request.body;
	name = b.split("&")[0].split("=")[1];
	score = b.split("&")[1].split("=")[1];
	print name;
        print score;
        rank.append((name, int(score)));
	self.set_header("Access-Control-Allow-Origin", "*");

class clearHandler(tornado.web.RequestHandler):
    def get(self):
	global rank;
        rank = [];
	print "clear";
	print rank;
	self.set_header("Access-Control-Allow-Origin", "*");

if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = tornado.web.Application(
    handlers=[
            (r"/ranking", rankingHandler), (r"/update", updateHandler), (r"/clear", clearHandler)
        ]
    )

    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
