

var Mario=cc.Sprite.extend({

    ctor:function () {
        this._super()
        // 设置脸朝右的帧
        var texture = cc.textureCache.addImage("res/smallWalkRight.png");
        var  frame = new cc.SpriteFrame(texture, cc.rect(0, 0,
            texture.getContentSize().width / 11,
            texture.getContentSize().height));
       // CCSprite::initWithSpriteFrame(frame);
             this.setSpriteFrame(frame)

        // 设置mario的zorder，不设置会被山覆盖
        this.setLocalZOrder(100);

        // 属性的初始化
        this._speed = 200;
        this._speedUp = 0;
        this._speedAcc = 10;
        this._speedDown = this._speedAcc;
        this._bGodMode = false;
        this._dead = false;


        this._dirRun = Common.DIRECTION.NONE;
        this._dirFace = Common.DIRECTION.RIGHT;
        //_life = 3;
        this._isBig = false;
        this._canFire = false;
        this._bFly = false;
        this._autoRun = false;
        this._flagRunAction = false;

        {
            // mario用到的动画

            cc.animationCache.addAnimation(Common.CreateAnimation("res/smallWalkLeft.png", 0, 9, 14, 0.05), "SmallWalkLeft");
            cc.animationCache.addAnimation(
                Common.CreateAnimation("res/smallWalkRight.png", 0, 9, 14, 0.05), "SmallWalkRight");

            cc.animationCache.addAnimation(
                Common.CreateAnimation("res/small_die.png", 0, 6, 16, 0.05), "smalldie");

            // Mario用到的帧

            frame = Common.getSpriteFrame("res/smallWalkLeft.png", 10, 14);
            cc.spriteFrameCache.addSpriteFrame(frame, "SmallJumpLeft");

            frame = Common.getSpriteFrame("res/smallWalkRight.png", 10, 14);
            cc.spriteFrameCache.addSpriteFrame(frame, "SmallJumpRight");
        }

        {
            // mario用到的动画
            cc.animationCache.addAnimation(Common.CreateAnimation("res/walkLeft.png", 0, 9, 18, 0.05), "BigWalkLeft");
            cc.animationCache.addAnimation(Common.CreateAnimation("res/walkRight.png", 0, 9, 18, 0.05), "BigWalkRight");


            // Mario用到的帧
            frame = Common.getSpriteFrame("res/walkLeft.png", 10, 18);
            cc.spriteFrameCache.addSpriteFrame(frame, "BigJumpLeft");

            frame = Common.getSpriteFrame("res/walkRight.png", 10, 18);
            cc.spriteFrameCache.addSpriteFrame(frame, "BigJumpRight");
        }


    },
    unsetGodMode:function (dt) {
       this._bGodMode=false;
    },
    setGodMode:function (time) {
        this._bGodMode=true;
        this.scheduleOnce(this.unsetGodMode,time);
    },
    autoRun:function () {
       this._autoRun=true;
       this.updateStatus();
       this._speedUp=0;
       this._speedDown=10;
       this.schedule(this.moveDown);

    },
    autoRun2:function () {
      this.schedule(this.moveRight)
    },
    getMap:function () {
        //返回地图
       return this.getParent();
    },
    canMoveLeft:function (dt) {
        if(this._dead)return false;
        // 判断mario的向左移动之后，是不是到了地图外面
        var rcMario=this.getBoundingBox();
        var ptMario=cc.p(cc.rectGetMinX(rcMario),cc.rectGetMinY(rcMario));
        var map=this.getMap();
        var ptMarioInWorld=map.convertToWorldSpace(ptMario);
        if(ptMarioInWorld.x-dt*this._speed<0){
            // - dt*_speed表示移动后是不是出去了，而不是当前已经出去了
            return false;
        }
        var pt=[];
        pt[0] = cc.p(cc.rectGetMinX(rcMario) - dt*this._speed, cc.rectGetMidY(rcMario));
        pt[1] = cc.p(cc.rectGetMinX(rcMario) - dt*this._speed, cc.rectGetMinY(rcMario));
        pt[2] = cc.p(cc.rectGetMinX(rcMario) - dt*this._speed, cc.rectGetMaxY(rcMario));
        // 坐标转换，将pt转化成地图格子坐标,然后获取gid，判断gid是不是被阻挡
        // 水管、砖头，地板
         var layerName = [ "block", "pipe", "land" ];

        for (var i = 0; i < 3; ++i)
        {
            if (pt[i].y >= map.getContentSize().height)
                continue;

            var ptTile = Common.Point2Tile(map, pt[i]);
            for (var j = 0; j < 3; ++j)
            {
                var layer = map.getLayer(layerName[j]);
                var gid = layer.getTileGIDAt(ptTile);
                if (gid != 0)
                {
                    return false;
                }
            }
        }
        return true;
    },
    canMoveRight:function (dt) {
        if (this._dead) return false;

        var rcMario = this.getBoundingBox();
        var map = this.getMap();
        var pt=[];

        pt[0] = cc.p(cc.rectGetMaxX(rcMario) + dt*this._speed, cc.rectGetMidY(rcMario));
        pt[1] = cc.p(cc.rectGetMaxX(rcMario) + dt*this._speed, cc.rectGetMinY(rcMario));
        pt[2] = cc.p(cc.rectGetMaxX(rcMario) + dt*this._speed, cc.rectGetMaxY(rcMario));

        // 坐标转换，将pt转化成地图格子坐标,然后获取gid，判断gid是不是被阻挡
        var layerName = ["block", "pipe", "land" ];

        for (var i = 0; i < 3; ++i)
        {
            if (pt[i].y >= map.getContentSize().height)
                continue;

            var ptTile = Common.Point2Tile(map, pt[i]);
            // 水管、砖头，地板
            for (var j = 0; j < 3; ++j)
            {
                var layer = map.getLayer(layerName[j]);
                var gid = layer.getTileGIDAt(ptTile);
                if (gid != 0)
                {
                    return false;
                }
            }
        }

        return true;
    },
    canMoveDown:function (dt) {
        if (this._dead) return false;

        var  rcMario = this.getBoundingBox();
        var map = this.getMap();
        var pt=[];
        pt[0] = cc.p( cc.rectGetMidX(rcMario), cc.rectGetMinY(rcMario) - dt*this._speedDown);
        pt[1] = cc.p(cc.rectGetMinX(rcMario), cc.rectGetMinY(rcMario) - dt*this._speedDown);
        pt[2] = cc.p( cc.rectGetMaxX(rcMario), cc.rectGetMinY(rcMario) - dt*this._speedDown);

        if (pt[0].y >= map.getContentSize().height)
            return true;

        // 坐标转换，将pt转化成地图格子坐标,然后获取gid，判断gid是不是被阻挡
        // 水管、砖头，地板
        var layerName = ["block", "pipe", "land" ];
        for (var i = 0; i < 3; ++i)
        {
            var ptTile = Common.Point2Tile(map, pt[i]);

            for (var j = 0; j < 3; ++j)
            {
                var layer = map.getLayer(layerName[j]);
                var gid = layer.getTileGIDAt(ptTile);
                if (gid != 0)
                {
                    // 微调
                    var ptLB = Common.Tile2PointLB(map, ptTile+cc.p(0, -1));
                    this.setPositionY(ptLB.y);

                  //  在自动运行情况下，
                    var dist = Math.abs(Item._Flag.getPositionX() - this.getPositionX());
                    cc.log("canMoveDown return false _autoRun is %d, dist=%d", this._autoRun, dist);
                    if (this._autoRun && !this._flagRunAction)
                    {
                        this._flagRunAction = true;
                        var ptFlagEnd = Common.Tile2PointLB(map, ptTile);
                        Item._Flag.runAction(cc.moveTo(1,cc.p(Item._Flag.getPositionX(),ptFlagEnd.y+16)));
                    }

                    return false;
                }
            }
        }
        return true;
    },
    canMoveUp:function (dt) {
        
    }

})
Mario._left=0;
