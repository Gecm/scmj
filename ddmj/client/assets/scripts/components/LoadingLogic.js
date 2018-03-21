//咋这个编译器中黄色代表函数（方法），蓝色代表变量和方法名，就是标识符，深蓝就是代表关键字
cc.Class({
    extends: cc.Component,

    properties: {
        //这个是正在连接网路的字符串..
        tipLabel:cc.Label,
        //声明这个变量是为了给上面的变量赋值
        _stateStr:'',
        //定义一个计算数值的变量
        _progress:0.0,
        //定义一个splash来找到canvas的字节点
        _splash:null,

        _isLoading:false,
    },

    // use this for initialization
    //初始化一般这个脚本中执行
    onLoad: function () {
        //首先执行这个方法
        //先来得到Canvas组件，并且吧fitHeight设置为true。fitWidth = true，场景刚加载的时候我需要干什么
        if(!cc.sys.isNative && cc.sys.isMobile){
            //得到this.node.getComponent（cc.Canvas）
            var cvs = this.node.getComponent(cc.Canvas);//得到本脚挂的本节点的组件Canvas
            cvs.fitHeight = true;//设置是适配度
            cvs.fitWidth = true;
        }
        this.initMgr();//初始化
        this.tipLabel.string = this._stateStr;//这里是吧_stateStr:''，这个值给这个节点（tipLabel:cc.Label,）的string属性，_stateStr:''这个值在前面已经改变。
        
        this._splash = cc.find("Canvas/splash");//把Canvas下的splash节点给this._splash.

        this._splash.active = false;//将他的active设置为true
        
    },

    //onEnable: function(){},
    
    start:function(){
        //脚本及激活的时候我需要干的事情
        var self = this;//记录一下本方法的this
        var SHOW_TIME = 3000;//声明两个局部时间变量
        var FADE_TIME = 500;
        // if(cc.sys.os != cc.sys.OS_IOS || !cc.sys.isNative){
        //     self._splash.active = true;
        //     var t = Date.now();
        //     var fn = function(){
        //         var dt = Date.now() - t;
        //         if(dt < SHOW_TIME){
        //             setTimeout(fn,33);
        //         }
        //         else {
        //             var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
        //             if(op < 0){
        //                 self._splash.opacity = 0;
        //                 self.checkVersion();    
        //             }
        //             else{
        //                 self._splash.opacity = op;
        //                 setTimeout(fn,33);   
        //             }
        //         }
        //     };
        //     setTimeout(fn,33);
        // }
        // else{
        //     this._splash.active = false;
        //     this.checkVersion();
        // }
        this.checkVersion();//这是核对版本的方法
    },

    // update: function(){},
    // lateUpdate: function(){},
    // onDisable: function(){

    // },

    // onDestroy: function(){

    // },
    
    initMgr:function(){
       //这些都是一些全局可能用到的脚本
        //初始化函数，得到一些Script脚本，并对这些脚本进行初始化
        cc.vv = {};//创建一个空的函数对象,实例化脚本
        var UserMgr = require("UserMgr");//获取脚本的名称
        cc.vv.userMgr = new UserMgr();  //实例化这个脚本

        var ReplayMgr = require("ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
        
        cc.vv.http = require("HTTP");
        cc.vv.global = require("Global");
        cc.vv.net = require("Net");
        //游戏管理这个脚本是说我和客服端和服务器连发消息的纽带
        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
        // 一些原生接口的管理

        var AnysdkMgr = require("AnysdkMgr");
        cc.vv.anysdkMgr = new AnysdkMgr();
        cc.vv.anysdkMgr.init();
        //这是声音的管里
        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();
        

        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();
        
        var Utils = require("Utils");
        cc.vv.utils = new Utils();
        //记住的cc.args是跟获取地址字符串有关的东西
        cc.args = this.urlParse(); //把方法给这个变量
    },
    
    urlParse:function(){
        var params = {};
        if(window.location == null){
            return params;
        }
        var name,value; 
        var str=window.location.href; //取得整个地址栏
        
        var num=str.indexOf("?")
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){ 
            num=arr[ i].indexOf("="); 
            if(num>0){ 
                name=arr[i].substring(0,num);
                value=arr[i].substr(num+1);
                params[name]=value;
            } 
        }
        return params;
    },
    
    checkVersion:function(){
        var self = this;
        var onGetVersion = function(ret){
            if(ret.version == null){
                console.log("error.");
            }
            else{
                //cc.vv.SI = 服务端穿过来的数据这里面饱含了服务器的hallAddr = config.HALL_IP  + ":" + config.HALL_CLIENT_PORT;
                cc.vv.SI = ret;
                if(ret.version != cc.VERSION){
                    cc.find("Canvas/alert").active = true;
                }
                else{
                    self.startPreloading();
                }
            }
        };
        
        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            self._stateStr = "正在连接服务器";
            xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn,5000);            
        }
        
        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();//如果请求已经被发送，则立刻停止
                    self._stateStr = "连接失败，即将重试";
                    setTimeout(function(){
                        fnRequest();
                    },5000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },
    
    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.SI.appweb);
    },
    
    startPreloading:function(){
        this._stateStr = "正在加载资源，请稍候";
        this._isLoading = true;
        var self = this;
        //重写onProgress函数
        // cc.loader.onProgress = function ( completedCount, totalCount,  item ){
        //     //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
        //     if(self._isLoading){
        //         self._progress = completedCount/totalCount;
        //     }
        // };
        
        cc.loader.loadResDir("textures", function ( completedCount, totalCount,  item ){
            //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
             if(self._isLoading){
                self._progress = completedCount/totalCount;
                //self.tipLabel.string = Math.floor(self._progress * 100) + "%"; 
            }
        }, function (err, assets) {
            self.onLoadComplete();
        });      
    },
    
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("login");//进入下一个页面
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    }

});