export default function serviceFlowTree (selector, json) {
  var m = [20, 120, 20, 120]
  var i = 0
  var root
  // size of the diagram
  var viewerWidth = $(document).width()
  var viewerHeight = $(document).height()

  var tree = d3.layout.tree()
    .size([viewerHeight, viewerWidth])

  var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x] })

  var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', zoomed)

  function zoomed () {
    vis.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
  }

  var vis = d3.select(selector).append('svg:svg')
    .attr('width', viewerWidth-m[0]*2)
    .attr('height', viewerHeight-m[1]+m[0])
    .call(zoom)
    .on('dblclick.zoom', null)
    .append('svg:g')
    .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')')

  root = json
  root.x0 = viewerHeight / 2
  root.y0 = 0

  root.children.forEach(collapse)
  update(root)
  centerNode(root)

  function collapse (d) {
    if (d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
  }

  function expand (d) {
    if (d._children) {
      d.children = d._children
      d.children.forEach(expand)
      d._children = null
    }
  }

  function centerNode (source) {
    let scale = zoom.scale()
    let x = -source.y0
    let y = -source.x0
    x = x * scale + viewerWidth / 2
    y = y * scale + viewerHeight / 2 - m[0]*3
    d3.select(selector+' g').transition()
      .duration(750)
      .attr('transform', 'translate(' + x + ',' + y + ')scale(' + scale + ')')
    zoom.scale(scale)
    zoom.translate([x, y])
  }

  function update (source) {
    var levelWidth = [1]
    var childCount = function (level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0)

        levelWidth[level + 1] += n.children.length
        n.children.forEach(function (d) {
          childCount(level + 1, d)
        })
      }
    }
    childCount(0, root)
    var newHeight = d3.max(levelWidth) * 25 // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth])

    var duration = d3.event && d3.event.altKey ? 5000 : 500

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse()

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180 })

    // Update the nodes…
    var node = vis.selectAll('g.node')
      .data(nodes, function (d) { return d.id || (d.id = ++i) })

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr('transform', function (d) { return 'translate(' + source.y0 + ',' + source.x0 + ')' })
      .on('click', function (d) { toggle(d); update(d); centerNode(d) })

    nodeEnter.append('svg:circle')
      .attr('r', 10)
      .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff' })

    nodeEnter.append('svg:text')
      .attr('class', function (d) { return d.children || d._children ? 'nodeHasChildren' : '' })
      .attr('x', function (d) { return d.children || d._children ? -15 : 15 })
      .attr('dy', '.45em')
      .attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start' })
      .text(function (d) { return d.name })
      .style('fill-opacity', 1e-6)

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')' })

    nodeUpdate.select('circle')
      .attr('r', 10)
      .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff' })

    nodeUpdate.select('text')
      .style('fill-opacity', 1)

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')' })
      .remove()

    nodeExit.select('circle')
      .attr('r', 10)

    nodeExit.select('text')
      .style('fill-opacity', 1e-6)

    // Update the links…
    var link = vis.selectAll('path.link')
      .data(tree.links(nodes), function (d) { return d.target.id })

    // Enter any new links at the parent's previous position.
    link.enter().insert('svg:path', 'g')
      .attr('class', 'link')
      .attr('d', function (d) {
        var o = { x: source.x0, y: source.y0 }
        return diagonal({ source: o, target: o })
      })
      .transition()
      .duration(duration)
      .attr('d', diagonal)

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr('d', diagonal)

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr('d', function (d) {
        var o = { x: source.x, y: source.y }
        return diagonal({ source: o, target: o })
      })
      .remove()

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x
      d.y0 = d.y
    })
  }

  // Toggle children.
  function toggle (d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
  }
}
