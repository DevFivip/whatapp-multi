module.exports = (sequelize, type) => {
    return sequelize.define("banco_inters", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nombre: type.STRING,
        paise_id: type.INTEGER,
        empresa_id: type.INTEGER,
    });
};
