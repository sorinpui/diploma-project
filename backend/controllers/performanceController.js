const mongoose = require("mongoose");
const Perf = require("../models/Performance");
const User = require("../models/User");

// POST a performance
const createPerformance = async (req, res) => {
  const { _id: performer_id } = req.user;
  
  const {piece, composer, period} = req.body;
  const video_id = req.file.id;
  
  let emptyFields = [];

  if (!piece) {
    emptyFields.push("piece");
  }

  if (!composer) {
    emptyFields.push("composer");
  }

  if (!period) {
    emptyFields.push("period");
  }

  try {
    if (emptyFields.length > 0) {
      throw new Error("All fields are mandatory.");
    }
    
    const performance = await Perf.create({ piece, composer, period, video_id, performer_id });
    await User.findByIdAndUpdate(performer_id, { "$push": { "performances": performance.id }});
    
    res.status(200).json(performance);

  } catch (error) {
    res.status(400).json({errorMessage: error.message, emptyFields});
  }
};

// UPDATE performance
const updatePerformance = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({errorMessage: "The performance doesn't exist."});
  }

  const {intScore, diffScore, techScore} = req.body;

  let emptyFields = [];

  if (!intScore) {
    emptyFields.push("intScore");
  }

  if (!diffScore) {
    emptyFields.push("diffScore");
  }

  if (!techScore) {
    emptyFields.push("techScore");
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({errorMessage: "Please provide all the scores.", emptyFields});
  }

  const updatedScores = {
    interpretation_score: Number(intScore),
    difficulty_score: Number(diffScore),
    technical_score: Number(techScore)
  }

  const performance = await Perf.findByIdAndUpdate(
    req.params.id, 
    {...updatedScores}, 
    {returnDocument: "after"}).populate("performer_id");

  if (!performance) {
    return res.status(404).json({errorMessage: "The performance doesn't exist.", emptyFields});
  }

  res.status(200).json(performance);
}

const getPerformance = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({errorMessage: "The performance doesn't exist."});
  }

  const performance = await Perf.findById(req.params.id).populate("performer_id");
  if (!performance) {
    return res.status(404).json({errorMessage: "The performance doesn't exist."});
  }
  
  res.status(200).json(performance);
};

const getPerformances = async (req, res) => {
  const query = req.query.period;

  let performances = [];

  if (query) {
    performances = await Perf.find({period: query}).populate("performer_id").sort({updatedAt: -1});
  } else {
    performances = await Perf.find({}).populate("performer_id").sort({updatedAt: -1});
  }
  res.status(200).json(performances);
};

module.exports = { createPerformance, getPerformances, getPerformance, updatePerformance };
