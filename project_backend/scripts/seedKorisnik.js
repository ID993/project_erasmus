const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Korisnik = require("../models/Korisnik");
const Uloga = require("../models/Uloga");

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
    email: "ivo@mail.com",
    sifra: "pass",
    uloga: "admin",
  },
  {
    ime: "Ana",
    prezime: "Maric",
    email: "ana.m@example.com",
    sifra: "pass",
    uloga: "profesor",
  },
  {
    ime: "Marko",
    prezime: "Horvat",
    email: "marko.h@example.com",
    sifra: "pass",
    uloga: "student",
  },
  {
    ime: "Petar",
    prezime: "Jurić",
    email: "petar.juric@example.com",
    sifra: "pass",
    uloga: "student",
  },
  {
    ime: "Marija",
    prezime: "Novak",
    email: "marija.novak@example.com",
    sifra: "pass",
    uloga: "profesor",
  },
];

const populateDatabase = async () => {
  try {
    await Korisnik.deleteMany();
    console.log("Existing users cleared!");

    const roles = await Uloga.find();
    const roleMap = roles.reduce((acc, role) => {
      acc[role.naziv] = role._id;
      return acc;
    }, {});
    console.log("Roles fetched:", roleMap);

    const hashedKorisnici = await Promise.all(
      korisnici.map(async (korisnik) => {
        const hashedPassword = await bcrypt.hash(korisnik.sifra, 10);
        return {
          ...korisnik,
          sifra: hashedPassword,
          uloga: [roleMap[korisnik.uloga]],
        };
      })
    );

    await Korisnik.insertMany(hashedKorisnici);
    console.log("Users populated!");

    process.exit();
  } catch (err) {
    console.error("Error populating database:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateDatabase();
};

runScript();
