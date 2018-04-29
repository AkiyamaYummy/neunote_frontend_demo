var pageEdit = {
    initEditPage:function (ele,option) {
        pageEditLoadLibrary();
        if(option.pSize)
            pageEdit.pageSize = option.pSize;
        if(option.cpSize)
            pageEdit.contentPanelInitialSize = option.cpSize;
        initBody();
        initEle(ele);
    },
    pageSize:{h:842,w:595},
    contentPanelInitialSize:{h:25,w:300},
    contentPanelMinSize:{h:20,w:20},
    keyevent:{},
    moving:false,
    cepmoving:false,
    cepfixing:false,
    cepposi:{},
    resizing:null,
    mouseposilast:{x:-1,y:-1},
    checkedpage:null,
    checkedpanels:null,
    checkedsize:{x1:0,y1:0,x2:0,y2:0},
    copyedpanels:null,
    focusitem:null,
    MathJaxConfig:{
        showProcessingMessages: false,
        messageStyle: "none",
        extensions: ["tex2jax.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
            inlineMath:  [ ["$", "$"] ],
            displayMath: [ ["$$","$$"] ],
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre','code','a','protect'],
            ignoreClass:"text-flag"
        },
        "HTML-CSS": {
            availableFonts: ["STIX","TeX"],
            showMathMenu: false
        }
    },
    pageLoadContent:function (ele,content) {
        allPanelsUncheck();
        var eventpanel = $(ele).find(".page-event-panel");
        $(eventpanel).remove();
        $(ele).empty();
        $(ele).append(eventpanel);
        $(ele).append($(content));
    },
    pageGetContent:function (ele) {
        allPanelsUncheck();
        var eventpanel = $(ele).find(".page-event-panel");
        $(eventpanel).remove();
        var res = $(ele).html();
        $(ele).prepend(eventpanel);
        return res;
    }
};
function pageEditLoadLibrary(){
    MathJax.Hub.Config(pageEdit.MathJaxConfig);
    hljs.initHighlightingOnLoad();
    return true;
}
function initBody(){
    /*
    $("body").bind("contextmenu",function(event){
        return false;
    });
    */
    $("body").keydown(function (event) {
        pageEdit.keyevent = event;
    });
    $("body").keyup(function (event) {
        pageEdit.keyevent = event;
    });
    $("body").mousemove(function (event) {
        var mouseposilast = pageEdit.mouseposilast;
        var mouseposinow = getMousePosi(event);
        if(mouseposilast.x*mouseposilast.y>=0){
            if(pageEdit.moving || pageEdit.resizing
                || pageEdit.cepmoving || pageEdit.highlightediting){
                $("body").attr({"onselectstart":"return false"});
            }
            var dif = {
                x:mouseposinow.x-mouseposilast.x,
                y:mouseposinow.y-mouseposilast.y
            };
            if(pageEdit.moving) {
                panelsMove(dif);
            }else if(pageEdit.resizing) {
                panelResize(pageEdit.resizing,event);
            }else if(pageEdit.cepmoving){
                cepMove(dif);
            }
        }
        pageEdit.mouseposilast = mouseposinow;
    });
    $("body").mouseup(function (event) {
        if(pageEdit.resizing)
            panelCheckedPlanning(pageEdit.checkedpage);
        pageEdit.moving = false;
        pageEdit.resizing = null;
        pageEdit.cepmoving = false;
        $("body").removeAttr("onselectstart");
    });
}
function cepMove(dif) {
    var leftstrlast = $("#cep").css("left");
    var topstrlast = $("#cep").css("top");
    var leftvallast = parseInt(leftstrlast.substr(0,leftstrlast.length-2));
    var topvallast = parseInt(topstrlast.substr(0,topstrlast.length-2));
    $("#cep").css({
        "left": (leftvallast + dif.x)+"px",
        "top": (topvallast + dif.y)+"px"
    });
}
function panelsMove(dif) {
    var mindx = -(pageEdit.checkedsize.x1);
    var mindy = -(pageEdit.checkedsize.y1);
    var maxdx = pageEdit.pageSize.w-(pageEdit.checkedsize.x2);
    var maxdy = pageEdit.pageSize.h-(pageEdit.checkedsize.y2+2);
    dif.x = Math.max(mindx,Math.min(maxdx,dif.x));
    dif.y = Math.max(mindy,Math.min(maxdy,dif.y));
    pageEdit.checkedsize.x1 += dif.x;
    pageEdit.checkedsize.x2 += dif.x;
    pageEdit.checkedsize.y1 += dif.y;
    pageEdit.checkedsize.y2 += dif.y;
    var checkedpanels = $("div[panel-checked=true]");
    for (var i=0;i<checkedpanels.length;i++) {
        var leftstrlast = $(checkedpanels[i]).css("left");
        var topstrlast = $(checkedpanels[i]).css("top");
        var leftvallast = parseInt(leftstrlast.substr(0,leftstrlast.length-2));
        var topvallast = parseInt(topstrlast.substr(0,topstrlast.length-2));
        $(checkedpanels[i]).css({
            "left": (leftvallast + dif.x)+"px",
            "top": (topvallast + dif.y)+"px"
        });
    }
}
function panelResize(resizepanel,event) {
    var panel = $(resizepanel).parent();
    var page = $(panel).parent();
    var textpanel = getTextPanelFromPanel(panel);
    var mp = getMousePosi(event);
    var fp = getEleAbsolutePosi(page);
    mp.x = Math.min(mp.x,fp.l+fp.w);
    mp.y = Math.min(mp.y,fp.t+fp.h);
    var pp = $(panel).offset();
    var tpp = $(textpanel).offset();
    var nw = Math.floor(mp.x-pp.left);
    var nh = Math.floor(mp.y-tpp.top);
    $(panel).css({
        "width":(Math.max(nw,pageEdit.contentPanelMinSize.w)+2)+"px"
    });
    $(textpanel).css({
        "height":(Math.max(nh,pageEdit.contentPanelMinSize.h)+2)+"px"
    });
}
function initEle(ele) {
    $(ele).attr({
        "class": "edit-page",
        "page-checked": false
    });
    $(ele).css({
        "position":"relative",
        "height":pageEdit.pageSize.h + "px",
        "width":pageEdit.pageSize.w + "px",
        "border":"solid 1px grey",
        "box-shadow":"3px 3px 3px grey",
        "overflow":"hidden",
        "display":"inline-block",
        "font-size":"20px",
        "font-family":"方正书宋简体",
        "background":"white",
        "text-align":"left"
    });
    var eventarea = $("<div></div>");
    $(eventarea).attr({
        "class":"page-event-panel",
        "onmouseup":"eventPanelOnclick(this,event)",
        "oncontextmenu":"editPageRightClick($(this).parent(), event);return false;"
    });
    $(eventarea).css({
        "height":"100%",
        "width":"100%",
        "left":"0",
        "top":"0",
        "position":"absolute"
    });
    $(ele).append(eventarea);
}
function eventPanelOnclick(eventpanel,event) {
    var ele = $(eventpanel).parent();
    editPageCheck(ele);
    if(event.which == 1)
        showNewContentPanel(ele,getMousePosi(event));
}
function editPageRightClick(ele,e) {
    var mouseposi = getMouseAbsolutePosi(e);
    var rcpaneldata = [];
    rcpaneldata.push({
        text:"新建文本框",
        onclick:function(){
            showNewContentPanel(ele,mouseposi);
        }
    });
    rcpaneldata.push({
        text:"编辑荧光笔迹",
        onclick:function(){
            showNewContentPanel(ele,mouseposi,"hl");
        }
    });
    if(pageEdit.checkedpanels!==null
        && pageEdit.checkedpanels.length > 0){
        rcpaneldata.push({
            text:"复制选中",
            onclick:function(){
                checkedPanelsCopy();
            }
        });
        rcpaneldata.push({
            text:"剪切选中",
            onclick:function(){
                checkedPanelsCopy();
                checkedPanelsRemove();
            }
        });
    }
    if(pageEdit.copyedpanels){
        rcpaneldata.push({
            text:"粘贴",
            onclick:function(){
                copyedPanelsPaste();
            }
        });
    }
    if(pageEdit.checkedpanels!==null
        && pageEdit.checkedpanels.length > 0){
        rcpaneldata.push({
            text:"删除选中",
            onclick:function(){
                checkedPanelsRemove();
            }
        });
    }
    var demo = getRightClickEles({
        height:"20px",
        width:"100px",
        posi:mouseposi,
        data:rcpaneldata
    });
    $("body").append(demo.mask);
    $("body").append(demo.panel);
}
function editPageCheck(ele) {
    if($(ele).attr("page-checked")=="true")return;
    var father = $(ele).parent();
    var checkedpages = $(father).find(
        "div[page-checked=true][class=edit-page]");
    for(var i=0;i<checkedpages.length;i++)
        editPageUncheck(checkedpages[i]);
    $(ele).attr({"page-checked":true});
    pageEdit.checkedpage = ele;
}
function editPageUncheck(ele) {
    $(ele).attr({"page-checked":false});
    var checkedpanels = $(ele).find("div[panel-checked=true]");
    for (var i=0;i<checkedpanels.length;i++)
        panelUncheck(checkedpanels[i]);
}
function checkedPanelsCopy() {
    var isallempty = true;
    for(var i=0;i<pageEdit.checkedpanels.length;i++){
        if(!isPanelEmpty(pageEdit.checkedpanels[i])){
            isallempty = false;
        }
    }
    if(isallempty) return;
    itemUnfocus();
    pageEdit.copyedpanels = [];
    for(i=0;i<pageEdit.checkedpanels.length;i++){
        var newpanel = $(pageEdit.checkedpanels[i]).clone();
        pageEdit.copyedpanels.push(newpanel);
        var panelposi = getEleRelativePosi(pageEdit.checkedpanels[i]);
        $(pageEdit.copyedpanels[i]).css({
            "top":(panelposi.t-pageEdit.checkedsize.y1)+"px",
            "left":(panelposi.l-pageEdit.checkedsize.x1)+"px"
        });
    }
}
function checkedPanelsRemove() {
    itemUnfocus();
    var checkedpanels = $(pageEdit.checkedpage)
        .find("div[panel-checked=true]");
    for (var i=0;i<checkedpanels.length;i++) {
        panelUncheck(checkedpanels[i]);
        $(checkedpanels[i]).remove();
    }
    pageEdit.checkedpanels = null;
    pageEdit.checkedsize = {x1:0,y1:0,x2:0,y2:0};
}
function copyedPanelsPaste() {
    allPanelsUncheck();
    for(var i=0;i<pageEdit.copyedpanels.length;i++) {
        var newpanel = $(pageEdit.copyedpanels[i]).clone();
        $(pageEdit.checkedpage).append(newpanel);
        panelCheck(newpanel,false);
    }
    panelCheckedPlanning(pageEdit.checkedpage);
}
function panelsSort(page) {
    var hls = $(page).find("div[hlmode=true]");
    $(hls).remove();
    if(hls.length == 0)return;
    $(page).find(".page-event-panel").after(hls[0]);
    for(var i=1;i<hls.length;i++){
        $(hls[i-1]).after(hls[i]);
    }
}