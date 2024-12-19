module.exports = (sequelize, DataTypes) => {
    const Program = sequelize.define('Program', {
        program_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv: {
            type: DataTypes.STRING,
            allowNull: false
        },
        opis: {
            type: DataTypes.STRING,
            allowNull: true
        },
        datum_pocetka: {
            type: DataTypes.DATE,
            allowNull: false
        },
        datum_zavrsetka: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    Program.associate = (models) => {
        Program.hasMany(models.Prijava, {
            foreignKey: 'program_id',
            as: 'prijave'
        });
        Program.hasMany(models.Rezultati, {
            foreignKey: 'program_id',
            as: 'rezultati'
        });
    };

    return Program;
};