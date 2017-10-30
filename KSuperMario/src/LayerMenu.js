

var LayerMenu=cc.Layer.extend({
    _view : null,
    ctor:function () {
        this._super();

        var bg=new cc.Sprite(res.bg_png)
        this.addChild(bg)
        bg.setPosition(cc.p(cc.winSize.width/2.0,cc.winSize.height/2.0))

        var view=new ccui.ScrollView()
        this.addChild(view)
        view.setTouchEnabled(true)

        console.log("cc.winSize : ",cc.winSize.width,cc.winSize.height)

        view.setContentSize(cc.winSize)
        view.setInnerContainerSize(cc.size(8*cc.winSize.width,cc.winSize.height) )
        view.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
        view.setPropagateTouchEvents(false)
        this._view=view;

        var pic=[res.select1_jpg,res.select2_jpg,res.select3_jpg,
            res.select4_jpg,res.select5_jpg,res.select6_jpg,
            res.select7_jpg,res.select8_jpg];
        for (var i=0;i<8;i++){
            var btn=new ccui.ImageView(pic[i])
            btn.setPosition(cc.p(
                cc.winSize.width/2.0+i*cc.winSize.width,cc.winSize.height/2.0))
            btn.setTag(1000+i)
            view.addChild(btn)
            btn.setTouchEnabled(true)
            btn.addTouchEventListener(this.touchEvent ,this)
        }
        var item=new cc.MenuItemImage(res.backA_png,res.backB_png,this.back,this)
        var menu=new cc.Menu(item);
        this.addChild(menu);
        item.setPosition(cc.p(cc.winSize.width/2.0-item.getContentSize().width/2.0,
            item.getContentSize().height/2.0-cc.winSize.height/2.0))



    },
    touchEvent:function (sender, type) {
        console.log("touchEvent",sender.getTag())
        var startPoint=null,endPoint=null;
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                startPoint=sender.getPosition()
                cc.log("startPoint: ",startPoint.x,startPoint.y)
                break;
            case  ccui.Widget.TOUCH_ENDED:
                endPoint=sender.getPosition();
                cc.log("endPoint: ",endPoint.x,endPoint.y)

                console.log("点击了.... : ")
                cc.director.runScene(new LayerGameScene(sender.getTag()-1000))
                break;
            default:
                break;
        }
    },
    back:function (node) {
        cc.director.runScene(new LayerStartScene())
    }
})

var LayerMenuScene=cc.Scene.extend({
    onEnter:function () {
        this._super()

        var layer=new LayerMenu();
        this.addChild(layer)
    }
})