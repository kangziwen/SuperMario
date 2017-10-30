var LayerStart=cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;
        console.log("size :",size.width,size.height)
        var bg=new cc.Sprite(res.background_png)
        this.addChild(bg)

        bg.setPosition(size.width/2.0,size.height/2.0)

        var menu=new cc.Menu();
        this.addChild(menu);
        var start=new cc.MenuItemImage(res.startgame_normal_png,res.startgame_select_png,this.start,this);
        menu.addChild(start)
        start.setTag(250)

        var setup=new cc.MenuItemImage(res.Setting_n_png,res.setting_s_png,this.Setup,this)
        menu.addChild(setup);

        var quit=new cc.MenuItemImage(res.quitgame_normal_png,res.quitgame_select_png,this.quit,this)
        menu.addChild(quit);

        var about=new cc.MenuItemImage(res.about_normal_png,res.about_select_png,this.about,this)
        menu.addChild(about);

        Common.moveNode(setup,cc.p(0,-140))

        Common.moveNode(quit,cc.p(0,-80))

        Common.moveNode(about,cc.p(150,-120))






    },
    start : function (node) {
    console.log("start....",node.getTag())
        cc.director.runScene(new LayerMenuScene())


    },
    Setup:function (node) {

    },
    about:function (node) {

    },
    quit:function (node) {

    }
})

var LayerStartScene=cc.Scene.extend({
    onEnter:function () {
        this._super();
      var start=new LayerStart();
      this.addChild(start);

    }
})