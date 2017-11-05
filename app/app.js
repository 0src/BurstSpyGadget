"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./helpers/database");
const servers_1 = require("./components/servers");
const $ = require("jquery");
const wallets_1 = require("./components/wallets");
database_1.database;
servers_1.serversComponent.init().then(() => {
    setInterval(() => {
        servers_1.serversComponent.getBlockInfo().catch(e => { console.log(e); });
    }, 10000);
    wallets_1.walletsComponent.init();
    $('#beforeApp').fadeOut(() => { $('#app').fadeIn(); });
    $(".button-collapse").sideNav({
        closeOnClick: true
    });
    $('.modal').modal();
});
