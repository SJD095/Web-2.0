/*
13331233    孙中阳
2016.11.15  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//关闭异步回调
$.ajaxSetup({
    async : false
});

//页面载入完成后执行
window.onload = function()
{
	//获取每个input
	var name_input = document.getElementById("name_input");
	var studentid_input = document.getElementById("studentid_input");
	var phone_input = document.getElementById("phone_input");
	var email_input = document.getElementById("email_input");

	//获取每个错误提示段落
	var name_message = document.getElementById("name_msg");
	var studentid_message = document.getElementById("studentid_msg");
	var phone_message = document.getElementById("phone_msg");
	var email_message = document.getElementById("email_msg");

	//获取两个按钮
	var submit_button = document.getElementById("submit");
	var reset_button = document.getElementById("reset");

	//如果四个状态都标志位成功才能提交
	var name_status = false;
	var studentid_status = false;
	var phone_status = false;
	var email_status = false;

	//鼠标移到用户名输入框
	name_input.onfocus = function()
	{
		set_msg(name_message, "rgb(0,162,74)", "用户名6~18位英文字母、数字或下划线，以英文字母开头");
		$("#name_msg").slideDown();
	}

	//鼠标移到ID输入框
	studentid_input.onfocus = function()
	{
		set_msg(studentid_message, "rgb(0,162,74)", "学号必须是8位数字，不能以0开头");
		$("#studentid_msg").slideDown();
	}

	//鼠标移到电话号码输入框
	phone_input.onfocus = function()
	{
		set_msg(phone_message, "rgb(0,162,74)", "电话必须是11位数字，不能以0开头");
		$("#phone_msg").slideDown();
	}

	//鼠标移到电子邮箱输入框
	email_input.onfocus = function()
	{
		set_msg(email_message, "rgb(0,162,74)", "请输入正确格式的邮箱");
		$("#email_msg").slideDown();
	}

	//鼠标离开用户名输入框
	name_input.onblur = function()
	{
		if(valid_name(name_input.value))
		{
			if(unique("name", name_input.value))
			{
				set_msg(name_message, "rgb(0,162,74)", "这个名字吼哇~");
				setTimeout("$('#name_msg').slideUp('slow');", 500);
				name_status = true;
			}
			else
			{
				set_msg(name_message, "red", "来晚了，这个名字已经被注册了");
				name_status = false;
			}
		}
		else
		{
			var detail = "非法字符";
			if(/^[^(a-zA-Z)]/.test(name_input.value))
			{
				detail = "没有以英文字母开头";
			}
			else if(name_input.value.length < 6 || name_input.value.length > 16)
			{
				detail = "长度不合适";
			}

			set_msg(name_message, "red", "同学你好，用户名有bug " + "(" + detail + ")");
			name_status = false;
		}
	}

	//鼠标离开ID输入框
	studentid_input.onblur = function()
	{
		if(valid_studentid(studentid_input.value))
		{
			if(unique("studentid", studentid_input.value))
			{
				set_msg(studentid_message, "rgb(0,162,74)", "嗯嗯，可以的~");
				setTimeout("$('#studentid_msg').slideUp('slow');", 500);
				studentid_status = true;
			}
			else
			{
				set_msg(studentid_message, "red", "这个学号重复了（做了一点微小的工作）");
				studentid_status = false;
			}
		}
		else
		{
			var detail = "非法字符";
			if(studentid_input.value[0] == "0")
			{
				detail = "以0开头";
			}
			else if(studentid_input.value.length != 8)
			{
				detail = "长度不为8";
			}
			set_msg(studentid_message, "red", "学号貌似不是很对，检查一下? " + "(" + detail + ")");
			studentid_status = false;
		}
	}

	//鼠标离开电话号码输入框
	phone_input.onblur = function()
	{
		if(valid_phone(phone_input.value))
		{
			if(unique("phone", phone_input.value))
			{
				set_msg(phone_message, "rgb(0,162,74)", "PASS^_^");
				setTimeout("$('#phone_msg').slideUp('slow');", 500);
				phone_status = true;
			}
			else
			{
				set_msg(phone_message, "red", "莫非你们共用一个电话？");
				phone_status = false;
			}
		}
		else
		{
			var detail = "非法字符";
			if(phone_input.value[0] == "0")
			{
				detail = "以0开头";
			}
			else if(phone_input.value.length != 11)
			{
				detail = "长度不为11";
			}
			set_msg(phone_message, "red", "这个电话...打不通的 " + "(" + detail + ")");
			phone_status = false;
		}
	}

	//鼠标离开邮箱输入框
	email_input.onblur = function()
	{
		if(valid_email(email_input.value))
		{
			if(unique("email", email_input.value))
			{
				set_msg(email_message, "rgb(0,162,74)", "excited!");
				setTimeout("$('#email_msg').slideUp('slow');", 500);
				email_status = true;
			}
			else
			{
				set_msg(email_message, "red", "一个邮箱只能注册一个号哦");
				email_status = false;
			}
		}
		else
		{
			set_msg(email_message, "red", "蛤，不合法？");
			email_status = false;
		}
	}

	//提交按钮被点击则开始提交表单
	submit_button.onclick = function()
	{
		this.submit;
	}

	//决定是否提交表单
	var form = document.getElementById("information_form");
	form.onsubmit = function()
	{
		//首先将焦点从输入框移开
		name_input.onblur();
		studentid_input.onblur();
		phone_input.onblur();
		email_input.onblur();

		//判断是否达到提交条件并显示相应的提示
		if(name_status && studentid_status && phone_status && email_status)
		{
			alert("注册成功");
			return true;
		}
		else
		{
			alert("要不我们还是先检查一下？");
			if(!name_status)
			{
				$("#name_msg").slideDown();
			}
			if(!studentid_status)
			{
				$("#studentid_msg").slideDown();
			}
			if(!phone_status)
			{
				$("#phone_msg").slideDown();
			}
			if(!email_status)
			{
				$("#email_msg").slideDown();
			}
			return false;
		}
	}

	//重置页面
	reset_button.onclick = function()
	{
		name_message.innerHTML = "";
		studentid_message.innerHTML = "";
		phone_message.innerHTML = "";
		email_message.innerHTML = "";

		name_input.value = "";
		studentid_input.value = "";
		phone_input.value = "";
		email_input.value = "";
	}
}

//设置输入框的提示信息
function set_msg(message, color, content)
{
	message.style.color = color;
	message.innerHTML = content;
}

//判断用户名是否合法
function valid_name(name)
{
	return /^[a-zA-Z][a-zA-Z_0-9]{5,18}$/.test(name);
}

//判断ID是否合法
function valid_studentid(studentid)
{
	return /^[1-9]\d{7}$/.test(studentid);
}

//判断电话号码是否合法
function valid_phone(phone)
{
	return /^[1-9]\d{10}$/.test(phone);
}

//判断邮箱是否合法
function valid_email(email)
{
	return /^[a-zA-Z_\-\d]+@(([a-zA-Z_\-\d])+\.)+[a-zA-Z]{2,4}$/.test(email);
}

//向服务器查询某个输入是否唯一
function unique(key, content)
{
	var result = "";

	$.post("http://localhost:8000/search",
	{
		k:key,
		c:content
	},
	function(data, status)
	{
		result = data;
	});

	if(result == "valid")
	{
		return true;
	}
	else
	{
		return false;
	}
}
