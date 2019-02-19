class ServiceLinking {

  constructor(services, serviceLinks) {
    this.services = Object.assign({}, services)
    this.sourceData = Object.assign({}, serviceLinks)
    this.flatServiceIOMap = {};

    this.buildFlatSourceTargetMap();
    this.mergeServicesWithRespectedIOServices()
  }

  buildFlatSourceTargetMap() {
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }

    for (let key in this.sourceData) {
      let item = this.sourceData[key];
      let that = this

      this.flatServiceIOMap[key] = this.flatServiceIOMap[key] || {input:[], output:[]}

      if (undefined !== item.output && typeof item.output === 'object') {
        let out = item.output.map(function(i){return that.name2Key(i)})
        Array.prototype.push.apply(this.flatServiceIOMap[key].output, out);
        
        out.map(function(outputElement){
          that.flatServiceIOMap[outputElement] = that.flatServiceIOMap[outputElement] || {input:[], output:[]}
          that.flatServiceIOMap[outputElement].input.push(key)
        })        

      }      

      if (undefined !== item.input && typeof item.input === 'object') {
        let inputs = item.input.map(function(i){return that.name2Key(i)})
        Array.prototype.push.apply(this.flatServiceIOMap[key].input, inputs);
        inputs.map(function(inputElement){
          that.flatServiceIOMap[inputElement] = that.flatServiceIOMap[inputElement] || {input:[], output:[]}
          that.flatServiceIOMap[inputElement].output.push(key)
        })        
      }      

      this.flatServiceIOMap[key].input = (this.flatServiceIOMap[key].input).filter(onlyUnique)
      this.flatServiceIOMap[key].output = (this.flatServiceIOMap[key].output).filter(onlyUnique)
    }
  }

  mergeServicesWithRespectedIOServices() {
    for (let key in this.flatSourceTargetMap) {
      if (this.services[key]) {
        this.services[key].servicesIO = this.flatSourceTargetMap[key]
        this.services[key].hasLinkingServices = 
        ((this.services[key].servicesIO.input || this.services[key].servicesIO.output)) 
          ? true 
          : false
      }
    }
  }

  name2Key(name) {
    if (name.search(/^\(external\)/) !== -1) {
      return name;
    }
  
    let key = String(name)
      .toLowerCase()
      .replace(new RegExp('^azure'),'')
      .trim()
      .replace(new RegExp(' ', 'g'),'-')
      ;
  
      return key;
  }

  get service() {
    return this.services
  }

  get flatSourceTargetMap() {
    return this.flatServiceIOMap
  }
}





function servicesVsGroupsForceDirectedTree(services) {
    function services2ServiceCategoryLink(data) {
      let links = []
    
      for (let i in data) {
        data[i].category.forEach(function(c) {          
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

    var width=1000,
        height=850,
        centerX = width/2,
        centerY = height/2,
        links = services2ServiceCategoryLink(services),
        nodes = {},
        categories = {}
    ;

    links.forEach(function(item) {            
      item.source = nodes[item.name] || (nodes[item.name] = {name: item.name, id: item.id, hasLinkingServices: item.hasLinkingServices, isCategory: (item.category=='Azure'?true:false)});
      item.target = nodes[item.category] || (nodes[item.category] = {name: item.category, isCategory: true});
      if (!categories[item.category]){
          categories[item.category] = item.category
      }
    });


    nodes = d3.values(nodes);
    var n = nodes.length;
    nodes.forEach(function(d, i) {
        if (d.name=='Azure') {
            d.x=centerX;
            d.y=centerY;
            d.fixed = true;
        } else {
            d.x = width / n * i
            d.y = height /2;
        }
    });

    var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", zoomed);

    function zoomed() {
      svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }     

    var svg = d3.select("#service-vs-group-map")
        .append("svg")
            .attr("width", '100%')
            .attr("height", height)
            .call(zoom)
            .append('g')



    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .charge(-300)
        .linkDistance(function(d,a){return Math.floor(Math.random()*(150-50+1)+50)})
        .gravity(0.3)
        .friction(0.9)
        .on('tick', forceTick)
        .start()


    var drag = d3.behavior.drag()
        .on("dragstart", function(d, nodeId){
            force.stop()
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true)
            triggerPopoverOff(d, nodeId)
        })
        .on("drag", function(d, nodeId){
          d.px += d3.event.dx;
          d.py += d3.event.dy;
          d.x += d3.event.dx;
          d.y += d3.event.dy; 
          forceTick();
        })
        .on("dragend", function(d, nodeId){
          // d3.select(this).classed("fixed", d.fixed = true)
          triggerPopover(d, nodeId)
          forceTick();
          force.resume()
      })

    var svgLink = svg.append("g").attr('class','container-link').selectAll('.link')
        .data(force.links())
        .enter().append('line')
            .attr('class','link')
        

    var svgNode = svg.append("g").attr('class','container-node').selectAll('.node')    
        .data(force.nodes())
        .enter()
            .append("circle")
                .attr('id', function(d,id){return 'service-node-'+id})
                .attr('class',function(d){
                  return 'node '
                        +(d.isCategory? 'node-category ':'')
                        +(d.hasLinkingServices ? 'has-linking-services ':'')
                })
                .call(drag)
                // .on('click',  onNodeClick)                       
                .on('dblclick', onNodeDblClick)   
                .on("mouseover",function(d, nodeId){
                  d3.select(this).classed('node-hovered', true)
                  $('#service-node-'+nodeId+'-label').toggleClass('node-hovered')

                  

                  let nx = Math.round($('#service-node-'+nodeId+'-label').attr('x')*1)
                  let ny = Math.round($('#service-node-'+nodeId+'-label').attr('y')*1)
                  let ndx = parseFloat($('#service-node-'+nodeId+'-label').attr('dx'))
                  let ndy = parseFloat($('#service-node-'+nodeId+'-label').attr('dy'))
                  
                  svg.append('rect')
                    .attr('id',"service-node-hovered-label-background")
                    .attr('x', nx+ndx+12)
                    .attr("y",ny+ndy-10)
                    .attr('height', 20)
                    .attr('width', 250)
                    .attr('fill','#ff0')
                  
                  $('.container-label')
                    .append($('#service-node-hovered-label-background'))
                    .append($('#service-node-'+nodeId+'-label'))
                
                  
                })
                .on("mouseout",function(d, nodeId){
                  d3.select(this).classed('node-hovered', false)
                  $('#service-node-'+nodeId+'-label').toggleClass('node-hovered')
                  $('#service-node-hovered-label-background').remove()
                })

  var svgLabel = svg.append("g").attr('class','container-label').selectAll('.label')
    .data(force.nodes())
    .enter()            
        .append("text")
            .attr('id', function(d,id){return 'service-node-'+id+'-label'})
            .attr('class',function(d){return 'label '+(d.isCategory?'label-category':'')})
            .attr("dx", "1.4em")
            .attr("dy", ".35em")
            .attr('font-size','15px')
            .text(function(d){return d.name})        

// var svgIcon = svg.append("g").attr('class','container-s-img').selectAll('.s-icon')    
//   .data(force.nodes())
//   .enter()
//     .append('image')
//       .attr('class','service-icon')
//       .attr("xlink:href", function(d){return SL && SL.services[d.id] ? SL.services[d.id].icon : ''})
//       // .attr("width", 16)
//       // .attr("height", 16)
        


    svg.append("defs").selectAll("marker")
        .data(d3.values(categories))
            .enter().append("marker")
                .attr("id", function(d) { return d; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 25)
                .attr("refY", 0)
                .attr("markerWidth", 8)
                .attr("markerHeight", 8)
                .attr("orient", "auto")
                    .append("path")
                        .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
                        .style("stroke", "#000")
                        .style("opacity", "0.7")
        
        
    // -----------------


    //Toggle stores whether the highlighting is on
    var toggle = 0;

    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (i = 0; i < nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    //This function looks up whether a pair are neighbours  
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }

    function triggerPopoverOff(d, nodeId) {
      $('circle[id^=service-node]')
        .not("circle[id=service-node-"+nodeId+"]")
        .popover('hide')
    }

    function triggerPopover (d,nodeId){      
       $('#service-node-'+nodeId)
        .not(".node-category")
        .popover({
          title: d.name,
          content: tmpl("service_node_popover", services[d.id]),
          sanitize: false,
          trigger: 'manual',
          html: true
        })
        .popover('show')
    }

    function onNodeDblClick(a,b,c) {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            svgNode.style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            });
            
            svgLink.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });

            svgLabel.style("opacity", function(o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            })
            
            //Reduce the op
            
            toggle = 1;
        } else {
            //Put them back to opacity=1
            svgNode.style("opacity", 1);
            svgLink.style("opacity", 1);
            svgLabel.style("opacity", 1);
            toggle = 0;
        }
    }

    function forceTick() {
        svgLink
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;})
            .style("marker-end",  function(d){return `url("#${d.category}")`} )
            
        svgNode
            .attr('cx', function (d) {return d.x})
            .attr('cy', function (d) {return d.y})
            
        // svgIcon
        //     .attr('x', function (d) {return d.x-8})
        //     .attr('y', function (d) {return d.y-8})

        svgLabel
            .attr('x', function (d) {return d.x})
            .attr('y', function (d) {return d.y})        
    }
}

function serviceFlowTree(json) {    

  var m = [20, 120, 20, 120],
  w = 1280 - m[1] - m[3],
  h = 800 - m[0] - m[2],
  i = 0,
  root;

  var tree = d3.layout.tree()
    .size([h, w]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
    
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", zoomed);

  function zoomed() {
    vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }  

  var vis = d3.select("#service-flow").append("svg:svg")
    .attr("width", '100%')
    .attr("height", h)
      .call(zoom)
    .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    ;

  root = json;
  root.x0 = h / 2;
  root.y0 = 0;

  update(root);

  function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
      .attr('class', function(d) { return d.children || d._children ? 'nodeHasChildren' : ''; })
      .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  }

  // Toggle children.
  function toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }  
}