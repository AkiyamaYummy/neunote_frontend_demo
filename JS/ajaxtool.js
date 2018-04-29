function new_ajax_obj(){
	var xml_http;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xml_http=new XMLHttpRequest();
    } else {// code for IE6, IE5
        xml_http=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xml_http;
}
function ajax_post_content(xml_http, url, ajax_mode, contents) {
    xmlhttp.open("POST", url, ajax_mode);
    var content_str = "";
    for(item in contents){
        if(content_str !== "")
            content_str += "&";
        content_str += item.key+"="+item.value;
    }
    xmlhttp.send(content_str);
}