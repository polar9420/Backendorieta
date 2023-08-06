import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import User from "../models/User.js"
import { createHash, isValidPassword } from "../utils.js"
import { Logger } from "../logger/index.js"

const LocalStrategy = local.Strategy
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body

          const user = await User.findOne({ email: username })
          if (user) {
            console.log("User already exists")
            return done(null, false)
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          }

          const result = await User.create(newUser)

          return done(null, result)
        } catch (error) {
          return done("Error when trying to find user: " + error)
        }
      }
    )
  )

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username })
          if (!user) return done(null, false)

          if (!isValidPassword(user, password)) return done(null, false)

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          Logger.info(profile)
          // * Chequear si el usuario existe en la db
          const user = await User.findOne({ email: profile._json.login })

          // * Si el usuario no existe, crearlo
          if (!user) {
            const newUser = await User.create({
              first_name:
                profile.displayName || profile.username || profile._json.login,
              last_name: null,
              email: profile._json.login,
              password: "",
              role: "user",
              age: null,
            })

            const result = await newUser.save()
            return done(null, result)
          } else {
            // * Si existe, devolver el usuario
            return done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  })
}

export default initializePassport
