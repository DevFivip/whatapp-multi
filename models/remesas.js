module.exports = (sequelize, type) => {
  return sequelize.define("remesas", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    correlativo: type.STRING,
    cliente_id: type.INTEGER,
    receptor: type.STRING,
    tipo_doc: type.STRING,
    n_doc: type.STRING,
    banco_vene_id: type.INTEGER,
    banco_inter_id: type.INTEGER,
    ban_pa_m: type.STRING,
    n_cuenta: type.STRING,
    obs: type.STRING,
    moneda_id_envio: type.INTEGER,
    total_envio: type.STRING,
    tasa: type.STRING,
    total_remesa: type.STRING,
    moneda_id_tasa: type.STRING,
    user_id: type.INTEGER,
    estado: type.STRING,
    empresa_id: type.INTEGER,
    created_at: type.STRING,
    updated_at: type.STRING,
    
  });
};



