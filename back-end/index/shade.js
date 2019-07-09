var srect = $('td.caption');
var shade = d3.select('#svg-shading')
    .attr("viewBox", [0, 0, (srect.width()), (srect.height()*.5)].join(' '));
var linearGradient = shade.append("defs")
    .append("linearGradient")
    .attr("id", "linear-gradient");
linearGradient.append("stop")
    .attr("offset", "00%")
    .attr("stop-color", color_map(0));
linearGradient.append("stop")
    .attr("offset", "10%")
    .attr("stop-color", color_map(.1));
linearGradient.append("stop")
    .attr("offset", "20%")
    .attr("stop-color", color_map(.2));
linearGradient.append("stop")
    .attr("offset", "30%")
    .attr("stop-color", color_map(.3));
linearGradient.append("stop")
    .attr("offset", "40%")
    .attr("stop-color", color_map(.4));
linearGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", color_map(.5));
linearGradient.append("stop")
    .attr("offset", "60%")
    .attr("stop-color", color_map(.6));
linearGradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", color_map(.7));
linearGradient.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", color_map(.8));
linearGradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", color_map(.9));
linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", color_map(1));
var rect = shade.append("rect")
    .attr("class", "shade_rect")
    .attr("viewBox", [0, 0, (srect.width()), (srect.height()*.5)].join(' '))
    .style("stroke", "black")
    .style("fill", "url(#linear-gradient)");