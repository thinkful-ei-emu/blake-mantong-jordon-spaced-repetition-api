const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const languageRouter = express.Router();
const LinkedListHelpers = require('../linkedlist.js');

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      );

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        });
      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );
      res.json({
        language: req.language,
        words,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      await LanguageService.getWord(
        req.app.get('db'),
        req.language.head
      )
        .then(word => {
          const nextWord =
          {
            nextWord: word.original,
            totalScore: req.language.total_score,
            wordCorrectCount: word.correct_count,
            wordIncorrectCount: word.incorrect_count,
          };
          console.log(newLang);
          res.json(newLang);
        });
      next();
    }
    catch (error){
      next(error);
    }
  });



languageRouter
  .post('/guess', async (req, res, next) => {
    let {answer} = res.body;
    const word = await LanguageService.getWord(
      req.app.get('db'),
      req.language.head );
     
    let newM = word.memory_value;
    let correct_count = word.correct_count;
    let incorrect_count = word.incorrect_count;
    let total_score = req.language.total_score;
    let isRight = (answer === word.translation);
    if(isRight){
      newM = newM * 2;
      correct_count++;
      total_score ++;
      await LinkedListHelpers.moveMany(req.app.get('db'), req.user.id, word.id, newM);
    }
    else{
      newM = 1;
      incorrect_count++;
      total_score --;
      await LinkedListHelpers.moveOne(req.app.get('db'), req.user.id, word.id);
    }
    await LanguageService.updateWord(req.app.get('db'), word.id, {memory_value : newM, correct_count, incorrect_count});
    await LanguageService.updateUsersLanguage(req.app.get('db'), req.user.id, {total_score});
    



    // implement me
    res.send('implement me!');
  });

module.exports = languageRouter;
