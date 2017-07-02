var Route = function(head){
  this.head = head;
  this.tail = function(node){
    if(node.next === null){
      return node;
    } else {
      return this.tail(node.next)
    }
  }
}
