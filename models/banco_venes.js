module.exports = (sequelize, type) => {
    return sequelize.define("banco_venes", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: type.STRING,
        codigo: type.STRING,
    });
};
