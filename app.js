const express = require("express");
const app = express();
const PORT = 3000;

//File system: In-built in NodeJs
const fs = require("fs");

const dbConnection = require("./database/dbConnection");
const Book = require("./model/bookModel");
dbConnection();

app.use(express.json());

//Cors:
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

//Imports MulterConfig:
const { upload } = require("./middleware/multerConfig");
// const { multer, storage } = require("./middleware/multerConfig");
// const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Successful",
  });
});

//Add Book:
app.post("/book", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const serverUrl = "http://localhost:3000";

  let fileName;
  if (!req.file) {
    fileName =
      "https://img.freepik.com/free-vector/hand-drawn-world-book-day-background_23-2149301166.jpg";
  } else {
    fileName = `${serverUrl}/${req.file.filename}`;
  }
  const {
    bookName,
    bookPrice,
    authorName,
    publication,
    publishedAt,
    isbnNumber,
  } = req.body;
  await Book.create({
    bookName,
    bookPrice,
    authorName,
    publication,
    publishedAt,
    isbnNumber,
    imageUrl: fileName,
  });
  res.status(200).json({
    message: "Book added succesfully",
  });
});

//Multiple Read:
app.get("/book", async (req, res) => {
  const books = await Book.find(); //return array
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});

//Single Read:
app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id); //return object
    if (!book) {
      res.status(404).json({
        message: "No book found of that id.",
      });
    } else {
      res.status(200).json({
        message: "Single book fetched succussfully",
        data: book,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//Delete Book:
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  const oldData = await Book.findById(id);
  const serverUrl = "http://localhost:3000/";
  const oldImagePath = oldData.imageUrl;
  const localHostUrlLength = serverUrl.length;
  const newImagePath = oldImagePath.slice(localHostUrlLength);
  console.log(newImagePath);

  fs.unlink(`./storage/${newImagePath}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted successfully");
    }
  });

  await Book.findByIdAndDelete(id);
  res.status(200).json({
    message: "Book deleted successully",
  });
});

//Update Book:
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const {
      bookName,
      bookPrice,
      authorName,
      isbnNumber,
      publication,
      publishedAt,
    } = req.body;
    const oldData = await Book.findById(id);

    let fileName;
    if (req.file) {
      const oldImagePath = oldData.imageUrl;
      const localHostUrlLength = serverUrl.length;
      const newImagePath = oldImagePath.slice(localHostUrlLength);
      console.log(newImagePath);

      // 'unlink' method to delete file
      fs.unlink(`./storage/${newImagePath}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File deleted successfully");
        }
      });
      fileName = serverUrl + req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(id, {
      bookName,
      bookPrice,
      authorName,
      isbnNumber,
      publication,
      publishedAt,
      imageUrl: fileName,
    });
    if (!book) {
      res.status(404).json({
        message: "No book found",
      });
    } else {
      res.status(200).json({
        message: "Book updated successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

//To give access of storage folder:
app.use(express.static("./storage/"));

app.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
});
