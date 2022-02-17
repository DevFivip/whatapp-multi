module.exports = (sequelize, type) => {
  return sequelize.define("usuarios", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_user: type.STRING,
    email: type.STRING,
  });
};
