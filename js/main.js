/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/
const height = 300;
const width = 500;
const margin = {left:80, top:50, right: 50, bottom:60 };

let flag = true;

const t = d3.transition().duration(750);


//Adds the main canvass and sets its height and width
const svg = d3.select("#chart-area")
        .append("svg")
        .attr("height",height)
        .attr("width", width);

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

//Adds the container of the rectangle bars within the canvass
const g = svg.append('g')
            .attr('height',innerHeight)
            .attr('width', innerWidth)
            .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisGroup =  g.append('g')
        .attr('transform', `translate(0,${innerHeight})`);

    const yAxisGroup = g.append('g');


    //Adds the xAxis label
    g.append("text")
        .attr('x', innerWidth/2)
        .attr('y', innerHeight + 30)
        .attr('text-anchor','middle')
        .text("Month");

    const yLabel = g.append("text")
        .text("Revenue")
        .attr('x', - (innerHeight/2))
        .attr('y', -50)
        .attr('text-anchor','middle')
        .attr('transform','rotate(-90)');


    //Sets the scale of the bars
    const yScale = d3.scaleLinear()
                .range([innerHeight, 0]);

    const xScale = d3.scaleBand()
                .range([0,innerWidth])
                .padding(0.1);

d3.json('data/revenues.json').then(data => {
    data.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
        }   
    );

    d3.interval(function(){
        var newData = flag ? data : data.slice(1); 
        update(newData);
        flag = !flag;
    }, 1000);

    update(data);

})

function update(data){
    let value = flag ? "revenue" : "profit";

    yScale.domain([0, d3.max(data, d => d[value])])

    xScale.domain(data.map(d => d.month))

    //Adds Axes
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => "$"+d);
        yAxisGroup.transition(t).call(yAxis);

    const xAxis = d3.axisBottom(xScale);
        xAxisGroup.transition(t).call(xAxis);

   //Adds rectangle bars
    const rects = g.selectAll('rect')
        .data(data, key => key.month);

        //Remove old elements that are not present in new data
        rects.exit()
            .attr("fill","red")
            .transition(t)
            .attr("y",yScale(0))
            .attr("height",0)
            .remove()
        
        /* REPLAVED BY MERGE
        //Update old element present in the new data;
        rects.transition(t)
            .attr('height', d => innerHeight - yScale(d[value]))
            .attr('width', xScale.bandwidth())
            .attr('x', d => xScale(d.month))
            .attr('y', d => yScale(d[value]));
        */

        rects.enter()
            .append('rect')
            .attr('fill','gray')
            .attr("height",0)
            .attr('width', xScale.bandwidth())
            .attr('x', d => xScale(d.month))
            .attr('y', yScale(0))
            .attr('fill-opacity',0)
            .merge(rects)
            .transition(t)
                .attr('class','bar')
                .attr('x', d => xScale(d.month))
                .attr('width', xScale.bandwidth())
                .attr('y',d => yScale(d[value]))
                .attr('height', d => innerHeight - yScale(d[value]))
                .attr('fill-opacity',1);


        let label = flag ? "Revenue" : "Profit";    
        yLabel.transition(t)
            .text(label);

        console.log(rects);

}