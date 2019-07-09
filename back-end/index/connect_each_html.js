function set_next(type, shape, data, common, five) {
    current_data.type_holding = type;
    if(shape == "Thailand"){
        current_data.province_name = shape
        current_data.idname = shape
    }
    else{
        current_data.province_name = nameTHP(shape);
        current_data.district_name = nameTHD(shape);
        current_data.tumbol_name = nameTHT(shape);
        if(type == "province"){current_data.idname = nameIdP(shape);}
        else if(type == "district"){current_data.idname = nameIdD(shape);}
        else if(type == "sub"){current_data.idname = nameIdT(shape);}
    }
    current_data.shape = shape;
    current_data.dataset = data;
    current_data.commonset = common;
    current_data.fiveset = five;
    localStorage.setItem("maintain", JSON.stringify(current_data));
}