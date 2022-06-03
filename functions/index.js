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



function saveToDb(pageToSave, timeSlot) {
    const options = {
        url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "value": pageToSave,
            "slottime": timeSlot
        })
    };
    requestNode(options, function (error, requestInternal, body) {
        console.log(body);
    });
}



function saveSlotoDb(timeSlot) {

    var valuepage = "";

    const optionget = {
        url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    requestNode(optionget, function (error, requestInternal, body) {
        console.log("--- READ DATA -- " + body);
        bodyparsed = JSON.parse(body)

        valuepage = bodyparsed.value;
    });

    console.log("---VALUE -- " + valuepage);
    const options = {
        url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "slottime": timeSlot
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });
}


app.intent("Default Welcome Intent", (conv) => {
    console.log("---- Default Welcome Intent ----");
    return conv.ask("Bienvenido al Command Center");
});


app.intent("Reportes", (conv, params) => {
    console.log("---- Default Reportes ---- " + params.timeslot);
    if (params.timeslot == "") {
        saveToDb("blank", "Month")
    }

    else {
        if (params.timeslot == "mes")
            saveToDb("blank", "month")
        else
            saveToDb("blank", "week")

    }
    return conv.ask("Perfecto, le muestro sus reportes");
});

app.intent("TimeSlot", (conv, params) => {
    console.log("---- Default Reportes ---- " + params.timeslot);

    if (params.timeSlot == "mes")
        saveSlotoDb("month")
    else
        saveSlotoDb("week")
    return conv.ask("Perfecto, le muestro sus reportes");
});





app.intent("Pagina principal", (conv) => {
    console.log("---- Pagina principal ----");
    saveToDb("index", "Month")
    return conv.ask("Ok, mostrando Dashboard");
});

app.intent("Tarjetas", (conv, params) => {
    console.log("---- Alertas ----");
    if (params.timeslot == "") {
        saveToDb("cards", "Month")
    }
    else {
        if (params.timeslot == "mes")
            saveToDb("cards", "month")
        else
            saveToDb("cards", "week")
    }
    return conv.ask("Perfecto, le muestro sus reportes");
});


function ProductSlotInDb(value) {
    const options = {
        url: 'https://webvoice-347112.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "product": value
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });

}


function CustomerInDb(value) {
    const options = {
        url: 'https://webvoice-347112.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "customer": value
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });

}


function CityInDb(value) {
    const options = {
        url: 'https://webvoice-347112.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "city": value
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });

}

function startDateInDb(value) {
    const options = {
        url: 'https://webvoice-347112.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "startDate": value
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });

}

function endDateInDb(value) {
    const options = {
        url: 'https://webvoice-347112.firebaseio.com/page.json',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "endDate": value
        })
    };

    requestNode(options, function (error, requestInternal, body) {
        console.log("--- write DATA -- " + body);
    });

}


function converDate(datToConver) {
    var date = new Date(datToConver) // formated_Date - SDK returned date
    var month = ("0" + (date.getMonth() + 1)).slice(-2)
    var day = ("0" + (date.getDate())).slice(-2)

    return date.getFullYear() + "/" + month + "/" + day;
}

app.intent("ParametricsReports", (conv, params) => {


    var bodyparsed = "";
    var productos = params.Products;
    var customer = params.Customers;
    var city = params.City.city;
    var startDate = params.RangeData.startDate;
    var endDate = params.RangeData.endDate;

    console.log("---- product --- " + productos);
    console.log("---- customer --- " + customer);
    console.log("---- city --- " + city);
    console.log("---- startDate --- " + startDate);
    console.log("---- endDate --- " + endDate);

  /*  if (startDate != null || startDate != "")
        startDate = converDate(startDate)

    if (endDate != null || endDate != "")
        endDate = converDate(endDate)

*/


    console.log("--- start date -- " + startDate)
    console.log("--- end date -- " + endDate)




    const optionget = {
        url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

    requestNode(optionget, function (error, requestInternal, body) {
        console.log("--- READ DATA -- " + body);
        bodyparsed = JSON.parse(body)

        cityToSend = bodyparsed.city;
        productToSend = bodyparsed.product;
        customerToSend = bodyparsed.customer;
        startDateToSend = bodyparsed.startDate;
        endDateToSend = bodyparsed.endeDate;
        var update = bodyparsed.update;

        if (city != bodyparsed.city && city != null && city != "")
            var cityToSend = city;
        if (productos != bodyparsed.product && productos != null && productos != "")
            productToSend = productos;
        if (customer != bodyparsed.customer && customer != null && customer != "")
            var customerToSend = customer;
        if (startDate != bodyparsed.startDate && startDate != null && startDate != "")
            var startDateToSend = converDate(startDate);
        if (endDate != bodyparsed.endDate && endDate != null && endDate != "")
            var endDateToSend = converDate(endDate);
        if (update == "N")
            updateToSend = "Y";
        else
            updateToSend = "N";




        const options = {
            url: 'https://webvoice-347112-default-rtdb.firebaseio.com/page.json',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "customer": customerToSend,
                "city": cityToSend,
                "product": productToSend,
                "startDate": startDateToSend,
                "endDate": endDateToSend,
                "update": updateToSend
            })
        };

        requestNode(options, function (error, requestInternal, body) {
            console.log("--- write DATA -- " + body);
        });
    });


    // this is not best way but only for demo purpose -- should use rules
    /* ProductSlotInDb(productos)
     CustomerInDb(customer)
     CityInDb(city)
     startDateInDb(startDate)
     endDateInDb(endDate) */


    return conv.ask("Perfecto, le muestro sus reportes");
});









exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);