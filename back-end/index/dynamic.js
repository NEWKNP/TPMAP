function sub_switch1(toggler, i) {
    if(toggler.getValue()){initial_dimemtion.dimention[i] = '1';}
    else{initial_dimemtion.dimention[i] = '0';}
    new_installazion();
}
function sub_switch2(toggler) {
    if(toggler.getValue()){ initial_dimemtion.states = "poor";}
    else{ initial_dimemtion.states = "rate";}
    re_fill();
}
function changeYear(d) {
    var y_id = this.id;
    initial_dimemtion.years = y_id.substr(3,2);
    new_installazion();
}
function dynamic_shade_by_level() {
    if(current_data.getTypeState() == "province"){
        dynamic_shade_by_state(province_data.getPoor(), province_data.getRate());
    }
    else if(current_data.getTypeState() == "district"){
        dynamic_shade_by_state(amphur_data.getPoor(), amphur_data.getRate());
    }
    else if(current_data.getTypeState() == "sub") {
        dynamic_shade_by_state(tambol_data.getPoor(), tambol_data.getRate());
    }
    //callback(null);
    return "done";
}
function dynamic_shade_by_state(poor, rate) {
    //when sub switch
    if(initial_dimemtion.getState() == "poor"){
        $("#shade-text").text("จำนวนคนจนเป้าหมาย");
        $("#min-shade-text").text(d3.min(poor.values()).toLocaleString());
        $("#max-shade-text").text(d3.max(poor.values()).toLocaleString());
    }
    else{
        $("#shade-text").text("สัดส่วนคนจน (%)");
        $("#min-shade-text").text(control_digit(parseFloat(d3.min(rate.values())), 2));
        $("#max-shade-text").text(control_digit(parseFloat(d3.max(rate.values())), 2));
    }
}