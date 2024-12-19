
module.exports = (sequelize, DataTypes) => {
    const Prijava = sequelize.define('Prijava', {
        prijava_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        datum_prijave: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    Prijava.associate = (models) => {
        Prijava.belongsTo(models.Korisnik, {
            foreignKey: 'korisnik_id',
            as: 'korisnik'
        });
        Prijava.belongsTo(models.Program, {
            foreignKey: 'program_id',
            as: 'program'
        });
    };

    return Prijava;
};