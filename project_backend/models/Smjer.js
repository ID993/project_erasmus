module.exports = (sequelize, DataTypes) => {
    const Smjer = sequelize.define('Smjer', {
        smjer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });

    Smjer.associate = (models) => {
        Smjer.belongsTo(models.Ustanova, {
            foreignKey: 'ustanova_id',
            as: 'ustanova'
        });
    };

    return Smjer;
};