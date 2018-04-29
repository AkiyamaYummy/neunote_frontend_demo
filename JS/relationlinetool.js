function relationAOnclick(a,event) {
    var href = $(a).attr("href");
    if (href.charAt(0) === '$'){
        href = href.substring(1);
        var is = $(pageEdit.checkedpage).find("*[name="+href+"]");
        if(is.length > 0) {
            itemFocus(is[0]);
        }
        return false;
    }
}