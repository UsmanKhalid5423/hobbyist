"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var logger_1 = require("../../config/logger");
var Scrapping = /** @class */ (function () {
    function Scrapping() {
    }
    Scrapping.prototype.PriceToStr = function (price) {
        price = price.replace(/ /g, "").replace(/,/g, "");
        var i = 0;
        for (i = 0; i < price.length; i++)
            if (price[i] >= '0' && price[i] <= '9')
                break;
        if (i == price.length)
            return {
                currency: 'No',
                price: 0
            };
        return {
            currency: price.slice(0, i),
            price: parseFloat(price.slice(i))
        };
    };
    Scrapping.prototype.getScrappingData = function (search_word, id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, params, data, response, invs_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = search_word.split(" ").map(function (val) { return encodeURIComponent(val); }).join("+");
                        params = {
                            api_key: "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
                            url: "https://www.amazon.com/s?k=".concat(url),
                            // Wait for there to be at least one
                            // non-empty .event-tile element
                            // wait: 10000,
                            wait_for: ".s-main-slot",
                            extract_rules: JSON.stringify({
                                data: {
                                    selector: '.s-main-slot div[data-component-type="s-search-result"]',
                                    type: "list",
                                    output: {
                                        title: 'h2',
                                        price: {
                                            selector: 'div[data-cy="price-recipe"] .a-price>span',
                                            output: "text"
                                        },
                                        link: {
                                            selector: ".s-product-image-container img",
                                            output: "@src"
                                        },
                                        url: {
                                            selector: ".s-product-image-container a",
                                            output: "@href"
                                        }
                                    }
                                }
                            }),
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get("https://app.scrapingbee.com/api/v1/", {
                                params: params
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        response = data.data;
                        invs_1 = [];
                        return [4 /*yield*/, response.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var data;
                                return __generator(this, function (_a) {
                                    data = this.PriceToStr(item.price);
                                    if (data.currency != 'No') {
                                        item.link = item.link;
                                        item.baseCurrency = data.currency;
                                        item.price = data.price;
                                        item.date = new Date();
                                        item.url = "https://www.amazon.com".concat(item.url);
                                        if (id == null)
                                            item.category = search_word;
                                        item.item = id;
                                        invs_1.push(item);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        logger_1.logger.info("amazon complete with ".concat(invs_1.length));
                        return [2 /*return*/, invs_1];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.logger.error("Amazon ".concat(error_1));
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Scrapping;
}());
exports.default = Scrapping;
