function importJs(src) {
    var jspanel = document.getElementById("nnc-imported-js");
    if(!jspanel){
        jspanel = document.createElement("div");
        jspanel.setAttribute("id","nnc-imported-js");
        jspanel.style.display = "none";
        document.getElementsByTagName("body")[0].appendChild(jspanel);
    }
    var sc = document.createElement("script");
    sc.setAttribute("type","application/javascript");
    sc.setAttribute("src",src);
    jspanel.appendChild(sc);
}
function importCss(href) {
    var csspanel = document.getElementById("nnc-imported-css");
    if(!csspanel){
        csspanel = document.createElement("div");
        csspanel.setAttribute("id","nnc-imported-css");
        csspanel.style.display = "none";
        document.getElementsByTagName("body")[0].appendChild(csspanel);
    }
    var lk = document.createElement("link");
    lk.setAttribute("rel","stylesheet");
    lk.setAttribute("href",href);
    csspanel.appendChild(lk);
}
importJs("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML");
importJs("JS/clienttool.js");
importJs("JS/contentpanel.js");
importJs("JS/rightclickpaneltool.js");
importJs("JS/textpanel.js");
importJs("JS/contenteditpanel.js");
importJs("JS/contenteditpanel.js");
importJs("JS/pageedit.js");
importJs("JS/relationlinetool.js");
importJs("https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js");
importJs("http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js");
importCss("CSS/pagecss.css");
importCss("CSS/font.css");
importCss("http://cdn.bootcss.com/highlight.js/8.0/styles/github.min.css");