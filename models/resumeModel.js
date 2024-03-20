const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  themeName: {
    type: String,
  },
  personalData: {
    type: Object,
  },
  projectData: {
    projectTitles: {
      type: Object,
    },
    projectDesc: {
      type: Object,
    },
  },
  educationData: {
    educationTitles: {
      type: Object,
    },
    educationDesc: {
      type: Object,
    },
  },
  workData: {
    workTitles: {
      type: Object,
    },
    workDesc: {
      type: Object,
    },
  },
  awardData: {
    awards: {
      type: Object,
    },
  },
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
