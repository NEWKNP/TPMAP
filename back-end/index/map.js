let map_point = Object.create(Point);
const map_root = $('div.the_map');
const previous = $('div.previous');
const exceed = previous.outerHeight(true) - previous.outerHeight();
const map_width = map_root.width(),
    map_height = map_root.height() - exceed*4;
const temp_w = map_root.innerWidth() - map_width;
var st,et;
//29/06/2018
var centerP,
    centerD,
    centerT;
var preX = map_width,
    preY = map_height,
    preXX, preYY,
    preK, preKK;
var layerC = true,
    layerP = false,
    layerD = false,
    layerT = false;
var weight = [1,1,1,1,1];
//create SVG
var svg_map = d3.select('#the_map')
    .append('svg')
        .attr("class", "svg-map")
    //.style("width", map_width)
    //.style("height", map_height)
        .attr("viewBox", [0, 0, map_width, map_height].join(' '))
;
var projection = d3.geo.mercator()
    .scale(2100)
    .rotate([-100.6331, -13.2])
    .translate([(map_width-temp_w)/2, (map_height)/2])
;
var path = d3.geo.path()
    .projection(projection);
//set province color
var color_map = d3.scaleLinear()
    .domain(d3.range(0,2))
    .range(["#F8D5CE", "#B81246"]);
var mapLayer = svg_map.append('g')
    .attr("id", "map-layer")
    .classed('map-layer', true);
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var cont, prov, dist, vll;
var scx, scy, spx, spy, sdx, sdy;
var en = true;
function place_country(json) {
    var features = json.features;
    var boundary = boundaryBox(features);
    scx = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[0], boundary[2]])
        .range([30, 5]);
    scy = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[1], boundary[3]])
        .range([30, 5]);
    mapLayer.append('g')
        .attr('class', 'cont hidden')
        .selectAll('map-layer')
        .data(features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', fillP)
        .style('stroke', '#eeeeee')
        .on('mouseover', mouseoverP)
        .on('mouseout', mouseoutP)
        .on('click', clickProvince)
    cont = d3.selectAll('.cont')
        .classed('hidden', false);
    //callback(null);
    return mapLayer;
}
function place_province(a_map) {
    var a_features = a_map.features;
    var boundary = boundaryBox(a_features);
    spx = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[0], boundary[2]])
        .range([220, 12]);
    spy = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[1], boundary[3]])
        .range([200, 12]);
    mapLayer.append('g')
        .attr('class', 'prov hidden')
        .selectAll('map-layer')
        .data(a_features)
        .enter().append('path')
        .attr('d', path)
        .on('mouseover', mouseoverD)
        .on('mouseout', mouseoutD)
        .on('click', clickDistrict)
    prov = d3.selectAll('.prov')
        .classed('hidden', true);
    //callback(null);
    return mapLayer;
}
function place_district(t_map) {
    var t_features = t_map.features;
    var boundary = boundaryBox(t_features);
    sdx = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[0], boundary[2]])
        .range([10000, 16]);
    sdy = d3.scale.pow()
        .exponent(-0.8)
        .domain([boundary[1], boundary[3]])
        .range([10000, 16]);
    mapLayer.append('g')
        .attr('class', 'dist hidden')
        .selectAll('map-layer')
        .data(t_features)
        .enter().append('path')
        .attr('d', path)
        .on('mouseover', mouseoverT)
        .on('mouseout', mouseoutT)
        .on('click', clickSubDistrict)
    dist = d3.selectAll('.dist')
        .classed('hidden', true);
    //callback(null);
    return mapLayer;
}
function place_village(v_map) {
    //var vf = formatVillage(v_map.features);
    var vf = v_map.features;
    mapLayer.append('g')
        .attr('class', 'vill hidden')
        .selectAll('map-layer')
        .data(vf)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
        .attr("r", .2)
        //.style("fill", d3.rgb('red'))
        .style("opacity", .5)
        .on('mouseover', mouseoverV)
        .on('mouseout', mouseoutV);
    vll = d3.selectAll(".vill")
        .classed('hidden', true);
    return mapLayer;
}
function nameTHP(d){
    return d && d.properties ? d.properties.PROV_NAMT : null;
}
function nameTHD(d){
    return d && d.properties ? d.properties.AMP_NAMT : null;
}
function nameTHT(d){
    return d && d.properties ? d.properties.TAM_NAMT : null;
}
function nameIdP(d) {
    var code = d.properties.PROV_CODE;
    return d && d.properties ? code : null;
}
function nameIdD(d) {
    var code = d.properties.PROV_CODE + d.properties.AMP_CODE;
    return d && d.properties ? code : null;
}
function nameIdT(d) {
    var code = d.properties.PROV_CODE + d.properties.AMP_CODE + d.properties.TAM_CODE;
    return d && d.properties ? code : null;
}
function fillP(d) {
    //console.log(d);
    if(check_fill(nameIdP(d), province_data.getData())){return fill_map(nameIdP(d), province_data);}
    else{return "#D1D2D5";}
}
function fillD(d) {
    if(check_fill(nameIdD(d), amphur_data.getData())){return fill_map(nameIdD(d), amphur_data);}
    else{return "#D1D2D5";}
}
function fillT(d) {
    if(check_fill(nameIdT(d), tambol_data.getData())){return fill_map(nameIdT(d), tambol_data);}
    else{return "#D1D2D5";}
}
function fillV(d) {
    var vname = d.properties.NAME;
    return color_map(10-vname.length/2);
}
function check_fill(id, sample) {
    if(sample.has(id)){return true;}
}
function newFill() {
    if(current_data.getTypeState() == "province"){
        cont.selectAll('path').style('fill', function(d){return fillP(d);});
    }
    else if(current_data.getTypeState() == "district"){
        prov.selectAll('path')
            .style('fill', function(d) {if(centerP && nameIdP(d) == nameIdP(centerP)){return fillD(d);}});
    }
    else if(current_data.getTypeState() == "sub") {
        dist.selectAll('path')
            .style('fill', function(d) {if(centerD && nameIdD(d) == nameIdD(centerD)){return fillT(d);}});
    }
    return "done";
}
function mouseoverP(d) {
    var data_sample = province_data.getData();
    if(check_fill(nameIdP(d), data_sample)){
        d3.select(this).style('fill', d3.rgb(fillP(d)).darker());
        initial_dimemtion.province_id = nameIdP(d);
        if(first){
            first = false;
            initial_dimemtion.level = "province";
        }
        set_bar_content("province", d, province_data.getData(), province_data.getCommon(),
            spider_generator(province_data.getData().get(nameIdP(d))), nameIdP(d));
    }
}
function mouseoverD(d){
    var data_sample = amphur_data.getData();
    if(check_fill(nameIdD(d), data_sample)) {
        d3.select(this).style('fill', d3.rgb(fillD(d)).darker());
        set_bar_content("district", d, amphur_data.getData(), amphur_data.getCommon(),
            spider_generator(amphur_data.getData().get(nameIdD(d))), nameIdD(d));
    }
}
function mouseoverT(d){
    var data_sample = tambol_data.getData();
    if(check_fill(nameIdT(d), data_sample) && en) {
        d3.select(this).style('fill', d3.rgb(fillT(d)).darker());
        set_bar_content("sub", d, tambol_data.getData(), tambol_data.getCommon(),
            spider_generator(tambol_data.getData().get(nameIdT(d))), nameIdT(d));
    }
}
function mouseoverV(d){
    var data_sample = village_data.getData();
    d3.select(this).style('fill', d3.rgb(fillV(d)).darker());
    tooltip
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 10 + "px")
        .style("display", "inline-block")
        .html(d.properties.NAME);
    /*
    if(check_fill(nameIdT(d), data_sample)) {
        d3.select(this).style('fill', d3.rgb(fillT(d)).darker());
        set_bar_content("sub", d, tambol_data.getData(), tambol_data.getCommon(),
            spider_generator(tambol_data.getData().get(nameIdT(d))), nameIdT(d));
    }
    */
}
function mouseoutP(d) {
    d3.select(this).style("fill", fillP(d));
}
function mouseoutD(d) {
    d3.select(this).style("fill", fillD(d));
}
function mouseoutT(d) {
    if(en){d3.select(this).style("fill", fillT(d));}
    else{d3.select(this).style("fill", '#e1e1e1');}
}
function mouseoutV(d) {
    d3.select(this).style("fill", d3.rgb(fillV(d)));
    tooltip.style("display", "none");
}

function clickProvince(d) {
    // Compute centroid of the selected
    //d = province shape
    if ((d && centerP !== d) && check_fill(nameIdP(d), province_data.getData())) {
        //if mouse overs map => zoom in
        var centroid = path.centroid(d);
        map_point.x = centroid[0];
        map_point.y = centroid[1];
        map_point.k = d3.min([scx(d.geometry.bbox[2] - d.geometry.bbox[0]), scy(d.geometry.bbox[3] - d.geometry.bbox[1])]);
        preX = map_point.getX();
        preY = map_point.getY();
        preK = map_point.getK();
        centerP = d;
        layerC = false;
        layerP = true;
        next_bind("amphur");
    }
}
function clickDistrict(d) {
    // Compute centroid of the selected path
    //d = district shape
    if (d && centerD !== d && check_fill(nameIdD(d), amphur_data.getData())) {
        //if mouse overs map => zoom in
        var centroid = path.centroid(d);
        map_point.x = centroid[0];
        map_point.y = centroid[1];
        map_point.k = d3.min([spx(d.geometry.bbox[2] - d.geometry.bbox[0]), spy(d.geometry.bbox[3] - d.geometry.bbox[1])]);
        preXX = map_point.getX();
        preYY = map_point.getY();
        preKK = map_point.getK();
        centerD = d;
        layerP = false;
        layerD = true;
        next_bind("tambol");
    }
}
function clickSubDistrict(d) {
    // Compute centroid of the selected path
    //d = sub-district shape
    if (d && centerT !== d && check_fill(nameIdT(d), tambol_data.getData())) {
        //if mouse overs map => zoom in
        var centroid = path.centroid(d);
        map_point.x = centroid[0];
        map_point.y = centroid[1];
        map_point.k = d3.min([sdx(d.geometry.bbox[2] - d.geometry.bbox[0]), sdy(d.geometry.bbox[3] - d.geometry.bbox[1])]);
        centerT = d;
        layerD = false;
        layerT = true;
        next_bind("village");
    }
}
function zoomed_in(x, y, k) {
    //cont -> prov
    if(layerP){
        //console.log("P->D");
        current_data.type_state = "district";
        mapLayer.transition()
            .duration(10)
            //.attr("transform", "translate(" + respond_w/2 + "," + respond_h/2 +")scale(" + ik + "," + ik +")"
            //    + "translate(" + -x + "," + -y + ")")
            .attr("transform", "translate(" + map_width/2 + "," + map_height/2 +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        cont.classed('hidden', true);
        prov.classed('hidden', false);
        prov.selectAll("path")
            .classed("hidden", centerP && function(d) {return nameIdP(d) !== nameIdP(centerP); })
            .style('fill', function(d) {if(centerP && nameIdP(d) == nameIdP(centerP)){return fillD(d);}})
            .style('stroke', '#eeeeee');
    }
    else if(layerD){ //prov -> dist
        //console.log("D->T");
        current_data.type_state = "sub";
        mapLayer.transition()
            .duration(10)
            //.attr("transform", "translate(" + respond_w/2 + "," + respond_h/2 +")scale(" + ik + "," + ik +")"
            //    + "translate(" + -x + "," + -y + ")")
            .attr("transform", "translate(" + map_width/2 + "," + map_height/2 +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        prov.classed('hidden', true);
        dist.classed('hidden', false);
        dist.selectAll("path")
            .classed("hidden", centerD && function(d) {return nameIdD(d) !== nameIdD(centerD); })
            .style('fill', function(d) {if(centerD && nameIdD(d) == nameIdD(centerD)){return fillT(d);}})
            .style('stroke', '#eeeeee');
    }
    else if(layerT){ //many dist -> a dist
        current_data.type_state = "sub";
        en = false;
        var getShpV = function (shpUrl) {
            var defer1 = $.Deferred();
            shp(shpUrl).then(function (geojson) {
                defer1.resolve(geojson);
            });
            return defer1.promise();
        };
        var placeV = function(j){
            var defer2 = $.Deferred();
            var rs2 = place_village(j);
            defer2.resolve(rs2);
            return defer2.promise();
        };
        mapLayer.transition()
            .duration(10)
            //.attr("transform", "translate(" + respond_w/2 + "," + respond_h/2 +")scale(" + ik + "," + ik +")"
            //    + "translate(" + -x + "," + -y + ")")
            .attr("transform", "translate(" + map_width/2 + "," + map_height/2 +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
        ;
        dist.selectAll("path")
            .classed("hidden", centerT && function(d) {return nameIdT(d) !== nameIdT(centerT); })
            .style('fill', function(d) {if(centerT && nameIdT(d) == nameIdT(centerT)){return '#e1e1e1';}});
        vll.classed('hidden', false);
        vll.selectAll("circle")
            .classed("hidden", function (d) {
                return !d3.polygonContains(centerT.geometry.coordinates[0],d.geometry.coordinates);
            })
            .style("fill", function (d) {
                if(d3.polygonContains(centerT.geometry.coordinates[0],d.geometry.coordinates)){
                    return fillV(d);
                }
                return '#bebebe';
            });

        //console.log(nameIdT(centerT));
    }
    setTimeout(dynamic_shade_by_level, 200);
    return "done";
}
function zoomed_out(x, y, k) {
    //k = 1
    disablemouse();
    if(layerP) {
        layerP = false;
        layerC = true;
        centerP = null;
        current_data.type_state = "province";
        mapLayer.transition()
            .duration(10)
            .attr("transform", "translate(" + map_width + "," + map_height +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
            .style("stroke-width", "1px");
        cont.classed('hidden', false);
        prov.classed('hidden', true);
        dist.classed('hidden', true);
    }
    //k = preK, dist -> prov
    else if(layerD){
        layerD = false;
        layerP = true;
        centerD = null;
        current_data.type_state = "district";
        mapLayer.transition()
            .duration(10)
            //.attr("transform", "translate(" + respond_w/2 + "," + respond_h/2 +")scale(" + ik + "," + ik +")"
            //    + "translate(" + -x + "," + -y + ")")
            .attr("transform", "translate(" + map_width/2 + "," + map_height/2 +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        prov.classed('hidden', false);
        dist.classed('hidden', true);
    }
    else if(layerT){
        en = true;
        layerT = false;
        layerD = true;
        centerT = null;
        current_data.type_state = "sub";
        mapLayer.transition()
            .duration(10)
            //.attr("transform", "translate(" + respond_w/2 + "," + respond_h/2 +")scale(" + ik + "," + ik +")"
            //    + "translate(" + -x + "," + -y + ")")
            .attr("transform", "translate(" + map_width/2 + "," + map_height/2 +")scale(" + k + "," + k +")"
                + "translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        dist.selectAll("path")
            .classed("hidden", centerD && function(d) {return nameIdD(d) !== nameIdD(centerD); })
            .style('fill', function(d) {if(centerD && nameIdD(d) == nameIdD(centerD)){return fillT(d);}});
        vll.classed("hidden", true);
    }
    dynamic_shade_by_level();
    setTimeout(enablemouse, 1000);
}
function reset() {
    while (!layerC) { undo(); }
    set_up_bar_content();
}
function undo() {
    //back to country layer
    if(layerC){set_up_bar_content();}
    else if(layerP){zoomed_out(map_width, map_height, 1);}
    //back to province layer
    else if(layerD){zoomed_out(preX, preY, preK);}
    //back to district layer
    else if(layerT){zoomed_out(preXX, preYY, preKK);}
}
function enablemouse() {
    //console.log("enable");
    $("body").css("pointer-events", "auto");
    d3.select("#downloading").style("display", "none");
    et = new Date();
    var ex_time = Math.round((et.getTime() - st.getTime())/1000);
    console.log("Execute time: " + String(ex_time) + " seconds");
}
function disablemouse() {
    //console.log("disable");
    st = new Date();
    $("body").css("pointer-events", "none");
    d3.select("#downloading").style("display", "inline");
}

$('i.icon2').css('font-size', '5rem');