var nextNodeIndex = 0;//遍历DOM树时递增，表示各个节点遍历的序号。

jQuery(document).ready(function()
{
    //updateTemplateList();
});

//转换特殊符号。
function TranParmValue(msg)
{
	//替换‘.’符号。
	msg = msg.replace(new RegExp('[.]', 'gm'), '[_A_POINT_T_]');

	//替换‘&’符号。
	msg = msg.replace(new RegExp('&', 'gm'), '[_A_AND_T_]');

	//替换‘＋’符号。
	msg = msg.replace(new RegExp('[+]', 'gm'), '[_A_PLUS_T_]');

	return msg;
}

//添加字段定义。
function OnAdd(){
	//获取被点亮的节点。
	var ifr = document.getElementById("iframePanel");
	var idArray = [];
	
	jQuery('._selected', ifr.contentWindow.document).each(
		function(index)
		{
			idArray.push(getElementID(this));
		}
	);
	if (idArray.length == 0)
	{
		alert('No block selected');
		return;
	}
	
	//构造点亮节点的ID集合字符串。
	var idset = '';
	for(var i = 0; i < idArray.length; i ++)
	{
		var nodeid = idArray[i];
		if(nodeid == '')
		{
	        alert('get node id fail!');
	        return;
		}
	    
		if(idset == '')
			idset = '' + nodeid;
		else
			idset = idset + ',' + nodeid;
	}
    
	//获取用户输入的信息。
	var recordname = document.getElementsByTagName("*").RecordName.value;
	var fieldname  = document.getElementsByTagName("*").FieldName.value;
	var attrname  = document.getElementsByTagName("*").AttrName.value;
	if(recordname == '' || recordname == 'RecordName'|| fieldname == '' || fieldname == 'FieldName')
	{
		alert("RecordName or  FieldName  is empty");
		return;
	}
	if(attrname == '' || attrname == 'AttrName')
		attrname = 'text';
    
	//获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换特殊符号。
	theurl     = TranParmValue(theurl);
	idset      = TranParmValue(idset);
	attrname   = TranParmValue(attrname);
	recordname = TranParmValue(recordname);
	fieldname  = TranParmValue(fieldname);
    
	 //向服务端发送请求。
	$.ajax({
		type: "POST",
		url: GetHost() + "nutch/extractor_index.jsp",
		data: "cmd=add&theurl="+theurl+"&idset="+idset+"&attrname="+attrname+"&recordname="+recordname+"&fieldname="+fieldname,
		success: function(msg){//返回的消息要么是错误提示消息，要么是对该url的所有字段定义。
			if(msg.indexOf('[_A_RECORD_T_]') < 0)//不是有效的数据内容，当错误消息对待。
			{
				alert(msg);
		    	}
		   else
		    	{
		        	//将下面语句注释掉，目的是方便继续在这些节点上定义别的字段。
            //jQuery('._selected', ifr.contentWindow.document).removeClass('_selected');//取消点亮。
				var  records = msg.split('[_A_WEBPAGE_T_]');//分割出记录集合。
				var htmlstr = "";
				for( var i = 0;i < records.length; i ++)
                		{
					var rec = records[i];
					var fields = rec.split('[_A_RECORD_T_]');//分割记录的组成部分。
                    
					htmlstr+="Record: "+fields[0]+"\r\n";//最开始为记录名称。
                    
					for( var j = 1;j < fields.length; j++)
                    			{
						var info = fields[j].split('[_A_FIELD_T_]');
						htmlstr+=" Field Name: " + info[0] + "\r\n";
               	htmlstr+=" Field Attr: " + info[1] + "\r\n";
                	htmlstr+=" Field Path: " + info[2] + "\r\n";
                    			}
                		}
         	alert(htmlstr);
            		}
        	}
    });
}

//清除指定记录的全部字段定义。
function OnClearTemp(){
	var ifr = document.getElementById("iframePanel");
  	jQuery('._selected', ifr.contentWindow.document).removeClass('_selected');//取消点亮。
    
	//获取要删除的记录名。
  	var recordname = document.getElementsByTagName("*").RecordName.value;
 	if(recordname == '' || recordname == 'RecordName')
    	{
	  alert("RecordName is empty");
	  return;
	}
    
	//获取网页url。
  	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
    
   	 //向服务端发送请求。
  	theurl 		= TranParmValue(theurl);
 	recordname	= TranParmValue(recordname);
    
	var url = GetHost()+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=clear&theurl="+theurl+"&recordname="+recordname,
		success: function(msg){//返回的消息要么是错误提示消息，要么是对该url的所有字段定义。
			if(msg != '' && msg.indexOf('[_A_RECORD_T_]') < 0)//不是有效的数据内容，当错误消息对待。
		    	{
		     	alert(msg);
		    	}
			else
		    	{
           	alert('success!');
            		}
        	}
    });
}

//返回当前打开的所有url。
function GetAllUrl()
{
 	var allurl = '';
	var tabPanel = parent.contextPanel.document.getElementById("browser-tabs");
	jQuery('A.txt', tabPanel).each(function(index)
    	{
		var childs = this.childNodes;
		for(var i = 0; i < childs.length; i ++)
       		{
   		var child = childs[i];
      	if(child == null)
     			continue;
      	if(child.nodeName == '#text')
            		{
        		if(allurl.length == 0)
           		allurl = escape(child.nodeValue);
           	else
            	allurl = allurl + '[_A_URL_T_]' + escape(child.nodeValue);
         	break;
            		}
       		}
    	});
    
    	//将点好替换掉。
 	allurl = TranParmValue(allurl);
    
	return allurl;
}

function OnReduce()
{
	//display('TABLE[id=forum_77]>TBODY[_A_CSS_T_]SPAN[id^=thread_]>A[href][_A_CSS_T_]0[_A_CSS_T_]CITE>A[href][_A_CSS_T_]0', document.getElementById("iframePanel"));
	//return;
    
   	 //获取网页的url。
	//var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	//获取当前打开的所有网页的url。
	var theurl = GetAllUrl();
	
	 //获取记录名。
	var recordname = document.getElementsByTagName("*").RecordName.value;
	if(recordname == '' || recordname == 'RecordName')
    	{
	  alert("RecordName is empty");
	  return;
    	}
    
    	//取消当前的点亮。
	var ifr = document.getElementById("iframePanel");
  	jQuery('._selected', ifr.contentWindow.document).removeClass('_selected');
    
	//向服务端发送请求。
	theurl 		= TranParmValue(theurl);
	recordname	= TranParmValue(recordname);
	$.ajax({
		type: "POST",
		url: GetHost()+"nutch/extractor_index.jsp",
		data: "cmd=reduce&theurl=" + theurl + "&recordname=" + recordname,
		success: function(msg){
			if(msg.indexOf('[_A_CSS_T_]') < 0)
		    	{
		     	alert(msg);
		    	}
			else
		   	{
            display(msg, ifr);
            		}
        	}
    });
}

function display(msg, ifr)
{
	var idset = msg.split('[_A_CSS_T_]');
	for(var i = 0; i < idset.length; i ++)
	{
		jQuery("[globalidentity=" + idset[i] + "]", ifr.contentWindow.document).addClass('_selected');
	}
}

function OnExportTemp()
{
	//获取用户输入的信息。
	var recordname = document.getElementsByTagName("*").RecordName.value;
	if(recordname == '' || recordname == 'RecordName')
    	{
        alert("RecordName is empty");
        return;
    	}
    
    	//获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);
	recordname = TranParmValue(recordname);
    
    	//向服务端发送请求。
	var url = GetHost()+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=exporttemp&theurl="+theurl+"&recordname="+recordname,
		success: function(msg){//返回的消息是错误或成功的提示消息。
            alert(msg);
        	}
    });
}

function OnAddSeed()
{  
	 //获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);

	//向服务端发送请求。
	var url = GetHost()+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=addseed&theurl="+theurl,
		success: function(msg){//返回的消息是错误或成功的提示消息。
            alert(msg);
        }
    });
}

function OnExportData()
{
    //获取用户输入的信息。
    var recordname = document.getElementsByTagName("*").RecordName.value;
    if(recordname == '' || recordname == 'RecordName')
    {
        alert("RecordName is empty");
        return;
    }
    
    //获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);
 	recordname = TranParmValue(recordname);
    
    //向服务端发送请求。
	var url = GetHost()+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=exportdata&theurl="+theurl+"&recordname="+recordname,
		success: function(msg){//返回的消息是错误或成功的提示消息。
		    if(msg.indexOf('[_A_CSS_T_]') < 0)
		    {
		        alert(msg);
		    }
		    else
		    {
                ExtractData(msg);
            }
        }
    });
}

//抓取数据。
function ExtractData(msg)
{
    var Tags = msg.split('[_A_CSS_T_]');
    if(Tags.length < 2)
    {
        alert('too few tags!');
        return;
    }
    var data = '';
    var ifr = document.getElementById("iframePanel");
    
    //下面仅考虑单节点集合的情形。
    jQuery(Tags[0], ifr.contentWindow.document).each(function(index)
    {
        var rec = '';
        for( var i = 1; i < Tags.length; i ++)
        {
            if(i > 1)
                rec = rec + ',';
            
            var attr = Tags[i];
            rec = rec + getAttrValue(this, attr);
        }
        if(data.length > 0)
            data = data + '\n';
        data = data + rec;
    });
    
    //将data传给服务端。
	data = TranParmValue(data);
	var url = GetHost()+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=savedata&data=" + data,
		success: function(msg){//返回的消息是错误或成功的提示消息。
            alert(msg);
        }
    });
}

//向服务端发送字段名。
function sendfieldname(id)
{
    //获取字段名。
	var fieldname  = Ext.get('TagName-'+id).dom.value;
    if(fieldname=='FieldName')
    {
        alert("FieldName  is empty");
        return;
    }
	
    //获取网页url。
	var theurl = escape(Ext.getCmp('tab-'+id).tabTip);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);
    fieldname = TranParmValue(fieldname);
    
    //向服务端发送请求。
	var url = host+"nutch/extractor_index.jsp";
	$.ajax({
		type: "POST",
		url: url,
		data: "cmd=sendfieldname&theurl="+theurl + "&fieldname="+fieldname,
		success: function(msg){//返回的消息为错误或成功的提示消息。
            alert(msg);
        }
    });
}

//取消当前的高亮显示。
function OnDisableHigh()
{
    var ifr = document.getElementById("iframePanel");
    jQuery('._selected', ifr.contentWindow.document).removeClass('_selected');
}

//从服务端获取字段定义，将节点高亮显示。
function OnShowField()
{
    //获取用户输入的信息。
    var recordname = document.getElementsByTagName("*").RecordName.value;
	var fieldname  = document.getElementsByTagName("*").FieldName.value;
    if(recordname == '' || recordname == 'RecordName'|| fieldname == '' || fieldname == 'FieldName')
    {
        alert("RecordName or  FieldName  is empty");
        return;
    }
    
    //获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);
    recordname = TranParmValue(recordname);
    fieldname  = TranParmValue(fieldname);
    
    //向服务端发送请求。
	$.ajax({
		type: "POST",
		url: GetHost() + "nutch/extractor_index.jsp",
		data: "cmd=getfield&theurl="+theurl+"&recordname="+recordname+"&fieldname="+fieldname,
		success: function(msg){//返回的消息要么是错误提示消息，要么是该字段的节点集合。
		    if(msg.indexOf('Err: ') == 0)//错误消息。
		    {
		        alert(msg);
		    }
		    else
		    {
		        var ifr = document.getElementById("iframePanel");
		        jQuery('._selected', ifr.contentWindow.document).removeClass('_selected');//取消点亮。
		        var  nodeset = msg.split(',');//分割出节点ID。
                for( var i = 0;i < nodeset.length; i ++)
                {
                    jQuery("[globalidentity=" + nodeset[i] + "]", ifr.contentWindow.document).addClass('_selected');//点亮。
                }
            }
        }
    });
}

//向服务端发送要排除的节点集合。
function OnExclude()
{
    //获取被点亮的节点。
	var ifr = document.getElementById("iframePanel");
	var idArray = [];
	
	jQuery('._selected', ifr.contentWindow.document).each(
	    function(index)
	    {
            idArray.push(getElementID(this));
        }
    );
	if (idArray.length == 0)
	{
		alert('No block selected');
		return;
	}
	
	//构造点亮节点的ID集合字符串。
	var idset = '';
	for(var i = 0; i < idArray.length; i ++)
	{
	    var nodeid = idArray[i];
	    if(nodeid == '')
	        return;
	    
	    if(idset == '')
	        idset = '' + nodeid;
	    else
	        idset = idset + ',' + nodeid;
	}
    
    //获取用户输入的信息。
    var recordname = document.getElementsByTagName("*").RecordName.value;
    if(recordname == '' || recordname == 'RecordName')
    {
        alert("RecordName is empty");
        return;
    }
    
    //获取网页url。
	var theurl = GetTheUrl(document.getElementsByTagName("*").iframePanel.src);
	
	//替换‘&’符号。
	theurl     = TranParmValue(theurl);
    idset      = TranParmValue(idset);
    recordname = TranParmValue(recordname);
    
    //向服务端发送请求。
	$.ajax({
		type: "POST",
		url: GetHost() + "nutch/extractor_index.jsp",
		data: "cmd=exclude&theurl="+theurl+"&idset="+idset+"&recordname="+recordname,
		success: function(msg){//返回的消息为错误或成功的提示消息。
            alert(msg);
        }
    });
}

//查询元素的globalidentity属性，获取id。
function getNodeID(elt)
{
    if(elt.attributes == null)
        return '';
    
    //遍历属性。
    for(var i = 0; i < elt.attributes.length; i ++)
    {
        var attr = elt.attributes[i];
        if(attr == null)
            continue;
        
		  if(attr.nodeName  == null)
				continue;
		  if(attr.nodeName != 'globalidentity')
				continue;
        if(attr.nodeValue == null)
            return '';
		  return attr.nodeValue;
    }
    
    return '';
}

//获取节点的ID。
function getElementID(elt)
{
    return getNodeID(elt);
}

//获取节点及子节点的文字。
function getNodeText(elt)
{
    var text = '';
    var childs = elt.childNodes;
    for(var i = 0; i < childs.length; i ++)
    {
        var child = childs[i];
        if(child == null)
            continue;
        if(child.nodeName == '#text')
            text = text + child.nodeValue;
        else
            text = text + getNodeText(child);
    }
    return text;
}

//获取节点的属性值。
function getAttrValue(elt, attrName)
{
    if(attrName == 'text')
    {
        return getNodeText(elt);
    }
    
    if(elt.attributes == null)
        return '';
    
    //遍历属性。
    for(var i = 0; i < elt.attributes.length; i ++)
    {
        var attr = elt.attributes[i];
        if(attr.nodeName == attrName)
            return attr.nodeValue;
    }
    return '';
}

function getElementsByClassName(className, tag, elm){
	var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
	var tag = tag || "*";
	var elm = elm || document;
	var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
	var returnElements = [];
	var current;
	var length = elements.length;
	for(var i=0; i<length; i++){
		current = elements[i];
		if(testClass.test(current.className)){
			returnElements.push(current);
		}
	}
	return returnElements;
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

function sendSelected()
{
    var articleType = document.getElementsByTagName("*").articleType.value;
    var templateName = document.getElementsByTagName("*").templateName.value;
    var groupname = document.getElementsByTagName("*").groupName.value;
    if(articleType=="" || articleType=="Page Type" || templateName=="" || templateName=="Tag Name" || groupname =="")
     {
        alert("Please input all the information!");
        return;
     }

    var ifr = window.frames["iframePanel"];
    var collection = getElementsByClassName("_selected","*",ifr.document);
    
    var pathList = new Array();
    for(var i=0; i<collection.length; i++)
    {
        var elem = collection[i];
        pathList.push(getElementXPath(elem));
    }
    
    if(pathList.length==0)
    {
        alert("No block selected.");
        return;
    }
    
    var elem = jQuery("#but");
    var url = elem.attr("value");

    jQuery.post("../TemplateProcess.aspx?theurl="+url+"&groupname="+groupname+"&article_type="+ articleType +"&tagname="+templateName, pathList.toJSONString(), 
    function(data)
    {
        if(data.indexOf("Yes")!=-1)
            alert("Save success!");
        else
            alert("Save fail!");
    });

    
    updateTemplateList();
 //   alert(document.getElementsByTagName("*").templateName.value);
 //   alert(pathList.toJSONString());
}

function highlightElem(elem)
{
    var jqElem = elem;//jQuery(elem);
    jqElem.addClass("_selected");
}

function getElementByXPath(path)
{
    var elems = path.split("/");
    var newPath = "";
    var len = elems.length;
    
    for(var i=0; i<len; i++)
    {
        if(elems[i]=="")
            continue;
    
        var tag, num;
        var str = elems[i].split("[");
        tag = str[0];
        var str1 = str[1].split("]");
        num = str1[0];
        newPath += (tag + ":eq(" + num +") ");
        
        if(i+2<len)
            newPath += " > ";
    }
    elem = jQuery(newPath,document.getElementById('iframePanel').contentWindow.document);
    
    return elem;
}

var iterater, container, templateNames;

function getInitData()
{
    var elem = jQuery("#but");
    var url = elem.attr("value");
    
    //don't need iterator and container now
//    jQuery.getJSON("../DataTransfer.aspx?theurl="+url,
//        function(data){
//            iterater = data.iterator;
//            container = data.container;
//        });
//        
    updateTemplateList();
}

function selectPagetype()
{
    updateTemplateList()
}

function updateTemplateList(pagetype)
{
    var elem = jQuery("#but");
    var url = elem.attr("value");
    
    if(url == null || url.length == 0)
        return;
        
    jQuery.getJSON("../FetchTemplateName.aspx?theurl="+url+"&pagetype="+pagetype,
    function(data){    
        templateNames = data;
        
    var select = document.createElement('select');
    var id = document.createAttribute('id');
    id.value = 'templateNames';
    var name = document.createAttribute('name');
    name.value = 'templateNames';
    var selectClass = document.createAttribute('class');
    selectClass.value = '_control';
    select.attributes.setNamedItem(selectClass);
    select.attributes.setNamedItem(id);
    select.attributes.setNamedItem(name);
    
    var propmt = document.createElement('option');
    propmt.innerHTML = "-- select a template --";
    var onclick1 = document.createAttribute('onclick');
    onclick1.value = "updateTemplateList();";
    propmt.attributes.setNamedItem(onclick1);
    select.appendChild(propmt);
     if(data != null && data.length > 0)
     {   
        for(var i=0; i<data.length; i++)
        {
            var option = document.createElement('option');
            var thevalue = document.createAttribute('value');
            thevalue.value = data[i];
            var onclick = document.createAttribute('onclick');
            onclick.value = "javascript:selectTemplate('" + data[i] + "');";
            option.attributes.setNamedItem(thevalue);
            option.attributes.setNamedItem(onclick);
            option.innerHTML = data[i];
            select.appendChild(option);
        }
    }
    var oldSelect = document.getElementById('templateNames');
    var listbox = document.getElementById('templateListbox');
    if(oldSelect)
        listbox.removeChild(oldSelect);
    listbox.appendChild(select);
    
    });
        
}

function selectTemplate(name)
{
    updateTemplateList();
    var elem = jQuery("#but");
    var url = elem.attr("value");
    
    jQuery.getJSON("../ExtractElement.aspx?theurl="+url+"&template="+name,
    function(data){
        //alert(data);
        var extractData = document.getElementById("extractData");
        extractData.innerHTML = data;
        
        var jqExtractData = jQuery(extractData);
        jqExtractData.addClass("_control");
    });
}

function extractAll()
{
    var elem = jQuery("#but");
    var url = elem.attr("value");
    
    if(url)    
        window.open("../ExtractElement.aspx?theurl="+url);
}

function highlightRelative()
{
    var elem = jQuery("#highlight");
    var path = elem.attr("value");
    
    if(iterater==null)
        return;
    
    var relativeElems = getRelativeElems(path, iterater);
    for(var i=0; i<relativeElems.length; i++)
    {
        theElem = getElementByXPath(relativeElems[i]);
        highlightElem(theElem);
    }    
}

function getRelativeElems(path, array)
{
    var elems = new Array();
    for(var i=0; i<array.length; i++)
    {
        if(comparePath(path, array[i]))
            elems[elems.length] = array[i];
    }
    return elems;
}

function comparePath(path1, path2)
{
    var elems1 = path1.split("/"); 
    var elems2 = path2.split("/");
    
    var i;
    for(i=0; i<elems1.length; i++)
    {
        if(elems1[i].toLowerCase() != elems2[i].toLowerCase())
            break;
    }
    return ( (i==elems1.length-2) && (elems1.length==elems2.length) );
}

function clearHighlight()
{
    var ifr = window.frames["iframePanel"];
    var collection = getElementsByClassName("_selected","*",ifr.document);

    for(var i=0; i<collection.length; i++)
    {
        var elem = collection[i];
        var jqElem = jQuery(elem);
        jqElem.removeClass("_selected");
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
    var theurl = params[1];
    //将点好替换掉。
    theurl = TranParmValue(theurl);
    return theurl;
}
