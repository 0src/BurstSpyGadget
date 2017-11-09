"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsPath = require("fs-path");
const path = require("path");
const fs = require("fs");
class History {
    constructor() {
        this.saving = new Map();
    }
    update(name, data) {
        name = name.replace(/[^0-9a-z]/gi, '_');
        if (this.saving.has(name)) {
            this.saving.set(name, this.saving.get(name) + '\n' + data);
            setTimeout(() => { this.update(name, data); }, 300);
            return;
        }
        this.saving.set(name, data);
        fs.appendFile(path.resolve('history', `${name}.txt`), `${data}\n`, 'utf8', (err) => {
            if (err) {
                console.log(err);
                fsPath.writeFile(path.resolve('history', `${name}.txt`), `${data}\n`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    this.saving.delete(name);
                });
            }
            else {
                this.saving.delete(name);
            }
        });
    }
    get(name) {
        return new Promise((resolve, reject) => {
            name = name.replace(/[^0-9a-z]/gi, '_');
            fs.readFile(path.resolve('history', `${name}.txt`), 'utf8', (err, data) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.history = new History();
