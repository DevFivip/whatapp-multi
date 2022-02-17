module.exports = (sequelize, type) => {
  return sequelize.define("clientes", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: type.STRING,
    apellidos: type.STRING,
    tipo_documento_id: type.STRING,
    n_documento: type.STRING,
    c_pais: type.STRING,
    telefono: type.STRING,
    paise_id: type.STRING,
    bot_phone: type.INTEGER,
    empresa_id: type.STRING,
    created_at: type.STRING,
    updated_at: type.STRING,
  });
};



