

var MenuCtrl =cc.Menu.extend({
    ctor:function () {
        this._super();
        this.scheduleUpdate();
        // this._className="MenuCtrl"
    },
    update:function (dt) {
        //_selectedItem 选中的item  _selectedItem _state 打印都是undefined 不能访问的变量

        // cc.log("MenuCtrl update _state",this._className,this._super._state,this._super._selectedItem,this._opacity,this.isEnabled())
      if(this._selectedItem&&this._state==cc.MENU_STATE_TRACKING_TOUCH){
          cc.log("MENU_STATE_TRACKING_TOUCH....")
          this._selectedItem.activate()
      }
    }
    
})

var KMenuState={TouchNone:0,TouchIng:1}
//自定义按钮
var KMenuCtrl=ccui.ImageView.extend({
    eventState:null,
    ctor:function (fileName) {
        this._super(fileName);
        // if( 'touches' in cc.sys.capabilities ) {
        //     cc.eventManager.addListener({
        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //         swallowTouches: false,
        //         onTouchBegan: this.onTouchBegan,
        //         onTouchMoved: this.onTouchMoved,
        //         onTouchEnded: this.onTouchEnded,
        //         onTouchCancelled: this.onTouchCancelled
        //     }, this);
        // } else {
        //     cc.log("TOUCH-ONE-BY-ONE test is not supported on desktop");
        // }

    },
    touchEvent:function () {
        cc.log("KMenuCtrl touchEvent....")

    },
    onTouchBegan:function (touch,event) {
       this.eventState=KMenuState.TouchIng;
       cc.log("KMenuCtrl onTouchBegan....")
    },
    onTouchMoved:function (touch,event) {

    },
    onTouchEnded:function (touch,event) {
        this.eventState=KMenuState.TouchNone;
        cc.log("KMenuCtrl onTouchEnded....")

    },
    onTouchCancelled:function (touch,event) {
        this.eventState=KMenuState.TouchNone;
        cc.log("KMenuCtrl onTouchCancelled....")

    }

})