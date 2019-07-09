let initial_dimemtion = Object.create(Dimention);
let current_data = Object.create(Current);
var first = true;
var getCsv = function (csvUrl) {
    var defer1 = $.Deferred();
    d3.csv(csvUrl, function (error, rows) {
        if (error) {
            defer1.reject(error);
        }
        defer1.resolve(rows);
    });
    return defer1.promise();
};
var getShp = function (shpUrl) {
    var defer2 = $.Deferred();
    shp(shpUrl).then(function (geojson) {
        defer2.resolve(geojson);
    });
    return defer2.promise();
};
installazion();

function installazion() {
    var get_di,get_year;
    get_di = initial_dimemtion.getDi();
    get_year = initial_dimemtion.getYear();

    disablemouse();

    $.when(
        //getCsv("../collection/"+get_year+"/"+get_year+"_country_common.csv"),
        //getCsv("../collection/"+get_year+"/"+get_year+"_country_"+get_di+".csv"),
        //getCsv("../collection/"+get_year+"/"+get_year+"_province_common.csv"),
        //getCsv("../collection/"+get_year+"/"+get_year+"_province_"+get_di+".csv"),
        //getShp("../shape/prov"),                                                // please pass csv url as you like
        //getShp("../shape/dist"),                                                // please pass csv url as you like
        //getShp("../shape/tumbon"),                                              // please pass csv url as you like
        //getShp("../village/village")                                            // please pass csv url as you like
        getCsv("collection/"+get_year+"/"+get_year+"_country_common.csv"),    // please pass csv url as you like
        getCsv("collection/"+get_year+"/"+get_year+"_country_"+get_di+".csv"),  // please pass csv url as you like
        getCsv("collection/"+get_year+"/"+get_year+"_province_common.csv"),     // please pass csv url as you like
        getCsv("collection/"+get_year+"/"+get_year+"_province_"+get_di+".csv"), // please pass csv url as you like
        getShp("shape/prov"),                                                   // please pass csv url as you like
        getShp("shape/dist"),                                                   // please pass csv url as you like
        getShp("shape/tumbon"),                                                 // please pass csv url as you like
        getShp("village/village")                                               // please pass csv url as you like
    ).done(function (res1, res2, res3, res4, res5, res6, res7, res8) {
        initial_dimemtion.level = "province";
        var formatC = function(common,id){
            var defer3 = $.Deferred();
            var rs1 = formatCommon(common,id);
            defer3.resolve(rs1);
            return defer3.promise();
        };
        var formatD = function(common,id){
            var defer4 = $.Deferred();
            var rs2 = formatData(common,id);
            defer4.resolve(rs2);
            return defer4.promise();
        };
        country_data.set_data(d3.map(res1[0]), d3.map(res2[0]));
        setTimeout(set_up_bar_content,100);

        $.when(
            formatC(res3, "province_ID"),
            formatD(res4, "province_ID")
        ).done(function (rr1,rr2) {
            province_data.set_data(rr1, rr2[0], rr2[1], rr2[2]);
            var placeC = function(j){
                var defer5 = $.Deferred();
                var rs3 = place_country(j);
                defer5.resolve(rs3);
                return defer5.promise();
            };
            var placeP = function(j){
                var defer6 = $.Deferred();
                var rs4 = place_province(j);
                defer6.resolve(rs4);
                return defer6.promise();
            };
            var placeD = function(j){
                var defer7 = $.Deferred();
                var rs5 = place_district(j);
                defer7.resolve(rs5);
                return defer7.promise();
            };
            var placeV = function(j){
                var defer8 = $.Deferred();
                var rs6 = place_village(j);
                defer8.resolve(rs6);
                return defer8.promise();
            };
            var dysd = function(){
                var defer8 = $.Deferred();
                var rs6 = dynamic_shade_by_level();
                defer8.resolve(rs6);
                return defer8.promise();
            };
            $.when(
                placeC(res5),
                placeP(res6),
                placeD(res7),
                placeV(res8),
                dysd(),
            ).done(function (rrr1,rrr2,rrr3,rrr4,rrr5) {
                enablemouse();
            }).fail(function (err) {
                console.log(err);
            });

        }).fail(function (er) {
            console.log(er);
        });

    }).fail(function (e) {
        console.log(e);
    });
}
function new_installazion() {
    var get_di = initial_dimemtion.getDi();
    var get_year = initial_dimemtion.getYear();
    var level = initial_dimemtion.getLevel();;
    var get_province_id = initial_dimemtion.getProvinceID();
    var next_fill = function(){
        var defer = $.Deferred();
        var rs = newFill();
        defer.resolve(rs);
        return defer.promise();
    }
    var pack;
    disablemouse();
    if(level == "country" || level == "province"){
        if(first){initial_dimemtion.level = "country";}
        $.when(
            //getCsv("../collection/"+get_year+"/"+get_year+"_country_"+get_di+".csv"),
            //getCsv("../collection/"+get_year+"/"+get_year+"_province_"+get_di+".csv")
            getCsv("collection/"+get_year+"/"+get_year+"_country_"+get_di+".csv"),
            getCsv("collection/"+get_year+"/"+get_year+"_province_"+get_di+".csv")
        ).done(function (resp1,resp2) {
            country_data.set_dynamic(d3.map(resp1[0]));
            pack = formatData(resp2, "province_ID");
            province_data.set_dynamic(pack[0],pack[1],pack[2]);

            $.when(
                next_fill()
            ).done(function (fill) {
                re_installazion();
            }).fail(function (err) {
                console.log(err);
            })
        }).fail(function (er) {
            console.log(er);
        });
    }
    else{
        $.when(
            //getCsv("../collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+level+"_"+get_di+".csv"),
            getCsv("collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+level+"_"+get_di+".csv"),
        ).done(function (resp) {
            var zoomed = function (x,y,k) {
                var defer2 = $.Deferred();
                var z = zoomed_in(x,y,k);
                defer2.resolve(z);
                return defer2.promise();
            }
            if(level == "amphur"){
                pack = formatData(resp, "amphur_ID");
                amphur_data.set_dynamic(pack[0],pack[1],pack[2]);
            }
            else if(level == "tambol"){
                pack = formatData(resp, "tumbol_ID");
                tambol_data.set_dynamic(pack[0],pack[1],pack[2]);
            }
            else if(level == "village"){
                pack = formatData(resp, "village_ID");
                village_data.set_dynamic(pack[0],pack[1],pack[2]);
            }
            /*
            $.when(
                zoomed(map_point.getX(), map_point.getY(), map_point.getK())
            ).done(function (zoom) {
                re_installazion();
            }).fail(function (err) {
                console.log(err);
            })
            */
            re_installazion();
        }).fail(function (er) {
            console.log(er);
        });
    }
}
function re_installazion() {
    var d = current_data.getShape();
    var hold = current_data.getTypeHolding();
    if (hold == "country") {
        set_up_bar_content();
    }
    else if (hold == "province" && province_data.getData().has(nameIdP(d))) {
        set_bar_content(hold, d, province_data.getData(), province_data.getCommon(),
            spider_generator(province_data.getData().get(nameIdP(d))), nameIdP(d));
    }
    else if (hold == "district") {
        set_bar_content(hold, d, amphur_data.getData(), amphur_data.getCommon(),
            spider_generator(amphur_data.getData().get(nameIdD(d))), nameIdD(d));
    }
    else if (hold == "sub") {
        set_bar_content(hold, d, tambol_data.getData(), tambol_data.getCommon(),
            spider_generator(tambol_data.getData().get(nameIdT(d))), nameIdT(d));
    }
    setTimeout(dynamic_shade_by_level, 150);
    setTimeout(enablemouse, 150);
}
function re_fill() {
    disablemouse();
    var next_fill = function(){
        var defer = $.Deferred();
        var rs = newFill();
        defer.resolve(rs);
        return defer.promise();
    }
    $.when(
        next_fill()
    ).done(function (fill) {
        dynamic_shade_by_level();
        setTimeout(enablemouse, 150);
    }).fail(function (err) {
        console.log(err);
    })
}