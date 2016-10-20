/*
13331233    孙中阳
2016.10.15  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//表示上一个目标按钮
var pre_button = 0;

//倒计时初始时间
var time = 30;

//表示游戏状态，最初并没有开始游戏
var play = false;

//表示当前目标按钮的id
var button_id = -1;

//表示当前分数
var score = 0;

//表示显示分数的面板
var score_panel;

//表示显示时间的面板
var time_panel;

//表示游戏状态
var game_status;

//表示玩家用于输入名称的input
var player_name;

//表示用于显示排名的div
var ranking_div;

//setInterval()的返回值，用于在必要时终止循环
var t;

//body load完成后自动加载有关设置
function init()
{
	var table = document.getElementById("button_panel");

	//添加地鼠，所有地鼠存在一个 5 * 8 的 table 中
	for(var i = 0; i < 5; i++)
	{
		newRow = table.insertRow();

		for(var j = 0; j < 8; j++)
		{
			newItem = newRow.insertCell();

			//每个地鼠都是一个button，属于 btn 类
			var btn = document.createElement("button");
			btn.type = "button";
			btn.id = (8 * i + j).toString();
			btn.className = "btn";
			btn.onclick = btn_click;
			newItem.appendChild(btn);
		}
	}

	//获取各必要变量
	score_panel = document.getElementById("score_panel");
	time_panel = document.getElementById("time_panel");
	game_status = document.getElementById("game_status");
	player_name = document.getElementById("player_name");
	ranking_div = document.getElementById("ranking_detail");

	//从服务器获取当前排名
	get_ranking();
}

//开始或者终止游戏
function start_stop()
{
	//如果目前不在游戏过程中
	if(!play)
	{
		//更改面板到游戏状态
		game_status.innerHTML = "Playing";
		score_panel.innerHTML = "0";
		time_panel.innerHTML = time.toString();

		play = true;
		//随机产生一个目标按钮
		random_button();
		//倒计时开始
		t = setInterval("time_count()", 1000);
	}
	else
	{
		//否则终止游戏
		clear();
	}
}

//倒计时
function time_count()
{
	//目前时间非零则递减
	if(time != 0)
	{
		--time;
		time_panel.innerHTML = time.toString();
	}
	else
	{
		//游戏结束
		clear();
	}
}

//点击地鼠
function btn_click()
{
	//游戏进行状况下才进行计分等操作
	if(play)
	{
		//如果是第一次点击
		if(pre_button == 0)
		{
			pre_button = this;
			//如果点击的地鼠是目标地鼠，则加分
			if(this.id == button_id)
			{
				increase_score(1);
				random_button();
			}
		}
		//如果不是第一次点击
		else
		{
			if(this.id == button_id)
			{
				//增加的分数为此次地鼠和之前地鼠的曼哈顿距离
				var grade = parseInt(this.innerHTML);
				increase_score(grade);
				random_button();
			}
			else
			{
				//否则减分
				pre_button = this;
				increase_score(0 - cal_score(button_id));
			}
		}
	}
}

//随机产生新地鼠
function random_button()
{
	//产生一个不同于上个地鼠的地鼠
	while(button_id == (tmp = Math.floor(Math.random() * 100) % 40));

	//构造新地鼠
	var new_btn = document.getElementById(tmp);

	new_btn.className = "btn2";

	//如果不是初次点击，则重置原地鼠
	if(button_id != -1)
	{
		pre_button = document.getElementById(button_id);
		pre_button.className = "btn";
		pre_button.innerHTML = "";

		new_btn.innerHTML = cal_score(tmp);
	}
	else
	{
		new_btn.innerHTML = 1;
	}

	button_id = new_btn.id;

	return new_btn;
}

//根据两个地鼠的曼哈顿距离设置分数
function cal_score(id)
{
	//x1, y1 需为整数
	var x1 = Math.floor(pre_button.id / 8);
	var y1 = pre_button.id % 8;
	var x2 = Math.floor(id / 8);
	var y2 = id % 8;

	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

//增加分数
function increase_score(i)
{
	//分数不能小于零
	if(score + i >= 0)
	{
		score += i;
	}
	else
	{
		score = 0;
	}

	score_panel.innerHTML = score;
}

//清理状态，恢复其初始值
function clear()
{
	alert("Game Over\nYour score is " + score.toString());
	//向服务器更新成绩
	update_ranking();

	if(button_id != -1)
	{
		pre_button = document.getElementById(button_id);
		pre_button.className = "btn";
		pre_button.innerHTML = "";
	}

	play = false;
	time = 30;
	button_id = -1;
	pre_button = 0;
	score = 0;
	game_status.innerHTML = "Game Over"

	//终止倒计时
	clearInterval(t);
}

//从服务器获取排名
function get_ranking()
{
	var child_list = document.getElementsByClassName("no_border");

	//清空当前排名
    while(child_list.length != 0)
    {
	    for(var i = 0; i < child_list.length; i++)
	    {
		    child_list[i].parentNode.removeChild(child_list[i]);
	    }

	    var child_list = document.getElementsByClassName("no_border");
    }

	$.get("http://sunzhongyang.com:15001/ranking",
    {

    },
    function(data, status)
    {
	    //解析json
        var json_list = eval('(' + data + ')');
        var count = 0;

        for(var o in json_list)
        {
	        ++count;
	        //只显示前十的排名
	        if(count == 10)
	        {
		        break;
	        }

	        //构造新排名
	        var p = document.createElement("span");
	        p.className = "no_border";
	        p.innerHTML = count.toString() + ".&nbsp;&nbsp;" + json_list[o].name + "&nbsp;&nbsp;&nbsp;" + json_list[o].score;
	        ranking_div.appendChild(p);
        }
    });
}

//更新排名
function update_ranking()
{
	//获取玩家姓名
	var name = player_name.value;
	if(name == "")
	{
		name = "test";
	}
	var score = score_panel.innerHTML;

	//向服务器提交信息
	$.post("http://sunzhongyang.com:15001/update",
	{
		n:name,
		s:score
	},
	function(data, status)
	{
		//提交完成后更新排名
		get_ranking();
	});
}

//清除当前排名
function clear_ranking()
{
	//首先清除页面上的排名
	var child_list = document.getElementsByClassName("no_border");

    while(child_list.length != 0)
    {
	    for(var i = 0; i < child_list.length; i++)
	    {
		    child_list[i].parentNode.removeChild(child_list[i]);
	    }
	    var child_list = document.getElementsByClassName("no_border");

    }

    //然后清除服务端的排名
	$.get("http://sunzhongyang.com:15001/clear",
    {

    },
    function(data, status)
    {
    });
}
