const functions = require("firebase-functions");
const admin = require('firebase-admin');
const dotenv = require('dotenv');




const NodeGeocoder = require("node-geocoder");
const { dialogflow, Permission, UpdatePermission, SimpleResponse } = require("actions-on-google");
const random = require("random");
const { Client } = require("@googlemaps/google-maps-services-js");
const { SignIn } = require("actions-on-google");
const requestNode = require('request');



const app = dialogflow({
    clientId: "435721891291-rp1kdpsu7sgr33pgaec4mpr4klnnk5d9.apps.googleusercontent.com",
});



function saveToDb(pageToSave,timeSlot) {
    const options = {
        url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "value" : pageToSave,
            "slottime" : timeSlot
        })
    };
    requestNode(options, function(error, requestInternal, body){
        console.log(body);
 });
}


app.intent("Default Welcome Intent", (conv) => {
    console.log("---- Default Welcome Intent ----");
    return conv.ask("Bienvenido al Command Center");
});


app.intent("Reportes", (conv,params) => {
    console.log("---- Default Reportes ---- " + params.timeslot);
    if(params.timeslot == ""){
        saveToDb("blank","Month")
    }

    else
    {
        if(params.timeslot == "mes")
            saveToDb("blank","month")
        else
        saveToDb("blank","week")

    }
    return conv.ask("Perfecto, le muestro sus reportes");
});


app.intent("Pagina principal", (conv) => {
    console.log("---- Pagina principal ----");
    saveToDb("index","Month")
    return conv.ask("Ok, mostrando Dashboard");
});

app.intent("Tarjetas", (conv,params) => {
    console.log("---- Alertas ----");
    if(params.timeslot == ""){
        saveToDb("cards","Month")
    }
    else{
        if(params.timeslot == "mes")
            saveToDb("cards","month")
        else
        saveToDb("cards","week")
    } 
    return conv.ask("Perfecto, le muestro sus reportes");
});






exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);