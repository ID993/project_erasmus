<<<<<<< Updated upstream
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    gpa: {
        type: Number,
        required: true,
        min: 3.0,
        max: 5.0,
    },
    firstMobility: {
        type: Boolean,
        required: true,
    },
    motivationLetter: {
        type: Boolean,
        required: true,
    },
    englishProficiency: {
        type: Boolean,
        required: true,
    },
    destinationLanguage: {
        type: Boolean,
        required: true,
    },
    initiatedLLP: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
=======
module.exports = (sequelize, DataTypes) => {
  const Prijava = sequelize.define("Prijava", {
    prijava_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datum_prijave: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Prijava.associate = (models) => {
    Prijava.belongsTo(models.Korisnik, {
      foreignKey: "korisnik_id",
      as: "korisnik",
    });
    Prijava.belongsTo(models.Program, {
      foreignKey: "program_id",
      as: "program",
    });
  };

  return Prijava;
};
>>>>>>> Stashed changes
