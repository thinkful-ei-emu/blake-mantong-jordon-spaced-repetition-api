const LanguageService = require('./language/language-service.js');

let LinkedListHelpers = {
  async moveOne(db, user_id, head_id){
    let currNode = await LanguageService.getWord(db, head_id);
    let nextNode = await LanguageService.getWord(db, currNode[0].next);
    await LanguageService.updateUsersLanguage(db, user_id, {head : nextNode[0].id});
    await LanguageService.updateWord(db, nextNode[0].id, {next : currNode[0].id} );
    await LanguageService.updateWord(db, currNode[0].id, {next : nextNode[0].next});
  },
  async moveMany(db, user_id, head_id, index = 1){
    let head = await LanguageService.getWord(db, head_id);
    let currNode = await LanguageService.getWord(db, head_id);
    await LanguageService.updateUsersLanguage(db, user_id, {head : currNode[0].next});
    let i = 0;
    while(currNode[0].next && i < index ){
      currNode = await LanguageService.getWord(db, currNode[0].next);
      i++;
    }
    await LanguageService.updateWord(db, currNode[0].id, {next : head[0].id} );
    await LanguageService.updateWord(db, head[0].id, {next : currNode[0].next});
  }
};

module.exports= LinkedListHelpers;