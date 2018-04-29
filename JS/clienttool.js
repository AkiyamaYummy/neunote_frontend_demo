var debug = console.log;
function getScroll(){
    var scrollTop = 0,scrollLeft = 0;
    if(document.documentElement&&document.documentElement.scrollTop)
        scrollTop=document.documentElement.scrollTop;
    else if(document.body)
        scrollTop=document.body.scrollTop;
    if(document.documentElement&&document.documentElement.scrollLeft)
        scrollLeft=document.documentElement.scrollLeft;
    else if(document.body)
        scrollLeft=document.body.scrollLeft;
    return {x:scrollLeft,y:scrollTop};
}
function getClient() {
    var clientTop = 0,clientLeft = 0;
    if(document.documentElement&&document.documentElement.clientTop)
        clientTop=document.documentElement.clientTop;
    else if(document.body)
        clientTop=document.body.clientTop;
    if(document.documentElement&&document.documentElement.clientLeft)
        clientLeft=document.documentElement.clientLeft;
    else if(document.body)
        clientLeft=document.body.clientLeft;
    return {x:clientLeft,y:clientTop};
}
function getMousePosi(e) {
    var scroll = getScroll(),client = getClient();
    return {
        x:e.clientX+scroll.x-client.x,
        y:e.clientY+scroll.y-client.y
    };
}
function getEleRelativePosi(ele) {
    var father = $(ele).parent();
    var fo = $(father).offset();
    var eo = $(ele).offset();
    res = {
        t:eo.top-fo.top,
        l:eo.left-fo.left,
        w:$(ele).width(),
        h:$(ele).height()
    }
    //alert(res.l+" "+res.t+" "+res.w+" "+res.h);
    return res;
}
function getEleAbsolutePosi(ele) {
    var father = $(ele).parent();
    var eo = $(ele).offset();
    res = {
        t:eo.top,
        l:eo.left,
        w:$(ele).width(),
        h:$(ele).height()
    }
    //alert(res.l+" "+res.t+" "+res.w+" "+res.h);
    return res;
}
function getMouseAbsolutePosi(e) {
    var mp = getMousePosi(e);
    var sc = getScroll(e);
    return {
        x:mp.x-sc.x,
        y:mp.y-sc.y
    };
}