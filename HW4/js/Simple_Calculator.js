/*
13331233    孙中阳
2016.10.06  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//一个标志位，用于记录计算是否已完成
compute_f = false;

//鼠标按下按钮后，改变按钮的颜色使其产生被按下的视觉效果
function mDown(obj)
{
    //改变按钮颜色
    obj.style.background="linear-gradient(to top, #F7EED6, #bcb6a4 90%)";
}

//鼠标从按下的按钮上松开，恢复按钮的颜色并执行计算器的有关行为
function mUp(obj)
{
    //恢复按钮颜色
    obj.style.background="linear-gradient(to bottom, #F7EED6, #bcb6a4 90%)";

    //获取输出框
    var input = document.getElementById("out");

    //获取按下按钮上的文本内容
    Button_Content = obj.innerHTML

    //如果此时输出框内容为0，则认为其在初始化状态
    if(input.value == "0")
    {
        //初始化状态按下"="，
        if(Button_Content == "=")
        {
            compute_f = false;
        }
        //在初始状态按下"←"或"CE"不会执行任何动作
        else if(Button_Content == "←" || Button_Content == "CE")
        {

        }
        //按下其他按钮则会初始化表达式
        else
        {
            var tmp_string = Button_Content;
            input.value = tmp_string;
            compute_f = false;
        }
    }
    //如果当前输出框已有表达式
    else
    {
        if(Button_Content == "=")
        {
            //计算结果时捕获可能出现的异常
            try
            {
	            while(input.value.indexOf("÷") != -1 || input.value.indexOf("×") != -1)
	            {
		            input.value = input.value.replace("÷", "/").replace("×", "*");
	            }
                input.value = eval(input.value);
                compute_f = true;
            }
            catch(err)
            {
                //出现异常则弹框告警
                alert("Expression error: " + err.message);
            }
        }
        //如果当前按钮内容为"←"
        else if(Button_Content == "←")
        {
            //当前输出框如果有不止一个值，则删除掉一个
            if(input.value.length > 1)
            {
                input.value = input.value.substring(0, input.value.length - 1);
            }
            //如果当前输出框只有一个值，那么这个值被删掉，并且置为0
            else
            {
                input.value = "0";
            }
        }
        else if(Button_Content == "CE")
        {
            input.value = "0";
            compute_f = false;
        }
        //如果刚刚完成了一次计算，那么输入按钮内容不是数字则继续表达式，否则会重新将输出框设置为新的数字
        else if(compute_f == true)
        {
            if(isNaN(Button_Content))
            {
                var tmp_string = input.value + Button_Content;
                input.value = tmp_string;
                compute_f = false;
            }
            else
            {
                var tmp_string = Button_Content;
                input.value = tmp_string;
                compute_f = false;
            }
        }
        //其他情况下，追加表达式
        else
        {
            var tmp_string = input.value + Button_Content;
            input.value = tmp_string;
        }
    }
