const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', (req, res, next) => {
    try {
      console.log(req.language);
      LanguageService.getWord(
        req.app.get('db'),
        req.language.head )
        .then(word => {
          console.log(word);
          const newLang =
          {
            nextWord: word[0].original,
            totalScore: req.language.total_score,
            wordCorrectCount: word[0].correct_count,
            wordIncorrectCount: word[0].incorrect_count,
          };
          console.log(newLang);
          res.status(200).json(newLang);
          next();
        })
    }
    catch (error){
      next(error)
    }
  })
languageRouter
  .post('/guess', async (req, res, next) => {
    
    res.send('implement me!')
  })

module.exports = languageRouter
