"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.Json2Ts = void 0;
var data_1 = require("./data");
var result;
var Json2Ts = /** @class */ (function () {
    function Json2Ts(config) {
        if (config === void 0) { config = {}; }
        this.interfaces = {};
        this.config = __assign({ prependWithI: true, sortAlphabetically: false, addExport: false, useArrayGeneric: true, optionalFields: false, prefix: '', rootObjectName: 'UST' }, config);
    }
    Json2Ts.prototype.convert = function (json) {
        this.interfaces = {};
        var result = "type JSON = " + this.unknownToTS(json) + "\n\n";
        result += this.interfacesToString();
        return result;
    };
    Json2Ts.prototype.unknownToTS = function (value, key) {
        if (key === void 0) { key = void 0; }
        var type = typeof value;
        if (type === 'object') {
            if (Array.isArray(value)) {
                type = this.arrayToTS(value, key);
            }
            else {
                type = this.objectToTS(value, key && this.capitalizeFirst(key));
            }
        }
        return type;
    };
    Json2Ts.prototype.arrayToTS = function (array, key) {
        if (key === void 0) { key = void 0; }
        var type = array.length ? void 0 : 'any';
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var item = array_1[_i];
            var itemType = this.unknownToTS(item, this.keyToTypeName(key));
            if (type && itemType !== type) {
                type = 'any';
                break;
            }
            else {
                type = itemType;
            }
        }
        return this.config.useArrayGeneric ? "Array<" + type + ">" : type + "[]";
    };
    Json2Ts.prototype.keyToTypeName = function (key) {
        if (key === void 0) { key = void 0; }
        if (!key || key.length < 2) {
            return key;
        }
        var _a = Array.prototype.slice.apply(key), first = _a[0], rest = _a.slice(1);
        var last = rest.pop();
        return __spreadArrays([first.toUpperCase()], rest, [last === 's' ? '' : last]).join('');
    };
    Json2Ts.prototype.capitalizeFirst = function (str) {
        var _a = Array.prototype.slice.apply(str), first = _a[0], rest = _a.slice(1);
        return __spreadArrays([first.toUpperCase()], rest).join('');
    };
    Json2Ts.prototype.objectToTS = function (obj, type) {
        var _this = this;
        if (type === void 0) { type = this.config.rootObjectName; }
        if (obj === null) {
            return 'any';
        }
        var _a = this.config, prependWithI = _a.prependWithI, prefix = _a.prefix;
        if (prependWithI) {
            type = "I" + (prefix || '') + type;
        }
        if (!this.interfaces[type]) {
            this.interfaces[type] = {};
        }
        var interfaceName = this.interfaces[type];
        Object.keys(obj).forEach(function (key) {
            var value = obj[key];
            var fieldType = _this.unknownToTS(value, key);
            if (!interfaceName[key] || interfaceName[key].indexOf('any') === 0) {
                interfaceName[key] = fieldType;
            }
        });
        return type;
    };
    Json2Ts.prototype.interfacesToString = function () {
        var _this = this;
        var _a = this.config, sortAlphabetically = _a.sortAlphabetically, addExport = _a.addExport, optionalFields = _a.optionalFields;
        return Object.keys(this.interfaces).map(function (name) {
            var interfaceStr = [(addExport ? 'export ' : '') + "interface " + name + " {"];
            var fields = Object.keys(_this.interfaces[name]);
            if (sortAlphabetically) {
                fields.sort();
            }
            fields
                .forEach(function (field) {
                var type = _this.interfaces[name][field];
                interfaceStr.push("  " + field + (optionalFields ? '?' : '') + ": " + type + ";");
            });
            interfaceStr.push('}\n');
            return interfaceStr.join('\n');
        }).join('\n');
    };
    return Json2Ts;
}());
exports.Json2Ts = Json2Ts;
var fs = require('fs');
fs.writeFile("JsonToTS.ts", result, function (err) {
    if (err) {
        console.log(err);
    }
});
function bootstrap() {
    var foo = new Json2Ts();
    result = foo.convert(data_1.raceCarDriver);
    console.log(result);
    return result;
}
