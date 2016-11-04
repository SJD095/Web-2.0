/*
13331233    孙中阳
2016.11.4  szy@sunzhongyang.com
Browser Safari 9.1.3 (10601.7.8)
*/

//当DOM已经加载完成
$(document).ready(function()
{
    //禁止页面中的文字被鼠标选中
    document.onselectstart = function()
    {
        return false;
    }

    //为所有偶数行添加类名 even
    $("tr:even").addClass("even");

    //为每个表格的表头添加编号，用于在排序中标示被用于排序的列
    $("#todo th").each(function(i)
    {
        $(this)[0].th_index = i;
    });
    $("#staff th").each(function(i)
    {
        $(this)[0].th_index = i;
    });

    //获取每个表格的行对象
    var todo_tr = Array.prototype.slice.call($("#todo tr"), 1);
    var staff_tr = Array.prototype.slice.call($("#staff tr"), 1);

    //为每个表头添加点击事件
    $("th").click(function()
    {
        //如果当前是升序排序，则改为降序排序
        if($(this).hasClass("up"))
        {
            $(this).addClass("down");
            $(this).removeClass("up");

            //进行排序并生成新表格
            table_sort(this, todo_tr, staff_tr, false);
        }
        //如果当前是降序排序，则改为升序排序
        else if($(this).hasClass("down"))
        {
            $(this).addClass("up");
            $(this).removeClass("down");

            //进行排序并生成新表格
            table_sort(this, todo_tr, staff_tr, true);
        }
        //如果当前没有排序，则改为升序排序
        else
        {
            $(this).addClass("up");

            //进行排序并生成新表格
            table_sort(this, todo_tr, staff_tr, true);
        }

        $(this).parent().children().not(this).removeClass("up");
        $(this).parent().children().not(this).removeClass("down");
    });
});

function table_sort(that, todo_tr, staff_tr, direction)
{
    //存储所有的行
    var tr = [];

    //判断正在被排序的表格并根据结果初始化 tr
    if($(that).parent().parent().parent().attr("id") == 'todo')
    {
        tr = todo_tr;
    }
    else
    {
        tr = staff_tr;    
    }

    //获取要排序的列
    var index = $(that)[0].th_index;

    //初始化保存结果的数组
    var sort_result = [];

    _.times(tr.length, function(i)
    {
        sort_result.push([]);

        //存入一个tr的所有td
        $(tr[i]).children().each(function()
        {
            sort_result[i].push($(this).text());
        });
    });

    //对数组排序
    sort_result.sort(function(a, b)
    {
        //升序排序
        if (direction === true)
        {
            return a[index] > b[index] ? 1 : -1;
        }
        //降序排序
        else
        {
            return a[index] < b[index] ? 1 : -1;
        }
    });

    //重新初始化表格
    _.times(tr.length, function(i)
    {
        _.times($(tr[i]).children().length, function(j)
        {
            $(tr[i]).children()[j].textContent = sort_result[i][j];
        });
    });
}