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
    select: false,
  },
});

BookSchema.pre("save", async function (next) {
  if (this.povCharacters[0]) {
    await Promise.all(
      this.povCharacters.map(async (char) => {
        if (char.includes("https://")) {
          const character = await fetch(char).then((res) =>
            res.json().then(async (res) => {
              const {
                url,
                books,
                spouse,
                allegiances,
                povBooks,
                ...filteredChar
              } = res;

              const newCharacter = await Character.findOneAndUpdate(
                { ...filteredChar },
                { $push: { povBooks: this._id } },
                { new: true, upsert: true }
              );

              await newCharacter.save();
              this.mainCharacters.push(newCharacter._id);
            })
          );
        }
      })
    );
  }

  next();
});

BookSchema.pre("save", async function (next) {
  if (this.mainCharacters[0]) {
    this.povCharacters = undefined;

    const coverUrl = `https://covers.openlibrary.org/b/isbn/${this.isbn}-L.jpg`;

    if (coverUrl) {
      this.cover = await encode(coverUrl, { string: true });
    } else {
      this.cover = "";
    }
  }

  next();
});

const Book = mongoose.model("Book", BookSchema);

export default Book;
