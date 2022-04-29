"use strict";
exports.__esModule = true;
var two_js_1 = require("two.js");
var two = new two_js_1["default"]({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);
var rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
two.bind('update', function () {
    rect.rotation += 0.001;
});
