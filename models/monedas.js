module.exports = (sequelize, type) => {
    return sequelize.define("monedas", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        moneda: type.STRING,
        simbolo: type.STRING,
        iso: type.STRING,
        paise_id: type.STRING,
        empresa_id: type.STRING,
        created_at: type.STRING,
        updated_at: type.STRING,
    });
};
