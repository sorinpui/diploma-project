const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const mongoose = require("mongoose");
const multer = require("multer");
const Grid = require("gridfs-stream");
const methodOverride = require('method-override');
const crypto = require('crypto');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');

const {
  createPerformance,
  getPerformances,
  getPerformance,
  updatePerformance
} = require("../controllers/performanceController");

// declare gridfs stream
let gfs = null;

// declare gridfs bucket
let gridFsBucket = null;

// connection to MongoDB
const connection = mongoose.createConnection(process.env.MONGODB_URI);
connection.once("open", () => {
  // initialize the bucket
  gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads"
  });
  // initiliaze the gfs stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

let storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

const router = express.Router();

// require auth for all performance routes
router.use(requireAuth);
router.use(methodOverride("_method"));

// CREATE
router.post("/", upload.single("file"), createPerformance);

// READ
router.get("/:id", getPerformance);
router.get("/", getPerformances);

// DOWNLOAD performance video
router.get('/download/:id', async (req, res) => {
  // id -> the id of the video performance
  const { id } = req.params;

  gfs.files.findOne({ "_id": mongoose.Types.ObjectId(id) }, (err, file) => {
    if (err) {
      return res.status(404).json({errorMessage: err.message});
    }

    if (!file || file.length === 0) {
      return res.status(404).json({errorMessage: 'No file exists'});
    }

    res.set('Content-Type', file.contentType);
    // res.set('Content-Disposition', `attachment; filename=${file.filename}`);
    res.set("Content-Disposition", "attachment");
    
    const readStream = gridFsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  });
});

// DELETE performance video
router.delete("/delete/:id", async (req, res) => {
  try {
    await gridFsBucket.delete(mongoose.Types.ObjectId(req.params.id));
  } catch (err) {
    return res.status(404).json({errorMessage: err.message});
  }
});

// UPDATE
router.patch("/:id", updatePerformance);

module.exports = router;
