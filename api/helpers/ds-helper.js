


var _makeTree = function(options) {
    var children, e, id, o, pid, temp, _i, _len, _ref;
    id = options.id || "id";
    pid = options.parentid || "parent_node_id";
    children = options.children || "children";
    temp = {};
    o = [];
    _ref = options.q;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      e[children] = [];
      temp[e[id]] = e;
      if (temp[e[pid]] != null) {
        temp[e[pid]][children].push(e);
      } else {
        o.push(e);
      }
    }
    return o;
  };

  module.exports = {
    makeTree: _makeTree
  }