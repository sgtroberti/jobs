import mongoose from "../database/index.js";

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  culture: {
    type: String,
  },
  born: {
    type: String,
  },
  died: {
    type: String,
  },
  titles: [
    {
      type: String,
    },
  ],
  aliases: [
    {
      type: String,
    },
  ],
  father: {
    type: String,
  },
  mother: {
    type: String,
  },
  povBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],

  tvSeries: [
    {
      type: String,
    },
  ],
  playedBy: [
    {
      type: String,
    },
  ],
});

const Character = mongoose.model("Character", CharacterSchema);

export default Character;
