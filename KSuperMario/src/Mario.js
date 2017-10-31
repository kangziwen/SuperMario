

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


    }
})