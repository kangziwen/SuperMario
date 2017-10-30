

var  Common={}
//
Common.moveNode=function (node,pt) {

    node.setPosition(node.getPosition().x+pt.x,node.getPosition().y+pt.y)

}

Common.format=function(v, prefix,suffix){
    var buf=prefix+v+suffix;
    return buf;
}
Common.CreateAnimation=function (filename,start,end ,width,delay) {
    var texture=cc.textureCache.addImage(filename);
    var arr=[];
    for (var i=start;i<end;i++){
        var frame=new cc.SpriteFrame(texture,
            new cc.Rect(i*width,0,width,texture.getContentSize().height))
            arr.push(frame)
    }
    return new cc.Animation(arr,delay);
}