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
  .get('/head', async (req, res, next) => {
    try {
      LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id,
      ) 
      .then(languages => {   
        let resArr = []
        let i = 0;
        while(i < languages.length){
          const head = language.head
          LanguageService.getWord(
          req.app.get('db'),
          head )
          .then(word => {
            console.log(word);
            const newLang =
            {
              nextWord: word.original,
              totalScore: language[i].total_score,
              wordCorrectCount: word.correct_count,
              wordIncorrectCount: word.incorrect_count,
            };
            console.log(newLang);
            resArr.push(newLang);
            i++;
          });
        }
        console.log(resArr)
        res.status(200).json(resArr);
        })
        next()
    }
    catch (error){
      next(error)
    }
  })
languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })

module.exports = languageRouter
