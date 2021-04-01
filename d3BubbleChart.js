(function () {
    
    var width = 800, height = 800, radius = 10 

    var svg = d3.select('#chart')
        .append('svg')
        .attr('height', height)
        .attr('width', width)
        .append('g')
        .attr('transform', 'translate(0,0)')
    
    var defs = svg.append('defs')

    defs.append('pattern')
        .attr('id', 'credit-img')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', 1)
        .attr('width', 1)
        .attr('preserveAspectRatio', 'none')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('xlink:href', 'raining-money.jpeg');

    defs.append('pattern')
        .attr('id', 'debit-img')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', 1)
        .attr('width', 1)
        .attr('preserveAspectRatio', 'none')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('xlink:href', 'burning-money.jpeg');

    var forceXSplit = d3.forceX(function(d) {
        return ((d.Credit) ? 180 : 620)        // return ((d.Credit) ? width/1.29 : width/4.44)
    }).strength(0.05)

    var forceXCombine = d3.forceX(width/2).strength(0.05)

    var forceCollide = d3.forceCollide(function(d) {
        return ((d.Credit) ? radiusScale(d.Credit) +1 : radiusScale(d.Debit) +1 )
    })

    var simulation = d3.forceSimulation()
        .force('x', forceXSplit)
        .force('y', d3.forceY(height/2).strength(0.05))
        .force('collide', forceCollide)

    var radiusScale = d3.scaleSqrt().range([10,80]) 
        
    d3.csv("transactions.csv").then(ready)

    function ready(datapoints) {
        var maxCredit = d3.max(datapoints, function(d) {return +d.Credit})
        var maxDebit = d3.max(datapoints, function(d) {return +d.Debit})
        var maxAmount = Math.max(maxCredit,maxDebit)
        radiusScale.domain([0,maxAmount])

        var circles = svg.selectAll('.artist')
            .data(datapoints)
            .enter().append('circle')
            .attr('class', 'artist')
            .attr('r', function(d) {
                return ((d.Credit) ? radiusScale(d.Credit) : radiusScale(d.Debit))
            })
            .attr('fill', function(d) {
                return ((d.Credit) ? 'url(#credit-img)': 'url(#debit-img)')
            })
            .attr('cx', 100)
            .attr('cy', 300)
            .attr('opacity', 0.7)
            .attr('stroke', 'grey')
            // .attr('fill', function(d) {
            //     return ((d.Credit) ? "green" : "red")
            // })
            // .on('click', function(d) {console.log(d)})
            // .attr('fill', function(d) { return colorScale(d.continent)})
            
            d3.select('#type-split').on('click', function () {
                simulation
                    .force('x',forceXSplit)
                    .alphaTarget(0.5)
                    .restart()
            })
            d3.select('#combine').on('click', function () {
                simulation
                    .force('x',forceXCombine)
                    .alphaTarget(0.5)
                    .restart()
            })


            simulation.nodes(datapoints)
                .on('tick', ticked)

            function ticked() {
                circles
                    .attr('cx', function(d) {
                        return d.x
                    })
                    .attr('cy', function(d) {
                        return d.y
                    })
            }
    }

})()