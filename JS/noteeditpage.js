var mainEdit = {
    editing:false,
    tree:null,
    trash:null,
    treepath:[],
    notemessage:{},
    showing:null
};
function setMainEdit() {
    editModeOff();
    getBackendTree();
    getAllBackendNotes();
    var topbuttons = $(".top-panel-button");
    $(topbuttons[0]).click(function () {
        showTopButtonSubList();
    });
    $(topbuttons[1]).click(function () {
        mainEdit.editing = !mainEdit.editing;
        if(mainEdit.editing)editModeOn();
        else {
            editModeOff();
            allPanelsUncheck();
        }
        $(this).css({
            "background":mainEdit.editing?"white":"black",
            "color":mainEdit.editing?"black":"white"
        })
    });
    $(topbuttons[2]).click(function () {
        if(mainEdit.editing) {
            saveNowEditingPageWithBackend();
        }else alert("您不在编辑模式中");
    });
    $("#top-panel-note-prev-button").click(function () {
        if(mainEdit.showing.pageleft > 1){
            showingChange(mainEdit.showing.note,mainEdit.showing.pageleft-1,mainEdit.showing.pageleft);
        }
    });
    $("#top-panel-note-next-button").click(function () {
        if(mainEdit.showing.pageleft < mainEdit.notemessage[mainEdit.showing.note].pages){
            showingChange(mainEdit.showing.note,mainEdit.showing.pageleft+1,mainEdit.showing.pageleft+2);
        }
    });
    $("#showing-note-left-page").keydown(function (event) {
        if(event.which === 13) showingTextboxChange();
    });
    $("#showing-note-right-page").keydown(function (event) {
        if(event.which === 13) showingTextboxChange();
    });
}
function showingTextboxChange() {
    var leftstr = $("#showing-note-left-page").val();
    var rightstr = $("#showing-note-right-page").val();
    if(/[0-9]+/.test(leftstr) && /[0-9]+/.test(rightstr)){
        var leftval = parseInt(leftstr);
        var rightval = parseInt(rightstr);
        var totpage = mainEdit.notemessage[mainEdit.showing.note].pages;
        if(leftval>0 && leftval <= totpage && rightval>0 && rightval<=totpage+1){
            showingChange(mainEdit.showing.note,leftval,rightval);
            return;
        }
    }
    $("#showing-note-left-page").val(mainEdit.showing.pageleft);
    $("#showing-note-right-page").val(mainEdit.showing.pageright);
}
function editModeOff() {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    var mask = $("<div></div>");
    $(mask).attr({
        "class":"edit-close-mask"
    });
    $(mask).css({
        "position":"absolute",
        "width":"100%",
        "height":"100%",
        "top":"0",
        "left":"0"
    });
    $(".edit-page").append(mask);
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"edit_mode","side":false},
        async:false
    });
}
function editModeOn() {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $(".edit-close-mask").remove();
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"edit_mode","side":true},
        async:false
    });
}
function showingChange(id,pageleft,pageright) {
    saveNowEditingPageWithBackend();
    getBackendPage(id,pageleft,$("#page1"));
    getBackendPage(id,pageright,$("#page2"));
    $("#top-panel-note-message").show();
    $("#showing-note-title").html(mainEdit.notemessage[id].title);
    $("#showing-note-tot-page").html(mainEdit.notemessage[id].pages);
    mainEdit.showing = {note:id,pageleft:pageleft,pageright:pageright};
    $("#showing-note-left-page").val(mainEdit.showing.pageleft);
    $("#showing-note-right-page").val(mainEdit.showing.pageright);
}
function showTopButtonSubList() {
    var eleposi = getEleRelativePosi($(".top-panel-button")[0]);
    var listposi = {x: eleposi.l, y: eleposi.t + eleposi.h};
    var mask = getSubListMask();
    var list = $("<div></div>");
    $(list).attr({
        "id":"top-button-sublist"
    });
    $(list).css({
        "min-width":"150px",
        "position": "fixed",
        "top": (listposi.y+5)+"px",
        "left": (listposi.x-3)+"px",
        "background":"black",
        "color":"white"
    });
    if(mainEdit.treepath.length === 0){
        for(var i=0;i<mainEdit.tree.length;i++){
            $(list).append(getSubListItem(mainEdit.tree[i].key));
        }
        $(list).append(getSubListItem("详细信息"));
    }else if(mainEdit.treepath.length === 1){
        var items = mainEdit.tree[mainEdit.treepath[0]].value;
        for(var i=0;i<items.length;i++){
            $(list).append(getSubListItem(items[i].key));
        }
        $(list).append(getSubListItem("返回"));
    }else if(mainEdit.treepath.length === 2){
        var items = mainEdit.tree[mainEdit.treepath[0]].value[mainEdit.treepath[1]].value;
        for(var i=0;i<items.length;i++){
            var title = mainEdit.notemessage[items[i]].title;
            $(list).append(getSubListItem(title));
        }
        $(list).append(getSubListItem("返回"));
    }
    $("body").append(mask);
    $("body").append(list);
}
function getSubListItem(str) {
    var item = $("<div>"+str+"</div>");
    $(item).css({
        "margin":"3px 10px 7px 10px",
        "cursor":"pointer"
    });
    $(item).click(function () {
        execSubListClick($(this).index());
    });
    return item;
}
function execSubListClick(r) {
    $("#top-button-sublist").remove();
    $("#top-button-sublist-mask").remove();
    if(mainEdit.treepath.length === 0){
        var size = mainEdit.tree.length;
        if(r === size){
            showTreeEditPanel();
            return;
        }else{
            mainEdit.treepath.push(r);
        }
    }else if(mainEdit.treepath.length === 1){
        var size = mainEdit.tree[mainEdit.treepath[0]].value.length;
        if(r === size){
            mainEdit.treepath.pop();
        }else{
            mainEdit.treepath.push(r);
        }
    }else if(mainEdit.treepath.length === 2){
        var arr = mainEdit.tree[mainEdit.treepath[0]].value[mainEdit.treepath[1]].value;
        var size =arr.length;
        if(r === size){
            mainEdit.treepath.pop();
        }else{
            if(mainEdit.showing.note === arr[r])return;
            showingChange(arr[r],1,2);
            return;
        }
    }
    showTopButtonSubList();
}
function getSubListMask() {
    var mask = $("<div></div>");
    $(mask).attr({
        "id": "top-button-sublist-mask"
    });
    $(mask).css({
        "position": "fixed",
        "width": "100%",
        "height": "100%",
        "top": "0",
        "left": "0"
    });
    $(mask).click(function () {
        $("#top-button-sublist").remove();
        $("#top-button-sublist-mask").remove();
    });
    return mask;
}
function showTreeEditPanel() {
    if($("#tree-edit-panel").length > 0)
        $("#tree-edit-panel").remove();
    var treeeditpanel = $("<div></div>");
    $(treeeditpanel).attr({
        "id":"tree-edit-panel",
        "class":"tree-node",
        "name":"[]"
    });
    $(treeeditpanel).css({
        "position": "fixed",
        "width": "400px",
        "height": "100%",
        "top": "0",
        "left": "0",
        "background":"black",
        "color":"white",
        "font-family":"方正书宋简体",
        "font-size":"20px",
        "overflow-y":"scroll"
    });
    var treeshowpanel = $("<div></div>");
    $(treeshowpanel).css({
        "position":"absolute",
        "top":"50px",
        "left":"10px",
        "padding-bottom":"40px"
    });
    var closep = $("<u>收起</u>");
    $(closep).css({
        "position":"absolute",
        "top":"50px",
        "right":"10px",
        "cursor":"pointer"
    });
    $(closep).click(function () {
        $("#tree-edit-panel").remove();
    });
    $(treeeditpanel).append(treeshowpanel);
    $(treeeditpanel).append(closep);
    $("#main-top-panel").before(treeeditpanel);
    showTreeEditPanelContent();
    bindTreeNodeItem();
}
function showTreeEditPanelContent() {
    var contentpanel0 = $("#tree-edit-panel").find("div")[0];
    for(var i=0;i<mainEdit.tree.length;i++){
        var key1 = mainEdit.tree[i].key;
        var value1 = mainEdit.tree[i].value;
        var item1 = getTreeEditPanelItem(key1);
        $(contentpanel0).append(item1);
        $(item1).attr({"name":"["+i+"]"});
        var subpanel1 = getTreeEditPanelContent();
        $(contentpanel0).append(subpanel1);
        for(var j=0;j<value1.length;j++){
            var key2 = value1[j].key;
            var value2 = value1[j].value;
            var item2 = getTreeEditPanelItem(key2);
            $(subpanel1).append(item2);
            $(item2).attr({"name":"["+i+","+j+"]"});
            var subpanel2 = getTreeEditPanelContent();
            $(subpanel1).append(subpanel2);
            for(var k=0;k<value2.length;k++){
                var key3 = value2[k];
                var contentitempanel = getTreeEditNoteMessagePanel(key3);
                $($(contentitempanel).find("div")[0]).attr({"name":"["+i+","+j+","+k+"]"});
                $(subpanel2).append(contentitempanel);
                var id = mainEdit.tree[i].value[j].value[k];
                $(contentitempanel).css({
                    "cursor":"pointer"
                });
                $(contentitempanel).attr({
                    "onclick":
                    "if(mainEdit.showing && mainEdit.showing.note === '"+id+"')return;" +
                    "else showingChange('"+id+"',1,2);"
                })
            }
        }
    }
}
function getTreeEditPanelItem(str) {
    var item = $("<div>"+str+"</div>");
    $(item).attr({
        "class":"tree-node"
    });
    $(item).css({
        "margin-left":"10px",
        "cursor":"pointer"
    });
    $(item).click(function () {
        $(this).next().slideToggle("fast");
    });
    return item;
}
function getTreeEditPanelContent() {
    var content = $("<div></div>");
    $(content).css({
        "margin-left":"30px",
        "border-left":"1px white dashed"
    });
    return content;
}
function getTreeEditNoteMessagePanel(id) {
    var messagenode = mainEdit.notemessage[id];
    if(!messagenode)return;
    var title = messagenode.title;
    var messagepanel = $("<div></div>");
    var item = getTreeEditPanelItem(title);
    $(messagepanel).append(item);
    var messagecontent = $("<div></div>");
    //{"author":"20164929","lastEditTime":"2018-04-26 19:27:08.0","noteId":"jbQGhk2Q","pages":1,"releaseTime":"2018-04-26 19:27:08.0","title":"新笔记"}
    $(messagecontent).append(getTreeEditMessageItem("页数",messagenode.pages));
    $(messagecontent).append(getTreeEditMessageItem("最后编辑时间",messagenode.lastEditTime));
    $(messagecontent).append(getTreeEditMessageItem("创建时间",messagenode.releaseTime));
    $(messagepanel).append(messagecontent);
    $(messagepanel).find("label").css({
        "height":"20px",
        "width":"100px",
        "display":"inline-block"
    });
    $(messagepanel).find("span").css({
        "height":"20px",
        "margin":"0"
    });
    return messagepanel;
}
function getTreeEditMessageItem(key,value) {
    var mi = $("<div></div>");
    $(mi).css({
        "font-size":"15px",
        "margin-left":"30px"
    });
    $(mi).append($("<label>"+key+"</label>"));
    $(mi).append($("<span>"+value+"</span>"));
    return mi;
}
function bindTreeNodeItem() {
    $(".tree-node").bind("contextmenu",function (event) {
        var path = JSON.parse($(this).attr("name"));
        return execTreeNodeRightClick(path,event);
    })
}
function unbindTreeNodeItem() {
    $(".tree-node").unbind("contextmenu")
}
function execTreeNodeRightClick(path,e) {
    if(!mainEdit.editing)return;
    var rcpaneldata = [];
    if(path.length === 0){
        rcpaneldata.push({
            text:"新笔记本",
            onclick:function(){
                addNewNoteBook(-1);
            }
        });
        if(mainEdit.trash.length > 0) {
            rcpaneldata.push({
                text: "查看闲置笔记",
                onclick: function () {
                    showRemovedNotes(-1);
                }
            });
        }
    }else if(path.length === 1){
        rcpaneldata.push({
            text:"在该位置新建笔记本",
            onclick:function(){
                addNewNoteBook(path[0]);
            }
        });
        rcpaneldata.push({
            text: "新分区",
            onclick: function () {
                addNewPart(path[0], -1);
            }
        });
        rcpaneldata.push({
            text: "重命名",
            onclick: function () {
                renameNoteBook(path[0]);
            }
        });
        rcpaneldata.push({
            text: "闲置",
            onclick: function () {
                removeNoteBook(path[0]);
            }
        });
        if(mainEdit.trash.length > 0) {
            rcpaneldata.push({
                text: "查看闲置笔记",
                onclick: function () {
                    showRemovedNotes(-1);
                }
            });
        }
    }else if(path.length === 2){
        rcpaneldata.push({
            text:"在该位置新建分区",
            onclick:function(){
                addNewPart(path[0],path[1]);
            }
        });
        rcpaneldata.push({
            text:"新笔记",
            onclick:function(){
                getNewNoteFromBackend(path[0],path[1],-1);
            }
        });
        rcpaneldata.push({
            text: "重命名",
            onclick: function () {
                renamePart(path[0],path[1]);
            }
        });
        rcpaneldata.push({
            text: "闲置",
            onclick: function () {
                removePart(path[0],path[1]);
            }
        });
        if(mainEdit.trash.length > 0) {
            rcpaneldata.push({
                text: "恢复闲置笔记到该分区",
                onclick: function () {
                    showRemovedNotes(path[0], path[1]);
                }
            });
        }
    }else if(path.length === 3){
        rcpaneldata.push({
            text:"在该位置新建笔记",
            onclick:function(){
                getNewNoteFromBackend(path[0],path[1],path[2]);
            }
        });
        rcpaneldata.push({
            text: "重命名",
            onclick: function () {
                renameNote(path[0],path[1],path[2]);
            }
        });
        rcpaneldata.push({
            text: "闲置",
            onclick: function () {
                removeNote(path[0],path[1],path[2]);
            }
        });
        if(mainEdit.trash.length > 0) {
            rcpaneldata.push({
                text: "查看闲置笔记",
                onclick: function () {
                    showRemovedNotes(-1);
                }
            });
        }
    }
    var demo = getRightClickEles({
        height:"20px",
        width:"100px",
        posi:getMouseAbsolutePosi(e),
        data:rcpaneldata
    });
    $("body").append(demo.mask);
    $("body").append(demo.panel);
    return false;
}
function showRemovedNotes(rank1,rank2) {
    var contentpanel = $("#tree-edit-panel").find("div")[0];
    $(contentpanel).empty();
    unbindTreeNodeItem();
    $(contentpanel).append($("<p style='font-size: 30px'>被闲置的笔记</p>"));
    $(contentpanel).append(getRemovedNotesEditButtonPanel(rank1,rank2));
    for(var i=0;i<mainEdit.trash.length;i++){
        var message = getTreeEditNoteMessagePanel(mainEdit.trash[i]);
        $($(message).find("div")[0]).prepend($("<input type='checkbox'/>"));
        $(contentpanel).append(message);
    }
}
function getRemovedNotesEditButtonPanel(rank1,rank2) {
    var panel = $("<div></div>");
    var backButton = $("<button>返回</button>");
    $(backButton).click(function () {
        setBackendTree();
        showTreeEditPanel();
    });
    $(panel).append(backButton);
    var removeButton = $("<button>彻底删除</button>");
    $(removeButton).click(function () {
        var res = confirm("删除后无法恢复，确定删除吗？");
        if (res === true) {
            var boxs = $("#tree-edit-panel").find("input[type='checkbox']");
            for(var i=boxs.length-1;i>=0;i--) {
                if($(boxs[i]).is(':checked')) {
                    removeBackendNote(mainEdit.trash[i]);
                    mainEdit.trash.remove(i);
                }
            }
            setBackendTree();
            showTreeEditPanel();
        }
    });
    $(panel).append(removeButton);
    if(rank1 !== -1) {
        var restoreButton = $("<button>恢复</button>");
        $(restoreButton).click(function () {
            var boxs = $("#tree-edit-panel").find("input[type='checkbox']");
            for(var i=boxs.length-1;i>=0;i--) {
                if($(boxs[i]).is(':checked')) {
                    mainEdit.tree[rank1].value[rank2].value.push(mainEdit.trash[i]);
                    mainEdit.trash.remove(i);
                }
            }
            setBackendTree();
            showTreeEditPanel();
        });
        $(panel).append(restoreButton);
    }
    return panel;
}
function addNewNoteBook(rank) {
    if(rank === -1){
        mainEdit.tree.push({key:"新笔记本",value:[]});
    }else{
        mainEdit.tree.insert(rank,{key:"新笔记本",value:[]});
    }
    setBackendTree();
    showTreeEditPanel();
}
function addNewPart(rank1,rank2) {
    var arr = mainEdit.tree[rank1].value;
    if(rank2 === -1){
        arr.push({key:"新分区",value:[]});
    }else{
        arr.insert(rank2,{key:"新分区",value:[]});
    }
    setBackendTree();
    showTreeEditPanel();
}
function removeNoteBook(rank) {
    var arr = mainEdit.tree.remove(rank).value;
    for(var i=0;i<arr.length;i++){
        for(var j=0;j<arr[i].value.length;j++){
            mainEdit.trash.push(arr[i].value[j]);
        }
    }
    setBackendTree();
    showTreeEditPanel();
}
function removePart(rank1,rank2) {
    var arr = mainEdit.tree[rank1].value.remove(rank2).value;
    for(var i=0;i<arr.length;i++){
        mainEdit.trash.push(arr[i]);
    }
    setBackendTree();
    showTreeEditPanel();
}
function removeNote(rank1,rank2,rank3) {
    var val = mainEdit.tree[rank1].value[rank2].value.remove(rank3);
    mainEdit.trash.push(val);
    setBackendTree();
    showTreeEditPanel();
}
function renameNoteBook(rank){
    $("#rename-node-input").remove();
    var item = $("*[name='["+rank+"]']");
    var textline = $("<input id='rename-node-input' type='text'/>");
    $(item).after(textline);
    $(textline).keydown(function (event) {
        if(event.which === 13){
            var val = $(this).val();
            if(/^[^<>"'{}\[\]]+$/.test(val)) {
                mainEdit.tree[rank].key = val;
                setBackendTree();
                showTreeEditPanel();
            }else alert("请注意命名中不能含有非法字符如 < > \" ' { } [ ]");
        }
    });
    $(textline).focus();
}
function renamePart(rank1,rank2) {
    $("#rename-node-input").remove();
    var item = $("*[name='["+rank1+","+rank2+"]']");
    var textline = $("<input id='rename-node-input' type='text'/>");
    $(item).after(textline);
    $(textline).keydown(function (event) {
        if(event.which === 13){
            var val = $(this).val();
            if(/^[^<>"'{}\[\]]+$/.test(val)) {
                mainEdit.tree[rank1].value[rank2].key = $(this).val();
                setBackendTree();
                showTreeEditPanel();
            }else alert("请注意命名中不能含有非法字符如 < > \" ' { } [ ]");
        }
    });
    $(textline).focus();
}
function renameNote(rank1,rank2,rank3) {
    $("#rename-node-input").remove();
    var item = $("*[name='["+rank1+","+rank2+","+rank3+"]']");
    var textline = $("<input id='rename-node-input' type='text'/>");
    var id = mainEdit.tree[rank1].value[rank2].value[rank3];
    $(item).after(textline);
    $(textline).keydown(function (event) {
        if(event.which === 13){
            var val = $(this).val();
            if(/^[^<>"'{}\[\]]+$/.test(val)) {
                renameNoteWithBackend(id,$(this).val());
            }else alert("请注意命名中不能含有非法字符如 < > \" ' { } [ ]");
        }
    });
    $(textline).focus();
}
function getAllBackendNotes() {
    for(var i=0;i<mainEdit.tree.length;i++){
        var arr1 = mainEdit.tree[i].value;
        for(var j=0;j<arr1.length;j++){
            var arr2 = arr1[j].value;
            for(var k=0;k<arr2.length;k++){
                getBackendNote(arr2[k]);
            }
        }
    }
    for(var i=0;i<mainEdit.trash.length;i++){
        getBackendNote(mainEdit.trash[i]);
    }
}
function getBackendNote(id) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        scriptCharset: 'utf-8',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"note",note_id:id},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else if((data+"").trim() === "Note doesn't exist.") {
                alert("无法获取笔记信息，笔记不存在");
            }else {
                var notemessage = JSON.parse((data+"").trim());
                mainEdit.notemessage[notemessage.noteId] = notemessage;
                showTreeEditPanel();
            }
        }.bind(this)
    });
}
function getBackendTree() {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        scriptCharset: 'utf-8',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"tree"},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else{
                var datadecode = decodeURIComponent(data);
                var tree = JSON.parse("["+(datadecode+"").trim()+"]");
                mainEdit.tree = [];
                mainEdit.trash = null;
                for(var i=0;i<tree.length;i++){
                    if("trash" in tree[i])mainEdit.trash = tree[i].value;
                    else mainEdit.tree.push(tree[i]);
                }
                if(mainEdit.trash === null){
                    mainEdit.trash = [];
                }
            }
        }.bind(this)
    });
}
function setBackendTree() {
    var c_code = get_cookie("c_code");
    var tree = JSON.stringify(mainEdit.tree);
    var trash = JSON.stringify({trash:"",value:mainEdit.trash});
    tree = tree.substring(1,tree.length-1);
    if(trash !== "" && tree !== "")tree = tree+","+trash;
    else tree = tree+trash;
    tree = encodeURIComponent(tree);
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"tree_edit","tree":tree},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else if((data+"").trim() === "Edit successfully.") {

            }
        }.bind(this)
    });
}
function getNewNoteFromBackend(rank1,rank2,rank3) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"note_create"},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else{
                var notemessage = JSON.parse((data+"").trim());
                mainEdit.notemessage[notemessage.noteId] = notemessage;
                var arr = mainEdit.tree[rank1].value[rank2].value;
                if(rank3 === -1){
                    arr.push(notemessage.noteId);
                }else{
                    arr.insert(rank3,notemessage.noteId);
                }
                setBackendTree();
                showTreeEditPanel();
            }
        }.bind(this)
    });
}
function renameNoteWithBackend(id,newname) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"note_rename","note_id":id,"new_name":newname},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else if((data+"").trim() === "Note doesn't exist.") {
                alert("重命名失败，笔记不存在");
            }else{
                var notemessage = JSON.parse((data+"").trim());
                mainEdit.notemessage[notemessage.noteId] = notemessage;
                if(mainEdit.showing.note === notemessage.noteId){
                    $("#showing-note-title").html(notemessage.title);
                }
                showTreeEditPanel();
            }
        }.bind(this)
    });
}
function removeBackendNote(id) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"note_drop","note_id":id},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else if((data+"").trim() === "Note doesn't exist.") {
                alert("删除失败，笔记不存在");
            }else if((data+"").trim() === "Edit successfully."){

            }
        }.bind(this)
    });
}
function getBackendPage(id,page,pageele) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"page","note_id":id,"number":page},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "Note doesn't exist.") {
                alert("无法获取这一页的内容，该篇笔记不存在");
            }else if((data+"").trim() === "This page doesn't exist."){
                if(page-mainEdit.notemessage[id].pages <=2){
                    var oldmode = mainEdit.editing;
                    editModeOn();
                    pageEdit.pageLoadContent(pageele,"");
                    if(!oldmode)editModeOff();
                } else alert("无法获取这一页的内容，该页码不存在");
            }else{
                var oldmode = mainEdit.editing;
                editModeOn();
                pageEdit.pageLoadContent(pageele,decodeURIComponent((data+"").trim()));
                if(!oldmode)editModeOff();
            }
        }.bind(this)
    });
}
function setBackendPage(id,page,pageele) {
    var c_code = get_cookie("c_code");
    if(c_code === null){
        location.href = "login.jsp";
    }
    var content = pageEdit.pageGetContent(pageele);
    content = encodeURIComponent(content);
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: "NoteEdit",
        data:{"c_code":c_code,"type":"page_edit","note_id":id,"number":page,"content":content},
        async:false,
        success:function(data){
            if((data+"").trim() === "You are not logged in."){
                location.href = "login.jsp";
            }else if((data+"").trim() === "You are not in edit mode.") {
                alert("您不在编辑模式中");
            }else if((data+"").trim() === "Note doesn't exist.") {
                alert("编辑失败，该篇笔记不存在");
            }else if((data+"").trim() === "Illegal operation."){
                alert("编辑失败，非法操作");
            }else {
                var notemessage = JSON.parse((data+"").trim());
                mainEdit.notemessage[notemessage.noteId] = notemessage;
                if(mainEdit.showing.note === notemessage.noteId){
                    $("#showing-note-tot-page").html(notemessage.pages);
                }
                if($("#tree-edit-panel").length > 0)
                    showTreeEditPanel();
            }
        }.bind(this)
    });
}
function saveNowEditingPageWithBackend() {
    if(mainEdit.showing) {
        var oldeditmode = mainEdit.editing;
        if(!oldeditmode)editModeOn();
        setBackendPage(mainEdit.showing.note, mainEdit.showing.pageleft, $("#page1"));
        setBackendPage(mainEdit.showing.note, mainEdit.showing.pageright, $("#page2"));
        if(!oldeditmode)editModeOff();
    }
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.remove = function(index) {
    var res = this[index];
    this.splice(index, 1);
    return res;
};