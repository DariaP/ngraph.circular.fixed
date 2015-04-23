module.exports = createLayout;

/**
 * Creates force based layout for a given graph.
 * @param {ngraph.graph} graph which needs to be laid out
 * @param {object} physicsSettings if you need custom settings
 * for physics simulator you can pass your own settings here. If it's not passed
 * a default one will be created.
 */



function createLayout(graph, settings) {

  if (!graph) {
    throw new Error('Graph structure cannot be undefined');
  }

  /* Set positions (x, y) according to nodes sequence */
  var nodes = setNodesPositions(),
      graphRect = {
        x1 : settings.center.x - settings.radius,
        y1 : settings.center.y - settings.radius,
        x2 : settings.center.x + settings.radius,
        y2 : settings.center.y + settings.radius
      };

  var api = {

    /* All positions are already set and final */
    step: function() {
      return true;
    },

    /**
     * For a given `nodeId` returns position
     */
    getNodePosition: function (nodeId) {
      console.log(nodes[nodeId]);
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

    setNodesPositions: function () {
    }

  };

  return api;

  function setNodesPositions() {
    var nodesCount = graph.getNodesCount(),
        nodes = {},
        angleStep,
        angle = 0,
        radius = settings.radius,
        center = settings.center;

    if (nodesCount === 0) {
        return;
    }

    angleStep = 2 * Math.PI / nodesCount;

    graph.forEachNode(function (node) {
      nodes[node.id] = {
        x : center.x + radius * Math.sin(angle),
        y : center.y + radius * Math.cos(angle)
      };
      angle += angleStep;
    });

    return nodes;
  }

};