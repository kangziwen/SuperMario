

var ItemType ={IT_mushroom:0, IT_tortoise:1, IT_flower:2,
    IT_mushroomReward:3, IT_mushroomAddLife:4, IT_flagpoint:5}
var Item=cc.Sprite.extend({
    _type:null,
    ctor:function (dict) {
        this._super();
        // this.setLocalZOrder(100);
    },
    //虚函数子类实现
    move:function (dt) {
        
    },
    collision:function () {
        
    },
    wakeup:function () {
        this.move(dt);
        this.collision()
    },
    update:function (dt) {
        
    },
    setPositionByProperty:function (dict) {
        var x=dict["x"];
        var y=dict["y"];
        parseFloat()
        this.setPosition(parseFloat(x),parseFloat(y)-16);
        this.setAnchorPoint(cc.p(0,0));
    },
    getMap:function () {
      return this.getParent();
    },
    isLeftInWindow:function () {
       var rcItem=this.getBoundingBox();
       var ptInMap=cc.p(cc.rectGetMinX(rcItem),
           cc.rectGetMinY(rcItem))
        var map=this.getMap();
       var ptInWorld=map.convertToWorldSpace(ptInMap);

       if(ptInWorld.x<=cc.winSize.width){
           return true;
       }
       return false;
    },
    isFarAwayFromMario:function () {
      var rcItem=this.getBoundingBox();
      rcMario=this._mario.getBoundingBox();
      var zhi=cc.rectGetMinX(rcMario)-cc.rectGetMaxX(rcItem)
      if(zhi>cc.winSize.width){
          return true
      }
      return false
    }
    
})

Item._Flag=null;
Item._itemReward=null;