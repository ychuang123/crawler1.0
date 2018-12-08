var tabNum=0;
var urlMap = new Array();
var currentTabID;

function go() {
    newPage();
    //loadPage();
    //makeRequest();
}

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

function newPage() {
	var url = document.getElementsByTagName("*").urlText.value;
	if(url.toString().toLowerCase().indexOf("http://",0)==-1)
		url = "http://" + url;
	url = TranParmValue(url);

	addPage(url);
	setIframeSource(url, true);
}

function setIframeSource(paramUrl, bLoading) {
	var url ="../../extractor_index.jsp?targeturl=" + escape(paramUrl);
        
	/*var loadingDiv = parent.mainPanel.document.getElementsByTagName("*").testdiv;
	if (bLoading && !loadingDiv)
    	{
        var div = top.frames['mainPanel'].document.createElement('DIV');
        div.id = 'testdiv';
        div.innerText = '&nbsp;';
        top.frames['mainPanel'].document.body.appendChild(div);
        var oo = jQuery(parent.mainPanel.document.getElementsByTagName("*").iframePanel);
        var css = oo.position();
        css = jQuery.extend({background: 'url(image/loading.gif) no-repeat center center Gray', position: 'absolute',width:oo.width(), height:oo.height(), opacity: '0.5', filter: 'alpha(opacity=50)'}, css);
        jQuery(div).css(css);
	}*/

	//var iframe = parent.mainPanel.document.getElementsByTagName("*").iframePanel;
    
	parent.mainPanel.document.getElementsByTagName("*").iframePanel.src=url;
	//parent.mainPanel.document.getElementsByTagName("*").but.value=escape(paramUrl);
	//parent.mainPanel.document.getElementsByTagName("*").but.onclick();
}

function addPage(url) {
    tabNum++;
    var tabPanel = document.getElementById("browser-tabs");
    
    var li = document.createElement('li');
    var li_id = document.createAttribute('id');
    li_id.value = 'tab' + tabNum;
    var li_class = document.createAttribute('class');
    li_class.value = '';
    li.attributes.setNamedItem(li_id);
    li.attributes.setNamedItem(li_class);
    
    var atxt = document.createElement('a');
    var atxt_class = document.createAttribute('class');
    atxt_class.value = 'txt';
    var atxt_href = document.createAttribute('href');
    atxt_href.value = 'javascript:changeTab(\''+li_id.value+'\')';
    atxt.attributes.setNamedItem(atxt_class);
    atxt.attributes.setNamedItem(atxt_href);
    //atxt.innerHTML=url.substr(0, 30);
    atxt.innerHTML=url;
    
    var aclose = document.createElement('a');
    var aclose_class = document.createAttribute('class');
    aclose_class.value = 'tab-close';
    var aclose_href = document.createAttribute('href');
    aclose_href.value = 'javascript:quitTab(\''+li_id.value+'\')';
    var aclose_title = document.createAttribute('title');
    aclose_title.value = 'Close';
    aclose.attributes.setNamedItem(aclose_class);
    aclose.attributes.setNamedItem(aclose_href);
    aclose.attributes.setNamedItem(aclose_title);
    aclose.innerHTML='&nbsp;';
        
    li.appendChild(atxt);
    li.appendChild(aclose);
    
    tabPanel.appendChild(li);
    
    urlMap[li_id.value] = url;
    
    var lastTab = document.getElementById(currentTabID);
    if(lastTab)
        lastTab.setAttribute('class','');
    li.setAttribute('class','showing');
    
    currentTabID = li_id.value;
}

function changeTab(elemid) {

    if (currentTabID != elemid)
    {
        var lastTab = document.getElementById(currentTabID);
        if(lastTab)
            lastTab.setAttribute('class','');
        
        var tab = document.getElementById(elemid);
        setIframeSource(urlMap[elemid], true);
        
        currentTabID = elemid;
        
        tab.setAttribute('class','showing');
    }
}

function quitTab(elemid) {
    var tabPanel = document.getElementById("browser-tabs");
    var tab = document.getElementById(elemid);
    tabPanel.removeChild(tab);
    delete urlMap[elemid];
    
    if(elemid==currentTabID)
    {
        setIframeSource("about:blank", false);
        for(var tabid in urlMap)
        {
            var firstTab = document.getElementById(tabid);
            setIframeSource(urlMap[tabid], true);
            firstTab.setAttribute('class','showing');
            currentTabID = tabid;
            break;
        }
    }
}
