
var LayerGame=cc.Layer.extend({
    ctor:function (i) {
        this._super()
        cc.log("LayerGame....",i)

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