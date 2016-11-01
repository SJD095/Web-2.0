/*
13331233    孙中阳
2016.10.15  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//地图的节点坐标，x和y是其相对canvas的位置
function node()
{
    var n = new Object;
    n.x = 0;
    n.y = 0;

    return n;
}

//DFS所用堆栈
var stack = new Array();

//canvas需要使用的两个全局变量
var c;
var ctx;

//游戏中被触发的墙壁的坐标
var x1;
var y1;

//四个bool值，用于标记某个节点的四个方向是否仍有可达节点
var w = false;
var s = false;
var a = false;
var d = false;

//用于标记是否正在构造迷宫的bool值，防止构造过程被打断
var on_build = false;

//确定性有限自动机用于判断当前所处状态和状态变化所使用的触发器
var status = "out";
var tmp_s = "";

//确定性有限自动机的状态，-1为初始态
var DFA = -1;

//用于保存setInterval()返回值的变量
var t;

//用于记录迷宫路径坐标的x和y值得两个数组
var path_x = new Array();
var path_y = new Array();

//用于显示游戏结果的h3
var dyna;

//用于记录已经达到的点的数量
var count = 0;

//当前栈顶节点
var top_node;

//用于记录迷宫中的所有节点的状态
var pos_array = new Array();
for(var i = 0; i < 5; i++)
{
    pos_array[i] = new Array();
    for(var j = 0; j < 5; j++)
    {
        pos_array[i][j] = 0;
    }
}

//使得鼠标移动会触发相应的更改
function mouse()
{
    //为canvas增加鼠标移动的监听事件
	window.addEventListener("mousemove", function(event)
	{
        //获取鼠标相对canvas原点的值
    	var mousePos = getMousePos(c, event);

        //获取鼠标所在位置的像素的有关信息
    	var imageData = ctx.getImageData(Math.floor(mousePos.x), Math.floor(mousePos.y), 1, 1).data;

        //如果鼠标在canvas内部
    	if(mousePos.x >= 0 && mousePos.y >= 0 && mousePos.x < 550 && mousePos.y < 550)
    	{
            //如果鼠标在迷宫路径中
	    	if(imageData[0] == "247" && imageData[1] == "238" && imageData[2] == "214")
	    	{
                //确定性有限自动机状态更改为i
		    	tmp_s = "i";
	    	}
            //如果鼠标在起点
	    	else if(mousePos.x >= 0 && mousePos.y >= 50 && mousePos.x < 50 && mousePos.y < 100)
	    	{
                //确定性有限自动机状态更改为s
		    	tmp_s = "s";
                //如果之前游戏没有开始
		    	if(DFA == -1)
		    	{
                    //游戏开始，确定性有限自动机到达0位置
			    	var dyna = document.getElementById("dynatic");
			    	dyna.innerHTML = "&nbsp;"
			    	DFA = 0;
			    }
	    	}
            //如果鼠标在终点
	    	else if(imageData[0] == "134" && imageData[1] == "132" && imageData[2] == "255")
	    	{
                //确定性有限自动机状态更改为e
		    	tmp_s = "e";
	    	}
            //否则鼠标一定在迷宫墙壁上
	    	else
	    	{
		    	tmp_s = "other";
	    	}
    	}
        //否则鼠标在迷宫之外
    	else
    	{
	    	tmp_s = "out";
    	}

        //如果游戏开始且确定性有限自动机的状态发生了变化
    	if(tmp_s != status && DFA >= 0)
    	{
            //更新当前状态
	    	status = tmp_s;

            //更新确定性有限自动机的位置
	    	if(DFA == 0)
	    	{
		    	if(status == "i")
		    	{
			    	DFA = 1;
		    	}
		    	else if(status == "other")
		    	{
			    	DFA = 2;
		    	}
		    	else if(status == "out")
		    	{
			    	DFA = 4;
		    	}
	    	}
			else if(DFA == 1)
			{
				if(status == "other")
				{
					DFA = 3;
				}
				if(status == "e")
				{
					DFA = 7;
				}
				if(status == "s")
				{
					DFA = 0;
				}
			}
			else if(DFA == 4)
			{
				if(status == "s")
				{
					DFA == 0;
				}
				if(status == "e")
				{
					DFA = 5;
				}
				if(status == "other")
				{
					DFA = 6;
				}
			}
			else if(DFA == 8)
			{
				if(status != "other")
				{
                    //鼠标移开报警墙壁，墙壁恢复原状
					recharge();
				}
			}

			dyna = document.getElementById("dynatic");

            //在确定性有限自动机到达有关位置时执行相关动作
			switch(DFA)
			{
				case 2:
                    //提示游戏失败
					game_fail(mousePos.x, mousePos.y)
					break;
				case 3:
					game_fail(mousePos.x, mousePos.y)
					break;
				case 6:
					game_fail(mousePos.x, mousePos.y)
					break;
				case 5:
                    //提示玩家作弊
					dyna.innerHTML = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze";
                    //重新开始游戏
					DFA = -1;
					break;
				case 7:
                    //提示玩家胜利
					dyna.innerHTML = "You Win";
                    //重新开始游戏
					DFA = -1;
					break;
			}

			console.log(DFA);
		}
    });
}

//在部分墙面因用户碰触而变成红色之后重新绘图
function recharge()
{
    //Safari需要新建一个图片，否则不会重新加载
    img = new Image();
	img.src = 'image/background.jpg';
	img.onload = function()
	{
        //以图片为背景绘图
		var pat = ctx.createPattern(img, 'no-repeat');
		ctx.fillStyle = pat;
		ctx.fillRect(0,0, 550, 550);

        //绘制起点
		ctx.fillStyle = "#82FF7A";
		ctx.fillRect(0, 50, 50, 50);

		ctx.fillStyle = "black";
		ctx.font="40px Arial";
		ctx.fillText("S", 10, 90);

        //绘制路径
		ctx.fillStyle = "#F7EED6";
		for(var i = 0; i < path_x.length; i++)
		{
			ctx.fillRect(path_x[i], path_y[i], 50, 50);
		}

        //绘制终点
	    ctx.fillRect(50, 50, 50, 50);
	    ctx.fillStyle = "#8684FF";
	    ctx.fillRect(500, 450, 50, 50);

	    ctx.fillStyle = "black";
		ctx.font="40px Arial";
		ctx.fillText("E", 510, 490);

	}

    //游戏重新开始
	DFA = -1;
}

//游戏失败所执行的动作
function game_fail(x, y)
{
	var dyna = document.getElementById("dynatic");

    //显示提示信息
	dyna.innerHTML = "You Lose";

    //将碰触的墙壁设置为红色
	x1 = x - x % 50;
	y1 = y - y % 50;
	ctx.fillStyle = "red";
	ctx.fillRect(x1, y1, 50, 50);

    //确定性有限自动机到达位置8
	DFA = 8;
}

//body加载完成后初始化canvas图片背景
function init_pic()
{
	c = document.getElementById("maze");
    ctx = c.getContext("2d");
    img = new Image();

	img.src = 'image/background.jpg';
	img.onload = function()
	{
		var pat = ctx.createPattern(img, 'no-repeat');
		ctx.fillStyle=pat;
		ctx.fillRect(0,0, 550, 550);
	}
}

//在产生点击效果后恢复button的位置
function recover()
{
	var obj = document.getElementById("generate_button");
	obj.style.transform="translate(3px, 3px)";
	obj.style.boxShadow = "0px 0px 0px 0 #25527a";
	obj.style.backgroundColor = "#25527a";
}

//初始化一个新的迷宫
function init()
{
    //获取初始化按键
	var obj = document.getElementById("generate_button");

    //更改初始化按键的呈现效果
	obj.style.transform="translate(-3px, -3px)";
    obj.style.boxShadow = "5px 5px 0px 0 #25527a";
	obj.style.backgroundColor = "#167bd4";

    //如果没有另一个迷宫正在被构建
    if(!on_build)
    {
	    c = document.getElementById("maze");
	    ctx = c.getContext("2d");
	    img = new Image();
		img.src = 'image/background.jpg';
		img.onload = function()
		{
			var pat = ctx.createPattern(img, 'no-repeat');
			ctx.fillStyle=pat;
			ctx.fillRect(0,0, 550, 550);

            //绘制起点
			ctx.fillStyle = "#82FF7A";
			ctx.fillRect(0, 50, 50, 50);

			ctx.fillStyle = "black";
			ctx.font="40px Arial";
			ctx.fillText("S", 10, 90);
		}

        //绘制地图并添加鼠标移动事件
	    build_maze(0, 0);
	    mouse();
    }
}

//构造地图
function build_maze(x, y)
{
    //更新构造状态为正在构造
	on_build = true;

    //重新初始化已绘制点的数组
	path_x = new Array();
	path_y = new Array();

    //构造初始节点
    var init_node = node();
    stack.push(init_node);

    //更新节点位置的状态
    pos_array[x][y] = 1;

    //每30ms绘制一个新节点
    t = setInterval("setNodes()", 30)

}

//处理迷宫节点
function setNodes()
{
	console.log(count)

    //获取DFS的栈顶节点
    top_node = stack[stack.length - 1];

    //在canvas上绘制节点
	path_color(top_node);

    //如果有其他可达节点
    if(check_auth(top_node))
    {
        //构造两个节点之间的一条路径
        setTimeout("buildPath()", 15);
    }
    else
    {
        //否则将节点弹出，直到找到一个节点能够到达其他可达节点
        while(!check_auth(stack[stack.length - 1]) && count != 24)
        {
	        stack.pop();
        }
    }

    //所有节点均已到达
    if(count == 24)
    {
        //重新绘制初始节点
	    ctx.fillRect(50, 50, 50, 50);

        //绘制终点
	    ctx.fillStyle = "#8684FF"
	    ctx.fillRect(500, 450, 50, 50);

	    ctx.fillStyle = "black";
		ctx.font="40px Arial";
		ctx.fillText("E", 510, 490);

        //清除有关状态，方便重新绘图
		clear_maze();
    }
}

//构造两个节点间的路径
function buildPath()
{
	var new_node = randon_direct(top_node.x, top_node.y);

    wall_color(new_node, top_node);
    pos_array[new_node.x][new_node.y] = 1;
    count++;
    stack.push(new_node);
}

//绘制迷宫节点
function path_color(top_node)
{
	var tmp_x = 50 + top_node.x * 100;
	var tmp_y = 50 + top_node.y * 100;

	ctx.fillStyle = "#F7EED6";
    ctx.fillRect(tmp_x, tmp_y, 50, 50);

    //将节点加入已绘制列表
    path_x.push(tmp_x);
    path_y.push(tmp_y);
}

//查看节点是否有其他可达节点，并设置可达方向的bool值为true
function check_auth(node)
{
    if(valid_pos(node.x, node.y - 1))
    {
        w = true;
    }
    else
    {
        w = false;
    }

	if(valid_pos(node.x, node.y + 1))
    {
        s = true;
    }
    else
    {
        s = false;
    }

    if(valid_pos(node.x - 1, node.y))
    {
        a = true;
    }
    else
    {
        a = false;
    }

    if(valid_pos(node.x + 1, node.y))
    {
        d = true;
    }
    else
    {
        d = false;
    }

    if(w || s || a || d)
    {
	    return true;
    }
    else
    {
		return false;
    }
}

//确定某个方向是否可达
function valid_pos(a, b)
{
    if(a >= 0 && a < 5 && b >= 0 && b < 5)
    {
        if(pos_array[a][b] == 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

//随机在可达方向中选择下一个方向，确保每次重新绘制的迷宫带有随机性
function randon_direct(x, y)
{
    var dir = ""
    var t_node = node();
    while(dir == "")
    {
        var ran = Math.floor((Math.random() * 10) % 4);
        switch(ran)
        {
            case 0:
                if(w)
                {
                    dir = "w";
                    t_node.x = x;
                    t_node.y = y - 1;
                }
                break;
            case 1:
                if(s)
                {
                    dir = "s";
                    t_node.x = x;
                    t_node.y = y + 1;
                }
                break;
            case 2:
                if(a)
                {
                    dir = "a";
                    t_node.x = x - 1;
                    t_node.y = y;
                }
                break;
            case 3:
                if(d)
                {
                    dir = "d";
                    t_node.x = x + 1;
                    t_node.y = y;
                }
                break;
        }
    }

    //返回可达节点
    return t_node;
}

//绘制两个节点之间的路径
function wall_color(to_node, from_node)
{
	var tmp_x = 50 + 100 * from_node.x + (to_node.x - from_node.x) * 50;
	var tmp_y = 50 + 100 * from_node.y + (to_node.y - from_node.y) * 50;

	ctx.fillStyle = "#F7EED6";
    ctx.fillRect(tmp_x, tmp_y, 50, 50);

    //加入已绘制节点
    path_x.push(tmp_x);
    path_y.push(tmp_y);
}

function clear_maze()
{
    //将栈清空
	stack = new Array();

    //重设节点状态
    for(var i = 0; i < 5; i++)
	{
	    pos_array[i] = new Array();
	    for(var j = 0; j < 5; j++)
	    {
	        pos_array[i][j] = 0;
	    }
	}

    //已绘制节点数归零
	count = 0;

    //游戏重新开始
    DFA = -1

    //不再继续绘制
    clearInterval(t);
    on_build = false;
}

//获取鼠标位置
function getMousePos(canvas, event)
{
    //获取canvas边界
	var rect = canvas.getBoundingClientRect();
	return{
		x:event.clientX - rect.left * (canvas.width / rect.width),
		y:event.clientY - rect.top * (canvas.height / rect.height)
	}
}
