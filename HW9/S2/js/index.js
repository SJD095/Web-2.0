$("document").ready(function()
{
	//禁止页面中的文字被鼠标选中
    document.onselectstart = function()
    {
        return false;
    }

    var result = 0;

    var onRunning = false;

    var finish_array = new Array();
	for(var i = 0; i < 5; i++)
	{
		finish_array.push(0);
	}

	var complete_array = new Array();
	for(var i = 0; i < 5; i++)
	{
		complete_array.push(0);
	}

	$(".A").click(function()
	{
		if($(".A").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("A")] != 1)
		{
			controller("A", finish_array);
			$(".A span").css({"opacity" : "1"}).text("...")

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

				if(onRunning)
				{
					setTimeout("$('.B').click();", 1000)
				}
		    });
		}
	});

	$(".B").click(function()
	{console.log($(".B").css("background-color"))
		if($(".B").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("B")] != 1)
		{console.log("e2")
			controller("B", finish_array);
			$(".B span").css({"opacity" : "1"}).text("...")

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

				if(onRunning)
				{
					setTimeout("$('.C').click();", 1000)
				}
		    });
		}
	});

	$(".C").click(function()
	{
		if($(".C").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("C")] != 1)
		{
			controller("C", finish_array);
			$(".C span").css({"opacity" : "1"}).text("...")

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

				if(onRunning)
				{
					setTimeout("$('.D').click();", 1000)
				}
		    });
		}
	});

	$(".D").click(function()
	{
		if($(".D").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("D")] != 1)
		{
			controller("D", finish_array);
			$(".D span").css({"opacity" : "1"}).text("...")

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

				if(onRunning)
				{
					setTimeout("$('.E').click();", 1000)
				}
		    });
		}
	});

	$(".E").click(function()
	{
		if($(".E").css("background-color") != "rgb(128, 128, 128)" && finish_array[toNumber("E")] != 1)
		{
			controller("E", finish_array);
			$(".E span").css({"opacity" : "1"}).text("...")

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

				if(onRunning)
				{
					$(".info").click();
				}
		    });
		}
	});

	$(".info").click(function()
	{
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
			$(".info").text(result);
		}
	});

	$(".icon").click(function()
	{
		 onRunning = true;

		 $(".A").click();
	})
})

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
