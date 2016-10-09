cal = false;

function mDown(obj)
{
	obj.style.background="linear-gradient(to top, #F7EED6, #bcb6a4 90%)";
}

function mUp(obj)
{
	obj.style.background="linear-gradient(to bottom, #F7EED6, #bcb6a4 90%)";
	
	var input = document.getElementById("out");
	if(input.value == "0")
	{
		if(obj.innerHTML == "=")
		{
			cal = false;
		}
		else
		{
			var tmp_string = obj.innerHTML;
			input.value = tmp_string;
			cal = false;
		}
	}
	else
	{
		if(obj.innerHTML == "=")
		{
			input.value = eval(input.value);
			cal = true;
		}
		else if(obj.innerHTML == "CE")
		{
			input.value = "0";
			cal = false;
		}
		else if(cal == true)
		{
			if(isNaN(obj.innerHTML))
			{
				var tmp_string = input.value + obj.innerHTML;
				input.value = tmp_string;
				cal = false;
			}
			else
			{
				var tmp_string = obj.innerHTML;
				input.value = tmp_string;
				cal = false;
			}
		}
		else
		{
			var tmp_string = input.value + obj.innerHTML;
			input.value = tmp_string;
		}
	}
}