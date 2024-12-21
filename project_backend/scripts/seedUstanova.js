const mongoose = require("mongoose");
require("dotenv").config();

const Ustanova = require("../models/Ustanova");
const Smjer = require("../models/Smjer");
const Drzava = require("../models/Drzava");

const ustanove = [
  {
    ime: "Sveučilište u Zagrebu",
    adresa: "Trg Republike Hrvatske 14",
    drzava: "Hrvatska",
    kontakt: "01 456 7890",
  },
  {
    ime: "Sveučilište u Splitu",
    adresa: "Livanjska 5",
    drzava: "Hrvatska",
    kontakt: "021 456 789",
  },
  {
    ime: "Sveučilište u Rijeci",
    adresa: "Radmile Matejčić 2",
    drzava: "Hrvatska",
    kontakt: "051 456 789",
  },
  {
    ime: "Sveučilište u Osijeku",
    adresa: "Trg Svetog Trojstva 3",
    drzava: "Hrvatska",
    kontakt: "031 456 789",
  },
  {
    ime: "Sveučilište u Zadru",
    adresa: "Mihovila Pavlinovića bb",
    drzava: "Hrvatska",
    kontakt: "023 456 789",
  },
  {
    ime: "Sveučilište u Dubrovniku",
    adresa: "Branitelja Dubrovnika 41",
    drzava: "Hrvatska",
    kontakt: "020 456 789",
  },
  {
    ime: "Universität Wien",
    adresa: "Universitätsring 1",
    drzava: "Austrija",
    kontakt: "+43 1 4277 0",
  },
  {
    ime: "Universidad de Salamanca",
    adresa: "Calle Libreros, 37008",
    drzava: "Španjolska",
    kontakt: "+34 923 294 400",
  },
  {
    ime: "Università degli Studi di Bologna",
    adresa: "Via Zamboni 33",
    drzava: "Italija",
    kontakt: "+39 051 2099111",
  },
  {
    ime: "Freie Universität Berlin",
    adresa: "Kaiserswerther Str. 16-18",
    drzava: "Njemačka",
    kontakt: "+49 30 8381",
  },
  {
    ime: "Université Paris-Saclay",
    adresa: "3 Rue Joliot Curie",
    drzava: "Francuska",
    kontakt: "+33 1 69 15 66 67",
  },
  {
    ime: "University of Helsinki",
    adresa: "Yliopistonkatu 4",
    drzava: "Finska",
    kontakt: "+358 2941 911",
  },
  {
    ime: "Universidad de Coimbra",
    adresa: "Paço das Escolas",
    drzava: "Portugal",
    kontakt: "+351 239 859 810",
  },
  {
    ime: "University of Edinburgh",
    adresa: "Old College, South Bridge",
    drzava: "Ujedinjeno Kraljevstvo",
    kontakt: "+44 131 650 1000",
  },
  {
    ime: "Universität Zürich",
    adresa: "Rämistrasse 71",
    drzava: "Švicarska",
    kontakt: "+41 44 634 11 11",
  },
  {
    ime: "Universidade de Lisboa",
    adresa: "Alameda da Universidade",
    drzava: "Portugal",
    kontakt: "+351 21 798 21 00",
  },
  {
    ime: "Technische Universität München",
    adresa: "Arcisstraße 21",
    drzava: "Njemačka",
    kontakt: "+49 89 289 01",
  },
  {
    ime: "Università Ca' Foscari Venezia",
    adresa: "Dorsoduro, 3246",
    drzava: "Italija",
    kontakt: "+39 041 234 8111",
  },
  {
    ime: "Universidad Autónoma de Madrid",
    adresa: "Cantoblanco, 28049",
    drzava: "Španjolska",
    kontakt: "+34 91 497 5000",
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

const populateUstanove = async () => {
  try {
    await Ustanova.deleteMany();
    console.log("Existing Ustanova entries cleared!");

    const drzave = await Drzava.find();
    if (!drzave.length) {
      console.log("No Drzave entries found! Populate Drzave first.");
      process.exit(1);
    }

    const smjerovi = await Smjer.find();
    if (!smjerovi.length) {
      console.log("No Smjer entries found! Populate Smjer first.");
      process.exit(1);
    }

    const drzavaMap = drzave.reduce((map, drzava) => {
      map[drzava.naziv] = drzava._id;
      return map;
    }, {});

    const smjerIds = smjerovi.map((smjer) => smjer._id);

    const updatedUstanove = ustanove.map((u) => ({
      ...u,
      drzava: drzavaMap[u.drzava],
      smjerovi: smjerIds,
    }));

    await Ustanova.insertMany(updatedUstanove);
    console.log("Ustanove populated with Smjer and Država references!");

    process.exit();
  } catch (err) {
    console.error("Error populating Ustanove:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateUstanove();
};

runScript();
