

var ProgressBar=cc.Layer.extend({

     _bar:null,
     _bg:null,
    ctor:function (bgFile,foreFile) {
        this._super();
        this._bg=new cc.Sprite(bgFile);
        this.addChild(this._bg)

        var fore=new cc.Sprite(foreFile);
        this._bar=new cc.ProgressTimer(fore);

        this._bar.setType(cc.ProgressTimer.TYPE_BAR);
        this._bar.setMidpoint(cc.p(0,0))
        this._bar.setBarChangeRate(cc.p(1,0));
        this._bar.setPercentage(0)
        this.addChild(this._bar)


    },
    setPercentage:function (per) {
         this._bar.setPercentage(per)

    },
    getPercentage:function () {
        return this._bar.getPercentage()
    },
    setPosition:function (x,y) {
        this._bar.setPosition(cc.p(x,y))
        this._bg.setPosition(cc.p(x,y))
    }

})