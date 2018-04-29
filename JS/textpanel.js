function getTextPanel() {
    var res = $("<div></div>");
    $(res).attr({
        "class":"text-panel"
    });
    $(res).css({
        "width":"100%",
        "overflow":"hidden"
    });
    $(res).keydown(function (event) {
        return false;
    });
    setNewItem(res,"append","text");
    return res;
}
function setNewItem(textpanel,mode,type) {
    var res = $("<div></div>");
    if(mode === "append") $(textpanel).append(res);
    else if(mode === "before") $(textpanel).before(res);
    else if(mode === "after") $(textpanel).after(res);
    else return;
    $(res).attr({
        "class":"content-item",
        "type":type,
        "onmouseup":"itemMouseup(event,this)"
    });
    $(res).css({
        "border":"",
        "min-height":(pageEdit.contentPanelInitialSize.h)+"px",
        "margin":"2px"
    });
    if(type === "text"){
        var newspan = $("<span></span>");
        $(newspan).css({
            "word-wrap":"break-word"
        });
        $(res).append(newspan);
    }
    return res;
}
function itemMouseup(event,item) {
    if(event.which === 1) {
        itemFocus(item);
        showContentEditPanel();
    }
}
function setTextPanelFocus(textpanel) {
    var tofocus = $(textpanel).find("div");
    itemFocus(tofocus);
    showContentEditPanel();
}
function itemFocus(tofocus) {
    if($(pageEdit.focusitem).is(tofocus))
        return;
    itemUnfocus();
    pageEdit.focusitem = tofocus;
    $(tofocus).css({
        "border":"1px solid LightSkyBlue"
    });
    var panel = $(tofocus).parent().parent();
    if(panel.attr("panel-checked")==="false"){
        panelCheck(panel);
    }
}
function itemUnfocus() {
    if(pageEdit.focusitem){
        $(pageEdit.focusitem).css({
            "border":""
        });
        if(isItemEmpty(pageEdit.focusitem)){
            var tp = $(pageEdit.focusitem).parent();
            $(pageEdit.focusitem).remove();
        }
        pageEdit.focusitem = null;
        $("body").find("#cep").remove();
    }
}
function isItemEmpty(item) {
    var type = $(item).attr("type");
    if(ItemInType[type] !== undefined)
        return ItemInType[type].isItemEmpty(item);
    else return true;
}