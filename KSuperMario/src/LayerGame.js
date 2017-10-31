
var LayerGame=cc.Layer.extend({


    _idx:null,
    _bar:null,
    _loadFileCount:0,
    _totalfile:0,
    _map:null,
    _textureDirNone:null,
    _menuShow:null,
    _marioDir:null,
    _mario:null,

    _textureDirLeft :null,
    _textureDirRight:null,
ctor:function (i) {
        this._super()

        this._idx=i;
        this._bar= new ProgressBar(res.sliderTrack_png,res.sliderProgress_png)
        this.addChild(this._bar);
        this._bar.setPosition(cc.winSize.width/2.0,cc.winSize.height/2.0)
          this.loadResource()
        cc.log("LayerGame....",i)

    },
    loadResource:function () {
        // picture, music
        var picfiles = [
            "about_normal.png",
            "about_select.png",
            "AB_normal.png",
            "AB_select.png",
            "allow_walkLeft.png",
            "allow_walkRight.png",
            "arrow.png",
            "arrowActionL.png",
            "arrowActionR.png",
            "arrowBroken.png",
            "arrowBullet.png",
            "arrow_die.png",
            "axe.png",
            "backA.png",
            "backB.png",
            "background.png",
            "backKeyImage.png",
            "backKeyLeft.png",
            "backKeyRight.png",
            "backToMenu.png",
            "battery.png",
            "batteryBoom1.png",
            "batteryBoom2.png",
            "batteryBoom3.png",
            "batteryBullet.png",
            "bg.png",
            "blinkcoin.png",
            "boss.png",
            "bossBullet.png",
            "brokencoin.png",
            "bulletBorder.png",
            "CloseNormal.png",
            "CloseSelected.png",
            "cloud.png",
            "coinani.png",
            "controlUI.png",
            "darkCloud.png",
            "fireActionL.png",
            "fireActionR.png",
            "fireBall.png",
            "fireLeft.png",
            "fireRight.png",
            "fire_die.png",
            "flag.png",
            "flower0.png",
            "flyFishLeft.png",
            "flyFishRight.png",
            "fps_images.png",
            "gameover.png",
            "HelloWorld.png",
            "ladder.png",
            "left.png",
            "leftright.png",
            "lighting.png",
            "Mushroom0.png",
            "music_off.png",
            "music_on.png",
            "M_n.png",
            "M_s.png",
            "newgameA.png",
            "newgameB.png",
            "nextlevel_normal.png",
            "nextlevel_select.png",
            "normal_die.png",
            "PassFailure.png",
            "PassSuccess.png",
            "princess.png",
            "quitgame_normal.png",
            "quitgame_select.png",
            "restart_n.png",
            "restart_s.png",
            "resume_n.png",
            "resume_s.png",
            "retry_normal.png",
            "retry_select.png",
            "rewardMushroomSet.png",
            "right.png",
            "select_n.png",
            "select_s.png",
            "Setting_n.png",
            "setting_s.png",
            "Set_Menu.png",
            "Set_Music.png",
            "set_n.png",
            "set_s.png",
            "shanshuodecoin.png",
            "singleblock.png",
            "sliderProgress.png",
            "sliderTrack.png",
            "smallWalkLeft.png",
            "smallWalkRight.png",
            "small_die.png",
            "sound_effect_off.png",
            "sound_effect_on.png",
            "startgame_normal.png",
            "startgame_select.png",
            "superMarioMap.png",
            "switchBg.png",
            "Tools.png",
            "tortoise0.png",
            "walkLeft.png",
            "WalkLeft_fire.png",
            "walkRight.png",
            "WalkRight_fire.png",
        ];
        var musicfile=
            [
                "EatCoin.wma",
            ];
        //
        // for (var i=0;i<musicfile.length;i++){
        //     cc.log("res/"+musicfile[i])
        //     cc.audioEngine.playEffect("res/"+musicfile[i])
        // }
        this._loadFileCount=0;
        this._totalfile=picfiles.length;
        for (var i=0;i<this._totalfile;++i){
          cc.textureCache.addImageAsync("res/"+picfiles[i],this.loadImageCallBack,this)
        }

    },
    loadImageCallBack:function (node) {
        this._loadFileCount++;
        this._bar.setPercentage(this._loadFileCount*100/this._totalfile);

        if(this._loadFileCount==this._totalfile){

            this._bar.removeFromParent()
            this.startGame();
        }
    },
    startGame:function () {
        cc.log("startGame.......")
        // cc.log(Common.format(this._idx+1,"MarioMap",".tmx"))
        //web上tmx地图加载报错.....
        this._map=new cc.TMXTiledMap("res/"+Common.format(this._idx+1,"MarioMap",".tmx"));//"res/MarioMap1.tmx" Common.format(this._idx+1,"MarioMap",".tmx")
        this.addChild(this._map)
         Common.moveNode(this._map,cc.p(0,cc.winSize.height-this._map.getContentSize().height))

        // 加载蘑菇怪资源
        {
            var animation = Common.CreateAnimation("res/Mushroom0.png", 0, 1, 16, 0.4)
            cc.animationCache.addAnimation(animation, "MushroomMoving")

            var dead1 = Common.getSpriteFrame("res/Mushroom0.png", 2, 16)
            cc.spriteFrameCache.addSpriteFrame(dead1, "MushroomDead1")

            var dead2 = Common.getSpriteFrame("res/Mushroom0.png", 3, 16);
            cc.spriteFrameCache.addSpriteFrame(dead2, "MushroomDead2");
        }
        // 加载乌龟动画资源 tortoise0
        {
            var animation1 = Common.CreateAnimation("res/tortoise0.png", 2, 3, 18, 0.4);
            cc.animationCache.addAnimation(animation1, "TortoiseMoveLeft");
            var animation2 = Common.CreateAnimation("res/tortoise0.png", 4, 5, 18, 0.4);
            cc.animationCache.addAnimation(animation2, "TortoiseMoveRight");
            var animation3 = Common.CreateAnimation("res/tortoise0.png", 8, 9, 18, 0.4);
            cc.animationCache.addAnimation(animation3, "TortoiseDead");
        }

        // Flower资源
        {
            var animation = Common.CreateAnimation("res/flower0.png", 0, 1, 16, 0.4);
            cc.animationCache.addAnimation(animation, "FlowerShow");
        }
        // MushroomReward
        {
            var frame = Common.getSpriteFrame("res/rewardMushroomSet.png", 0, 16);
           cc.spriteFrameCache.addSpriteFrame(frame, "MushroomReward");
        }

        {
            var frame = Common.getSpriteFrame("res/rewardMushroomSet.png", 1, 16);
            cc.spriteFrameCache.addSpriteFrame(frame, "MushroomAddLife");
        }
        // 增加控制按钮
        this.addCtrl();
        // 移动马里奥

        //.....

    },
    addCtrl:function () {
        cc.log("addCtrl....")
        // 控制按钮的背景图片
        var sprite=new cc.Sprite(cc.textureCache.addImage("res/controlUI.png"))
        this.addChild(sprite);
        sprite.setPosition(cc.p(0,0))
        sprite.setAnchorPoint(cc.p(0,0))
        // 显示在菜单位置的纹理

        this._textureDirNone = cc.textureCache.addImage("res/backKeyImage.png");
        cc.log("_textureDirNone :",this._textureDirNone.getContentSize().width,this._textureDirNone.getContentSize().height)

        this._textureDirLeft = cc.textureCache.addImage("res/backKeyLeft.png");
        this._textureDirRight = cc.textureCache.addImage("res/backKeyRight.png");
        this._menuShow = new cc.Sprite(this._textureDirNone);
        this.addChild(this._menuShow);
        var ptmenuShowPos = cc.p(70, 50);
        this._menuShow.setPosition(ptmenuShowPos);
        // 定制菜单：每个帧循环都会触发的菜单
        // 菜单项是透明的，菜单的样式由别的精灵来显示
        var menu = new MenuCtrl();
        this.addChild(menu);

        var left1=new cc.Sprite();//"res/backKeyLeft.png"
        var left2=new cc.Sprite();
        left1.setContentSize(cc.size(this._textureDirNone.getContentSize().width/2.0,
            this._textureDirNone.getContentSize().height))
        left2.setContentSize(cc.size(this._textureDirNone.getContentSize().width/2.0,
            this._textureDirNone.getContentSize().height))
        var left =  new cc.MenuItemSprite(left1, left2,  this.moveLeft,this);
        cc.log("left1 :",left1.getContentSize().width,left1.getContentSize().height)

        cc.log("left :",left.getContentSize().width,
            left.getContentSize().height,left.getPosition().x,left.getPosition().y)
        menu.addChild(left);


        var right1 =new cc.Sprite( );
        var right2 = new cc.Sprite( );
        right1.setContentSize(cc.size(this._textureDirNone.getContentSize().width / 2,
            this._textureDirNone.getContentSize().height));
        right2.setContentSize(cc.size(this._textureDirNone.getContentSize().width / 2,
            this._textureDirNone.getContentSize().height));
        var right = new cc.MenuItemSprite(right1, right2, this.moveRight, this);
        menu.addChild(right);

        left.setPosition(cc.p(ptmenuShowPos.x - cc.winSize.width / 2,
            ptmenuShowPos.y - cc.winSize.height / 2));
        right.setPosition(cc.p(ptmenuShowPos.x - cc.winSize.width / 2,
            ptmenuShowPos.y - cc.winSize.height / 2));
        Common.moveNode(left, cc.p(-this._menuShow.getContentSize().width / 4, 0));
        Common.moveNode(right, cc.p(this._menuShow.getContentSize().width / 4, 0));

        this._marioDir=Common.DIRECTION.NONE;
        // 跳跃，发射子弹，菜单
        this.addJumpFireMenuCtrl();
    },
    //向左走
    moveLeft:function () {
        cc.log("moveLeft....")
    },
    moveRight:function () {
        cc.log("moveRight....")

    },
    addJumpFireMenuCtrl:function () {
        var menu = new cc.Menu() ;
        this.addChild(menu);
        
        var textureAB_Normal = cc.textureCache.addImage("res/AB_normal.png");
        var textureAB_Select = cc.textureCache.addImage("res/AB_select.png");

        var jumpNormal =  new cc.Sprite(textureAB_Normal)//CCSprite::createWithTexture(textureAB_Normal);
        var jumpSelect = new cc.Sprite(textureAB_Select);

        var jump = new cc.MenuItemSprite(jumpNormal, jumpSelect, this.Jump, this);
        menu.addChild(jump);
        Common.moveNode(jump, cc.p(192, -125));  
    },
    Jump:function () {
       cc.log("Jump.....")
        //....
    }
})


var LayerGameScene=cc.Scene.extend({
    can:null,
    ctor:function (i) {
        this._super();

        this.can=i;
    },
    onEnter:function () {
        this._super();
        var layer=new LayerGame(this.can);
        this.addChild(layer)
    }
})