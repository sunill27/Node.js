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
  const serverUrl = "https://node-js-dc34.onrender.com";

  let fileName;
  if (!req.file) {
    fileName =
      "https://wallpapers.com/images/featured/aesthetic-book-pictures-gl5fohbknw1j6r0z.jpg";
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

// Delete book
app.delete("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const oldData = await Book.findById(id);

    if (
      oldData &&
      oldData.imageUrl &&
      oldData.imageUrl.includes(req.get("host"))
    ) {
      const fileName = oldData.imageUrl.split("/").pop();
      const filePath = path.join(__dirname, "storage", fileName);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete old file:", err.message);
        } else {
          console.log("Old file deleted successfully");
        }
      });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// Update book
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

    let updatedFields = {
      bookName,
      bookPrice,
      authorName,
      isbnNumber,
      publication,
      publishedAt,
    };

    if (req.file) {
      if (
        oldData &&
        oldData.imageUrl &&
        oldData.imageUrl.includes(req.get("host"))
      ) {
        const oldFileName = oldData.imageUrl.split("/").pop();
        const oldFilePath = path.join(__dirname, "storage", oldFileName);

        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Failed to delete old file:", err.message);
          } else {
            console.log("Old file deleted successfully");
          }
        });
      }

      const serverUrl = getServerUrl(req);
      updatedFields.imageUrl = `${serverUrl}/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        message: "No book found with that id.",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
//To give access of storage folder:
app.use(express.static("./storage/"));

app.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
});
