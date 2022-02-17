module.exports = (sequelize, type) => {
    return sequelize.define("tasas", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        moneda_tasa_id: type.STRING,
        monto: type.STRING,
        moneda_cambio_id: type.STRING,
        empresa_id: type.STRING,
        paise_id: type.STRING,
        created_at: type.STRING,
        updated_at: type.STRING,
    });
};



