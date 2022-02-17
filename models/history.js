module.exports = (sequelize, type) => {
    return sequelize.define("history", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: type.STRING,
      command: type.STRING,
    });
  };
  