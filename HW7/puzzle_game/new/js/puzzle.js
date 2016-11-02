/*
13331233    孙中阳
2016.11.2  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//设置初始维度
var dimension = 3;

//全局变量Puzzle宽度及Puzzle高度
var background_image_width;
var background_image_height;

//全局变量Puzzle北京图像
var background_image = new Image();

//用于终止随机生成Puzzle setInterval()变量
var t;

//用于终止求解Puzzle setInterval()变量
var t2;

//记录求解栈中剩余节点数量的变量
var back_count

//随机生成迷宫过程中记录当前生成位置的变量
var random_id;

//为了提升随机生成Puzzle的效率，记录之前空格的位置以避免Puzzle Item的往复
var pre_id = dimension * dimension - 1;

//空格位置
var empty_pos;

//是否正在生成迷宫
var onStart = false;

//是否正在解决
var onSolve = false;

//是否正在游戏
var inGame;

//是否强制重新开始
var qiangzhi;

//记录当前点击过的格子的栈
var stack;

//记录当前Puzzle状态的数组
var status_array

//初始背景名为galaxy
var bg_name = "galaxy"

//初始化背景为Galaxy
background_image.src = "image/galaxy_square.jpg";
background_image.onload = function() {
    background_image_width = background_image.width;
    background_image_height = background_image.height;
}

//页面加载完成后自动根据当前状况生成Puzzle
function init()
{
    clear();
    build_puzzle();
}

function clear()
{
    //终止生成或者恢复
    clearInterval(t);
    clearInterval(t2);

    //退出游戏状态
    inGame = false;
    //恢复步数为零
    back_count = 0;

    //更改Start按钮内容
    $("#start_button").html("Start")

    random_id = -1;

    empty_pos = dimension * dimension - 1;

    stack = new Array();

    //清空当前Puzzle
    $("#puzzle").empty();

    //重新按照新维度更新状态
    status_array = new Array();

    _.times(dimension, function(i)
    {
        status_array[i] = new Array();
        _.times(dimension, function(j)
        {
            status_array[i][j] = i * dimension + j;
        });
    });

    status_array[dimension - 1][dimension - 1] = "empty";
}

function build_puzzle()
{
    //初始化Puzzle的每个格子
    _.times(dimension, function(i)
    {
        //新建一行
        var tr = document.createElement("tr")
        $("#puzzle").append(tr);

        _.times(dimension, function(j)
        {
            //构造一个td对象
            var td = document.createElement("td");

            //每个td里面有一个带编号的div
            var div = document.createElement("div");

            //设置id
            $(div).attr("id", (i * dimension + j).toString());

            //构造一个新的button,并设置button的有关信息
            var btn = document.createElement("button");

            $(btn).attr({"class" : "puzzle_btn", "id" : "btn_" + (i * dimension + j).toString()}).css({"width" : (background_image_width / dimension).toString() + "px", "height" : (background_image_height / dimension).toString() + "px"}).click(btn_click)

            //初始化button的背景
            if( i * dimension + j != dimension * dimension - 1)
            {
                $(btn).css({"background-size" : background_image_width.toString() + "px", "background-position" : -(j * background_image_width / dimension).toString() + "px " + -(i * background_image_height / dimension).toString() + "px"});
            }
            //最后一个button是透明的
            else
            {
                $(btn).css({"background-color" : "transparent", "box-shadow" : "none"});
            }

            $(tr).append($(td).append($(div).append($(btn))));
        });
    });

    change_init(bg_name);
}

//点击button，则Puzzle发生改变
function btn_click()
{
	//检测当前是随机生成还是用户的点击生成
    if(random_id != -1)
    {
        id = random_id;
    }
    else
    {
        id = this.parentNode.id;
    }

    //如果点击的button旁边有空格，则交换button和空格的位置
    if(Math.floor(id / dimension - 1) >= 0 && status_array[Math.floor(id / dimension - 1)][id % dimension] == "empty")
    {
        move(this.id);
        //更新Puzzle状态
        var tmp = status_array[Math.floor(id / dimension)][id % dimension] ;
        status_array[Math.floor(id / dimension - 1)][id % dimension] = tmp;
        status_array[Math.floor(id / dimension)][id % dimension] = "empty";
        empty_pos = id;
        //将当前操作入栈，方便返回初始状态
        stack.push(id);
    }
    if(Math.floor(id / dimension + 1) < dimension && status_array[Math.floor(id / dimension + 1)][id % dimension] == "empty")
    {
        move(this.id);
        //更新Puzzle状态
        var tmp = status_array[Math.floor(id / dimension)][id % dimension] ;
        status_array[Math.floor(id / dimension + 1)][id % dimension] = tmp;
        status_array[Math.floor(id / dimension)][id % dimension] = "empty";
        empty_pos = id;
        //将当前操作入栈，方便返回初始状态
        stack.push(id);
    }
    if(id % dimension - 1 >= 0 && status_array[Math.floor(id / dimension)][id % dimension - 1] == "empty")
    {
        move(this.id);
        //更新Puzzle状态
        var tmp = status_array[Math.floor(id / dimension)][id % dimension] ;
        status_array[Math.floor(id / dimension)][id % dimension - 1] = tmp;
        status_array[Math.floor(id / dimension)][id % dimension] = "empty";
        empty_pos = id;
        //将当前操作入栈，方便返回初始状态
        stack.push(id);
    }
    if(id % dimension + 1 < dimension && status_array[Math.floor(id / dimension)][id % dimension + 1] == "empty")
    {
        move(this.id);
        //更新Puzzle状态
        var tmp = status_array[Math.floor(id / dimension)][id % dimension] ;
        status_array[Math.floor(id / dimension)][id % dimension + 1] = tmp;
        status_array[Math.floor(id / dimension)][id % dimension] = "empty";
        empty_pos = id;
        //将当前操作入栈，方便返回初始状态
        stack.push(id);
    }

    //如果当前不在生成过程中或者解决过程中，在游戏状态中
    if(!onStart && !onSolve && inGame)
    {
	    var judge = true;

	    //如果发现当前状态和目标结果相同
	    for(var i = 0; i < dimension * dimension - 1; i++)
	    {
		    if(status_array[Math.floor(i / dimension)][i % dimension] != i)
		    {
			    judge = false;
			    break;
		    }
	    }

	    if(judge)
	    {
		    //先恢复到初始状态，然后发出通知信息
		    difficult_change(dimension);
		    setTimeout("alert('You Win!');", 5)
	    }
    }
}

//移动某个button，这里由于要不断获取节点并互相删除以及添加，采用jquery会产生非常长的一个语句，可读性并不好，故没有采用jquery的实现
function move(btn_id)
{
    //首先获取到当前的空格button和要交换的button
    var empty_btn = document.getElementById("btn_" + (dimension * dimension - 1).toString())
    var empty_td = empty_btn.parentNode;
    var current_btn = document.getElementById(btn_id)
    var current_td = current_btn.parentNode;

    //交换两个button的位置
    empty_btn.parentNode.removeChild(empty_btn);
    current_td.removeChild(current_btn);
    empty_td.appendChild(current_btn);
    current_td.appendChild(empty_btn);
}

//点击开始随机生成Puzzle，并开始游戏
function start()
{
	onStart = true;

	//如果正在游戏，则恢复显示为Start，同时重新初始化
	if(inGame)
	{
		$("#start_button").html("Start");
		qiangzhi = true;
		difficult_change(dimension);
		qiangzhi = false;
	}
	//如果不是正在游戏，则开始游戏，按钮内容更改为Restart，并开始随机生成
	else
	{
		inGame = true;
		$("#start_button").html("Restart");
		//每10毫秒到达一个新的状态
		t = setInterval("random_move()", 10);
	}
}

//随机到达新状态
function random_move()
{
	//到达给定的生成数量时
    if(stack.length >= dimension * dimension * 5)
    {
	    //生成状态结束
	    onStart = false;
        random_id = -1;

        //停止随机生成
        clearInterval(t);
    }
    else
    {
	    //随机选择一个新方向
        while(true)
        {
            random = _.random(3);

            //0 1 2 3 分别代表上下左右
            switch(random)
            {
                case 0:
                    random_id = empty_pos + 1;
                    break;
                case 1:
                    random_id = empty_pos - 1;
                    break;
                case 2:
                    random_id = empty_pos + dimension;
                    break;
                case 3:
                    random_id = empty_pos - dimension;
                    break;
            }
            //某些状态是非法的或者不是我们期望的，重新选择新方向
            if(random_id < 0 || random_id >= dimension * dimension || Math.floor(random_id / dimension) != Math.floor(random_id / dimension) || random_id == pre_id)
            {
                continue;
            }
            else
            {
	            //防止往复运动
		        pre_id = empty_pos;
                break;
            }
        }

        //根据选中的id出发点击动作
        $("#"+ random_id).children().first().click();
    }
}

//恢复初始状态
function slove()
{
	onSolve = true;
	back_count = stack.length - 1;

	//开始恢复
	t2 = setInterval("back_solve(back_count)", 200);
}

//每次前进一个状态
function back_solve(i)
{
	//如果还没有到达初始步数
	if(i >= 0)
	{
        $("#" + stack[i].toString()).children().first().click();
		back_count--;
	}
	else
	{
		//终止恢复
		clearInterval(t2);

		$("#" + (dimension * dimension - 1).toString()).children().first().click();
		stack = new Array();
		onSolve = false;
		inGame = false;

		//更新Start按钮的状态
		$("#start_button").html("Start");
	}
}

//更改当前背景
function background_change(background)
{
	//根据传入的数据决定更换的背景
	set_button_border(background.toLowerCase());

    change_init(background.toLowerCase());
}

function set_button_border(background)
{
    switch(background)
    {
        case "galaxy":
            //设定每个button的阴影
            $(".puzzle_btn").not($("#btn_" + (dimension * dimension - 1).toString())).css("box-shadow", "3px 3px 3px 0 #3c3c3c");
            break;
        case "river":
            $(".puzzle_btn").not($("#btn_" + (dimension * dimension - 1).toString())).css("box-shadow", "2px 2px 2px 0 #3c3c3c");
            break;
        case "beach":
            //设定每个button的阴影
            $(".puzzle_btn").not($("#btn_" + (dimension * dimension - 1).toString())).css("box-shadow", "1px 1px 1px 0 #747171");
            break;
    }
}

//具体更换背景的操作
function change_init(bg_n)
{
	bg_name = bg_n;

	background_image = new Image();

	//生成新的背景地址
	$(background_image).attr("src", "image/" + bg_name + "_square.jpg");
	background_image.onload = function() {
	    background_image_width = background_image.width;
	    background_image_height = background_image.height;
	}

	//按照id重新初始化每个button的背景
	_.times(dimension * dimension - 1, function(i)
	{
        $("#" + "btn_" + i).css("backgroundImage", "url('image/" + bg_name + "_square.jpg')");
	});

	//设置页面背景
    $("body").css("background", "url('image/" + bg_name + "_blur.jpg')");

	//设置完成图片的背景
    $("#complete").attr("src", "image/" + bg_name + "_square.jpg");
}

//更改难度，同时重新初始化
function difficult_change(new_dimension)
{
	//如果维数不同或者在强制状态，则更新到新难度
	if(new_dimension != dimension || qiangzhi)
	{
        dimension = new_dimension;

        clear();

	    //重新按照新维度初始化每个button
	    build_puzzle();

	    //重新根据背景初始化每个button的阴影
	    set_button_border(bg_name);
	}
}
