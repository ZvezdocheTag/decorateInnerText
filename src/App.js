import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super() 
    this.state = {
      html: '',
      renderHtml: '',
      currentCutLength: 0,
      delayTime: 3000
    }
    
  }
  componentWillMount() {
    fetch('/doc')
    .then(res => res.json())
    .then(res => {
      this.setState({
        html: res.doc,
        renderHtml: res.doc
      })
    })
    .catch(err => console.log(err))
  }

  returnReRender() {
    return {__html: this.state.renderHtml}
  }

  wordDecorator(word) {
    return `<span class="word-red-bg">${word}</span> `
  }

  getResult({startText, base, endText, stringForDecor}) {
    let startRes = base.slice(0, startText);
    let endRes = base.slice(endText, base.length);
    let result = this.wordDecorator(stringForDecor);

    return startRes + result + endRes;
  }

  getWorkingString({ withoutTag }) {
    return withoutTag.input.slice(withoutTag[0].length, withoutTag.input.length);
  }

  prepares(str, base) {
    let withoutTag = this.parseStringWithoutTag(str);
    if(withoutTag === null) {
      console.log("DOCUMENT END")
      return {
        resutl: str
      }
    }
    let pwa = '';
    let { currentCutLength } = this.state;
    
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

      this.setState({
        currentCutLength: endText
      })

      pwa = this.getResult({startText, base, endText, stringForDecor})
      
    } else {
      let emptySpace = str.indexOf(' ');
      let endText = currentCutLength + emptySpace + 1;
      let stringForDecor = str.slice(0, emptySpace)

      this.setState({
        currentCutLength: endText
      })
     
      pwa = this.getResult({startText: currentCutLength, base, endText, stringForDecor})
    }

    return {
      result: pwa
    };
  }
  parseStringWithoutTag(str) {
    // Регулярка проверяющая наличие тегов
    let myR = /<\/?[A-Za-z][^>]*>/;
    return myR.exec(str.trim());
  }

  componentDidMount() {
    let self = this;
    setInterval(function() {
      let { html, currentCutLength, count } = self.state;
      let second = html.slice(currentCutLength, html.length).trim();
      self.setState({
        renderHtml: self.prepares(second, html).result,
        count: count + 1
      })

    }, this.state.delayTime)
  }

  render() {
    return (
      <div className="App">
        <div dangerouslySetInnerHTML={this.returnReRender()} />;
      </div>
    );
  }
}

export default App;
