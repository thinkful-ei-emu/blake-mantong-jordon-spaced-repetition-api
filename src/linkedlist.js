const LanguageService = require('./language/language-service.js');

let LinkedListHelpers = {
  async moveOne(db, user_id , head_id, newIndex = 1){
    let currNode = await LanguageService.getWord(db, head_id);
    let nextNode = await LanguageService.getWord(db, currNode.next);
    await LanguageService.updateUsersLanguage(db, user_id, {head : nextNode.id});
    await LanguageService.updateWord(db, nextNode.id, {next : currNode.id} );
    await LanguageService.updateWord(db, currNode.id, {next : nextNode.next} );
  }
}

export default LinkedListHelpers;