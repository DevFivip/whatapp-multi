module.exports = (sequelize, type) => {
    return sequelize.define("bot", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: type.STRING,
        respuesta: type.STRING,
        empresa_id: type.INTEGER,
    });
};
