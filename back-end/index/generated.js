function boundaryBox(feature) {
    var bb = [];
    bb.push(d3.min(feature.map(function (d) {return d.geometry.bbox[2] - d.geometry.bbox[0]}))); //xmin
    bb.push(d3.min(feature.map(function (d) {return d.geometry.bbox[3] - d.geometry.bbox[1]}))); //ymin
    bb.push(d3.max(feature.map(function (d) {return d.geometry.bbox[2] - d.geometry.bbox[0]}))); //xmax
    bb.push(d3.max(feature.map(function (d) {return d.geometry.bbox[3] - d.geometry.bbox[1]}))); //ymax
    return bb;
}
function formatData(raw, id) {
    var data, rate, poor;
    data = d3.nest()
        .key(function (k) { return k[id];})
        .rollup(function (v) {return v[0];})
        .map(raw);
    rate = d3.nest()
        .key(function (k) { return k[id];})
        .rollup(function (v) {return Number(v[0]["JPT.MOFval.pov.rate"]);})
        .map(raw);
    poor = d3.nest()
        .key(function (k) { return k[id];})
        .rollup(function (v) {return Number(v[0]["poor.JPT.MOFval.CNT"]);})
        .map(raw);
    return [data,rate,poor];
    //callback(data, rate, poor);
}
function formatCommon(raw, id) {
    var data;
    data = d3.nest()
        .key(function (k) { return k[id];})
        .rollup(function (v) {return v[0];})
        .map(raw);
    return data;
    //callback(data);
}
function fill_generater(id, dataset) {
    var observe, min, max, result;
    observe = dataset.get(id);
    min = d3.min(dataset.values());
    max = d3.max(dataset.values());
    if(observe == 0){ return "grey";}
    result = (observe - min) / (max - min);
    return color_map(1*(result));
}
function fill_map(id, dataset){
    if(initial_dimemtion.getState()=="rate"){return fill_generater(id, dataset.getRate());}
    else{return fill_generater(id, dataset.getPoor());}
}
function spider_country(dataset) {
    var people = dataset.get("poor.JPT.MOFval.CNT");
    /*
    var spider = d3.map()
        .set("health", dataset.get("poor.JPT.MOFval.health")*100/people)
        .set("living", dataset.get("poor.JPT.MOFval.living")*100/people)
        .set("education", dataset.get("poor.JPT.MOFval.education")*100/people)
        .set("income", dataset.get("poor.JPT.MOFval.income")*100/people)
        .set("accessibility", dataset.get("poor.JPT.MOFval.accessibility")*100/people);
    */
    var spider = d3.map()
        .set("health", dataset.get("poor.JPT.MOFval.health")*100/people)
        .set("living", dataset.get("poor.JPT.MOFval.accessibility")*100/people)
        .set("education", dataset.get("poor.JPT.MOFval.income")*100/people)
        .set("income", dataset.get("poor.JPT.MOFval.education")*100/people)
        .set("accessibility", dataset.get("poor.JPT.MOFval.living")*100/people);
    return spider;
}
function spider_generator(dataset) {
    var people = dataset["poor.JPT.MOFval.CNT"];
    /*
    var spider = d3.map()
        .set("health", dataset["poor.JPT.MOFval.health"]*100/people)
        .set("living", dataset["poor.JPT.MOFval.living"]*100/people)
        .set("education", dataset["poor.JPT.MOFval.education"]*100/people)
        .set("income", dataset["poor.JPT.MOFval.income"]*100/people)
        .set("accessibility", dataset["poor.JPT.MOFval.accessibility"]*100/people);
    */
    var spider = d3.map()
        .set("health", dataset["poor.JPT.MOFval.health"]*100/people)
        .set("living", dataset["poor.JPT.MOFval.accessibility"]*100/people)
        .set("education", dataset["poor.JPT.MOFval.income"]*100/people)
        .set("income", dataset["poor.JPT.MOFval.education"]*100/people)
        .set("accessibility", dataset["poor.JPT.MOFval.living"]*100/people);
    return spider;
}
function set_bar_content(current, shape, data, common, five, id) {
    //console.log(current);
    set_next(current, shape, data.get(id), common.get(id),five);
    setTimeout(set_first_layer_text(shape), 200);
    setTimeout(set_second_layer_text(data.get(id)), 150);
    setTimeout(set_radar_chart(five), 150);
}
function control_digit(value, digit){
    value = value.toFixed(digit);
    value = parseFloat(value);
    return value;
}
Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}