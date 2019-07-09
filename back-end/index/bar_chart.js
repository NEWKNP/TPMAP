var bar_content = $('div.bar_content');
var bar_content_width = bar_content.width();
var radar_length = bar_content.height()*.5;
var tx = (bar_content_width + bar_content.innerWidth()-bar_content.width())/2;
var ty = (radar_length + bar_content.innerHeight()-bar_content.height())/2;
var svg_bar = d3.select('.svg-bar')
    .attr("viewBox", [-tx, -ty, bar_content_width, radar_length].join(' '))
;
var mycfg = {
    w: bar_content_width,
    h: radar_length,
    translateX: bar_content.innerWidth()-bar_content.width(),
    translateY: bar_content.innerHeight()-bar_content.height(),
    maxValue: 0.6,
    levels: 6,
};
function set_up_bar_content() {
    //console.log("3. bar chart");
    var country = country_data.getData();
    d3.select("#province-text")
        .style("font-size", "2vw")
        .text("ประเทศไทย");
    d3.select("#province-value").classed('hidden', true);
    d3.select("#district-text").classed('hidden', true);
    d3.select("#district-value").classed('hidden', true);
    d3.select("#tumbon-text").classed('hidden', true);
    d3.select("#tumbon-value").classed('hidden', true);
    $("#rate-value").text(control_digit(parseFloat(country.get("JPT.MOFval.pov.rate")), 3));
    $("#poor-value").text(Number(country.get("poor.JPT.MOFval.CNT")).toLocaleString());
    mycfg.maxValue = 100;
    mycfg.DOM = svg_bar;
    RadarChart.draw("#radar", spider_country(country), mycfg);
    set_next("country", "Thailand", country_data.getData(), country_data.getCommon(),
        spider_country(country));
    //callback(null);
    //console.log("3. done");
}
function set_first_layer_text(map_object) {
    if(nameTHT(map_object) != null){
        d3.select("#province-text")
            .classed('hidden', false)
            .style("font-size", "1vw")
            .text("ชื่อจังหวัด");
        d3.select("#province-value").classed('hidden', false);
        d3.select("#district-text").classed('hidden', false);
        d3.select("#district-value").classed('hidden', false);
        d3.select("#tumbon-text").classed('hidden', false);
        d3.select("#tumbon-value").classed('hidden', false);
        $("#tumbon-value").text(nameTHT(map_object));
    }
    else if(nameTHD(map_object) != null){
        d3.select("#province-text")
            .classed('hidden', false)
            .style("font-size", "1vw")
            .text("ชื่อจังหวัด");
        d3.select("#province-value").classed('hidden', false);
        d3.select("#district-text").classed('hidden', false);
        d3.select("#district-value").classed('hidden', false);
        d3.select("#tumbon-text").classed('hidden', true);
        d3.select("#tumbon-value").classed('hidden', true);
        $("#district-value").text(nameTHD(map_object));
    }
    else if(nameTHP(map_object) != null){
        d3.select("#province-text")
            .classed('hidden', false)
            .style("font-size", "1vw")
            .text("ชื่อจังหวัด");
        d3.select("#province-value").classed('hidden', false);
        d3.select("#district-text").classed('hidden', true);
        d3.select("#district-value").classed('hidden', true);
        d3.select("#tumbon-text").classed('hidden', true);
        d3.select("#tumbon-value").classed('hidden', true);
        $("#province-value").text(nameTHP(map_object));
    }
    else{
        d3.select("#province-value").classed('hidden', true);
        d3.select("#province-text")
            .style("font-size", "2vw")
            .text("ประเทศไทย");
        $("#rate-value").text(control_digit(parseFloat(country_data.getRate()), 2));
        $("#poor-value").text(country_data.getRate().toLocaleString());
    }
}
function set_second_layer_text(data) {
    var rate = data["JPT.MOFval.pov.rate"];
    $("#rate-value").text(control_digit(parseFloat(rate), 2));
    $("#poor-value").text(Number(data["poor.JPT.MOFval.CNT"]).toLocaleString());
}
function set_radar_chart(five){
    var re_bar_content = $('div.bar_content');
    mycfg.maxValue = 100;
    mycfg.DOM = svg_bar;
    mycfg.w = re_bar_content.width();
    mycfg.h = re_bar_content.height()*.5;
    mycfg.translateX = re_bar_content.innerWidth()-re_bar_content.width();
    mycfg.translateY = re_bar_content.innerHeight()-re_bar_content.height();
    RadarChart.draw("#radar", five, mycfg);
}
function another_page() {
    var next_window = window.open("next.html", "_self");
}