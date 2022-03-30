import Book from "../models/book.js";
import fetch from "node-fetch";

export const seed = async () => {
  return await fetch("https://anapioficeandfire.com/api/books/")
    .then((res) => res.json())
    .then(async (res) => {
      await Promise.all(
        res.map(async (book) => {
          const newBook = await new Book({ ...book });
          await newBook.save();
        })
      );
    });
};
