// Helpers

function svgEl(id) { 
    return document.getElementById('obj').contentDocument.getElementById(id);
}
function svgdEl(id) {
    return document.getElementById('obj_2').contentDocument.getElementById(id);
}

function htmlEl(id) {
    return document.getElementById(id);
}

function htmlElsEna(name, ena) {
    document.getElementsByName(name).forEach(function(el) {
        el.disabled = !ena;
    });
}

function pinModesEls(prefix, func) {
    document.querySelectorAll('[id^=' + prefix + '_]').forEach(function(el) { if (!el.id.match("param")) func(el); });
}

function copyText(text) {
    var dummy = document.createElement('textarea');

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

// Saving settings

var params = {};
function updateSettings() {
    window.history.replaceState(null, null, 
        window.location.href.split('?')[0] + 
        '?' + 
        Object.keys(params).map(function(key) { return key + '=' + params[key]; }).join('&')
    );
}

function updateSetting(pin, group, mode) {
    // save pin mode
    params[pin] = mode;
    
    // delete old pin mode parameters
    Object.keys(params).map(function(key) {
        if (key.match("^" + pin + "_.*_param_.*$"))
            delete params[key];
    });
    // save pin mode parameters
    paramObjs = document.querySelectorAll('[id^=' + pin + '_' + mode + '_param_]');
    Object.keys(paramObjs).map(function(index) {
        if (typeof index !== "number") return;
        params[paramObjs[index].id] = paramObjs[index].value;
    });
    
    updateSettings();
}

htmlEl('resetConfig').onclick = function() {
    if (confirm('Are you sure to clear the configuration?')) window.location.href = window.location.href.split('?')[0];
};

htmlEl('copyURL').onclick = function() {
    copyText(window.location.href);
};

htmlEl('copyCode').onclick = function() {
    copyText(htmlEl('code').textContent);
};

function setPinSettings(pin, group, type) {
    if (!pins[pin]) pins[pin] = {};
    
    if (type !== undefined && type !== null) {
        pins[pin].type = type;
    }
    
    paramObjs = document.querySelectorAll('[id^=' + group + '_param_]');
    pins[pin].params = {};
    Object.keys(paramObjs).map(function(index) {
        if (parseInt(index) != index) return; // unstrict == to allow "number"
        pins[pin].params[paramObjs[index].id.replace(/^(.*)_param_/,"")] = paramObjs[index].value;
    });
}

function updateParams() {
    var reg = this.id.match(/^((pin([^_]+))_(.*))_param_.*$/);
    if (!reg || reg.length < 3) return;

    var group = reg[1],
        pin = reg[2],
        pinNum = reg[3],
        mode = reg[4];
    
    setPinSettings(pinNum, group, null);
    updateSetting(pin, group, mode);
    updateParamsUI(pin, group);
    updateCode();
    svgdGen();
}

function updateParamsUI(pin, group) {
    if (htmlEl('settings_' + pin)) {
        htmlEl('settings_' + pin).querySelectorAll('[id*=_params]').forEach(function(el) { el.style.display = "none"; });
    }
    if (htmlEl(group + '_params')) {
        htmlEl(group + '_params').querySelectorAll('[id^=' + group + '_param_]').forEach(function(el) {
            if (el.value === undefined || el.value === "") {
                el.value = defaultParams[el.id];
                el.onchange();
            }
        });
        htmlEl(group + '_params').style.display = "block";
        htmlEl(group + '_params').querySelectorAll('[id^=' + group + '_param_]').forEach(function(el) {
            if (el.getAttribute('depend')) {
                var hide = 1;
                el.getAttribute('depend').split(',').forEach(function(dep) {
                    if (htmlEl(dep.split('=')[0]).value === dep.split('=')[1]) {
                        hide = 0;
                    }
                });
                el.style.display = hide ? 'none' : 'inline';
            }
        });
    }
}

// Jumpers

function jumersADC() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "i_3" || mode === "o_3" || mode === "ADC_i_3") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgEl('direction_' + pin + '_i').style.opacity = (mode === "o_3") ? 0 : 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_3") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_3") ? 0 : 1;


        svgdEl('jumper_' + pin + '_io_3').style.fillOpacity = 1;
        svgdEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgdEl('direction_' + pin + '_i').style.opacity = (mode === "o_3") ? 0 : 1;
        svgdEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_3") ? 1 : 0;
        svgdEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_3") ? 0 : 1;
    } else if (mode === "ADC_i_5" || mode === "i_5") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_5") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_5") ? 0 : 1;

        svgdEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5').style.fillOpacity = 1;
        svgdEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_5") ? 1 : 0;
        svgdEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_5") ? 0 : 1;
    } else if (mode === "ADC_i_12" || mode === "i_12") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_12") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_12") ? 0 : 1;

        svgdEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_12').style.fillOpacity = 1;
        svgdEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_12") ? 1 : 0;
        svgdEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_12") ? 0 : 1;
    } else if (mode === "NC") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('type_' + pin + '_analog').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgdEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgdEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('type_' + pin + '_analog').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
    }
    
    if (pin === 'pin3') {
        htmlElsEna('pin3pwm', mode === "NC");
        htmlEl('pin3pwm_disabled').style.display = mode === "NC" ? 'none': 'block';
    }
    
    if (mode === "i_3" || mode === "i_5" || mode === "i_12") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "ADC_i_3" || mode === "ADC_i_5" || mode === "ADC_i_12") {
        setPinSettings(pinNum, group, "SensorMultilevel");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

function jumersPWM() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
        
    if (mode === "o") {
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;

        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_pwm').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
    } else if (mode === "PWM") {
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_pwm').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_pwm').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
    }
    
    if (mode === "o") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "PWM") {
        setPinSettings(pinNum, group, "SwitchMultilevel");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

function jumersPWM0() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "PWM") {
        svgEl('jumper_' + pin).style.fillOpacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 1;
        htmlElsEna('pin3', false);
        htmlEl('pin3_disabled').style.display = 'block';

        svgdEl('jumper_' + pin).style.fillOpacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_pwm').style.opacity = 1;
        svgdEl('layer11').style.display = 'block';
    } else if (mode === "NC") {
        svgEl('jumper_' + pin).style.fillOpacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        htmlElsEna('pin3', true);
        htmlEl('pin3_disabled').style.display = 'none';

        svgdEl('jumper_' + pin).style.fillOpacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_pwm').style.opacity = 0;
        svgdEl('layer11').style.display = 'none';
    }
    
    if (mode === "PWM") {
        setPinSettings(pinNum === "3pwm" ? "3" : pinNum, group, "SwitchMultilevelPWM0");
    } else {
        setPinSettings(pinNum === "3pwm" ? "3" : pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

function jumersGPIO() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "o_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "i_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "dht") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 1;

        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 1;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "dht") {
        setPinSettings(pinNum, group, "DHT");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

function jumersOneWire() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "o_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
        svgdEl('type_' + pin + '_onewire').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "i_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
        svgdEl('type_' + pin + '_onewire').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "dht") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 1;

        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
        svgdEl('type_' + pin + '_onewire').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 1;
    } else if (mode === "onewire") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 1;
        svgdEl('direction_' + pin + '_o').style.opacity = 1;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
        svgdEl('type_' + pin + '_onewire').style.opacity = 1;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;

        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;
        svgdEl('type_' + pin + '_onewire').style.opacity = 0;
        svgdEl('type_' + pin + '_dht').style.opacity = 0;
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "dht") {
        setPinSettings(pinNum, group, "DHT");
    } else if (mode === "onewire") {
        setPinSettings(pinNum, group, "DS18B20");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

function jumersUART() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    console.log(reg);

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "UART") {
        svgEl('jumper_RX_UART').style.opacity = 1;
        svgEl('jumper_TX_UART').style.opacity = 1;
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgEl('direction_pin7_o').style.opacity = 1;
        svgEl('direction_pin7_i').style.opacity = 0;
        svgEl('direction_pin8_o').style.opacity = 0;
        svgEl('direction_pin8_i').style.opacity = 1;
        svgEl('type_pin7_uart').style.opacity = 1;
        svgEl('type_pin8_uart').style.opacity = 1;
        svgEl('type_pin7_rs485').style.opacity = 0;
        svgEl('type_pin8_rs485').style.opacity = 0;
        svgEl('type_pin7_digital').style.opacity = 0;
        svgEl('type_pin8_digital').style.opacity = 0;

        svgdEl('jumper_RX_UART').style.opacity = 1;
        svgdEl('jumper_TX_UART').style.opacity = 1;
        svgdEl('jumper_RX_RS485').style.opacity = 0;
        svgdEl('jumper_TX_RS485').style.opacity = 0;
        svgdEl('jumper_RS485_A').style.fillOpacity = 0;
        svgdEl('jumper_RS485_B').style.fillOpacity = 0;
        svgdEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgdEl('direction_pin7_o').style.opacity = 1;
        svgdEl('direction_pin7_i').style.opacity = 0;
        svgdEl('direction_pin8_o').style.opacity = 0;
        svgdEl('direction_pin8_i').style.opacity = 1;
        svgdEl('type_pin7_uart').style.opacity = 1;
        svgdEl('type_pin8_uart').style.opacity = 1;
        svgdEl('type_pin7_rs485').style.opacity = 0;
        svgdEl('type_pin8_rs485').style.opacity = 0;
        svgdEl('type_pin7_digital').style.opacity = 0;
        svgdEl('type_pin8_digital').style.opacity = 0;
        if (pin === 'pin7' && (!htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_UART').click();
        }
        if (pin === 'pin8' && (!htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_UART').click();
        }
    } else if (mode === "RS485") {
        svgEl('jumper_RX_UART').style.opacity = 0;
        svgEl('jumper_TX_UART').style.opacity = 0;
        svgEl('jumper_RX_RS485').style.opacity = 1;
        svgEl('jumper_TX_RS485').style.opacity = 1;
        svgEl('jumper_RS485_A').style.fillOpacity = 1;
        svgEl('jumper_RS485_B').style.fillOpacity = 1;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 1;
        svgEl('direction_pin7_o').style.opacity = 1;
        svgEl('direction_pin7_i').style.opacity = 1;
        svgEl('direction_pin8_o').style.opacity = 1;
        svgEl('direction_pin8_i').style.opacity = 1;
        svgEl('type_pin7_uart').style.opacity = 0;
        svgEl('type_pin8_uart').style.opacity = 0;
        svgEl('type_pin7_rs485').style.opacity = 1;
        svgEl('type_pin8_rs485').style.opacity = 1;
        svgEl('type_pin7_digital').style.opacity = 0;
        svgEl('type_pin8_digital').style.opacity = 0;

        svgdEl('jumper_RX_UART').style.opacity = 0;
        svgdEl('jumper_TX_UART').style.opacity = 0;
        svgdEl('jumper_RX_RS485').style.opacity = 1;
        svgdEl('jumper_TX_RS485').style.opacity = 1;
        svgdEl('jumper_RS485_A').style.fillOpacity = 1;
        svgdEl('jumper_RS485_B').style.fillOpacity = 1;
        svgdEl('jumper_CTRL_RS485').style.fillOpacity = 1;
        svgdEl('direction_pin7_o').style.opacity = 1;
        svgdEl('direction_pin7_i').style.opacity = 1;
        svgdEl('direction_pin8_o').style.opacity = 1;
        svgdEl('direction_pin8_i').style.opacity = 1;
        svgdEl('type_pin7_uart').style.opacity = 0;
        svgdEl('type_pin8_uart').style.opacity = 0;
        svgdEl('type_pin7_rs485').style.opacity = 1;
        svgdEl('type_pin8_rs485').style.opacity = 1;
        svgdEl('type_pin7_digital').style.opacity = 0;
        svgdEl('type_pin8_digital').style.opacity = 0;
        if (pin === 'pin7' && (!htmlEl('pin8_RS485').checked)) {
            htmlEl('pin8_RS485').click();
        }
        if (pin === 'pin8' && (!htmlEl('pin7_RS485').checked)) {
            htmlEl('pin7_RS485').click();
        }
    } else if (mode === "i_3" || mode === "o_3") {
        if (pin === 'pin8') {
            svgEl('jumper_RX_UART').style.opacity = 1;
            svgdEl('jumper_RX_UART').style.opacity = 1;
        }
        if (pin === 'pin7') {
            svgEl('jumper_TX_UART').style.opacity = 1;
            svgdEl('jumper_TX_UART').style.opacity = 1;
        }
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = (mode === "i_3") ? 1 : 0;
        svgEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgEl('type_' + pin + '_uart').style.opacity = 0;
        svgEl('type_' + pin + '_rs485').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;

        svgdEl('jumper_RX_RS485').style.opacity = 0;
        svgdEl('jumper_TX_RS485').style.opacity = 0;
        svgdEl('jumper_RS485_A').style.fillOpacity = 0;
        svgdEl('jumper_RS485_B').style.fillOpacity = 0;
        svgdEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgdEl('direction_' + pin + '_i').style.opacity = (mode === "i_3") ? 1 : 0;
        svgdEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgdEl('type_' + pin + '_uart').style.opacity = 0;
        svgdEl('type_' + pin + '_rs485').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 1;
        if (pin === 'pin7' && (htmlEl('pin8_RS485').checked || htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_NC').click();
        }
        if (pin === 'pin8' && (htmlEl('pin7_RS485').checked || htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_NC').click();
        }
    } else if (mode === "NC") {
        if (pin === 'pin8') {
            svgEl('jumper_RX_UART').style.opacity = 0;
            svgdEl('jumper_RX_UART').style.opacity = 0;
        }
        if (pin === 'pin7') {
            svgEl('jumper_TX_UART').style.opacity = 0;
            svgdEl('jumper_TX_UART').style.opacity = 0;
        }
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_uart').style.opacity = 0;
        svgEl('type_' + pin + '_rs485').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgdEl('jumper_RX_RS485').style.opacity = 0;
        svgdEl('jumper_TX_RS485').style.opacity = 0;
        svgdEl('jumper_RS485_A').style.fillOpacity = 0;
        svgdEl('jumper_RS485_B').style.fillOpacity = 0;
        svgdEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        svgdEl('direction_' + pin + '_i').style.opacity = 0;
        svgdEl('direction_' + pin + '_o').style.opacity = 0;
        svgdEl('type_' + pin + '_uart').style.opacity = 0;
        svgdEl('type_' + pin + '_rs485').style.opacity = 0;
        svgdEl('type_' + pin + '_digital').style.opacity = 0;

        if (pin === 'pin7' && (htmlEl('pin8_RS485').checked || htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_NC').click();
        }
        if (pin === 'pin8' && (htmlEl('pin7_RS485').checked || htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_NC').click();
        }
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "UART") {
        setPinSettings(pinNum, group, "UART");
    } else if (mode === "RS485") {
        setPinSettings(pinNum, group, "RS485");
    } else {
        setPinSettings(pinNum, group, "NC");
    }

    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
    svgdGen();
}

// Prototypes

if (!NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;

// Attach handlers

for (var n = 3; n <= 6; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersADC; });
for (var n = 7; n <= 8; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersUART; });
for (var n = 13; n <= 16; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersPWM; });
pinModesEls('pin3pwm', function(el) { el.onclick = jumersPWM0; });
pinModesEls('pin11', function(el) { el.onclick = jumersOneWire; });
pinModesEls('pin12', function(el) { el.onclick = jumersGPIO; });

document.querySelectorAll('[id*=_param_]').forEach(function(el) { el.onchange = updateParams; });

function loadConfiguration() {
    if (window.location.href.split('?')[1]) {
        window.location.href.split('?')[1].split('&').forEach(function(el) {
            var radio = htmlEl(el.replace('=', '_')),
                param = htmlEl(el.split('=')[0]),
                paramVal = el.split('=')[1];
            
            if (radio && radio.type === "radio") {
                // enable element to click on it and disable back if needed
                var dis = radio.disabled;
                radio.disabled = false;
                radio.click();
                radio.disabled = dis;
            } else if (param && (param.type === "select-one" || param.type === "text")) {
                param.value = paramVal;
                param.onchange();
            }
        });
    } else {
        // All NC
        
        for (var n = 3; n <= 6; n++) {
            htmlEl('pin' + n + '_NC').click();
        }
        
        for (var n = 13; n <= 16; n++) {
            htmlEl('pin' + n + '_NC').click();
        }
        
        htmlEl('pin3pwm_NC').click();
        
        htmlEl('pin7_NC').click();
        htmlEl('pin8_NC').click();
        
        htmlEl('pin11_NC').click();
        htmlEl('pin12_NC').click();
    }
}

// Default

// TODO: Think about onload event
htmlEl('obj_2').onload = function() {
    ['pin3pwm', 'pin3', 'pin4', 'pin5', 'pin6', 'pin7', 'pin8', 'pin11', 'pin12', 'pin13', 'pin14', 'pin15', 'pin16'].forEach(function(pin) {
        htmlEl('settings_' + pin).onmouseover = function() {
            svgEl('connector_' + pin).style.fill = 'yellow';
            svgdEl('connector_' + pin).style.fill = 'yellow';
        };
        htmlEl('settings_' + pin).onmouseout = function() {
            svgEl('connector_' + pin).style.fill = '#358800';
            svgdEl('connector_' + pin).style.fill = '#358800';
        };
    });
    
    document.getElementsByClassName('zoom_svg')[0].onclick = function() {
        var flex = parseFloat(this.parentNode.style.flexGrow);
        if (!flex) flex = 1;
        
        if (flex < 1.9) flex += 0.3;
        else flex = 1;
        
        this.parentNode.style.flexGrow = flex;
    };
    
    loadConfiguration();
};

// Default params

defaultParams = {
    'pin11_onewire_param_1': '1',

    'pin11_dht_param_1': 'DHT11',
    'pin12_dht_param_1': 'DHT11',

    'pin3_ADC_i_3_param_1': '0',
    'pin3_ADC_i_3_param_2': '100',
    'pin3_ADC_i_5_param_1': '0',
    'pin3_ADC_i_5_param_2': '100',
    'pin3_ADC_i_12_param_1': '0',
    'pin3_ADC_i_12_param_2': '100',

    'pin4_ADC_i_3_param_1': '0',
    'pin4_ADC_i_3_param_2': '100',
    'pin4_ADC_i_5_param_1': '0',
    'pin4_ADC_i_5_param_2': '100',
    'pin4_ADC_i_12_param_1': '0',
    'pin4_ADC_i_12_param_2': '100',

    'pin5_ADC_i_3_param_1': '0',
    'pin5_ADC_i_3_param_2': '100',
    'pin5_ADC_i_5_param_1': '0',
    'pin5_ADC_i_5_param_2': '100',
    'pin5_ADC_i_12_param_1': '0',
    'pin5_ADC_i_12_param_2': '100',

    'pin6_ADC_i_3_param_1': '0',
    'pin6_ADC_i_3_param_2': '100',
    'pin6_ADC_i_5_param_1': '0',
    'pin6_ADC_i_5_param_2': '100',
    'pin6_ADC_i_12_param_1': '0',
    'pin6_ADC_i_12_param_2': '100',
    
    'nc': ''
};

// Code generation

var pins = {};

function updateCode() {
    var ret = generateCode(pins);
    htmlEl('code').innerHTML = ret.code;
    htmlEl('notes').innerHTML = ("\n" + ret.notes + "\n").replace(/\n-([^\n]*)\n/g, '\n<li>$1</li>\n');
}

function svgdGen() {
    var anyDevice = false;
    var buttonLegs = []; // this array contains current selected leg for button. This will be helpful when we want hide layer with button
    var LED = undefined;

    for (var i = 3; i <= 16; i++) {
        try {   // this need to prevent early calling pins P.S. try to use global boolean variable what will give access to this function only afler onload event  
            if (i > 8 && i < 11) i = 11; // these pins aren't used in Shield

            if (pins[i]['type'] != 'NC') anyDevice = true;

            // Buttons
            if ((pins[i]['type'] == 'SensorBinary') && (pins[i]['params']['1'] == 'general')) {        
                svgdEl('layer7').style.display = "block";
                svgdEl('leg_pin' + i + '_button').style.opacity = 1;

                buttonLegs.push(i);
            } else if ((pins[i]['type'] != 'SensorBinary') || (pins[i]['params']['1'] != 'general')) {
                try {
                    svgdEl('leg_pin' + i + '_button').style.opacity = 0;
                    if (i in buttonLegs) buttonLegs = -1;
                } catch (e) { // this way should be selected if we don't have this svg element
                    
                }
            }

            // LED strip 
            if (pins[i]['params']['1'] == 'red' || pins[i]['params']['1'] == 'green' || 
                pins[i]['params']['1'] == 'blue' || pins[i]['params']['1'] == 'white') { 
                LED = true;
            }

        } catch(e) {

        }
    }

    // Power supply select 
    if (anyDevice && (!LED)) { // if any device exists and device !LED we use small power supply  
        svgdEl('layer1').style.display = "none"
        svgdEl('layer11').style.display = "block";
    } else if (anyDevice && LED) { // if device is LED we use 180W power supply
        svgdEl('layer11').style.display = "none"
        svgdEl('layer1').style.display = "block"
    } else if (!anyDevice) {
        svgdEl('layer1').style.display = "none"
        svgdEl('layer11').style.display = "none";
    }

    if (buttonLegs.length == 0) {
        svgdEl('layer7').style.display = "none";
    }
}
// TODO: zoom on 'shield details'
