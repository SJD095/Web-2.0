function node()
{
    var n = new Object;
    n.x = 0;
    n.y = 0;
    
    return n;
}

var stack = new Array();

var c;
var ctx;

var w = false;
var s = false;
var a = false;
var d = false;

var on_build = false;

var pre_status = ""
var status = "out"
var tmp_s = ""

var DFA = -1

var t

var pos_array = new Array();
for(var i = 0; i < 5; i++)
{
    pos_array[i] = new Array();
    for(var j = 0; j < 5; j++)
    {
        pos_array[i][j] = 0;
    }
}

//console.log(mousePos.x.toString() + ", " + mousePos.y.toString())

function mouse()
{
	window.addEventListener("mousemove", function(event)
	{
    	var mousePos = getMousePos(c, event);
    	
    	var imageData = ctx.getImageData(Math.floor(mousePos.x), Math.floor(mousePos.y), 1, 1).data;
    	
    	if(mousePos.x >= 0 && mousePos.y >= 0 && mousePos.x < 550 && mousePos.y < 550)
    	{
	    	if(imageData[0] == "247" && imageData[1] == "238" && imageData[2] == "214")
	    	{
		    	tmp_s = "i";
	    	}
	    	else if(mousePos.x >= 0 && mousePos.y >= 50 && mousePos.x < 50 && mousePos.y < 100)
	    	{
		    	tmp_s = "s";
		    	console.log(DFA)
		    	if(DFA == -1)
		    	{
			    	DFA = 0
			    }
	    	}
	    	else if(imageData[0] == "134" && imageData[1] == "132" && imageData[2] == "255")
	    	{
		    	tmp_s = "e";
	    	}
	    	else
	    	{
		    	tmp_s = "other"
	    	}
    	}
    	
    	else
    	{
	    	tmp_s = "out";
    	}
    	
    	if(tmp_s != status && DFA >= 0)
    	{
	    	pre_status = status;
	    	status = tmp_s;
	    	
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
			
			switch(DFA)
			{
				case 2:
					alert("failure");
					DFA = -1;
					break;
				case 3:
					alert("failure");
					DFA = -1;
					break;
				case 6:
					alert("failure");
					DFA = -1;
					break;
				case 5:
					alert("cheat");
					DFA = -1;
					break;
				case 7:
					alert("win");
					DFA = -1;
					break;
			}
		
			console.log(DFA);
		}
    });
}

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

function recover()
{
	var obj = document.getElementById("generate_button");
	obj.style.transform="translate(3px, 3px)";
	obj.style.boxShadow = "0px 0px 0px 0 #25527a";
	obj.style.backgroundColor = "#25527a"
}

function init()
{	
	var obj = document.getElementById("generate_button");
	
	obj.style.transform="translate(-3px, -3px)";
    obj.style.boxShadow = "5px 5px 0px 0 #25527a";
	obj.style.backgroundColor = "#167bd4";
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
			ctx.fillStyle = "#82FF7A";
			ctx.fillRect(0, 50, 50, 50);
			
			
			ctx.fillStyle = "black";
			ctx.font="40px Arial";
			ctx.fillText("S", 10, 90);
		}
	
	    build_maze(0, 0);
	    mouse();
    }
}

var count = 0;

function build_maze(x, y)
{
	on_build = true;
	
    var init_node = node();
    stack.push(init_node);
    pos_array[x][y] = 1;
   
    t = setInterval("test1()", 30)

}

var top_node

function test1()
{
	console.log(count)
    top_node = stack[stack.length - 1];
	path_color(top_node)
	    
    if(check_auth(top_node))
    {
        setTimeout("test2()", 15)
    }
    else
    {
        while(!check_auth(stack[stack.length - 1]) && count != 24)
        {
	        stack.pop();
        }
    }
    
    if(count == 24)
    {
	    ctx.fillRect(50, 50, 50, 50)
	    ctx.fillStyle = "#8684FF"
	    ctx.fillRect(500, 450, 50, 50);
	    
	    ctx.fillStyle = "black";
		ctx.font="40px Arial";
		ctx.fillText("E", 510, 490);

		clear_maze();
    }
}

function test2()
{
	var new_node = randon_direct(top_node.x, top_node.y);
    wall_color(new_node, top_node);
    pos_array[new_node.x][new_node.y] = 1;
    count++;
    stack.push(new_node);
}

function path_color(top_node)
{
	ctx.fillStyle = "#F7EED6";
    ctx.fillRect(50 + top_node.x * 100, 50 + top_node.y * 100, 50, 50);
}

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
                    dir = "w"
                    t_node.x = x;
                    t_node.y = y - 1;
                }
                break;
            case 1:
                if(s)
                {
                    dir = "s"
                    t_node.x = x;
                    t_node.y = y + 1;
                }
                break;
            case 2:
                if(a)
                {
                    dir = "a"
                    t_node.x = x - 1;
                    t_node.y = y;
                }
                break;
            case 3:
                if(d)
                {
                    dir = "d"
                    t_node.x = x + 1;
                    t_node.y = y;
                }
                break;
        }
    }
    
    return t_node;
}

function wall_color(to_node, from_node)
{
	ctx.fillStyle = "#F7EED6";
    ctx.fillRect(50 + 100 * from_node.x + 50 * (to_node.x - from_node.x), 50 + 100 * from_node.y + (to_node.y - from_node.y) * 50, 50, 50);
}

function clear_maze()
{
	stack = new Array();
    
    for(var i = 0; i < 5; i++)
	{
	    pos_array[i] = new Array();
	    for(var j = 0; j < 5; j++)
	    {
	        pos_array[i][j] = 0;
	    }
	}
	
	count = 0;
    
    clearInterval(t);
    on_build = false;
}

function getMousePos(canvas, event)
{
	var rect = canvas.getBoundingClientRect();
	return{
		x:event.clientX - rect.left * (canvas.width / rect.width),
		y:event.clientY - rect.top * (canvas.height / rect.height)
	}
}