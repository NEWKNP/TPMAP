var index;
for (var i = 0; i <= 10; i++) {
    if (i === 0) {
        SaVaGe.ToggleSwitch({
            container: "#range" + i, width: 40, height: 24, value: true,
            colors: {backLeft:color_map(.2), foreLeft:color_map(.05), backRight:color_map(.2), foreRight:color_map(.9)},
            onChange: sub_switch2
        });
    }
    else {
        SaVaGe.ToggleSwitch({
            container: "#range" + i, width: 40, height: 24, value: true,
            colors: {backRight: color_map(.2), foreRight: color_map(.9)},
            onChange: function (toggler) {
                index = this.container.substr(6,1);
                index = index % 5;
                sub_switch1(toggler, index-1);
            }
        })
    }
}
function expanded() {
    $('.is-expanded').css("display", "flex");
}
function hided() {
    $('.is-expanded').css("display", "none");
}
