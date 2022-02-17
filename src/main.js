require('dotenv').config();
const fs = require('fs');
// const dialogflow = require("@google-cloud/dialogflow");
const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const bodyParser = require("body-parser");
const Jimp = require('jimp');

const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
    })
);
const { User, History, Cliente, Remesa, Tasas, Bot, Pagos, BancoI, BancoV, Monedas } = require("../db");
// const dialogFlowConfig = require("../assets/newagent.json");
const user = require("../models/usuarios");

// // Your google dialogflow project-id
// const PROJECID = dialogFlowConfig.project_id;
// // Configuration for the client
// const CONFIGURATION = {
//     credentials: {
//         private_key: dialogFlowConfig.private_key,
//         client_email: dialogFlowConfig.client_email,
//     },
// };

// Create a new session
// const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);


// Detect intent method
// const dialog = async (languageCode, queryText, sessionId) => {
//     let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

//     // The text query request.
//     let request = {
//         session: sessionPath,
//         queryInput: {
//             text: {
//                 // The query to send to the dialogflow agent
//                 text: queryText,
//                 // The language used by the client (en-US)
//                 languageCode: languageCode,
//             },
//         },
//     };

//     // Send request and log result
//     const responses = await sessionClient.detectIntent(request);

//     const result = responses[0].queryResult;
//     return {
//         response: result.fulfillmentText,
//         parameters: result.parameters,
//     };
// };

// iniciar session

const parse = (texto) => {
    let de = "ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç",
        a = "AAAAAEEEEIIIIOOOOUUUUNCaaaaaeeeeiiiioooouuuunc",
        re = new RegExp("[" + de + "]", "ug");
    texto = texto.toLowerCase();
    return texto.replace(re, (match) => a.charAt(de.indexOf(match)));
};

const connectionReady = () => {
    listenMessage();
    //catchMessage();
};

const listenMessage = () => {
    client.on("message", async ({ from, to, body }) => {
        if (typeof (body) === 'string' && !!body.length) {
            console.log('<<<<<<<<<', { body })
            const cliente_id = await saludar(from);
            await replyAsk(from, body, cliente_id);
        } else {
            console.log('is media file')
        }
    });
};


const saludar = async (from) => {
    let cliente = await Cliente.findOne({ where: { empresa_id: process.env.EMPRESA_ID, bot_phone: from.replace("@c.us", "") } });
    if (!cliente) {
        // cliente = await Cliente.create({ nombres: "new client", apellidos: from.replace("@c.us", ""), telefono: from.replace("@c.us", ""), empresa_id: process.env.EMPRESA_ID, c_pais: 89, bot_phone: from.replace("@c.us", ""), paise_id: 82 });
        // menu(from);
        return false
    }
    return cliente.id;
};

const menu = async (from) => {
    const menus = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: '[menu]' } });
    menus.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
};

const comando1 = async (from) => {
    const bot = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: 1 } });
    bot.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
}
const comando2 = async (from) => {
    const bot = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: 2 } });
    bot.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
}
const comando3 = async (from) => {
    const bot = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: 3 } });
    bot.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
}
const comando4 = async (from) => {
    const bot = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: 4 } });
    bot.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
}
const comando5 = async (from) => {
    const bot = await Bot.findAll({ where: { empresa_id: process.env.EMPRESA_ID, code: 5 } });
    bot.map((v) => {
        client.sendMessage(from, v.respuesta);
    })
}
const comando9 = async (from) => {
    const cliente = await Cliente.findOne({ where: { empresa_id: process.env.EMPRESA_ID, bot_phone: from.replace("@c.us", "") } });
    const remesas = await Remesa.findAll({
        where: { empresa_id: process.env.EMPRESA_ID, cliente_id: cliente.id }, limit: 10, order: [
            ['id', 'DESC']]
    });
    remesas.map(async (v) => {
        let banco;
        if (!!v.banco_vene_id) {
            banco = await BancoV.findByPk(v.banco_vene_id);
        } else if (!!v.banco_inter_id) {
            banco = await BancoI.findByPk(v.banco_inter_id);
        } else {
            banco = {
                nombre: 'Banco indeterminado'
            }
        }

        const moneda = await Monedas.findByPk(v.moneda_id_envio);
        const estatus = v.estado === -1 ? "❌ Por Pagar" : v.estado === 0 ? '⏳ Por Verificar' : '✔️ Pagado'
        const respuesta = `${v.correlativo} | ${new Date(v.created_at).toISOString().slice(0, 10)}\n${v.receptor}\n${banco.nombre}\n${estatus} *${Number(v.total_remesa).toFixed(2)} ${moneda.simbolo}*`;
        client.sendMessage(from, respuesta);
    })
};


const replyAsk = async (from, answer, cliente_id) => {
    const msg = parse(answer);
    // const flow = await dialog("es", msg, "12312371231656765765123");
    // console.log(JSON.stringify(flow, null, 2))

    return new Promise((resolve, reject) => {
        if (answer.includes("/nombre")) {
            let st = rename(cliente_id, answer, from);
            resolve(true);
        }

        if (msg === "menu" || msg === "ayuda" || msg === "help") {
            menu(from);
            resolve(true);
        }

        /***COMANDOS */
        if (msg === "1") {
            comando1(from);
            resolve(true);
        }
        if (msg === "2") {
            comando2(from);
            resolve(true);
        }
        if (msg === "3") {
            comando3(from);
            resolve(true);
        }
        if (msg === "4") {
            comando4(from);
            resolve(true);
        }
        if (msg === "4") {
            comando4(from);
            resolve(true);
        }

        if (msg === "5") {
            comando5(from);
            resolve(true);
        }

        if (msg === "9") {
            comando9(from);
            resolve(true);
        }


        if (msg === "status") {
            console.log({ from });
            client.sendMessage(from, "enable");
            resolve(true);
        }

        /**
         * DESACTIVAR COMANDO DE TASAS
         */

        // if (flow.response === "[send_tasa]") {
        //   const rawdata = fs.readFileSync("cambios.json");

        //   const cambios = JSON.parse(rawdata);
        //   const cam = Object.keys(cambios);

        //   const enviable = cam.filter((v, index) => {
        //     return cambios[v].enviable;
        //   });

        //   const cambio_actual = cambios[enviable];

        //   // From file path
        //   const photo = `./images/${cambio_actual.imagen_rename}`;

        //   const media = MessageMedia.fromFilePath(photo);
        //   client.sendMessage(from, media);
        //   resolve(true);
        // }

        // if (flow.response === "[send_tasa_recarga]") {
        //   const rawdata = fs.readFileSync("cambios.json");

        //   const cambios = JSON.parse(rawdata);
        //   const cam = Object.keys(cambios);

        //   const recarga = cam.filter((v, index) => {
        //     return cambios[v].recarga;
        //   });

        //   const cambio_actual = cambios[recarga];

        //   // From file path
        //   const photo = `./images/${cambio_actual.imagen_rename}`;

        //   const media = MessageMedia.fromFilePath(photo);
        //   client.sendMessage(from, media);
        //   resolve(true);
        // }


        // if (flow.response === "[send_cuentas]") {
        //     console.log(flow);
        //     client.sendMessage(from, "🏦 banco bcp 5616516551");
        //     client.sendMessage(from, "🏦 banco bcp 5616516551");
        //     resolve(true);
        // }

        // if (flow.response === "[send_calculo_cambio]") {

        //     const monto_base =
        //         flow.parameters.fields["unit-currency"].structValue?.fields.amount
        //             .numberValue;

        //     const moneda_base =
        //         flow.parameters.fields["unit-currency"].structValue?.fields.currency
        //             .stringValue;




        //     let a = flow.parameters.fields["currency-name"].stringValue;
        //     a = a ? true : flow.parameters.fields["currency-name"].listValue?.values[0]?.stringValue;

        //     (async () => {

        //         try {


        //             const model_moneda_base = await Monedas.findOne({ where: { empresa_id: process.env.EMPRESA_ID, iso: moneda_base } });
        //             const model_a = await Monedas.findOne({ where: { empresa_id: process.env.EMPRESA_ID, iso: a } });


        //             console.log('>>>>>>>>>>>>>>>>>>>>', model_moneda_base.id, model_a.id);

        //             Tasas.findOne({ where: { empresa_id: process.env.EMPRESA_ID, moneda_tasa_id: model_a.id, moneda_cambio_id: model_moneda_base.id } }).then(tasa => {
        //                 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', { tasa });


        //                 if (!!tasa) {
        //                     const total = calcularCambios(
        //                         tasa.monto,
        //                         monto_base
        //                     );
        //                     client.sendMessage(from, "son:  " + total + ' ' + model_a.simbolo);
        //                 } else {
        //                     client.sendMessage(
        //                         from,
        //                         "Lo siento pero la moneda de envio no se encuantra disponible o la escribiste mal usa *soles, dolares, pesos colombianos, pesos chilenos* " +
        //                         moneda_base + ' ' + a
        //                     );
        //                 }
        //             }, err => {
        //                 client.sendMessage(
        //                     from,
        //                     "Lo siento pero la moneda de envio no se encuantra disponible o la escribiste mal usa *soles, dolares, pesos colombianos, pesos chilenos* " +
        //                     moneda_base + ' ' + a
        //                 );
        //             })

        //         } catch (error) {
        //             console.log('moneda no encontrada')
        //         }



        //     })()


        // }

        // if (flow.response === "[crear_ticket_recarga]") {
        // }
    });
};

const session = () => {

    client = new Client();
    client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
        console.log("Client is ready!");
        connectionReady();
    });

    client.on("auth_failure", () => {
        console.log("** Error de autentificacion vuelve a generar el QRCODE **");
    });

    client.on('authenticated', () => {
        console.log('authenticated');
    });

    client.initialize();
};

session();

/**
 * Rutas
 */

app.get("/", (req, res) => {
    res.send({ status: "conectado" });
});

app.get("/img/:remesa_id", async (req, res) => {

    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); // bitmap fonts
    const remesa = await Remesa.findOne({ where: { id: req.params.remesa_id } });
    const cliente = await Cliente.findOne({ where: { id: remesa.cliente_id } });
    const pagos = await Pagos.findAll({ where: { remesa_id: req.params.remesa_id } });

    let banco;
    if (!!remesa.banco_vene_id) {
        banco = await BancoV.findByPk(remesa.banco_vene_id);
    } else if (!!remesa.banco_inter_id) {
        banco = await BancoI.findByPk(remesa.banco_inter_id);
    } else {
        banco = {
            nombre: 'Banco indeterminado'
        }
    }


    // console.log({ remesa, cliente })
    const imagen = await Jimp.read('assets/BASE-RECIBO.png');
    /**SIDE LEFT */
    imagen.print(font, 15, 120, `Envio a: ${remesa.receptor}`);
    imagen.print(font, 15, 135, `Documento: ${remesa.n_doc}`);
    imagen.print(font, 15, 150, `${'Banco'}: ${banco.nombre}`);
    imagen.print(font, 15, 165, `${'Numero de Cuenta'}: ${remesa.n_cuenta}`);

    imagen.print(font, 15, 195, `Fecha: ${new Date(remesa.updated_at).toISOString().slice(0, 10)}`);
    imagen.print(font, 15, 210, `${'Correlativo'}: ${remesa.correlativo}`);
    imagen.print(font, 15, 225, `${'Cliente'}: ${cliente.nombres} ${cliente.apellidos}`);
    imagen.print(font, 15, 240, `${'Teléfono'}: ${cliente.telefono}`);
    /**END SIDE LEFT */

    /**SIDE RIGHT */
    imagen.print(font, 290, 20, `Estado: ${remesa.estado === -1 ? "Por Pagar" : remesa.estado === 0 ? 'Por Verificar' : ' Pagado'}`);
    /**END SIDE LEFT */

    /**END LOOP OBSERVACIONES */

    /**FOOTER */
    imagen.print(font, 15, 450, `Tasas: ${Number(remesa.tasa).toFixed(3)}`);
    imagen.print(font, 150, 450, `Monto: ${Number(remesa.total_envio).toFixed(3)}`);
    imagen.print(font, 285, 450, `Total: ${Number(remesa.total_remesa).toFixed(3)}`);

    /**END FOOTER */

    const name = `images/${process.env.EMPRESA_ID}/${remesa.correlativo}.jpg`
    await imagen.writeAsync(name)

    try {

        const media = MessageMedia.fromFilePath(name);
        client.sendMessage(cliente.bot_phone + "@c.us", media);

        res.send({ status: "enviado exitosamente" });


    } catch (error) {
        console.log('Error>>>>>>>>>>>>>>>>>>>>>>>>>>', error)
    }


});

app.get("/remesas-enviar/:remesa_id", async (req, res) => {
    console.log(req.params.remesa_id);
    const remesas = await Remesa.findOne({ where: { id: req.params.remesa_id } });
    const cliente = await Cliente.findByPk(remesas?.cliente_id);
    try {
        console.log(cliente?.bot_phone + "@c.us");
        await client.sendMessage(
            cliente?.bot_phone + "@c.us",
            JSON.stringify(remesas, 2, null)
        );
        res.json(remesas);
    } catch (error) {
        res.json({
            errors: [
                "error al enviar recibo de remesa",
                cliente?.bot_phone + "@c.us",
            ],
        });
    }
});

app.post("/enviar", async (req, res) => {
    const { to, msg } = req.body;
    const st = await client.sendMessage(to + "@c.us", msg);
    console.log(st);
    res.send({ status: "mensaje enviado" });
});

app.listen(process.env.PORT_EXPRESS, () => {
    console.log("Server ready!");
});
