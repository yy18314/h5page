/**
 * Created by yuyou on 14-10-15.
 */
(function($){
    $.fn.extend({
        config:{},
        startX:0,
        startY:0,
        transX:0,
        transY:0,
        time:0,
        addHandler : function(obj,type,fn){
            if(obj.attachEvent){
                obj.attachEvent('on'+type,fn);
            }else if(obj.addEventListener){
                obj.addEventListener(type,fn,false);
            }else{
                obj["on"+type] = fn;
            }
        },
        bind_fn : function(obj,fn){
            return function(){
                fn.apply(obj,arguments);
            }
        },
        swip: function (config) {
            this.config = config;
            this.addHandler($(this)[0],"touchstart",this.bind_fn(this,this.touch_start));
            this.addHandler($(this)[0],"touchmove",this.bind_fn(this,this.touch_move));
            this.addHandler($(this)[0],"touchend",this.bind_fn(this,this.touch_end));
            return $(this);
        },
        touch_start : function(e){
            if(!event.touches.length) return;
            var touch = event.touches[0];
            this.startX = touch.pageX;
            this.startY = touch.pageY;
            this.transX = 0;
            this.transY = 0;
        },
        touch_move : function(e){
            if(!event.touches.length) return;
            var touch = event.touches[0];
            this.transX = this.startX-touch.pageX;
            this.transY = this.startY-touch.pageY;
            if(this.config.moving != null)this.config.moving(this.transX,this.transY);

            e.preventDefault();
        },
        touch_end : function(){
            var absX = Math.abs(this.transX);
            var absY = Math.abs(this.transY);
            if(absX > 5 && absX > absY){
                if(this.transX < 0){
                    if(this.config.right != null)this.config.right.apply(this,arguments);
                }else{
                    if(this.config.left != null)this.config.left.apply(this,arguments);
                }
            }else if(absY > 5 && absY > absX){
                if(this.transY < 0){
                    if(this.config.bottom != null)this.config.bottom.apply(this,arguments);
                }else{
                    if(this.config.top != null)this.config.top.apply(this,arguments);
                }
            }
            if(this.config.speed != null)this.config.speed(this.transX,this.transY);
        }
    });
})(jQuery);