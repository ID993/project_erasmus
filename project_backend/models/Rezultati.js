module.exports = (sequelize, DataTypes) => {
    const Rezultati = sequelize.define('Rezultati', {
        rezultati_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ocjena: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        komentar: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Rezultati.associate = (models) => {
        Rezultati.belongsTo(models.Korisnik, {
            foreignKey: 'korisnik_id',
            as: 'korisnik'
        });
        Rezultati.belongsTo(models.Program, {
            foreignKey: 'program_id',
            as: 'program'
        });
    };

    return Rezultati;
};