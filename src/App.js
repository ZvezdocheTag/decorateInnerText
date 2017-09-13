import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super() 
    this.state = {
      html: '',
      renderHtml: '',
      lastIndexOf: 0,
      first: null,
      currentCutLength: 0,
      currentString: '',
      count: 0
    }
    
  }
  componentWillMount() {
    fetch('/doc')
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      this.setState({
        html: res.doc,
        renderHtml: res.doc
      })
    })
    .catch(err => err)
  }

  returnReRender() {
    let html = this.state.renderHtml;
    return {__html: this.state.renderHtml};
  }



  findNextWord(str, lastId) {

    let index = lastId;
    let self = this;

    // console.log(index)
    return function() {
      let secondIndex = str.indexOf(' ', index + 1);
      let sliceWord = str.slice(index, secondIndex);
      let decorWord = self.wordDecorator(sliceWord);

      let full = str.slice(0, index) + decorWord + str.slice(secondIndex, str.length);
      return {
        html: decorWord,
        lastIndex: secondIndex,
        fullHTML: full
      }
      // console.log(decorWord)
    }
  }

  wordDecorator(word) {
    return `<span class="word-red-bg">${word}</span> `
  }

  // findWord(st) {
  //   // находим в строке первое совпадение между тегами
  //   let as = str.match(/(>)(.*?)(?=\<)/i);
  //   let item = as[0].slice(1, as.length);

  //   console.log(item);

  // }

  selectString(str) {
    // находим в строке первое совпадение между тегами
    let as = str.match(/>[^<<]*/i);
    let prep = as[0].slice(1, as[0].length).trim();
    // console.log(prep)
    let lastIndex = as.index + as[0].indexOf(' ');
    let data = str.slice(as.index, lastIndex);
    return {
      data: data,
      first: as.index,
      last: lastIndex,
      length: as[0].length + as.index
    };
  }

  resultString(str, start, end, data) {
    return str.substr(0, start + 1) + this.wordDecorator(data) + str.substr(end, str.length);
  }

  componentDidMount() {
    let self = this;

    // console.log(html.doc)
    let goCaunt = setTimeout(function() {
      let html = self.state.html;

      function prepares(str, base) {

        // Регулярка проверяющая наличие тегов
        let myR = /<\/?[A-Za-z][^>]*>/;
        let withoutTag = myR.exec(str.trim());
        // console.log(withoutTag)
        let pwa = '';
        let longside = null;
        if(withoutTag.index < 2) {
          // Cчитаем длинну нашедшего тега от начала
          
          let startText = withoutTag.index + withoutTag[0].length + self.state.currentCutLength;

          // Строка без тега
          let workString = withoutTag.input.slice(withoutTag[0].length, withoutTag.input.length);
          // Ищем в строке первый пробел
          let emptySpace = workString.indexOf(' ');
          // Позиция до первого пробела от начала
          longside = startText + emptySpace ;

          self.setState({
            currentCutLength: longside
          })

          // Начало и конец первоначальной строки
          let startRes = base.slice(0, startText);
          let endRes = base.slice(longside, base.length);
          // Берем первое слово до пробела
          let decor = workString.slice(0, emptySpace)
          // Декорируем єто слово
          let result = self.wordDecorator(decor);
          // результат
          pwa = startRes + result + endRes;
          
        } else {

          let emptySpace = str.indexOf(' ');
          let decor = str.slice(0, emptySpace)
          let result = self.wordDecorator(decor);
          let startText = self.state.currentCutLength;
          let longside = startText + emptySpace;

          self.setState({
            currentCutLength: longside
          })
          let startRes = base.slice(0, startText);
          let endRes = base.slice(longside, base.length);
          pwa = startRes + result + endRes;


        }
        return {
          result: pwa,
          lastIndex: longside
        };
      }
        
      let second = self.state.html.slice(self.state.currentCutLength, 500).trim();
      console.log(second , "%c INTERVAL", 'color: red;')
      self.setState({
        renderHtml: prepares(second, self.state.html).result,
        count: self.state.count + 1
      })

    }, 5000)


  }

  consolidate(item) {
    // console.log(item)
  }
  render() {
    // let prepared = this.state.html.slice(1, this.state.html.length - 1);
    let prepared = {__html: this.state.html}
    let anotherVarian = new DOMParser();

    let a = anotherVarian.parseFromString(this.state.html, "text/xml")
    let content = document.querySelector('.content');
    this.consolidate(content)
    // console.log(content)
    return (

      <div className="App">
        <div dangerouslySetInnerHTML={this.returnReRender()} />;
      </div>
    );
  }
}

export default App;
