"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bread {
    constructor(breadId, breadPrice, breadName, bakerCpf) {
        if (!breadId || !breadPrice || !breadName || !bakerCpf) {
            throw new Error('Null properties');
        }
        this.breadId = breadId;
        this.breadPrice = breadPrice;
        this.breadName = breadName;
        this.bakerCpf = bakerCpf;
    }
    //getters and setters
    getBreadId() {
        return this.breadId;
    }
    setBreadId(breadId) {
        this.breadId = breadId;
    }
}
exports.default = Bread;
