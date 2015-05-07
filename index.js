module.exports = createLayout;

function createLayout(graph, settings) {

  if (!graph) {
    throw new Error('Graph structure cannot be undefined');
  }

  /* Set positions (x, y) according to nodes sequence */
  var nodes = {}, links = {};

  resetAll();

  listenToGraphEvents();

  var api = {

    /* All positions are already set and final */
    step: function() {
      return true;
    },

    /**
     * For a given `nodeId` returns position
     */
    getNodePosition: function (nodeId) {
      return nodes[nodeId];
    },

    /**
     * @returns {Object} area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect: function () {
      return graphRect;
    },

    getLinkPosition: function(linkId) {
      return links[linkId];
    },

    setNodesPositions: function () {
    }

  };

  return api;

  function resetAll() {
    setNodesPositions();
    setLinksPositions(nodes);
  }

  function setNodesPositions() {
    var nodesCount = graph.getNodesCount(),
        angleStep,
        angle = 0,
        radius = settings.radius,
        center = settings.center;

    if (nodesCount === 0) {
        return;
    }

    angleStep = 2 * Math.PI / nodesCount;

    graph.forEachNode(function (node) {
      // One of the ngraph requirements for layout is
      // pos object should remaine the same object
      var newPos = {
        x : center.x + radius * Math.sin(angle),
        y : center.y + radius * Math.cos(angle)
      };
      if (nodes[node.id]) {
        nodes[node.id].x = newPos.x;
        nodes[node.id].y = newPos.y;
      } else {
        nodes[node.id] = newPos;
      }
      angle += angleStep;
    });
  }

  function setLinksPositions(nodes) {

    graph.forEachLink(function (link) {
      // One of the ngraph requirements for layout is
      // pos object should remaine the same object
      var newPosition = getLinkPosition(link);
      if (links[link.id]) {
        links[link.id].from = newPosition.from;
        links[link.id].to = newPosition.to;
      } else {
        links[link.id] = newPosition;
      }
    });
  }

  function getLinkPosition(link) {
    return {
      from: {
        x: nodes[link.fromId].x,
        y: nodes[link.fromId].y
      },
      to: {
        x: nodes[link.toId].x,
        y: nodes[link.toId].y
      }      
    };
  }

  function listenToGraphEvents() {
    graph.on('changed', onGraphChanged);
  }

  function onGraphChanged(changes) {
    for (var i = 0; i < changes.length; ++i) {
      var change = changes[i];
      if (change.changeType === 'add') {
        if (change.node) {
          resetAll();
        }
        if (change.link) {
          links[change.link.id] = getLinkPosition(change.link);
        }
      } else if (change.changeType === 'remove') {
        if (change.node) {
          resetAll();
        }
        if (change.link) {
          links[change.link.id] = null;
        }
      }
    }
  }

};