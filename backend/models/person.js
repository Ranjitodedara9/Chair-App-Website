const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
});

personSchema.pre("save", async function (next) {
  const person = this;

  if (!person.isModified("password")) {
    return next();
  }
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(person.password, salt);
    person.password = hashpassword;
    next();
  } catch (err) {
    next(err);
  }
});

personSchema.methods.comparePassword = async function (candidatepassword) {
  try {
    const isMatch = await bcrypt.compare(candidatepassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
