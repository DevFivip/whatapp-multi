const Sequelize = require("sequelize");
const UsuariosModel = require("./models/usuarios");
const HistoryModel = require("./models/history");
const ClientesModel = require("./models/clientes");
const RemesasModel = require("./models/remesas");
const TasasModel = require("./models/tasas");
const BotModel = require("./models/bots");
const PagosModel = require("./models/pagos");
const MonedasModel = require("./models/monedas");


const BancosIntModel = require("./models/banco_inters");
const BancosVenzModel = require("./models/banco_venes");

console.log(process.env.DB_NAME);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

const User = UsuariosModel(sequelize, Sequelize);
const History = HistoryModel(sequelize, Sequelize);
const Cliente = ClientesModel(sequelize, Sequelize);
const Remesa = RemesasModel(sequelize, Sequelize);
const Tasas = TasasModel(sequelize, Sequelize);
const Bot = BotModel(sequelize, Sequelize);
const Pagos = PagosModel(sequelize, Sequelize);

const Monedas = MonedasModel(sequelize, Sequelize);

const BancoI = BancosIntModel(sequelize, Sequelize);
const BancoV = BancosVenzModel(sequelize, Sequelize);
// User.hasMany(History,{as:"historial",foreign:"user_id"})

sequelize.sync({ force: false }).then((res) => {
  console.log("tablas sync");
});

module.exports = {
  User,
  History,
  Cliente,
  Remesa,
  Tasas,
  Bot,
  Pagos,
  BancoI,
  BancoV,
  Monedas
};
