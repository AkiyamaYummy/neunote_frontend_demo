function get_cookie(name){
    var cookie_str = document.cookie;
    var cookie_aar = cookie_str.split("; ");
    for ( var i = 0; i < cookie_aar.length; i++) {
        var arr = cookie_aar[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return null;
}