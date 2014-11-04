/**
 * Created by yuyou on 14-10-18.
 */
(function($){
    $.fn.extend({
        winH:document.documentElement.clientHeight,
        dx:0,
        dy:0,
        index:0,
        prev:null,
        next:null,
        pages:new Array(),
        init_page:function(type){
            this.pages = $(this).find(".suno-page");
            for(var i = 0 ; i < this.pages.length ; i ++) {
                var page = this.pages[i];
                if(i == 0){
                    page.style.top = 0 + "px";
                }else{
                    page.style.top = -1000 + "px";
                }
            }
            var that = this;
            $(this).swip({
                bottom:function(){
                    //下翻操作
                    if(that.index > 0){
                        that.index -= 1;
                        $(that.prev).animate({top:that.winH},300);
                        $(that.next).animate({top:0},300);
                    }
                },top:function(){
                    //上翻操作
                    if(that.index < that.pages.length - 1){
                        that.index += 1;
                        $(that.prev).animate({top:-that.winH},300);
                        $(that.next).animate({top:0},300);
                    }
                },moving:function(x,y){
                    that.dx = x;
                    that.dy = y;
                    that.prev = that.pages[that.index];
                    that.prev.style.zIndex = 50;
                    if(that.dy > 0){
                        if(that.index + 1 < that.pages.length){
                            that.next = that.pages[that.index +1];
                            that.next.zIndex = 20;
                            $(that.prev).animate({top:-that.dy},0);
                            $(that.next).animate({top:that.winH - that.dy},0);
                        }
                    }else{
                        if(that.index - 1 >= 0) {
                            that.next = that.pages[that.index -1];
                            that.next.zIndex = 20;
                            $(that.prev).animate({top:-that.dy},0);
                            $(that.next).animate({top:-that.winH - that.dy},0);
                        }
                    }
                }
            });
        }
    });
})(jQuery);