jQuery(document).ready(function()
{
    disableLink();
    update();
	MsgTempUrlReady();
});

function MsgTempUrlReady()
{
	parent.document.getElementById('errmsgtd').innerHTML = '<font style="PADDING-LEFT: 4px; FONT-SIZE: 12pt; COLOR: #ff0000; PADDING-TOP: 20px; FONT-FAMILY: 黑体; LETTER-SPACING: 2pt;">模版网页加载完成！</font>';
	parent.document.getElementById('errmsgtr').style.display = "";
}

function update()
{
	jQuery("*").hover(
		function(e){
			jQuery('._choice').removeClass("_choice");
			jQuery(this).addClass("_choice");
			return false;
		},
		function(){
			jQuery(this).removeClass("_choice");
			var obj = this.parentNode;
			if (obj)
				jQuery(obj).addClass("_choice");
			return false;
		}
	);
	
    jQuery('*').click(
        function(){
	        //获取当前被点元素。
            var clickedobj = jQuery(this);
            
            //http://bbs.yahoo.cn/thread-htm-fid-335-page-1.html 无法调用ajax，所以，后面的操作暂时不做。
            if (clickedobj.hasClass('_selected'))
                clickedobj.removeClass('_selected');
            else
                clickedobj.addClass('_selected');
			UpdateHighStatus();
            return false;
        }
    );
}

/*
 统计高亮节点个数和高亮节点的公共属性。
 */
function UpdateHighStatus()
{
	var commonattrs = []; // 公共属性。
	var count = 0; // 高亮节点个数。
	jQuery('._selected', document).each(
		function(index)
		{
			count = count + 1;
			if(count == 1)
			{
				commonattrs = getInfoAttrNames(this);
			}
			else
			{
				commonattrs = getCommonInfoAttrNames(this, commonattrs);
			}
		}
	);
	parent.document.getElementsByTagName('*').highnodenum.innerHTML=count;
	
	parent.document.getElementsByTagName('*').commonattr.options.length = 0;
	parent.document.getElementsByTagName('*').commonattr.options.add(new Option('--请选择--', ''));
	for(var i = 0; i < commonattrs.length; i ++)
	{
		parent.document.getElementsByTagName('*').commonattr.options.add(new Option(commonattrs[i], commonattrs[i]));
	}
}

/*
 获取节点的所有属性名称。
 */
function getInfoAttrNames(elt)
{
	var names = [];
	if(elt.attributes == null)
	{
		return names;
	}
	var attrlist = elt.getAttribute('info_attrname_list');
	if(attrlist == null || attrlist == '')
	{
		return names;
	}
	return attrlist.split('_s_p_l_i_t_');
}

/*
 获取节点的公共属性名称。
 */
function getCommonInfoAttrNames(elt, commonattrs)
{
	var names = [];
	var eltattrnames = getInfoAttrNames(elt);
	for(var i = 0; i < eltattrnames.length; i ++)
	{
		var exist = false;
		for(var j = 0; j < commonattrs.length; j ++)
		{
			if(eltattrnames[i] == commonattrs[j])
			{
				exist = true;
				break;
			}
		}
		if(exist)
		{
			names.push(eltattrnames[i]);
		}
	}
	return names;
}

function getElementXPath(elt)
{  
    var path = "";  
    for (; elt && elt.nodeType == 1; elt = elt.parentNode)  
    {    
        idx = getElementIdx(elt);  
        xname = elt.tagName;  
        xname += "[" + idx + "]";  
        path = xname + "/" + path;  
    }
    return path;
}

function getElementIdx(elt)  
{  
    var count = 0;
    for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)  
    {  
        if(sib.nodeType == 1 && sib.tagName == elt.tagName) count++  
    }  
      
    return count;  
}

function disableLink()
{
    var aList = document.getElementsByTagName("a"); 
    for(var i=0;i<aList.length;i++) 
    {
        aList[i].onclick = function() 
        {
            return false;
        }
    }
	
	var inputList = document.getElementsByTagName("input"); 
    for(var i=0;i<inputList.length;i++) 
    {
		var type = inputList[i].getAttribute("type");
		if(type == null)
		{
			continue;
		}
		if(type != 'button' && type != 'submit')
		{
			continue;
		}
        inputList[i].onclick = function() 
        {
            return false;
        }
    }
}

function GetHost()
{
    var host = location.href;
    host = host.substr(7, host.length);
    var pos = host.indexOf('/');
    if(pos > 0)
        host = host.substr(0, pos);
    
    return "http://" + host + "/";
}

function GetTheUrl(link)
{
    var params = link.split('targeturl=');
    return params[1];
}

//查询元素的class，从_id_中获取id。
function getIDFromClassAttr(elt)
{
    if(elt.attributes == null)
        return -1;
    //遍历属性。
    for(var i = 0; i < elt.attributes.length; i ++)
    {
        var attr = elt.attributes[i];
        if(attr == null)
            continue;
        
        if(attr.nodeValue == null)
            continue;

        var begin = attr.nodeValue.indexOf('_id_begin_');
        if(begin < 0)
            continue;
        var end = attr.nodeValue.indexOf('_id_end_');
        if(end < 0)
            continue;
        
        var ret = attr.nodeValue.substr(begin + 10, end - begin - 10);
        return ret;
    }
    
    return -1;
}
