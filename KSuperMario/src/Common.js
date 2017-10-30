

var  Common={}
//
Common.moveNode=function (node,pt) {

    node.setPosition(node.getPosition().x+pt.x,node.getPosition().y+pt.y)

}