let country_data = Object.create(DataSet),
    province_data = Object.create(DataSet),
    amphur_data = Object.create(DataSet),
    tambol_data = Object.create(DataSet),
    village_data = Object.create(DataSet);

function next_bind(level) {
    initial_dimemtion.level = level;
    var get_di = initial_dimemtion.getDi();
    var get_year = initial_dimemtion.getYear();
    var get_level = initial_dimemtion.getLevel();
    var get_province_id = initial_dimemtion.getProvinceID();
    var get_next_csv = function (csvUrl) {
        var defer1 = $.Deferred();
        d3.csv(csvUrl, function (error, rows) {
            if (error) {
                defer1.reject(error);
            }
            defer1.resolve(rows);
        });
        return defer1.promise();
    };
    disablemouse();
    $.when(
        //get_next_csv("../collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+get_level+"_common.csv"),
        //get_next_csv("../collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+get_level+"_"+get_di+".csv")
        get_next_csv("collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+get_level+"_common.csv"),
        get_next_csv("collection/"+get_year+"/"+get_year+"_"+get_province_id+"_"+get_level+"_"+get_di+".csv")
    ).done(function (common,bind) {
        var stat, dy, pack, ini_rate, ini_poor;
        var zoomed = function (x,y,k) {
            var defer2 = $.Deferred();
            var z = zoomed_in(x,y,k);
            defer2.resolve(z);
            return defer2.promise();
        }
        if(initial_dimemtion.getLevel() == "amphur"){
            //console.log("dy amphur");
            stat = formatCommon(common, "amphur_ID");
            pack = formatData(bind, "amphur_ID");
            dy = pack[0];
            ini_rate = pack[1];
            ini_poor = pack[2];
            amphur_data.set_data(stat, dy, ini_rate, ini_poor);
            //console.log(amphur_data);
        }
        else if(initial_dimemtion.getLevel() == "tambol"){
            //console.log("dy tambol");
            stat = formatCommon(common, "tumbol_ID");
            pack = formatData(bind, "tumbol_ID");
            dy = pack[0];
            ini_rate = pack[1];
            ini_poor = pack[2];
            tambol_data.set_data(stat, dy, ini_rate, ini_poor);
        }
        else if(initial_dimemtion.getLevel() == "village"){
            //console.log("dy village");
            stat = formatCommon(common, "village_ID");
            pack = formatData(bind, "village_ID");
            dy = pack[0];
            ini_rate = pack[1];
            ini_poor = pack[2];
            village_data.set_data(stat, dy, ini_rate, ini_poor);
            console.log(village_data);
        }

        $.when(
            zoomed(map_point.getX(), map_point.getY(), map_point.getK())
        ).done(function (rr) {
            enablemouse();
        }).fail(function (err) {
            console.log(err);
        });

    }).fail(function (er) {
        console.log(er);
    });
}
Object.prototype.set_data = function (c, data, rate, poor) {
    this.commons = c;
    this.set_dynamic(data, rate, poor);
};
Object.prototype.set_dynamic = function (data, rate, poor) {
    this.dataitem = data;
    this.rates = rate;
    this.poors = poor;
};