

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
        if (this._dead)
        {
            cc.log("_dead=yes...")
            return false;
        }

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
                cc.log("gid :" ,gid)

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
      //  cc.log("canMoveDown p[0].:",pt[0].x,pt[0].y)

        // 坐标转换，将pt转化成地图格子坐标,然后获取gid，判断gid是不是被阻挡
        // 水管、砖头，地板
        var layerName = ["block", "pipe", "land" ];
        for (var i = 0; i < 3; ++i)
        {
            var ptTile = Common.Point2Tile(map, pt[i]);
            cc.log("canMoveDown ptTile : ",ptTile.x ,ptTile.y)
            // if(ptTile.x>=map.getMapSize().width||ptTile.y>=map.getMapSize().height){
            //     return false;
            // }


            for (var j = 0; j < 3; ++j)
            {
                var layer = map.getLayer(layerName[j]);
                cc.log("canMoveDown ptTile: ",ptTile.x ,ptTile.y)
                var gid = layer.getTileGIDAt(ptTile);
                if (gid != 0)
                {
                    /*

                    // 微调
                    var ptLB = Common.Tile2PointLB(map, cc.p(ptTile.x+0,ptTile.y-1));//ptTile+cc.p(0, -1)
                    // cc.log("ptLB :",ptLB.x,ptLB.y )
                    this.setPositionY(ptLB.y);

                   在自动运行情况下，
                    var dist = Math.abs(Item._Flag.getPositionX() - this.getPositionX());
                    cc.log("canMoveDown return false _autoRun is %d, dist=%d", this._autoRun, dist);
                    if (this._autoRun && !this._flagRunAction)
                    {
                        this._flagRunAction = true;
                        var ptFlagEnd = Common.Tile2PointLB(map, ptTile);
                        Item._Flag.runAction(cc.moveTo(1,cc.p(Item._Flag.getPositionX(),ptFlagEnd.y+16)));
                    }


                      */
                    return false;

                }
            }
        }
        return true;
    },
    canMoveUp:function (dt) {
        if (this._dead) return false;

        var rcMario = this.getBoundingBox();
        var map = this.getMap();
        var pt=[];

        pt[0] = cc.p(cc.rectGetMidX(rcMario), cc.rectGetMaxY(rcMario)+dt*this._speedUp);
        pt[1] = cc.p( cc.rectGetMinX(rcMario), cc.rectGetMaxY(rcMario)+dt*this._speedUp);
        pt[2] = cc.p( cc.rectGetMaxX(rcMario), cc.rectGetMaxY(rcMario)+dt*this._speedUp);

        if (pt[0].y >= map.getContentSize().height)
            return true;
        // 水管、砖头，地板
        var layerName = [ "block", "pipe", "land" ];
        // 坐标转换，将pt转化成地图格子坐标,然后获取gid，判断gid是不是被阻挡
        for (var i = 0; i < 3; ++i)
        {
            var ptTile = Common.Point2Tile(map, pt[i]);
            // if(ptTile.x>=map.getMapSize().width||ptTile.y>=map.getMapSize().height){
            //     return false;
            // }
            for (var j = 0; j < 3; ++j)
            {
                var layer = map.getLayer(layerName[j]);
                cc.log("canMoveUp ptTile: ",ptTile.x ,ptTile.y)

                var gid = layer.getTileGIDAt(ptTile);
                if (gid != 0)
                {
                    // 微调
                    var ptLB = Common.Tile2PointLB(map, cc.p(ptTile.x+0,ptTile.y+1));//ptTile+cc.p(0, 1)
                    this.setPositionY(ptLB.y);

                    // 顶到东西了
                    this.Hit(layerName[j], gid, ptTile);

                    return false;
                }
            }
        }
        return true;
    },
    Hit:function (layername,gid,ptTile) {
        if(layername != "block")return

        var layer=this.getMap().getLayer(layername);
        var sprite=layer.getTileAt(ptTile);
        var jump=cc.jumpBy(0.1,cc.p(0,0),20,1);
        var callfunc=cc.callFunc(this.wakeupMushroomReward,this);
        sprite.runAction(cc.sequence([jump,callfunc]))



    },
    // 唤醒隐藏的蘑菇奖赏
    wakeupMushroomReward:function () {
        //*** item
        /*
        * 	// 唤醒隐藏的蘑菇奖赏
	CCObject* obj;
	CCARRAY_FOREACH(Item::_itemReward, obj)
	{
		Item* item = (Item*)obj;
		CCRect rcBlock = sprite->boundingBox();
		rcBlock.origin = rcBlock.origin + ccp(4, 4);
		rcBlock.size.width /= 2;
		rcBlock.size.height /= 2;
		if (item->boundingBox().intersectsRect(rcBlock))
		{
			item->wakeup();
			break;
		}
	}
	*/
    },
    moveLeft:function (dt) {
        if (this._dirRun != Common.DIRECTION.LEFT)
        {
            this._dirRun = Common.DIRECTION.LEFT;
            this._dirFace = Common.DIRECTION.LEFT;
            this.updateStatus();
        }

        if (!this.canMoveLeft(dt)){
            cc.log("!canMoveLeft....")
            return;

        }

        Common.moveNode(this, cc.p(-dt*this._speed, 0));
    },
    moveRight:function (dt) {
        if (this._dirRun != Common.DIRECTION.RIGHT)
        {
            this._dirRun = Common.DIRECTION.RIGHT;
            this._dirFace = Common.DIRECTION.RIGHT;
            this.updateStatus();
        }

        if (!this.canMoveRight(dt)){
            cc.log("!canMoveRight....")
            return;

        }

        Common.moveNode(this, cc.p(dt*this._speed, 0));

        // 卷动地图
        // 如果mario位置超过了地图的一半，就应该卷动地图
        // mario的在世界坐标中的x坐标，超过了窗口的一半
        var map = this.getParent();
        var ptWorld = map.convertToWorldSpace(this.getPosition());
        if (ptWorld.x > cc.winSize.width / 2)
        {
            Common.moveNode(map, cc.p(-dt*this._speed, 0));
        }
    },
    moveUp:function (dt) {
        if (this._speedUp <= 0)
        {
            return;
        }

        if (!this.canMoveUp(dt))
        {
            // 反弹效果
            this._speedDown = this._speedUp;
            this._speedUp = 0; // 不继续上升了
            return;
        }

        Common.moveNode(this, cc.p(0, dt*this._speedUp));
        this._speedUp -= this._speedAcc;
    },
    moveDown:function (dt) {
        if (this._speedUp <= 0)
        {
            if (this.canMoveDown(dt))
            {

                if (this._bFly == false)
                {
                    this._bFly = true;
                    this.updateStatus();
                }

                Common.moveNode(this, cc.p(0, -dt*this._speedDown));
                this._speedDown += this._speedAcc;
            }
            else
            {
                if (this._bFly)
                {

                    this._bFly = false;
                    this._speedDown = this._speedAcc;
                    this.updateStatus();
                }
            }
        }
    },
    stop:function () {
        
    },
    updateStatus:function () {
        this.stopAllActions();

        if (this._autoRun)
        {
            if (this._isBig)
                this.setDisplayFrameWithAnimationName("BigWalkRight", 0);
            else
                this.setDisplayFrameWithAnimationName("SmallWalkRight", 0);
            cc.log("_autoRun......")
            return;
        }

        if (this._dead)
        {
            var  animation = cc.animationCache.getAnimation("smalldie");
            var animate =new cc.Animate(animation)

            var moveBy = cc.moveBy(cc.winSize.height/this._speed, cc.p(0, -cc.winSize.height))
            var callfunc =cc.callFunc(this.Dead,this);

            var seq=cc.sequence([animate, moveBy, callfunc])
            this.runAction(seq);
            return;

        }

        if (this._bFly)
        {
            if (this._isBig)
            {
                if (this._dirFace == Common.DIRECTION.LEFT)
                {
                    this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("BigJumpLeft"));
                }
                else
                {
                    this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("BigJumpRight"));
                }
            }
            else
            {

                if (this._dirFace == Common.DIRECTION.LEFT)
                {
                    this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("SmallJumpLeft"));
                    cc.log("_bFly LEFT ......")

                }
                else
                {
                    this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("SmallJumpRight"));
                }
            }
            return;
        }


        if (this._isBig)
        {
            if (this._dirRun == Common.DIRECTION.LEFT)
            {
                this.runAction(cc.repeatForever(cc.animate(cc.animationCache.getAnimation("BigWalkLeft"))))
                //runAction
                cc.log("_isBig=yes _dirRun =LEFT ......")

            }
            else if (this._dirRun == Common.DIRECTION.RIGHT)
            {
                // runAction
                this.runAction(cc.repeatForever(cc.animate(cc.animationCache.getAnimation("BigWalkRight"))))

            }
            else // 静止
            {
                if (this._dirFace == Common.DIRECTION.LEFT)
                {
                    this.setDisplayFrameWithAnimationName("BigWalkLeft", 0);

                }
                else
                {
                    this.setDisplayFrameWithAnimationName("BigWalkRight", 0);
                }
            }
        }
        else
        {

            if (this._dirRun == Common.DIRECTION.LEFT)
            {
                this.runAction(cc.repeatForever(cc.animate(cc.animationCache.getAnimation("SmallWalkLeft"))))

                //runAction
            }
            else if (this._dirRun == Common.DIRECTION.RIGHT)
            {
                // runAction
                this.runAction(cc.repeatForever(cc.animate(cc.animationCache.getAnimation("SmallWalkRight"))))

            }
            else // 静止
            {
                if (this._dirFace == Common.DIRECTION.LEFT)
                {
                    this.setDisplayFrameWithAnimationName("SmallWalkLeft", 0);
                }
                else
                {
                    this.setDisplayFrameWithAnimationName("SmallWalkRight", 0);
                }
            }

        }


    },
    Dead:function () {

    },
    jump:function () {
        if (this._bFly)
            return;

        if (this._dead)
            return;

        this._speedUp = 300;
        this._bFly = true;
        this.updateStatus();
    }
    

})
Mario._left=0;
