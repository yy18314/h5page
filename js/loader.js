/**
 * Created by yuyou on 14/11/3.
 * loader:init
 */
var Loader = function(baseUrl){
    this.baseUrl = baseUrl || "";
    this.imageArr = [];
    this.asyncArr = [];
    this.syncArr = [];
}
Loader.prototype = {
    loadScript:function(src,callback) {
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
            script,options;
        var url = this.baseUrl + "js/" + src;
        script = document.createElement("script");
        script.async = false;
        script.type = "text/javascript";
        script.charset = "utf-8";
        url = url+( /\?/.test( url ) ? "&" : "?" )+ "_=" +(new Date()).getTime();
        script.src = url;
        head.insertBefore(script, head.firstChild);
        if(callback){
            document.addEventListener ? script.addEventListener("load", callback, false) : script.onreadystatechange = function() {
                if (/loaded|complete/.test(script.readyState)) {
                    script.onreadystatechange = null
                    callback()
                }
            }
        }
    },
    loadCSS:function(src,callback){

    },
    loadImage:function(src,callback){
        var image = new Image();
        var that = this;
        image.src = this.baseUrl + "images/" + src;
        image.addEventListener('load',function(e){
            callback.apply(this,arguments);
            that.imageArr.push({src:this.src,loaded:true});
        });
        image.addEventListener('error',function(e){
            //alert("图片资源不存在");
            callback.apply(this,arguments);
            that.imageArr.push({src:this.src,loaded:false});
        });
    },
    load:function(type,src,callback){
        switch(type){
            case "script":
                this.loadScript(src,callback);
                break;
            case "css":
                this.loadCSS(src,callback);
                break;
            case "image":
                this.loadImage(src,callback);
                break;
            default :break;
        }
    },
    loadSync:function(configs,percentage,next,index){
        index = index || 0;
        var config = configs[index];
        var that = this;
        this.load(config[0],config[1],function(){
            if(index < configs.length - 1){
                percentage(configs.length,index);
                that.loadSync(configs,percentage,next,index + 1);
            }else{
                next.apply(this,arguments);
            }
        });
    },
    loadAsync:function(configs,percent,finish){
        var index = 0;
        for(var i = 0 ; i < configs.length ; i ++){
            var config = configs[i];
            this.load(config[0],config[1],function(){
                index ++;
                percent(configs.length,index);
                if(index == configs.length){
                    finish.apply(this,arguments);
                }
            })
        }
    },
    addQueue:function(type,url,sync){
        /*
            加入异步列队：
            1.在异步列表中按config规则创建config对象
            2.把创建的config对象加入异步列队数组
         */
        var config = [type,url];
        if(sync){
            //同步列队
            this.syncArr.push(config)
        }else {
            this.asyncArr.push(config);
        }
    },
    execQueue:function(percent,finish){
        /*
            执行列队
            1.先执行同步列队
            2.后执行异步列队
         */
        var total = this.asyncArr.length + this.syncArr.length;
        var that = this;
        this.loadSync(this.syncArr,
            function(a,index){
                percent(total,index);
            },function(){
                that.loadAsync(that.asyncArr,function(a,index){
                    percent(total,index + that.syncArr.length)
            },finish);
        },0)
    },
    loadConfig:function(config,percent,finish){
        var js = config.basic.js;
        for(var i = 0 ; i < js.length ; i ++){
            if(js[i].sync){//同步列队
                this.addQueue("script",js[i].url,true);
            }else{
                this.addQueue("script",js[i].url);
            }
        }
        var pages = config.pages;
        for(var i = 0 ; i < pages.length ; i ++){
            var page = pages[i];
            var _imgUrl = page.fill[1];

            if(page.fill[1] != null){
                //执行列队操作
                this.addQueue("image",page.fill[1]);
            }

            for(var j = 0 ; j < pages[i].dom.length ; j ++){
                var _dom = page.dom[j]; //获取该dom元素的fill
                if(_dom.fill[1] != null){
                    //执行列队操作
                    this.addQueue("image",_dom.fill[1]);
                }
            }
        }
        this.execQueue(percent,finish);    //执行同步loading
    }
}

var loader = new Loader();
loader.load("script","config.js",function(){
    loader.loadConfig(config,function(total,index){
        //加载中，更改loading进度
    },function(){
        //加载完成，关闭loading层
        /*
        for(var i = 0 ; i < config.js.length ; i ++){
            var js = config.js[i];
            switch(js.name){
                case "parallax":break;
                case "pager":break;
            }
        }
        */
        init();
    });
});