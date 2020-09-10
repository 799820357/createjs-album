/*
    图片集----------------------
*/
function Album(options){
    this.node = options.node;
    this.width = options.width;
    this.height = options.height;
    this.resources = options.resources;
    this.loadedResource = null;
    this.goldfishState = 0;
    this.goldfishStatus = true;
    this.goldfishs = options.goldfishs;
    this.triggerCall = options.triggerCall;
};
//原型方法
Album.prototype = {
    constructor : Album,
    init : function(){
        var _this = this;
        //创建画布，舞台
        _this.createStage();
        //加载资源
        Magpie.loadResources(_this.resources,function(result){
            _this.loadedResource = result;
            _this.createContainer();
            _this.bindEve();
            _this.trigger();
        });
    },
    //创建舞台
    createStage : function(){
        var _this = this;
        _this.createCanvas();
        _this.stage = new createjs.Stage(_this.canvas);
    },
    //创建画布
    createCanvas : function(){
        var _this = this;
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;
        _this.ctx = _this.canvas.getContext('2d');
        _this.node.appendChild(_this.canvas);
    },
    //创建图片容器
    createContainer : function(){
        var _this = this;
        _this.container = new createjs.Container();
        _this.stage.addChild(_this.container);
    },
    //触发
    trigger : function(num){
        var _this = this;
        _this.container.removeAllChildren();
        _this.goldfishStatus = true;
        _this.goldfishState = typeof num == 'number' ? num : _this.goldfishState;
        var resource = _this.loadedResource[parseInt(_this.loadedResource.length * Math.random())];
        var method = _this.goldfishs[_this.goldfishState] + 'Show';
        _this[method](resource);
        //是否回调通知
        if(typeof num != 'number'){
            typeof _this.triggerCall == 'function' && _this.triggerCall(_this.goldfishState);
        }
        
    },
    // 金鱼结束
    goldfishEnd : function(){
        var _this = this;
        _this.goldfishStatus = false;
        _this.goldfishState ++;
        _this.goldfishState = (_this.goldfishState >= _this.goldfishs.length) ? 0 : _this.goldfishState;
    },
    //变形
    distortionShow : function(resource){
        var _this = this;
        Goldfish.distortion({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            column : 20,
            row : 20,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //吹泡泡
    rotatetwinkleShow : function(resource){
        var _this = this;
        Goldfish.rotatetwinkle({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            column : 20,
            row : 20,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //旋转3d
    rotate3dShow : function(resource){
        var _this = this;
        Goldfish.rotate3d({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            column : 20,
            row : 20,
            rotateTime : 2000,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        })
    },
    //弹球
    pinballShow : function(resource){
        var _this = this;
        Goldfish.pinball({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            num : 20,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //飘扬
    flickerShow : function(resource){
        var _this = this;
        Goldfish.flicker({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            column : 8,
            row : 10,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //气泡展示
    bubbleShow : function(resource){
        var _this = this;
        Goldfish.bubble({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //网格展示
    gridShow : function(resource){
        var _this = this;
        Goldfish.grid({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            column : 10,
            row : 12,
            callback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        });
    },
    //碎片展示
    pieceShow : function(resource){
        var _this = this;
        Goldfish.piece({
            resource : resource.content,
            container : _this.container,
            width : _this.canvas.width,
            height : _this.canvas.height,
            endCallback : function(){
                console.log('done-执行容器：');
                console.log(this);
                _this.goldfishEnd();
            }
        })
    },
    //定时器
    handleTick : function(e){
        var _this = this;
        _this.stage.update();
    },
    //容器点击点击
    handleContainerClick : function(){
        var _this = this;
        if(_this.goldfishStatus){ return }
        _this.trigger();
    },
    //绑定事件
    bindEve : function(){
        var _this = this;
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener('tick', _this.stage.update.bind(_this.stage));
        _this.container.addEventListener('click',_this.handleContainerClick.bind(_this));
    }
};
