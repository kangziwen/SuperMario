

var MenuCtrl =cc.Menu.extend({
    ctor:function () {
        this._super();
        this.scheduleUpdate();
    },
    update:function (dt) {
        //_selectedItem 选中的item
      if(this._selectedItem&&this._state==cc.MENU_STATE_TRACKING_TOUCH){
          this._selectedItem.activate()
      }
    }
    
})