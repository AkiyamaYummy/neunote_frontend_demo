var DISPLAY_DEMO =
    '<div class="note-display">' +
    '<div class="note-display-other-message">' +
    '<span><b>作者</b></span>' +
    '<span class="note-display-author"></span><br/>' +
    '<span><b>页数</b></span>' +
    '<span class="note-display-pages"></span><br/><br/>' +
    '<span><b>笔记创建时间</b></span><br/>' +
    '<span class="note-display-create-time"></span><br/>' +
    '<span><b>最后编辑时间</b></span><br/>' +
    '<span class="note-display-edit-time"></span>' + '</div>' +
    '<div class="note-display-title-mask">' + '<div>' +
    '<span class="note-display-title"></span>' +
    '</div>' + '</div>' + '</div>';

var messagedemo = [
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    },
    {
        nickname:"史努比",
        pages:11,
        createtime:"2018/4/30 0:01",
        edittime:"2018/4/30 0:01",
        title:"传统相声曲艺八大棍"
    }
]
function noteSearchButtonOnclick(button){
    if($("#note-search-input").val().trim() === "")return;
    if("搜&nbsp;索" === $(button).html()){
        $(button).html("收&nbsp;起");
        loadNotes($("#note-search-display-content"),messagedemo);
    } else $(button).html("搜&nbsp;索");
    $("#note-search-display-panel").slideToggle();
}
function loadNotes(contentpanel,message) {
    var displaydemo = $(DISPLAY_DEMO);
    $(contentpanel).find(".note-display").remove();
    for(var i=0;i<Math.min(message.length,14);i++){
        var display = $(displaydemo).clone();
        $(display).find(".note-display-author").html(message[i].nickname);
        $(display).find(".note-display-pages").html(message[i].pages);
        $(display).find(".note-display-create-time").html(message[i].createtime);
        $(display).find(".note-display-edit-time").html(message[i].edittime);
        $(display).find(".note-display-title").html(message[i].title);
        $(contentpanel).append(display);
    }
}