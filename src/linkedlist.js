const LanguageService = require('./language/language-service.js');

let LinkedListHelpers = {
  async movePositionInLinkedList(db, user_id, head_id, index = 1){
    let head = await LanguageService.getWord(db, head_id);
    let currNode = await LanguageService.getWord(db, head_id);
    await LanguageService.updateUsersLanguage(db, user_id, {head : currNode.next});
    let i = 0;
    while(currNode.next && i < index ){
      currNode = await LanguageService.getWord(db, currNode.next);
      i++;
    }
    await LanguageService.updateWord(db, currNode.id, {next : head.id} );
    await LanguageService.updateWord(db, head.id, {next : currNode.next});
  }
};

module.exports= LinkedListHelpers;