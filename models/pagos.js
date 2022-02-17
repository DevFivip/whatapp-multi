module.exports = (sequelize, type) => {
    return sequelize.define("pagos", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cuenta_vene_id: type.INTEGER,
        cuenta_inter_id: type.INTEGER,
        monto: type.STRING,
        n_ope: type.STRING,
        metodo_p: type.STRING,
        remesa_id: type.INTEGER,
        signo: type.STRING,
        empresa_id: type.INTEGER,
        created_at: type.STRING,
        updated_at: type.STRING,
    });
};
