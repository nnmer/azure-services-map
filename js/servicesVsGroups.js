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

    var svg = d3.select("#service-vs-group-map")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')



    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .charge(-300)
        .linkDistance(50)
        .gravity(0.3)
        .friction(0.9)
        .on('tick', forceTick)
        .start()


    var drag = force.drag()
        .on("dragstart", function(d){
            d3.select(this).classed("fixed", d.fixed = true)
        })

    var svgLink = svg.append("g").attr('class','container-link').selectAll('.link')
        .data(force.links())
        .enter().append('line')
            .attr('class','link')
        

    var svgNode = svg.append("g").attr('class','container-node').selectAll('.node')    
        .data(force.nodes())
        .enter()
            .append("circle")
                .attr('class',function(d){return 'node '+(d.isCategory?' node-category ':'')+(d.hasLinkingServices ?' has-linking-services ':'')})
                .call(drag)
                .on('dblclick', connectedNodes)          
        
    var svgLabel = svg.append("g").attr('class','container-label').selectAll('.label')    
        .data(force.nodes())
        .enter()            
            .append("text")
                .attr('class',function(d){return 'label '+(d.isCategory?'label-category':'')})
                .attr("dx", "1.4em")
                .attr("dy", ".35em")
                .attr('font-size','15px')
                .text(function(d){return d.name})

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

    function connectedNodes(a,b,c) {
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

        showServiceLinking(toggle && false === d.isCategory ? services[d.id] : false)
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

        svgLabel
            .attr('x', function (d) {return d.x})
            .attr('y', function (d) {return d.y})        
    }
}