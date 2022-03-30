import fetch from "node-fetch";
import mongoose from "../database/index.js";
import Character from "./character.js";
import { encode } from "node-base64-image";

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
    },
  ],
  numberOfPages: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
  },
  released: {
    type: Date,
  },
  povCharacters: [
    {
      type: String,
    },
  ],
  mainCharacters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
    },
  ],
  cover: {
    type: String,
  },
});

BookSchema.pre("save", async function (next) {
  await Promise.all(
    this.povCharacters.map(async (char) => {
      const character = await fetch(char).then((res) =>
        res.json().then(async (res) => {
          const { url, books, spouse, allegiances, povBooks, ...filteredChar } =
            res;

          const newCharacter = await Character.findOneAndUpdate(
            { ...filteredChar },
            { $push: { povBooks: this._id } },
            { new: true, upsert: true }
          );

          await newCharacter.save();
          this.mainCharacters.push(newCharacter._id);
        })
      );
    })
  );

  next();
});

BookSchema.pre("save", async function (next) {
  this.povCharacters = this.mainCharacters;
  this.mainCharacters = undefined;

  const coverUrl = `https://covers.openlibrary.org/b/isbn/${this.isbn}-L.jpg`;
  this.cover = await encode(coverUrl, { string: true });

  next();
});

const Book = mongoose.model("Book", BookSchema);

export default Book;
