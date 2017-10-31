


var  Common={

}
Common.DIRECTION={NONE:0,LEFT:1, RIGHT:2, UP:3, DOWN:4,  }


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
            cc.rect(i*width,0,width,texture.getContentSize().height))

            arr.push(frame)
    }
    return new cc.Animation(arr,delay);
}

Common.getSpriteFrame=function (filename,pos,width) {
    var texture=cc.textureCache.addImage(filename);
     var frame=new cc.SpriteFrame(texture,
         cc.rect(pos*width, 0, width, texture.getContentSize().height))

    return frame;
}
Common.Point2Tile=function (map,ptInMap) {
    var dx=map.getTileSize().width;
    var dy=map.getTileSize().height;
    var x=ptInMap.x/dx;
    var y=ptInMap.y/dy;
    y=map.getTileSize().height-1-y;
    return cc.p(x,y)
}

Common.Tile2PointLB=function (map,ptTile) {

    ptTile.y=map.getMapSize().height-1-ptTile.y;
    return cc.p(ptTile.x*map.getTileSize().width,
        ptTile.y*map.getTileSize().height)
}