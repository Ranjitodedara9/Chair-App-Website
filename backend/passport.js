const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Person = require("./models/person");
const { generateToken } = require("./jwt");

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Person.findOne({ username });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const passwordMatch = await user.comparePassword(password);

      if (passwordMatch) {
        const token = generateToken({ username: user.username });

        return done(null, { token });
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;
