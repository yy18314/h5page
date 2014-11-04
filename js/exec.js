/**
 * Created by yuyou on 14/11/4.
 */
var callbacks = new Array();
function load_page(index){
    var pages = config.pages[index];

    /*
        加载页面中的运动元素
        1.获取运动脚本列表
        2.配置回调函数
     */
    for(var i = 0 ; i < page.length ; i ++){
        var page = pages[i];
    }
}

function init(){
    //第一次运行的初始化
    $("#main").html("");
    for(var i = 0 ; i < config.pages.length; i ++){
        var page = config.pages[i];
        init_page(page);
    }
    $("#main").init_page("");
}

function init_page(page){
    var fill = page.fill;
    var page_dom = $("<article></article>").attr("id",page.id).addClass("suno-page");
    var bg_str = fill[0];
    if(fill[1] != null){
        bg_str += "url(images/" + fill[1] + ") no-repeat";
    }
    $(page_dom).css("background",bg_str).css("background-size","cover");


    var doms = page.dom;
    var configs = new Array();
    for(var i = 0 ; i < doms.length ; i ++){
        var dom = doms[i];
        var fill = dom.fill;
        var animate = dom.animate;
        switch(dom.type){
            case "image":
                configs.push(animate);
                break;
            case "group":break;
            case "text":break;
        }
    }

    var callback = function(){
        var images = $(page_dom).find("img");
        $(page_dom).init_move(images,configs);
    }

    callbacks.push(callback);       //增加回调函数

    $(page_dom).appendTo("#main");

}