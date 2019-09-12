const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },
  updateUsersLanguage(db, user_id, language) {
    return db
      .from('language')
      .where('language.user_id', user_id)
      .update(language)
      .returning('*');
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
<<<<<<< HEAD

  getLanguageHead(db, language_id) {
    return db
      .from('language')
      .select('*')
      .where({ id: language_id });

  },
  updateWord(db, word_id, word){
    return db
      .from('word')
      .where({ id: word_id })
      .update(word)
      .returning('*');
  },
  getWord(db, word_id) {
    return db
      .from('word')
      .select (
        '*'
      )
      .where({ id: word_id });
      
  }
};
=======
  getWord(db, word_id) {
    return db
      .from('word')
      .select('*')
      .where({ id: word_id })
      .first();
  },
}
>>>>>>> cfce3aae1c1afae89d56fb7f4fc4f6ead21e5d2e

module.exports = LanguageService;
