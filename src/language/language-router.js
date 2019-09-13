const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const languageRouter = express.Router();
const jsonBodyParser = express.json();
const LinkedListHelpers = require('../linkedlist.js');
const bodyParser = express.json()

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
            nextWord: word[0].original,
            totalScore: req.language.total_score,
            wordCorrectCount: word[0].correct_count,
            wordIncorrectCount: word[0].incorrect_count,
          };
          //console.log(nextWord);
          res.status(200).json(nextWord);
          next();
        });
    }
    catch (error) {
      next(error);
    }
  });

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try{
      const { guess } = req.body;      
      if(!guess){
        res.status(400).json({error: `Missing 'guess' in request body`});
        next();
      }
      const words = await LanguageService.getWord(
        req.app.get('db'),
        req.language.head);
      const word = words;     
      let newM = word.memory_value;
      let correct_count = word.correct_count;
      let incorrect_count = word.incorrect_count;
      let total_score = req.language.total_score;
      let isCorrect = (guess === word.translation);
      if (isCorrect) {
        newM = newM * 2;
        correct_count++;
        total_score++;
        await LinkedListHelpers.moveMany(req.app.get('db'), req.user.id, word.id, newM);
      }
      else {
        newM = 1;
        incorrect_count++;
        await LinkedListHelpers.moveMany(req.app.get('db'), req.user.id, word.id);
      }
      await LanguageService.updateWord(req.app.get('db'), word.id, { memory_value: newM, correct_count, incorrect_count });
      await LanguageService.updateUsersLanguage(req.app.get('db'), req.user.id, { total_score });
      const nextWords = await LanguageService.getWord(
        req.app.get('db'),
        word.next);
      const nextWord = nextWords;
      let myResponse = {
        nextWord: nextWord.original,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        totalScore: total_score,
        answer: word.translation,
        isCorrect
      };

      res.status(200).json(myResponse);
      next();
    }
    catch (error) {
      next(error);
    }

  });

module.exports = languageRouter;
