import Book from "../models/book.js";
import fetch from "node-fetch";
import Character from "../models/character.js";

const books = await fetch("https://anapioficeandfire.com/api/books/")
  .then((res) => res.json())
  .then(async (res) => {
    await Promise.all(
      res.map(async (book) => {
        const newBook = await new Book({ ...book });
        await newBook.save();
      })
    );
  });

// const newCharacter = await new Character({ ...characters });
// await newCharacter.save();

// console.log(characters);

// await Promise.all(
//   books.map(async (book) => {
//     if (book.povCharacters[0]) {
//       book.povCharacters.map(async (character) => {
//         const newCharacter = await new Character({
//           ...fetch(character).then((res) => res.json()),
//         });
//         await newCharacter.save();

//         character = newCharacter._id;
//       });
//     }

//     const newBook = await new Book({ ...book });
//     await newBook.save();
//   })
// );
