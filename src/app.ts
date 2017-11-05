import {database} from "./helpers/database";
import {serversComponent} from "./components/servers";
import * as $ from 'jquery';
import {walletsComponent} from "./components/wallets";

database;

serversComponent.init().then(() => {
    setInterval(() => {
        serversComponent.getBlockInfo().catch(e => { console.log(e) });
    }, 10000);

    walletsComponent.init();

    $('#beforeApp').fadeOut(() => { $('#app').fadeIn(); });

    $(".button-collapse").sideNav({
        closeOnClick: true
    });
    $('.modal').modal();
});