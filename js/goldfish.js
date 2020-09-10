/*
    金鱼------------------------
*/
function Goldfish(){};
//网格遍历
Goldfish.eachRect = function(column,row,fn){
    for(var ix = 0; ix < column; ix++){
        for(var iy = 0; iy < row; iy++){
            typeof fn == 'function' && fn(ix,iy);
        }
    }
};
//气泡
Goldfish.bubble = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        callback : null
    },options);
    for(var i = 0,len = 5; i < len; i++){
        var config = {};
        config.r = opts.width * 0.1 * Math.random();
        switch (i){
            case 0 : 
                config.x = opts.width / 4 * Math.random();
                config.y = opts.height / 4 * Math.random();
                break;
            case 1 : 
                config.x = opts.width - opts.width / 4 * Math.random();
                config.y = opts.height / 4 * Math.random();
                break;
            case 2 : 
                config.x = opts.width / 4 * Math.random();
                config.y = opts.height - opts.height / 4 * Math.random();
                break;
            case 3 : 
                config.x = opts.width - opts.width / 4 * Math.random();
                config.y = opts.height - opts.height / 4 * Math.random();
                break;
            case 4 : 
                config.y = opts.height / 2;
                config.x = opts.width / 2;
                break;
        };
        var shape = new createjs.Shape();
        shape.graphics.beginFill().drawCircle(config.x,config.y,config.r);
        var bitmap = new createjs.Bitmap(opts.resource);
        bitmap.set({
            mask : shape,
            alpha : 0.5
        });
        opts.container.addChild(bitmap);
        opts.container.addChild(shape);
        //动画
        createjs.Tween.get(bitmap).to({
            alpha : 1
        },500,createjs.Ease.circIn).call(done);
        createjs.Tween.get(shape.graphics.command).to({
            radius : opts.width > opts.height ? opts.width : opts.height
        },800,createjs.Ease.circIn).call(done);
    };
    len *= 2;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//网格
Goldfish.grid = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        column : 8,
        row : 8,
        callback : null
    },options);
    var w = Math.ceil(opts.width / opts.column),
        h = Math.ceil(opts.height / opts.row);
    var sum = opts.column + opts.row;
    //遍历矩形
    Goldfish.eachRect(opts.column,opts.row,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h;
        var ratio = (ix + iy) / sum;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x, y, w, h),
            x : x,
            y : y,
            scaleX : ratio,
            scaleY : ratio,
            orgX : x,
            orgY : y,
            alpha : ratio
        });
        opts.container.addChild(bitmap);
        //动画
        ratio = 1 - ratio;
        createjs.Tween.get(bitmap).to({
            scaleX : ratio,
            scaleY : ratio,
            alpha : ratio
        },400,createjs.Ease.circInOut).call(function(){
            createjs.Tween.get(this).to({
                scaleX : 1,
                scaleY : 1,
                alpha : 1
            },400).call(done);
        });
    });
    var len = opts.column * opts.row;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//碎片
Goldfish.piece = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        halfRunCallback : null,
        endCallback : null
    },options);
    var width = parseInt(opts.width),
        height = parseInt(opts.height);
    var w = parseInt(width / 10),
        h = parseInt(height / 10);
    var lx = Math.ceil(width / w),
        ly = Math.ceil(height / h);
    //动画
    Goldfish.eachRect(lx,ly,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h;
        var half = ly / 2 > iy;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x,y,w,h),
            x : width * Math.random(),
            y : half ? Math.random() * height / 10 : height - height / 10 + Math.random() * height / 10,
            orgX : x,
            orgY : y,
            scaleX : 0.1,
            scaleY : 0.1,
            alpha : 0.5
        });
        opts.container.addChild(bitmap);
        //串行动画
        createjs.Tween.get(bitmap).wait(100).to({
            y : height / 2 + Math.random() * height / 10 - height / 10,
            x : width / 3 + Math.random() * width / 3,
            alpha : 0.8
        },600,createjs.Ease.circOut).call(function(){
            //运行一半回调
            typeof opts.halfRunCallback == 'function' && opts.halfRunCallback.call(this);
            //动画
            createjs.Tween.get(this).wait(100).to({
                x : width / 2 + Math.random() * width / 10 - width / 10,
                y : height / 3 + Math.random() * height / 3,
            },400,createjs.Ease.circOut).call(function(){
                createjs.Tween.get(this).wait(100).to({
                        y : this.orgY,
                        x : this.orgX,
                        alpha : 1,
                        scaleX : 1,
                        scaleY : 1,
                        alpha : 1
                    },400,createjs.Ease.circOut).call(done);
                });
        });
    });
    var len = parseInt(lx * ly);
    function done(){
        len--;
        if(len === 0){
            typeof opts.endCallback == 'function' && opts.endCallback.call(opts.container);
        }
    }
};
//飘扬
Goldfish.flicker = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        column : 4,
        row : 6,
        callback : null
    },options);
    var w = Math.ceil(opts.width / opts.column),
        h = Math.ceil(opts.height / opts.row);
    var sum = opts.column + opts.row;
    Goldfish.eachRect(opts.column,opts.row,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h;
        var _sum = ix + iy;
        var _ratio = _sum / sum;
        var wait = (sum - _sum) * 20,
            scale = _ratio + 1,
            alpha = _ratio;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x, y, w, h),
            x : -w,
            y : y,
            orgX : x ,
            orgY : y,
            alpha : alpha,
            scaleX : _ratio,
            scaleY : _ratio,
            rotation : 12
        });
        opts.container.addChild(bitmap);
        //动画
        createjs.Tween.get(bitmap).wait(wait).to({
            x : (bitmap.orgX) * scale,
            y : (bitmap.orgY) * scale,
            scaleX : scale,
            scaleY : scale,
            alpha : alpha + 0.4,
            rotation : 6
        },400,createjs.Ease.bounceInOut).call(function(){
            createjs.Tween.get(this).to({
                x : this.orgX * 0.95,
                y : this.orgY * 0.95,
                scaleX : 0.95,
                scaleY : 0.95,
                rotation : 0,
                alpha : 1
            },400,createjs.Ease.circInOut).call(function(){
                createjs.Tween.get(this).to({
                    x : this.orgX,
                    y : this.orgY,
                    scaleX : 1,
                    scaleY : 1,
                },400,createjs.Ease.circInOut).call(done);
            })
        });
    });
    var len = opts.column * opts.row;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//弹球
Goldfish.pinball = function(options){
    var opts = Object.assign({
        resource : null,
        width : 0,
        height : 0,
        num : 10,
        callback : null
    },options);
    var endRadius = Math.sqrt(Math.pow(opts.width,2),Math.pow(opts.height,2));
    for(var i = 0,len = opts.num; i < len; i ++){
        (function(i){
            var r = opts.width / 20 * Math.random() + opts.width / 40;
            var position = {
                x : r + (opts.width - 2 * r) * Math.random(),
                y : r + opts.height / 5 * Math.random()
            };
            var shape = new createjs.Shape();
            shape.graphics.beginFill().drawCircle(position.x,position.y,r);
            var bitmap = new createjs.Bitmap(opts.resource);
            bitmap.set({
                mask : shape,
                alpha : 0
            });
            opts.container.addChild(bitmap);
            opts.container.addChild(shape);
            //动画
            createjs.Tween.get(bitmap).wait(i * 50).to({
                alpha : 0.5
            },100,createjs.Ease.circIn).call(function(){
                bitmap.alpha = 0.8;
                createjs.Tween.get(shape.graphics.command).to({
                    radius : 3 * r,
                    y : opts.height - r
                },300,createjs.Ease.circIn).call(function(){
                    createjs.Tween.get(this).to({
                        radius : 6 * r,
                        y : opts.height / 4 + opts.height / 4 * Math.random(),
                    },300).call(function(){
                        bitmap.alpha = 1;
                        createjs.Tween.get(this).wait((len - i) * 50).to({
                            radius : endRadius
                        },300).call(done);
                    });
                });
            })
        })(i)
    }
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//旋转
Goldfish.rotate3d = function(options){
    var opts = Object.assign({
        container : null,
        width : 0,
        height : 0,
        column : 20,
        row : 20,
        rotateTime : 2000,
        callback : null
    },options);
    //中心
    var center = {
        x : opts.width / 2,
        y : opts.height / 2
    };
    var w = Math.ceil(opts.width / opts.column),
        h = Math.ceil(opts.height / opts.row);
    //遍历
    Goldfish.eachRect(opts.column,opts.row,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h,
            offX = x - center.x;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x, y, w, h),
            x : x + w / 2,
            y : y + h / 2,
            regX : w / 2,
            regY : h / 2,
            orgX : x,
            orgY : y,
            scaleX : 0.4,
            scaleY : 0.4,
            rotateData : {
                r : Math.abs(offX),
                speed : Math.random() * 30 + 10,
                angle : x > center.x ? 180 : 0,
                focalLength : 250
            }
        });
        opts.container.addChild(bitmap);
        rotate.call(bitmap,opts.rotateTime);
    });
    //旋转
    function rotate(time){
        var _this = this;
        var random = Math.random();
        _this.rotateData.angle += _this.rotateData.speed;
        _this.rotateData.angle = _this.rotateData.angle > 360 ? _this.rotateData.angle - 360 : _this.rotateData.angle;
        var radian = _this.rotateData.angle * Math.PI / 180;
        var _y = Math.cos(radian) * _this.rotateData.r,
            _x = Math.sin(radian) * _this.rotateData.r,
            _alpha = _this.rotateData.focalLength / (_this.rotateData.focalLength - _y);
        //动画
        createjs.Tween.get(_this).to({
            x : _this.orgX + 2 * _x,
            alpha : _alpha,
            scaleX : _alpha / 2,
            scaleY : _alpha / 2
        },150,createjs.Ease.cubicIn).call(function(){
            time -= 150;
            if(time < 0){
                createjs.Tween.get(this).to({
                    x : this.orgX,
                    y : this.orgY,
                    regX : 0,
                    regY : 0,
                    alpha : 1,
                    scaleX : 1,
                    scaleY : 1
                },500).call(done);
                return;
             }
            rotate.call(this,time);
        });
    };
    //完成
    var len = opts.column * opts.row;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//旋转闪烁
Goldfish.rotatetwinkle = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        column : 10,
        row : 10,
        callback : null
    },options);
    var diagonal = Math.sqrt(Math.pow(opts.width,2) + Math.pow(opts.height,2)),
        center = {
            x : opts.width / 2,
            y : opts.height / 2
        };
    
    opts.container.set({
        x : opts.width / 2,
        y : opts.height / 2,
        regX : opts.width / 2,
        regY : opts.height / 2,
        scaleX : 0,
        scaleY : 0,
        alpha : 0.5,
        rotation : 0
    });
    var children = [];
    var w = Math.ceil(opts.width / opts.column),
        h = Math.ceil(opts.height / opts.row);
    var sum = opts.column + opts.row;
    //遍历矩形
    Goldfish.eachRect(opts.column,opts.row,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h;
        var ratio = (ix + iy) / sum;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x, y, w, h),
            x : x + w / 2,
            y : y + h / 2,
            regX : w / 2,
            regY : h / 2,
            scaleX : ratio,
            scaleY : ratio,
            orgX : x,
            orgY : y,
            ratio : ratio
        });
        children.push(bitmap);
        opts.container.addChild(bitmap);
    });
    //动画
    createjs.Tween.get(opts.container).to({
        scaleX : 1,
        scaleY : 1,
        rotation : 1080,
        alpha : 1
    },800).call(function(){
        children.forEach(function(bm){
            createjs.Tween.get(bm).to({
                scaleX : 1,
                scaleY : 1,
                alpha : bm.ratio
            },400).call(function(){
                createjs.Tween.get(bm).to({
                    x : bm.orgX,
                    y : bm.orgY,
                    scaleX : 1,
                    scaleY : 1,
                    regX : 0,
                    regY : 0,
                    alpha : 1
                },200).call(done);
            });
        })
    });
    //完成
    var len = opts.column * opts.row;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};
//变性
Goldfish.distortion = function(options){
    var opts = Object.assign({
        resource : null,
        container : null,
        width : 0,
        height : 0,
        row : 10,
        column : 10,
        callback : null
    },options);
    //属性
    var w = Math.ceil(opts.width / opts.column),
        h = Math.ceil(opts.height / opts.row);
    var sum = opts.column + opts.row;
    //遍历
    Goldfish.eachRect(opts.column,opts.row,function(ix,iy){
        var bitmap = new createjs.Bitmap(opts.resource);
        var x = ix * w,
            y = iy * h;
        var ratio = 1 - (ix + iy) / sum;
        bitmap.set({
            sourceRect : new createjs.Rectangle(x, y, w, h),
            x : 0,
            y : 0,
            scaleX : 0,
            scaleY : 0,
            alpha : 0
        });
        opts.container.addChild(bitmap);
        //动画
        createjs.Tween.get(bitmap).to({
            x : w + x * ratio,
            y : h + y * ratio,
            scaleX : ratio,
            scaleY : ratio,
            alpha : ratio - 0.2
        },400).call(function(){
            ratio = 1 - ratio;
            createjs.Tween.get(this).to({
                x : x * ratio,
                y : y * ratio,
                scaleX : ratio,
                scaleY : ratio,
                alpha : ratio - 0.2
            },400).call(function(){
                createjs.Tween.get(this).to({
                    x : x,
                    y : y,
                    scaleX : 1,
                    scaleY : 1,
                    alpha : 1
                },400).call(done);
            });
        })
    });
    //完成
    var len = opts.column * opts.row;
    function done(){
        len--;
        if(len === 0){
            typeof opts.callback == 'function' && opts.callback.call(opts.container);
        }
    }
};