//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
var radar_scale = d3.scaleLinear()
    .domain([0,.2,.4,.6,.8,1])
    .range([0,5/15,9/15,12/15,14/15,1]);
var g_radar;
var RadarChart = {
    draw: function(classId, d, options){
        var cfg = {
            radius: 5,
            w: 500,
            h: 500,
            translateX: 0,
            translateY: 0,
            maxWidth: 999,
            maxHeight: 999,
            factor: 1/15,
            denominator: 5,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI, //fixed value
            opacityArea: 0.6,
            ToRight: 5,
            DOM: 0,
            fontSize1: "1rem",
            fontSize2: "1.5rem",
            //keyName: ["ด้านสุุขภาพ", "ด้านความเป็นอยู่", "ด้านการศึกษา", "ด้านรายได้", "ด้านการเข้าถึงบริการรัฐ"],
            keyName: ["สุขภาพ", "การเข้าถึงบริการรัฐ", "รายได้", "การศึกษา", "ความเป็นอยู่"],
            dx: [0, -1.5, 0, 0, 0],
            dy: [.5, .5, -.5, -.5, .5],
            color: "#455396"
        };
        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    cfg[i] = options[i];
                }
            }
        }
        var allAxis = cfg.keyName //key
        var length = allAxis.length;
        var radius = Math.min(cfg.w/2, cfg.h/2);
        var Format = d3.format('.2%');
        var bars_top = cfg.DOM.selectAll(classId)
            .remove()
            .exit()
            .data([1]); //dummy data
        var st = classId.substr(1,classId.length-1);
        g_radar = bars_top.enter()
            .append("g")
            .attr("id", st)
            .attr("viewBox", [0, 0, (cfg.w), (cfg.h)].join(' '))
        ;
        var tooltip;
        //Circular segments
        var levelFactor;
        var old_level = 0;
        for(var j=0; j<cfg.levels-1; j++){
            levelFactor = cfg.factor*(cfg.denominator-j+old_level)*radius*(cfg.denominator/cfg.levels);
            old_level += cfg.denominator-j;
            g_radar.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("class", "line")
                .attr("x1", function(d, i){return levelFactor*(1-Math.sin(i*cfg.radians/length));})
                .attr("y1", function(d, i){return levelFactor*(1-Math.cos(i*cfg.radians/length));})
                .attr("x2", function(d, i){return levelFactor*(1-Math.sin((i+1)*cfg.radians/length));})
                .attr("y2", function(d, i){return levelFactor*(1-Math.cos((i+1)*cfg.radians/length));})
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")");
        }
        //Text indicating at what % each level is
        old_level = 0; //re level
        for(var k=0; k<cfg.levels-2; k++){
            levelFactor = cfg.factor*(cfg.denominator-k+old_level)*radius*(cfg.denominator/cfg.levels);
            old_level += cfg.denominator-k;
            g_radar.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("class", "legend")
                .attr("x", function(d){return levelFactor*(1-15*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1-Math.cos(0));})
                .style("font-size", cfg.fontSize1)
                .attr("transform", "translate(" + (-levelFactor + cfg.ToRight) + ", " + (-levelFactor) + ")")
                .attr("fill", "#737373")
                .text(Format((k+1)/(cfg.levels-1)));
        }
        //Line axis from center to
        var axis = g_radar.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        levelFactor = radius*(cfg.denominator/cfg.levels);
        axis.append("line")
            .attr("class", "line")
            .attr("x1", cfg.w/2 - (cfg.w/2-levelFactor))
            .attr("y1", cfg.h/2 - (cfg.h/2-levelFactor))
            .attr("x2", function(d, i){return levelFactor*(1-Math.sin(i*cfg.radians/length));})
            .attr("y2", function(d, i){return levelFactor*(1-Math.cos(i*cfg.radians/length));})
            .style("stroke", "grey")
            .style("stroke-width", "1px")
            .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")")
        ;
        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-size", cfg.fontSize2)
            .attr("text-anchor", "middle")
            .attr("dx", function(d, i)
            {return cfg.dx[i] + "em";})
            .attr("dy", function(d, i)
            {return cfg.dy[i] + "em";})
            .attr("x", function(d, i)
            {return levelFactor*(1-cfg.factorLegend*Math.sin(i*cfg.radians/length))-60*Math.sin(i*cfg.radians/length);})
            .attr("y", function(d, i)
            {return levelFactor*(1-Math.cos(i*cfg.radians/length))-20*Math.cos(i*cfg.radians/length);})
            .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")")
        ;
        //add position node by data
        var dataValues = [];
        g_radar.selectAll(".nodes")
            .data(d.values(), function(v, i){
                dataValues.push([
                    levelFactor*(1-radar_scale(control_digit(v/cfg.maxValue, 10))*Math.sin(i*cfg.radians/length)),
                    levelFactor*(1-radar_scale(control_digit(v/cfg.maxValue, 10))*Math.cos(i*cfg.radians/length))
                ]);
            });
        //add polygon
        g_radar.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", function (d, i) {return "radar-chart-serie"+i;})
            .style("stroke-width", "2px")
            .style("stroke", cfg.color)
            .attr("points",function(d) {
                var str="";
                for(var pti=0;pti<d.length;pti++){
                    str=str+d[pti][0]+","+d[pti][1]+" ";
                }
                return str;
            })
            .style("fill", "#cc0f49")
            .style("fill-opacity", cfg.opacityArea)
            .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")")
            .on('mouseover', function (d){
                var z = "polygon."+d3.select(this).attr("class");
                g_radar.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea);
                g_radar.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea/7);
            })
            .on('mouseout', function(){
                g_radar.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea);
            });
        //add point
        g_radar.selectAll(".nodes")
            .data(d.values()).enter()
            .append("svg:circle")
            .attr("class", function (d, i) {return "radar-chart-serie"+i;})
            .attr('r', cfg.radius)
            .attr("alt", function(j){return control_digit(j/cfg.maxValue, 10)})
            .attr("cx", function(j, i){return dataValues[i][0];})
            .attr("cy", function(j, i){return dataValues[i][1];})
            .attr("data-id", function(j){return j.text})
            .style("fill", cfg.color)
            .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")")
            .on('mouseover', function (j){
                var z = "polygon."+d3.select(this).attr("class");
                g_radar.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", .1);
                g_radar.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
            })
            .on('mouseout', function(){
                tooltip
                    .transition(200)
                    .style('opacity', 0);
                g_radar.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", cfg.opacityArea);
            })
            .append("svg:title")
            .html(function(j, i){return allAxis[i] + "<br>" + Format(control_digit(j/cfg.maxValue, 10))})
            .attr("transform", "translate(" + (-levelFactor) + ", " + (-levelFactor) + ")")
            .style("align", "center");
        //Tooltip
        tooltip = g_radar.append('text')
            .style('opacity', 0)
            .style('font-size', '13px');
        if(cfg.maxWidth != 999){
            var posGX = (cfg.maxWidth-cfg.w)/2,
                posGY = (cfg.maxHeight-cfg.h)/2;
            //g_radar.attr("transform", "translate("+posGX+","+posGY+")")
            ;
        }
    }
};