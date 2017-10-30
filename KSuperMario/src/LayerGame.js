
var LayerGame=cc.Layer.extend({


    _idx:null,
    _bar:null,
    _loadFileCount:0,
    _totalfile:0,
    _map:null,
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
        if(this._loadFileCount>=this._totalfile){
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
        var animatio=Common.CreateAnimation("res/Mushroom0.png",0,1,16,0.4)



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