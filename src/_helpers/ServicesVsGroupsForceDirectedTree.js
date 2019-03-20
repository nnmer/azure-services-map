export default class ServicesVsGroupsForceDirectedTree {
  constructor (visSelector, services, vue) {
    this._vue = vue
    this.visSelector = visSelector
    this.filter = null
    this.width = $(document).width()
    this.height = 850
    this.centerX = this.width / 2
    this.centerY = this.height / 2

    this.services = services

    this.links = this.services2ServiceCategoryLink(this.services)

    // Create an array logging what is connected to what
    this.linkedByIndex = {}

    this.nodes = {}
    this.categories = {}

    this.toggle = 0 // Toggle stores whether the highlighting is on

    this.force = null
    this.svgLabel = null
    this.svgNode = null
    this.svgLink = null

    this.svg = null
  }

  set searchValue (value) {
    this.filter = value
    this.applyFilter()
  }

  applyFilter () {
    if (this.svgNode === null) {
      return
    }

    if (this.toggle === 1) {
      this.toggle = 0
    }

    if (this.filter) {
      let regex = new RegExp('' + this.filter + '', 'i')
      this.svgLink.style('opacity', 0.1)

      this.svgNode.style('opacity', function (o) {
        return o.name.search(regex) !== -1 ? 1 : 0.1
      })
      this.svgLabel.style('opacity', function (o) {
        return o.name.search(regex) !== -1 ? 1 : 0.1
      })
    } else {
      this.svgNode.style('opacity', 1)
      this.svgLink.style('opacity', 1)
      this.svgLabel.style('opacity', 1)
    }
  }

  services2ServiceCategoryLink (data) {
    let links = []

    for (let i in data) {
      data[i].category.forEach(function (c) {
        links.push({
          id: data[i].id,
          name: data[i].name,
          category: c,
          hasLinkingServices: data[i].hasLinkingServices
        })
      })
    }

    return links
  }

  render () {
    let that = this

    this.links.forEach(function (item) {
      item.source = that.nodes[item.name] || (that.nodes[item.name] = { name: item.name, id: item.id, hasLinkingServices: item.hasLinkingServices, isCategory: (item.category == 'Azure') })
      item.target = that.nodes[item.category] || (that.nodes[item.category] = { name: item.category, isCategory: true })
      if (!that.categories[item.category]) {
        that.categories[item.category] = item.category
      }
    })

    this.nodes = d3.values(this.nodes)

    var n = this.nodes.length

    this.nodes.forEach(function (d, i) {
      if (d.name === 'Azure') {
        d.x = centerX
        d.y = centerY
        d.fixed = true
      } else {
        d.x = that.width / n * i
        d.y = that.height / 2
      }
    })

    var zoomed = function () {
      that.svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
    }

    var zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', zoomed)

    this.svg = d3.select(this.visSelector)
      .append('svg')
      .attr('width', this.width - 60)
      .attr('height', this.height)
      .call(zoom)
      .on('dblclick.zoom', null)
      .append('g')

    this.force = d3.layout.force()
      .nodes(this.nodes)
      .links(this.links)
      .size([this.width, this.height])
      .charge(-300)
      .linkDistance(function (d, a) { return Math.floor(Math.random() * (150 - 50 + 1) + 50) })
      .gravity(0.3)
      .friction(0.9)
      .on('tick', function (d) { that.forceTick(d) })
      .start()

    var drag = d3.behavior.drag()
      .on('dragstart', function (d, nodeId) {
        that.force.stop()
        d3.event.sourceEvent.stopPropagation()
        d3.select(this).classed('fixed', d.fixed = true)
        // that.triggerPopoverOff(d, nodeId)
      })
      .on('drag', function (d, nodeId) {
        d.px += d3.event.dx
        d.py += d3.event.dy
        d.x += d3.event.dx
        d.y += d3.event.dy
        that.forceTick()
      })
      .on('dragend', function (d, nodeId) {
        // d3.select(this).classed("fixed", d.fixed = true)
        that.triggerPopover(d, nodeId)
        that.forceTick()
        that.force.resume()
      })

    this.svgLink = this.svg.append('g').attr('class', 'container-link').selectAll('.link')
      .data(this.force.links())
      .enter().append('line')
      .attr('class', 'link')

    this.svgNode = this.svg.append('g').attr('class', 'container-node').selectAll('.node')
      .data(this.force.nodes())
      .enter()
      .append('circle')
      .attr('id', function (d, id) { return 'service-node-' + id })
      .attr('class', function (d) {
        return 'node ' +
          (d.isCategory ? 'node-category ' : '') +
          (d.hasLinkingServices ? 'has-linking-services ' : '')
      })
      .attr('r', function (d) {
        return d.isCategory ? 13 : 10
      })
      .call(drag)
      // .on('click',  onNodeClick)
      .on('dblclick', function (d) { that.onNodeDblClick(d) })
      .on('mouseover', function (d, nodeId) {
        d3.select(this).classed('node-hovered', true)
        $('#service-node-' + nodeId + '-label').toggleClass('node-hovered')

        let nx = Math.round($('#service-node-' + nodeId + '-label').attr('x') * 1)
        let ny = Math.round($('#service-node-' + nodeId + '-label').attr('y') * 1)
        let ndx = parseFloat($('#service-node-' + nodeId + '-label').attr('dx'))
        let ndy = parseFloat($('#service-node-' + nodeId + '-label').attr('dy'))

        that.svg.append('rect')
          .attr('id', 'service-node-hovered-label-background')
          .attr('x', nx + ndx + 12)
          .attr('y', ny + ndy - 10)
          .attr('height', 20)
          .attr('width', 250)
          .attr('fill', '#ff0')

        $('.container-label')
          .append($('#service-node-hovered-label-background'))
          .append($('#service-node-' + nodeId + '-label'))
      })
      .on('mouseout', function (d, nodeId) {
        d3.select(this).classed('node-hovered', false)
        $('#service-node-' + nodeId + '-label').toggleClass('node-hovered')
        $('#service-node-hovered-label-background').remove()
      })

    this.svgLabel = this.svg.append('g').attr('class', 'container-label').selectAll('.label')
      .data(this.force.nodes())
      .enter()
      .append('text')
      .attr('id', function (d, id) { return 'service-node-' + id + '-label' })
      .attr('class', function (d) { return 'label ' + (d.isCategory ? 'label-category' : '') })
      .attr('dx', '1.4em')
      .attr('dy', '.35em')
      .attr('font-size', '15px')
      .text(function (d) { return d.name })

    // var svgIcon = svg.append("g").attr('class','container-s-img').selectAll('.s-icon')
    //   .data(force.nodes())
    //   .enter()
    //     .append('image')
    //       .attr('class','service-icon')
    //       .attr("xlink:href", function(d){return SL && SL.services[d.id] ? SL.services[d.id].icon : ''})
    //       // .attr("width", 16)
    //       // .attr("height", 16)

    this.svg.append('defs').selectAll('marker')
      .data(d3.values(this.categories))
      .enter().append('marker')
      .attr('id', function (d) { return d })
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5')
      .style('stroke', '#000')
      .style('opacity', '0.7')

    // .index available after the nodes nad linkes are evaluated by d3
    this.nodes.forEach(function (d) {
      that.linkedByIndex[d.index + ',' + d.index] = 1
    })

    this.links.forEach(function (d) {
      that.linkedByIndex[d.target.index + ',' + d.source.index] = 1
    })
  }

  // This function looks up whether a pair are neighbours
  neighboring (a, b) {
    return this.linkedByIndex[a.index + ',' + b.index]
  }

  // triggerPopoverOff (d, nodeId) {
  //   $('circle[id^=service-node]')
  //     .not('circle[id=service-node-' + nodeId + ']')
  //     .popover('hide')
  // }

  triggerPopover (d, nodeId) {
    let service = this.services[d.id];
    if (service) {
      this._vue.$root.$emit('app::services::popover::show', d3.event, service.id, 'service-node-' + nodeId)
    }
    // $('#service-node-' + nodeId)
    //   .not('.node-category')
    //   .popover({
    //     title: d.name,
    //     content: 'aaa',//tmpl('service_node_popover', this.services[d.id]),
    //     sanitize: false,
    //     trigger: 'manual',
    //     html: true
    //   })
    //   .popover('show')
  }

  onNodeDblClick (d) {
    let that = this
    if (this.toggle === 0) {
      // Reduce the opacity of all but the neighbouring nodes
      // d = d3.select(node).node().__data__;
      this.svgNode.style('opacity', function (o) {
        return that.neighboring(d, o) | that.neighboring(o, d) ? 1 : 0.1
      })

      this.svgLink.style('opacity', function (o) {
        return d.index === o.source.index | d.index === o.target.index ? 1 : 0.1
      })

      this.svgLabel.style('opacity', function (o) {
        return that.neighboring(d, o) | that.neighboring(o, d) ? 1 : 0.1
      })

      // Reduce the op

      this.toggle = 1
    } else {
      // Put them back to opacity=1
      this.svgNode.style('opacity', 1)
      this.svgLink.style('opacity', 1)
      this.svgLabel.style('opacity', 1)
      this.toggle = 0

      this.applyFilter()
    }
  }

  forceTick (d) {
    this.svgLink
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })
      .style('marker-end', function (d) { return `url("#${d.category}")` })

    this.svgNode
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })

    // svgIcon
    //     .attr('x', function (d) {return d.x-8})
    //     .attr('y', function (d) {return d.y-8})

    this.svgLabel
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
  }
}
