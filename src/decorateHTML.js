class DecorateHTML {
    constructor(str, base, currentCutLength) {
        this.currentCutLength = currentCutLength;
        this.str = str;
        this.base = base;
        this.htmlResult = '';
    }

    getResult() {
        return {
            html: this.prepares().html,
            currentCutLength: this.prepares().cut
        }
    }

    wordDecorator(word) {
        return `<span class="word-red-bg">${word}</span> `
    }

    getResultParse({startText, endText, stringForDecor}) {
        let { base } = this;
        let startRes = base.slice(0, startText);
        let endRes = base.slice(endText, base.length);
        let result = this.wordDecorator(stringForDecor);
    
        return startRes + result + endRes;
      }
    
      getWorkingString({ withoutTag }) {
        return withoutTag.input.slice(withoutTag[0].length, withoutTag.input.length);
      }

      prepares() {
        let { base, currentCutLength, htmlResult, str } = this; 
        let withoutTag = this.parseStringWithoutTag(str);

        if(withoutTag.index < 2) {
          // Cчитаем длинну нашедшего тега от начала
          let startText = withoutTag.index + withoutTag[0].length + currentCutLength;
          // Строка без тега
          let workString = this.getWorkingString({ withoutTag });
          // Ищем в строке первый пробел
          let emptySpace = workString.indexOf(' ');
          // Позиция до первого пробела от начала
          let endText = startText + emptySpace + 1;
          let stringForDecor = workString.slice(0, emptySpace)
    
          currentCutLength = endText;

          htmlResult = this.getResultParse({startText, base, endText, stringForDecor})
          
        } else {
          let emptySpace = str.indexOf(' ');
          let endText = currentCutLength + emptySpace + 1;
          let stringForDecor = str.slice(0, emptySpace)
    
          currentCutLength = endText;
         
          htmlResult = this.getResultParse({startText: currentCutLength, base, endText, stringForDecor})
        }

        return {
            html: htmlResult,
            cut: currentCutLength
        };
      }

      parseStringWithoutTag() {
        // Регулярка проверяющая наличие тегов
        let myR = /<\/?[A-Za-z][^>]*>/;
        return myR.exec(this.str.trim());
      }
}

export default DecorateHTML;

