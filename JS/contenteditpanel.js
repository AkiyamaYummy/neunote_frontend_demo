function showContentEditPanel() {
    $("body").find("#cep").remove();
    var cep = $("<div></div>");
    $("body").append(cep);
    var fposi = getEleAbsolutePosi(pageEdit.focusitem);
    var sc = getScroll();
    $(cep).attr({
        "id":"cep"
    });
    $(cep).css({
        "position":"fixed",
        "border":"2px solid gray",
        "box-shadow":"3px 3px 3px grey",
        "background":"white",
        "top":(pageEdit.cepfixing?pageEdit.cepposi.t:(fposi.t+fposi.h+10-sc.y))+"px",
        "left":(pageEdit.cepfixing?pageEdit.cepposi.l:(fposi.l-3-sc.x))+"px"
    });
    setCepTopPanel(cep);
    setCepMainPanel(cep);
}
function setCepTopPanel(cep) {
    var tp = $("<div></div>");
    $(cep).append(tp);
    $(tp).css({
        "width":"100%",
        "height":"22px",
        "border-bottom":"1px solid gray",
        "cursor":"move"
    });
    $(tp).mousedown(function (event) {
        if(!pageEdit.cepfixing)pageEdit.cepmoving = true;
    });
    $(tp).append(getCepCloseButton());
    $(tp).append(getCepFixButton());
    var type = $(pageEdit.focusitem).attr("type");
    //setTypeSwitch(tp,type)
}
function getCepCloseButton() {
    var res = $("<div></div>")
    $(res).css({
        "background-image":"url('./PIC/closebutton.png')",
        "background-size":"cover",
        "margin":"4px",
        "height":"14px",
        "width":"14px",
        "float":"right",
        "cursor":"pointer"
    });
    $(res).mouseup(function (event) {
        $("body").find("#cep").remove();
    })
    return res;
}
function getCepFixButton() {
    var res = $("<div></div>")
    $(res).css({
        "background-image":"url('./PIC/fixbutton.png')",
        "background-size":"cover",
        "margin":"4px",
        "height":"14px",
        "width":"14px",
        "float":"right",
        "cursor":"pointer"
    });
    if(pageEdit.cepfixing)
        $(res).css({"transform":"rotate(-45deg)"});
    else $(res).css({"transform":"rotate(45deg)"});
    $(res).mouseup(function (event) {
        pageEdit.cepmoving = true;
        var cep = $("body").find("#cep");
        var ta = $(cep).find("textarea");
        pageEdit.cepposi = getEleAbsolutePosi(cep);
        pageEdit.cepposi.w = getEleAbsolutePosi(ta).w;
        pageEdit.cepposi.h = getEleAbsolutePosi(ta).h;
        pageEdit.cepfixing = !pageEdit.cepfixing;
        if(pageEdit.cepfixing)
            $(res).css({"transform":"rotate(-45deg)"});
        else $(res).css({"transform":"rotate(45deg)"});
    });
    return res;
}
function setCepMainPanel(cep) {
    var mp = $("<div></div>");
    $(cep).append(mp);
    var type = $(pageEdit.focusitem).attr("type");
    switchCepMainPanel(type,mp);
    $(mp).keydown(function (event) {
        if(event.which === 13 && !event.shiftKey){
            if($(pageEdit.focusitem).parent().parent()
                    .attr("hlmode") === "true")
                return false;
            if(!isItemEmpty(pageEdit.focusitem)){
                var newitem = setNewItem(
                    pageEdit.focusitem,"after","text");
                itemFocus(newitem);
                showContentEditPanel();
            }
            return false;
        }else if(event.which === 33){
            var prev = $(pageEdit.focusitem).prev();
            if($(prev).html() === undefined)return false;
            itemFocus(prev);
            showContentEditPanel();
        }else if(event.which === 34){
            var next = $(pageEdit.focusitem).next();
            if($(next).html() === undefined)return false;
            itemFocus(next);
            showContentEditPanel();
        }
    });
}
function setTypeSwitch(tp,type) {
    var label = $("<label>类型选择</label>");
    $(label).css({
        "float":"left",
        "font-size":"15px",
        "color":"grey",
        "margin":"3px 5px"
    });
    $(tp).append(label);
    var select = $("<select></select>");
    $(select).css({
        "float":"left",
        "width":"70px",
        "margin-top":"1px",
        "height":"20px",
        "font-size":"15px",
        "font-family":"方正楷体简体",
        "border":"1px solid grey"
    });
    $(select).attr({
        "id":"type-select"
    });
    $(tp).append(select);
    for(t in ItemInType){
        var op = ItemInType[t].getOption();
        $(select).append(op);
        if(t === type)$(op).attr({"selected":"selected"});
    }
}
function switchCepMainPanel(type,mp) {
    $(pageEdit.focusitem).attr({"type":type});
    var oldtp = $("body").find("div[id=cep-main-panel]");
    if($(oldtp).html() !== undefined) {
        mp = $(oldtp).parent();
        oldtp.remove();
    }
    var ops = $("#type-select").find("option");
    for(var i=0;i<ops.length;i++){
        $(ops[i]).removeAttr("selected");
        if($(ops[i]).attr("value") === type){
            $(ops[i]).attr({"selected":"selected"});
        }
    }
    ItemInType[type].setMainPanel(mp)
}
var ItemInType = {
    "text":{
        setMainPanel:function (mp) {
            var tp = $("<div></div>");
            $(tp).attr({
                "id":"cep-main-panel"
            });
            $(mp).append(tp);
            var ta = $("<textarea></textarea>");
            $(ta).attr({
                "id":"text-main-textarea"
            });
            $(ta).css({
                "font-size":"17px",
                "font-family":"方正楷体简体",
                "height":(pageEdit.cepfixing?pageEdit.cepposi.h:200)+"px",
                "width":(pageEdit.cepfixing?pageEdit.cepposi.w:400)+"px",
            });
            $(tp).append(ta);
            //设置cep
            $(ta).bind('input propertychange', function() {
                ItemInType["text"].cep2item();
            });
            //绑定cep内元素的事件
            $(ta).focus();
            //设置初始焦点
            this.focusInit();
            //如果focusitem之前不是这个类别的，初始化focusitem
            this.item2cep();
            //设置初始值
        },
        getOption:function () {
            var textop = $("<option>文本框</option>");
            $(textop).attr({
                "value":"text"
            });
            $(textop).click(function (event) {
                switchCepMainPanel("text");
            });
            return textop;
        },
        isItemEmpty:function(item){
            var pstr = $(item).find(".text-flag").html();
            return (pstr==="");
        },
        focusInit:function () {
            if($(pageEdit.focusitem).find(".text-flag").length === 0){
                $(pageEdit.focusitem).empty();
                $(pageEdit.focusitem).append($("<span class='text-content'></span>"));
                var tf = $("<textarea class='text-flag'></textarea>");
                $(tf).css({
                    "display":"none"
                });
                $(pageEdit.focusitem).append(tf);
            }
        },
        cep2item:function () {
            var mt = $("#text-main-textarea");
            var value = $(mt).val();
            /*
            value = value.replace(/ /g,"&nbsp");
            value = value.replace(/</g,"&lt;");
            value = value.replace(/>/g,"&gt;");
            */
            var tf = $(pageEdit.focusitem).find(".text-flag")[0];
            var span = $(pageEdit.focusitem).find(".text-content")[0];
            $(tf).html(value);
            this.decode(value,span);
            $(pageEdit.focusitem).find("code").css({
                "width":"90%",
                "background":"none",
                "font-size":"17px",
                "font-family":"ALEO",
                "background":"rgba(135,206,250,0.1)",
                "margin":"auto",
                "padding":"3px",
                "overflow-x":"auto"
            });
            $(pageEdit.focusitem).find("pre").css({
                "margin":"0",
                "padding":"0"
            });
            $(pageEdit.focusitem).find("table").attr({
                "border":"1",
                "cellspacing":"0",
                "cellpadding":"0"
            });
        },
        item2cep:function () {
            var span = $(pageEdit.focusitem).find("span")[0];
            var mt = $("#text-main-textarea");
            var tf = $(pageEdit.focusitem).find(".text-flag")[0];
            $(mt).text($(tf).text());
        },
        decode:function (str,span) {
            var setstrs = str.match(/{[\s\S]*?}/g);
            if(setstrs !== null){
                var rep = this.execset(setstrs[0]);
                if(rep === "hl") str = str.substring(setstrs[0].length);
                else if(rep !== "ig"){
                    str = str.substring(setstrs[0].length);
                }
            }
            var liststrs = str.match(/\|\|\|[\s\S]*?\|\|\|/g);
            if(liststrs !== null)for(var i=0;i<liststrs.length;i++){
                str = str.replace(liststrs[i],this.decodeList(liststrs[i]));
            }

            var codes = str.match(/```[\s\S]*?```/g);
            if(codes !== null)for(var i=0;i<codes.length;i++){
                var oldstr = codes[i];
                codes[i] = codes[i].substring(3,codes[i].length-3);
                var lang = codes[i].split(/\s/)[0];
                codes[i] = codes[i].substring(lang.length).trim();
                var codecode = "<pre><code class='"+lang+"'>"+codes[i]+"</code></pre>";
                str = str.replace(oldstr,codecode);
            }
            $(span).html(str);
            var codes = $(span).find("code");
            for(var i=0;i<codes.length;i++)
                hljs.highlightBlock(codes[i]);

            MathJax.Hub.Config(pageEdit.MathJaxConfig);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,span]);

            str = $(span).html().replace(/&gt;/g,">");
            //$(span).html($(span).html().replace(/&#62;/g,">"));

            var converter = new showdown.Converter();
            $(span).html(converter.makeHtml(str));

            str = $(span).html();
            codes = str.match(/`[\s\S]*?`/g);
            if(codes !== null)for(var i=0;i<codes.length;i++){
                var oldstr = codes[i];
                codes[i] = codes[i].substring(1,codes[i].length-1);
                var codecode = "<span class='code-inline'>"+codes[i]+"</span>";
                str = str.replace(oldstr,codecode);
            }
            $(span).html(str);
            var codes = $(span).find(".code-inline");
            for(var i=0;i<codes.length;i++)
                hljs.highlightBlock(codes[i]);

            $(span).html(this.decodeImg($(span).html()));

            $(span).find("a").attr({
                "onclick":"return relationAOnclick(this,event)",
            });
        },
        decodeList:function (str) {
            str = str.substring(3,str.length-3);
            str = str.replace(/\s/g,"");
            var tabstr = "";
            var trs = str.split("||");
            for(var i=0;i<trs.length;i++){
                var trstr = "";
                var tds = trs[i].split("\|");
                for(var j=0;j<tds.length;j++){
                    var td = $("<td></td>");
                    var attrs = tds[j].split("\-");
                    if(attrs.length > 0)$(td).html(attrs[0]);
                    if(attrs.length > 1)$(td).attr({"colspan":attrs[1]});
                    if(attrs.length > 2)$(td).attr({"rowspan":attrs[2]});
                    trstr += $(td).prop("outerHTML");
                }
                tabstr += ("<tr>"+trstr+"</tr>");
            }
            return "<table>"+tabstr+"</table>"
        },
        decodeImg:function (str) {
            var p = $("<p></p>");
            $(p).html(str);
            var imgs = $(p).find("img");
            for(var i=0;i<imgs.length;i++){
                var ip = $("<div class='img-panel'></div>");
                var cp = $("<p class='img-comment'></p>");
                $(ip).append(cp);
                $(ip).append($(imgs[i]).clone());
                var alt = $(imgs[i]).attr("alt");
                if(typeof(alt) !== "undefined"&&alt!==""){
                    $(cp).text(alt);
                    $(ip).append(cp);
                }
                $(imgs[i]).after(ip);
                $(imgs[i]).remove();
            }
            return $(p).html();
        },
        execset:function (str) {
            try {
                str = str.replace(/{/,"{\"");
                str = str.replace(/}/,"\"}");
                str = str.replace(/,/,"\",\"");
                str = str.replace(/:/,"\":\"");
                var set = JSON.parse(str);
                var panel = $(pageEdit.focusitem).parent().parent();
                if($(panel).attr("hlmode") == "true"){
                    var op = set.hlmode.split(" ");
                    if(op.length > 0) {
                        $(panel).css({
                            "background-color": op[0]
                        });
                    }
                    if(op.length > 1){
                        $(panel).css({
                            "opacity": op[1]
                        });
                    }
                    return "hl";
                }else{
                    if(set.name){
                        $(pageEdit.focusitem).attr({
                            "name":set.name
                        });
                    }
                }
                return "";
            } catch(err) {
                return $(pageEdit.focusitem).parent().attr("hlmode")==="true"?"hl":"ig";
            }
        },
    }
};