

var ItemType ={IT_mushroom:0, IT_tortoise:1, IT_flower:2,
    IT_mushroomReward:3, IT_mushroomAddLife:4, IT_flagpoint:5}
var Item=cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.setLocalZOrder(100);
    }
})

Item._Flag=null;
Item._itemReward=null;