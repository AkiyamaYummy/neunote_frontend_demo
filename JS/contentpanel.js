function showNewContentPanel(pageele,mouseposi,mode) {
    var panel = getContentPanel(pageele,mouseposi);
    $(panel).append(getContentTopPanel());
    $(panel).append(getContentTextPanel());
    $(panel).append(getResizePanel(panel));
    $(pageele).append(panel);
    panelCheck(panel);
    var firstItem = getFirstItemPanelFromPanel(panel);
    itemFocus(firstItem);
    if(mode === "hl"){
        $(panel).attr({
            "hlmode":"true"
        });
        $(firstItem).css({
            "width":"100%",
            "margin":"0",
            "min-height":"25px",
            "height":"100%",
        });
    }
    showContentEditPanel();
}
function getContentPanel(pageele,mouseposi) {
    var res = $("<div></div>");
    var pageposi = $(pageele).offset();
    var relativeposi = {
        x:mouseposi.x-pageposi.left,
        y:mouseposi.y-pageposi.top
    };
    var maxposi = {
        x:pageEdit.pageSize.w-pageEdit.contentPanelInitialSize.w,
        y:pageEdit.pageSize.h-(pageEdit.contentPanelInitialSize.h+13)
    };
    var leftval = Math.min(relativeposi.x,maxposi.x);
    var topval = Math.min(relativeposi.y,maxposi.y);
    var leftstr = Math.floor(leftval)+"px";
    var topstr = Math.floor(topval)+"px";
    $(res).css({
        "width":pageEdit.contentPanelInitialSize.w+"px",
        "position":"absolute",
        "left":leftstr,
        "top":topstr
    });
    $(res).attr({
        "panel-checked":"false",
        "onmouseup":"contentPanelMouseup(event,this)",
        "oncontextmenu": "return panelContextmenu(this,event)"
    });
    return res;
}
function panelContextmenu(panel,event) {
    panelCheck(panel,false);
    showContentPanelRightClickPanel(panel,event);
    return false;
}
function contentPanelMouseup(event,panel) {
    uncheckOtherPage(panel);
    panelCheck(panel);
}
function showContentPanelRightClickPanel(panel,e) {
    var mouseposi = getMouseAbsolutePosi(e);
    var rcpaneldata = [];
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
function getContentTextPanel(){
    return getTextPanel();
}
function getContentTopPanel() {
    var res = $("<div></div>");
    $(res).css({
        "height":"5px",
        "width":"100%",
        "background":"grey",
        "visibility":"hidden",
        "overflow":"hidden",
        "cursor":"move"
    });
    $(res).attr({
        "class":"top-panel",
        "onmousedown":"pageEdit.moving=true"
    });
    return res;
}
function getResizePanel(panel) {
    var res = $("<div></div>");
    $(res).css({
        "width":"5px",
        "height":"5px",
        "position":"absolute",
        "right":"0",
        "bottom":"0",
        "cursor":"se-resize"
    });
    $(res).attr({
        "class":"resize-panel",
        "onmousedown":"pageEdit.resizing = this"
    });
    return res;
}
function panelCheck(panel,single) {
    var hassf;
    try {
        hassf = (typeof(arguments[1]) !== 'undefined');
    }catch (e){
        hassf = false;
    }
    var sflag = arguments[1]?arguments[1]:false;
    if(pageEdit.moving)return;
    if($(panel).attr("checked"))return;
    var page = $(panel).parent();
    var checkedpanels = $(page).find("div[panel-checked=true]");
    for (var i=0;i<checkedpanels.length;i++) {
        if(isPanelEmpty(checkedpanels[i])) {
            panelUncheck(checkedpanels[i]);
        }
    }
    if(hassf?sflag:(!pageEdit.keyevent.ctrlKey)) {
        for (var i=0;i<checkedpanels.length;i++) {
            if(!$(panel).is(checkedpanels[i])) {
                panelUncheck(checkedpanels[i]);
            }
        }
    }
    $(panel).remove();
    $(page).append(panel);
    if($(panel).attr("panel-checked")==="true")return;
    $(panel).css({
        "border": "solid 1px grey"
    });
    if($(panel).attr("hlmode") != "true") {
        $(panel).css({
            "background": "hsla(0,0%,100%,0.7)"
        });
    }
    $(panel).attr({
        "panel-checked": "true"
    });
    var textpanel = getTextPanelFromPanel(panel);
    var toppanel = getTopPanelFromPanel(panel);
    $(toppanel).css({
        "visibility": "visible"
    });
    //setPanelFocus(panel);
    panelCheckedPlanning(page);
}
function panelCheckedPlanning(page) {
    var checkedpanels = $(page).find("div[panel-checked=true]");
    var ans = {x1:0,y1:0,x2:0,y2:0};
    for (var i=0;i<checkedpanels.length;i++) {
        var ep = getEleRelativePosi(checkedpanels[i]);
        var es = {x1:ep.l,y1:ep.t,x2:ep.l+ep.w,y2:ep.t+ep.h};
        if(i === 0){
            ans = es;
        } else ans = {
            x1:Math.min(ans.x1,es.x1),
            y1:Math.min(ans.y1,es.y1),
            x2:Math.max(ans.x2,es.x2),
            y2:Math.max(ans.y2,es.y2)
        };
    }
    pageEdit.checkedpanels = $(page).find("div[panel-checked=true]");
    pageEdit.checkedsize = ans;
}
function panelUncheck(panel) {
    $(panel).css({
        "border": "",
    });
    if($(panel).attr("hlmode") != "true") {
        $(panel).css({
            "background": ""
        });
    }
    $(panel).attr({
        "panel-checked":"false"
    });
    var textpanel = getTextPanelFromPanel(panel);
    var toppanel = getTopPanelFromPanel(panel);
    $(toppanel).css({
        "visibility":"hidden"
    });
    if($(pageEdit.focusitem).parent().parent().is(panel)){
        itemUnfocus();
    }
    if(isPanelEmpty(panel))$(panel).remove();
    panelsSort($(panel).parent());
}
function allPanelsUncheck() {
    var checkedpanels = $(pageEdit.checkedpage)
        .find("div[panel-checked=true]");
    for (var i=0;i<checkedpanels.length;i++) {
        panelUncheck(checkedpanels[i]);
    }
}
function isPanelEmpty(panel){
    var res = true;
    var textpanel = getTextPanelFromPanel(panel);
    var items = $(textpanel).find("*");
    for(var i=0;i<items.length;i++){
        res = (res && isItemEmpty(items[i]));
    }
    //console.log("panel : "+res);
    return res;
}
function getTextPanelFromPanel(panel) {
    return $(panel).find(".text-panel");
}
function getTopPanelFromPanel(panel) {
    return $(panel).find(".top-panel");
}
function getResizePanelFromPanel(panel){
    return $(panel).find(".resize-panel");
}
function getFirstItemPanelFromPanel(panel){
    return getTextPanelFromPanel(panel).find("div")[0];
}
function uncheckOtherPage(panel){
    editPageCheck($(panel).parent());
}
function setPanelFocus(panel) {
    var tp = getTextPanelFromPanel(panel)
    setTextPanelFocus(tp);
}