var bar_detail = $('div.bar_detail');
var bar_detail_width = bar_detail.width();
var bar_detail_height = bar_detail.height();
var width_box = 60;
var height_box = 12;
var rtx = (bar_detail_width + bar_detail.innerWidth()-bar_detail.width())/2;
var rty = (bar_detail_height + bar_detail.innerHeight()-bar_detail.height())/2;
var svg_detail = d3.select('.svg-detail')
    .attr("viewBox", [-rtx, -rty, bar_detail_width, bar_detail_height].join(' '))
;
var nextcfg = {
    w: bar_detail_width,
    h: bar_detail_height,
    maxWidth: bar_detail_width,
    maxHeight: bar_detail_height,
    translateX: bar_detail.innerWidth()-bar_detail_width,
    translateY: bar_detail.innerHeight()-bar_detail_height,
    maxValue: 100,
    levels: 6,
    DOM: svg_detail,
    fontSize1: "1.6rem",
    fontSize2: "1.7rem",
};
var use_obj = JSON.parse(localStorage.getItem('maintain'));
var use_five = use_obj.fiveset,
    show_data = use_obj.dataset,
    show_common = use_obj.commonset,
    show_five = d3.map();
var handle_key;
var poor_cnt = additionDynamic(show_data);
var addition_common = additionCommon(show_common);
var indicator_all = addition_common[0];
var indicator_cnt = addition_common[1];
var number_of_people = addition_common[2];
Object.keys(use_five).forEach(function (k) {show_five.set(k, use_five[k]);})
RadarChart.draw("#big-radar", show_five, nextcfg);
if(use_obj.idname.length == 2){
    $('#detail-main-name').text("จ."+use_obj.province_name);
}
else if(use_obj.idname.length == 4){
    $('#detail-main-name').text("จ."+use_obj.province_name+"    อ."+use_obj.district_name);
}
else if(use_obj.idname.length == 6){
    $('#detail-main-name').text("จ."+use_obj.province_name+"    อ."+use_obj.district_name+"    ต."
        +use_obj.tumbol_name);
}
else{
    $('#detail-main-name').text("ประเทศไทย");
}
updateAddition(poor_cnt, indicator_cnt, indicator_all, number_of_people);
function additionDynamic(dy) {
    var poor_cnt = [];
    var index = [1,4,5,7,8,9,10,11,15,16,17,19,20,21,22,27,28];
    if (dy["poor.JPT.MOFval.ind1.CNT"]) {handle_key = "";}
    else {handle_key = "$";}
    for(var i = 0; i < index.length; i++) {
        poor_cnt.push(Number(dy[handle_key + "poor.JPT.MOFval.ind" + index[i] + ".CNT"]));
    }
    return poor_cnt;
}
function additionCommon(common) {
    var all = [], cnt = [];
    var index = [1,4,5,7,8,9,10,11,15,16,17,19,20,21,22,27,28];
    if (common["HOUSEMEMBER_CNT"]) {handle_key = "";}
    else {handle_key = "$";}
    for(var i = 0; i < index.length; i++) {
        all.push(Number(common[handle_key + "indicator" + index[i] + ".ALL"]));
        cnt.push(Number(common[handle_key + "indicator" + index[i] + ".CNT"]));
    }
    return [all, cnt, common[handle_key + "HOUSEMEMBER_CNT"]];
}
function updateAddition(dy_cnt, cnt, all, n) {
    var poor_width, cnt_width, all_width;
    $("#detail-cnt-value").text(Number(show_common[handle_key+"HOUSEMEMBER_CNT"]).toLocaleString());
    $("#detail-poor-value").text(Number(show_data[handle_key+"poor.JPT.MOFval.CNT"]).toLocaleString());
    $("#detail-rate-value").text(control_digit(parseFloat(show_data[handle_key+"JPT.MOFval.pov.rate"]), 2)+"%");
    $('#health-value').text(control_digit(parseFloat(Object.values(use_five)[0]), 2)+"%");
    $('#health-cnt').text(Number(show_data[handle_key+"poor.JPT.MOFval.health"]).toLocaleString());
    $('#living-value').text(control_digit(parseFloat(Object.values(use_five)[4]), 2)+"%");
    $('#living-cnt').text(Number(show_data[handle_key+"poor.JPT.MOFval.living"]).toLocaleString());
    $('#education-value').text(control_digit(parseFloat(Object.values(use_five)[3]), 2)+"%");
    $('#education-cnt').text(Number(show_data[handle_key+"poor.JPT.MOFval.education"]).toLocaleString());
    $('#income-value').text(control_digit(parseFloat(Object.values(use_five)[2]), 2)+"%");
    $('#income-cnt').text(Number(show_data[handle_key+"poor.JPT.MOFval.income"]).toLocaleString());
    $('#accessibility-value').text(control_digit(parseFloat(Object.values(use_five)[1]), 2)+"%");
    $('#accessibility-cnt').text(Number(show_data[handle_key+"poor.JPT.MOFval.accessibility"]).toLocaleString());
    for(var a=1; a<=17; a++){
        $('#a'+a).text(dy_cnt[a-1].toLocaleString());
        $('#b'+a).text(cnt[a-1].toLocaleString());
        poor_width = dy_cnt[a-1]/d3.max(cnt);
        cnt_width = cnt[a-1]/d3.max(cnt);
        //all_width = all[a-1]/n;
        //gray
        d3.select("#svg-box"+a)
            .attr("width", width_box)
            .attr("height", height_box)
            .append("rect")
                .attr("class", "outer_box")
                .attr("width", width_box)
                .attr("height", height_box);
        //purple
        d3.select("#svg-box"+a)
            .append("rect")
            .attr("class", "cnt")
            .attr("width", cnt_width*width_box)
            .attr("height", height_box);
            /*.append("svg:title")
            .text(cnt[a-1].toLocaleString()+" คน");*/
        //orange
        d3.select("#svg-box"+a)
            .append("rect")
                .attr("class", "poor_cnt")
                .attr("x", poor_width*width_box-3)
                .attr("width", 3)
                .attr("height", height_box);
            /*.append("svg:title")
                .text(dy_cnt[a-1].toLocaleString()+" คน");*/
        /*
        d3.select("#svg-box"+a)
            .append("rect")
                .attr("class", "all")
                .attr("x", all_width*width_box*.9)
                .attr("width", width_box*.1)
                .attr("height", height_box)
            .append("svg:title")
                .text(all[a-1].toLocaleString()+" คน");
        */
    }
}
function backToPrevious() {
    window.history.back();
}