const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Korisnik = require("../models/Korisnik");

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
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

const korisnici = [
  {
    ime: "Ivo",
    prezime: "Damjanovic",
    email: "ivo.d@example.com",
    sifra: "pass",
  },
  { ime: "Ana", prezime: "Maric", email: "ana.m@example.com", sifra: "pass" },
  {
    ime: "Marko",
    prezime: "Horvat",
    email: "marko.h@example.com",
    sifra: "pass",
  },
  {
    ime: "Petar",
    prezime: "Jurić",
    email: "petar.juric@example.com",
    sifra: "pass",
  },
  {
    ime: "Marija",
    prezime: "Novak",
    email: "marija.novak@example.com",
    sifra: "pass",
  },
  {
    ime: "Ivana",
    prezime: "Perić",
    email: "ivana.peric@example.com",
    sifra: "pass",
  },
  {
    ime: "Luka",
    prezime: "Babić",
    email: "luka.babic@example.com",
    sifra: "pass",
  },
  {
    ime: "Ana",
    prezime: "Kovač",
    email: "ana.kovac@example.com",
    sifra: "pass",
  },
  {
    ime: "Davor",
    prezime: "Šimić",
    email: "davor.simic@example.com",
    sifra: "pass",
  },
  {
    ime: "Maja",
    prezime: "Horvat",
    email: "maja.horvat@example.com",
    sifra: "pass",
  },
  {
    ime: "Tomislav",
    prezime: "Zorić",
    email: "tomislav.zoric@example.com",
    sifra: "pass",
  },
  {
    ime: "Katarina",
    prezime: "Božić",
    email: "katarina.bozic@example.com",
    sifra: "pass",
  },
  {
    ime: "Filip",
    prezime: "Grgić",
    email: "filip.grgic@example.com",
    sifra: "pass",
  },
  {
    ime: "Martina",
    prezime: "Lovrić",
    email: "martina.lovric@example.com",
    sifra: "pass",
  },
  {
    ime: "Josip",
    prezime: "Čupić",
    email: "josip.cupic@example.com",
    sifra: "pass",
  },
  {
    ime: "Lea",
    prezime: "Milić",
    email: "lea.milic@example.com",
    sifra: "pass",
  },
  {
    ime: "Andrej",
    prezime: "Radnić",
    email: "andrej.radnic@example.com",
    sifra: "pass",
  },
  {
    ime: "Helena",
    prezime: "Zidar",
    email: "helena.zidar@example.com",
    sifra: "pass",
  },
  {
    ime: "Marko",
    prezime: "Šarić",
    email: "marko.saric@example.com",
    sifra: "pass",
  },
  {
    ime: "Sara",
    prezime: "Lukić",
    email: "sara.lukic@example.com",
    sifra: "pass",
  },
  {
    ime: "Nikola",
    prezime: "Barić",
    email: "nikola.baric@example.com",
    sifra: "pass",
  },
  {
    ime: "Nina",
    prezime: "Krnić",
    email: "nina.krnic@example.com",
    sifra: "pass",
  },
  {
    ime: "Ema",
    prezime: "Živković",
    email: "ema.zivkovic@example.com",
    sifra: "pass",
  },
];

const populateKorisnici = async () => {
  try {
    await Korisnik.deleteMany();

    const hashedKorisnici = await Promise.all(
      korisnici.map(async (korisnik) => {
        const hashedPassword = await bcrypt.hash(korisnik.sifra, 10);
        return { ...korisnik, sifra: hashedPassword };
      })
    );

    await Korisnik.insertMany(hashedKorisnici);
    console.log("Korisnici added to the database!");

    process.exit();
  } catch (err) {
    console.error("Error populating Korisnici:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateKorisnici();
};

runScript();
