function getRightClickEles(options) {
    var resmask = getRightClickMask();
    var respanel = getRightClickPanel(options.width,options.posi);
    for(var i=0;i<options.data.length;i++){
        $(respanel).append(
            getRightClickItem(options.data[i],options.height));
    }
    return {mask:resmask,panel:respanel};
}
function getRightClickPanel(width,posi) {
    var res = $("<div></div>");
    $(res).attr({
        "id":"right-click-panel"
    });
    $(res).css({
        "position":"fixed",
        "min-width":width,
        "top":posi.y,
        "left":posi.x,
        "background":"white",
        "border":"solid 1px grey",
        "border-radius":"3px"
    });
    return res;
}
function getRightClickItem(data,height) {
    var res = $("<div></div>");
    $(res).append($("<span>"+data.text+"</span>"));
    $(res).click(function () {
        data.onclick();
        $("#right-click-panel").remove();
        $("#right-click-mask").remove();
    });
    $(res).css({
        "height":height,
        "width":"100%",
        "cursor":"pointer"
    });
    return res;
}
function getRightClickMask() {
    var res = $("<div></div>");
    $(res).attr({
        "id":"right-click-mask"
    });
    $(res).css({
        "position":"fixed",
        "width":"100%",
        "height":"100%",
        "top":"0",
        "left":"0"
    });
    $(res).mouseup(function () {
        $("#right-click-panel").remove();
        $("#right-click-mask").remove();
    });
    return res;
}