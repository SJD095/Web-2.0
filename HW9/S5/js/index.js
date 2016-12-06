$("document").ready(function()
{
    //禁止页面中的文字被鼠标选中
    document.onselectstart = function()
    {
        return false;
    }

    //在正常点击中计算累加结果
    var result = 0;

    //用于记录易被点击过的按钮，已被点击过的按钮会被锁死
    var finish_array = new Array();
    for(var i = 0; i < 5; i++)
    {
        finish_array.push(0);
    }

    //记录点击完成的按钮，所有按钮点击完成后才能显示最终结果
    var complete_array = new Array();
    for(var i = 0; i < 5; i++)
    {
        complete_array.push(0);
    }

    //某个按钮被正常点击
    $(".A").click(function(count)
    {
        //如果该按钮处于可以点击的状态
        if($(".A").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("A")] != 1)
        {
            //设置其他按钮为锁死状态
            controller("A", finish_array);
            //设置按钮的右上角图标内容为 ...
            $(".A span").css({"opacity" : "1"}).text("...")
            //设置显示文本
            $("#talk").text("这是个天大的秘密");

            //发起网络请求
            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                //设置右上角图标内容为返回的数字
                $(".A span").css({"opacity" : "1"}).text(data);
                //设置按钮为不可点击状态
                $(".A").css({ "background-color" : "grey"})

                //累加结果
                result += parseInt(data);
                //设置该按钮的状态为完成点击
                complete_array[toNumber("A")] = 1;

                //将其他按钮，如果能够恢复不锁死状态的，全部恢复
                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
            });
        }
    });

    $(".B").click(function ()
    {
        if($(".B").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("B")] != 1)
        {
            controller("B", finish_array);
            $(".B span").css({"opacity" : "1"}).text("...")
            $("#talk").text("我不知道");

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".B span").css({"opacity" : "1"}).text(data);
                $(".B").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("B")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
            });
        }
    });

    $(".C").click(function ()
    {
        if($(".C").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("C")] != 1)
        {
            controller("C", finish_array);
            $(".C span").css({"opacity" : "1"}).text("...")
            $("#talk").text("你不知道");

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".C span").css({"opacity" : "1"}).text(data);
                $(".C").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("C")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }

            });
        }
    });

    $(".D").click(function ()
    {
        if($(".D").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("D")] != 1)
        {
            controller("D", finish_array);
            $(".D span").css({"opacity" : "1"}).text("...")
            $("#talk").text("他不知道");

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".D span").css({"opacity" : "1"}).text(data);
                $(".D").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("D")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
            });
        }
    });

    $(".E").click(function ()
    {
        if($(".E").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("E")] != 1)
        {
            controller("E", finish_array);
            $(".E span").css({"opacity" : "1"}).text("...")
            $("#talk").text("才怪");

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".E span").css({"opacity" : "1"}).text(data);
                $(".E").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("E")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
            });
        }
    });

    //点击大气泡显示计算结果
    $(".info").click(function()
    {
        //如果全部按钮都已经点击完成
        var tmp = true;
        for(var i = 0; i < 5; i++)
        {
            if(complete_array[i] == 0)
            {
                tmp = false;
            }
        }

        if(tmp)
        {
            //显示随机数相加结果
            $("#info_text").text(result);
            $("#talk").text("楼主异步调用战斗力感人，目测不超过" + result);
        }
    })

    //点击执行随机点击程序
    $(".icon").click(function()
    {
        //获取随机顺序
        random_array = randomArray();
        var order_bar_text = "";

        //设置并显示随机顺序于大气泡上方
        for(var i = 0; i < 5; i++)
        {
            order_bar_text += " " + toString(random_array[i]);
        }

        $("#order_bar").text(order_bar_text);

        //开始随机点击
        random_click(0, random_array, 0);
    })

    //按照要求执行随机点击
    function random_click(count, random_array, result)
    {
        //根据count数量判断执行内容
	    if(count == 5)
	    {
            //模拟点击大气泡
		    var tmp = true;
	        for(var i = 0; i < 5; i++)
	        {
	            if(complete_array[i] == 0)
	            {
	                tmp = false;
	            }
	        }

	        if(tmp)
	        {
	            $("#info_text").text(result);
	            $("#talk").text("楼主异步调用战斗力感人，目测不超过" + result);
	        }
		    return;
	    }

        try
        {
	        switch(random_array[count])
	        {
	            case 0:
	                count += 1;
	                aHandler(count, random_array, result);
	                break;
	            case 1:
	            	count += 1;
	                bHandler(count, random_array, result);
	                break;
	            case 2:
	                count += 1;
	                cHandler(count, random_array, result);
	                break;
	            case 3:
	                count += 1;
	                dHandler(count, random_array, result);
	                break;
	            case 4:
	                count += 1;
	                eHandler(count, random_array, result);
	                break;
	        }
        }
        catch(err)
        {
            //异常处理
	        console.log(err.toString())
	        $("#talk").text(err.split(' ')[1]);
	        random_click(count, random_array, parseInt(err.split(' ')[0]))
        }
    }

    //为了达到题目要求，每个按钮的模拟点击都单独设置了一个 Handler
    function aHandler(count, random_array, result)
    {
        if(finish_array[toNumber("A")] != 1)
        {
            controller("A", finish_array);
            $(".A span").css({"opacity" : "1"}).text("...")
            $("#talk").text("这是个天大的秘密");

            //五分之一的概率发生异常
            if(Math.floor(Math.random() * 5) == 1)
            {
	            $(".A span").css({"opacity" : "1"}).text("x")
                $(".A").css({ "background-color" : "grey"})
	            complete_array[toNumber("A")] = 1;
	            throw result + " " + "这不是个天大的秘密";
            }

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".A span").css({"opacity" : "1"}).text(data);
                $(".A").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("A")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }

                //进行下一次随机点击
                random_click(count, random_array, result)
            });
        }
    }

    function bHandler(count, random_array, result)
    {
        if(finish_array[toNumber("B")] != 1)
        {
            controller("B", finish_array);
            $(".B span").css({"opacity" : "1"}).text("...")
            $("#talk").text("我不知道");

            if(Math.floor(Math.random() * 5) == 1)
            {
	            $(".B span").css({"opacity" : "1"}).text("x")
                $(".B").css({ "background-color" : "grey"})
	            complete_array[toNumber("B")] = 1;
	            throw result + " " + "我知道";
            }

            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".B span").css({"opacity" : "1"}).text(data);
                $(".B").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("B")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
				console.log(count + "s" + result)
                random_click(count, random_array, result)
            });
        }
    }

    function cHandler(count, random_array, result)
    {
        if(finish_array[toNumber("C")] != 1)
        {
            controller("C", finish_array);
            $(".C span").css({"opacity" : "1"}).text("...")
            $("#talk").text("你不知道");

            if(Math.floor(Math.random() * 5) == 1)
            {
	            $(".C span").css({"opacity" : "1"}).text("x")
                $(".C").css({ "background-color" : "grey"})
	            complete_array[toNumber("C")] = 1;
	            throw result + " " + "你知道";
            }


            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".C span").css({"opacity" : "1"}).text(data);
                $(".C").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("C")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
                random_click(count, random_array, result)
            });
        }
    }

    function dHandler(count, random_array, result)
    {
        if(finish_array[toNumber("D")] != 1)
        {
            controller("D", finish_array);
            $(".D span").css({"opacity" : "1"}).text("...")
            $("#talk").text("他不知道");

            if(Math.floor(Math.random() * 5) == 1)
            {
	            $(".D span").css({"opacity" : "1"}).text("x")
                $(".D").css({ "background-color" : "grey"})
	            complete_array[toNumber("D")] = 1;
	            throw result + " " + "他知道";
            }


            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".D span").css({"opacity" : "1"}).text(data);
                $(".D").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("D")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
                random_click(count, random_array, result)
            });
        }
    }

    function eHandler(count, random_array, result)
    {
        if(finish_array[toNumber("E")] != 1)
        {
            controller("E", finish_array);
            $(".E span").css({"opacity" : "1"}).text("...")
            $("#talk").text("才怪");

            if(Math.floor(Math.random() * 5) == 1)
            {
	            $(".E span").css({"opacity" : "1"}).text("x")
                $(".E").css({ "background-color" : "grey"})
	            complete_array[toNumber("E")] = 1;
	            throw result + " " + "不奇怪";
            }


            $.get("http://localhost:3000",
            {

            },
            function(data, status)
            {
                $(".E span").css({"opacity" : "1"}).text(data);
                $(".E").css({ "background-color" : "grey"})

                result += parseInt(data);
                complete_array[toNumber("E")] = 1;

                for(var i = 0; i < 5; i++)
                {
                    if(finish_array[i] == 0)
                    {
                        $("." + toString(i)).css({ "background-color" : "rgba(48, 63, 159, 1)"})
                    }
                }
                random_click(count, random_array, result)
            });
        }
    }

    function controller(value, finish_array)
    {
        finish_array[toNumber(value)] = 1;

        for(var i = 0; i < 5; i++)
        {
            if(finish_array[i] == 0)
            {
                $("." + toString(i)).css({ "background-color" : "grey"})
            }
        }
    }

    function toNumber(string)
    {
        switch(string)
        {
            case "A":
                return 0;
            case "B":
                return 1;
            case "C":
                return 2;
            case "D":
                return 3;
            case "E":
                return 4;
        }
    }

    function toString(num)
    {
        switch(num)
        {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
            case 4:
                return "E";
        }
    }

    function randomArray()
    {
        select_array = new Array(5);
        random_array = new Array();

        for(var i = 0; i < 5;)
        {
            var tmp = Math.floor(Math.random() * 10) % 5;
            if(select_array[tmp] != 1)
            {
                random_array.push(tmp);
                select_array[tmp] = 1;
                i++;
            }
        }

        return random_array;
    }
})


