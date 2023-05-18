export class FMInsidePlayer{
    constructor(doc){
        this.doc = doc;
        this.GetBasicInfo();
    }

    GetBasicInfo(){
        this.name = this.doc.querySelector('#player_info #player .title .meta h1').getAttribute('title');
    }

}