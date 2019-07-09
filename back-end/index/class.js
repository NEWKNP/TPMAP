let Dimention = {
    dimention: ["1", "1", "1", "1", "1"],
    years: "61",
    states: "poor",
    level: "country",
    province_id: "",
    getDi: function () {
        return this.dimention[0]+this.dimention[1]+this.dimention[2]+this.dimention[3]+this.dimention[4];
    },
    getYear: function (){ return this.years;},
    getState: function (){ return this.states;},
    getLevel: function (){ return this.level;},
    getProvinceID: function (){ return this.province_id;}
};
let DataSet = {
    dataitem: d3.map(),
    commons: d3.map(),
    rates: [],
    poors: [],
    getData: function () { return this.dataitem;},
    getCommon: function () { return this.commons;},
    getRate: function () { return this.rates;},
    getPoor: function () { return this.poors;},
};
let Current = {
    type_holding: "country",
    type_state: "province",
    province_name: "province name",
    district_name: "district name",
    tumbol_name: "tumbol name",
    idname: "000000",
    dataset: d3.map(),
    commonset: d3.map(),
    fiveset: d3.map(),
    shape: d3.map(),
    getTypeHolding: function () { return this.type_holding;},
    getTypeState: function () { return this.type_state;},
    getNameP: function () { return this.province_name;},
    getNameD: function () { return this.district_name;},
    getNameT: function () { return this.tumbol_name;},
    getID: function () { return this.idname;},
    getFiveCurrent: function (){ return this.fiveset;},
    getDataCurrent: function (){ return this.dataset;},
    getCommon: function (){ return this.commonset;},
    getShape: function (){ return this.shape;}
};
let Point = {
    x: 0,
    y: 0,
    k: 0,
    getX: function () { return this.x;},
    getY: function () { return this.y;},
    getK: function () { return this.k;}
}