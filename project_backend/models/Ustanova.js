module.exports = (sequelize, DataTypes) => {
    const Ustanova = sequelize.define('Ustanova', {
        ustanova_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adresa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        drzava: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kontakt: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Ustanova.associate = (models) => {
        Ustanova.hasMany(models.Smjer, {
            foreignKey: 'ustanova_id',
            as: 'smjerovi'
        });
        Ustanova.hasMany(models.Prijava, {
            foreignKey: 'ustanova_id',
            as: 'prijave'
        });
    };

    return Ustanova;
};