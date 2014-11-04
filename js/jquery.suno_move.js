/**
 * Created by yuyou on 14-10-18.
 */
(function($){
    $.fn.extend({
        callback:null,
        wrap:null,
        move:function(type,config,callback){
            this.callback = callback;
            this.wrap = config.wrap || window;
            var cx = config.center? $(this.wrap).width() / 2:0;
            switch(type){
                case "left":
                    $(this).animate({top:config.y,left:-$(this).width(),opacity:0},0);
                    break;
                case "right":
                    $(this).animate({top:config.y,left:$(this.wrap).width(),opacity:0},0);
                    break;
                case "bottom":
                    $(this).animate({top:$(this.wrap).height(),left:config.x + cx,opacity:0},0);
                    break;
                case "top":
                    $(this).animate({top:-$(this).height(),left:config.x + cx,opacity:0},0);
                    break;
                default:moveTo(config);break;
            }
            this.moveTo(config,this.callback);
            return $(this);
        },
        zoomTo:function(config,callback){
            //缩放到指定位置
            this.callback = callback;
            this.wrap = config.wrap || window;
            var x = config.x;
            if(config.center){
                //相对中线的坐标（做x方向的坐标变换）
                x = config.x + $(this.wrap).width() / 2;
            }
            var y = config.y;
            var time = config.time || 300;
            var opacity = config.opacity || 1;
            $(this).animate({left:x,top:y,opacity:opacity},time,"swing",callback);

        },
        moveOut:function(type,config,callback){
            //移出去
            this.callback = callback;
            this.wrap = config.wrap || window;
            var cx = config.center? $(this.wrap).width() / 2:0;
            switch(type){
                case "left":
                    config.x = -$(this.wrap).width();
                    break;
                case "right":
                    config.x = $(this.wrap).width();
                    break;
                case "bottom":
                    config.y = $(this.wrap).height();
                    config.x = config.x + cx;
                    break;
                case "top":
                    config.y = -$(this.wrap).height();
                    config.x = config.x + cx;
                    break;
                default:break;
            }
            config.opacity = 0;
            this.moveTo(config,this.callback);
            return $(this);
        },
        moveTo: function (config,callback) {
            var x = config.x;
            if(config.center){
                //相对中线的坐标（做x方向的坐标变换）
                x = config.x + $(this.wrap).width() / 2;
            }
            var y = config.y;
            var time = config.time || 300;
            var opacity = config.opacity || 1;
            callback = callback || this.callback;
            $(this).animate({left:x,top:y,opacity:opacity},time,"swing",callback);
        },
        steps:function(configs,index){
            var config = configs[index];
            var that = this;
            this.moveTo(config,function(){
                if(index < configs.length - 1){
                    that.steps(configs,index + 1);
                }
            })
        },
        init_move:function(doms,steps){
            if(doms.length == steps.length){
                for(var i = 0 ; i < doms.length ; i ++){
                    var dom = doms[i];
                    var step = steps[i];
                    var _type = step[0];
                    var _config = {x:step[1],y:step[2],center:step[3],time:step[4]};
                    $(dom).move(_type,_config);
                }
            }
        },init_move_out:function(doms,steps){
            //把所有元素移除到屏幕外
            if(doms.length == steps.length){
                for(var i = 0 ; i < doms.length ; i ++){
                    var dom = doms[i];
                    var step = steps[i];
                    var _type = step[0];
                    var _config = {x:step[1],y:step[2],center:step[3],time:step[4]};
                    $(dom).moveOut(_type,_config);
                }
            }
        }
    });
})(jQuery);