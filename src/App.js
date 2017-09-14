import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super() 
    this.state = {
      html: '',
      renderHtml: '',
      currentCutLength: 0,
      count: 0,
      counter: 0
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

  wordDecorator(word) {
    return `<span class="word-red-bg">${word}</span> `
  }

  getResult({startText, base, longside, decor}) {
    let startRes = base.slice(0, startText);
    let endRes = base.slice(longside, base.length);
    let result = this.wordDecorator(decor);

    return startRes + result + endRes;
  }

  prepares(str, base) {
    let withoutTag = this.parseStringWithoutTag(str);
    let pwa = '';
    let { currentCutLength } = this.state;
    
    if(withoutTag.index < 2) {
      // Cчитаем длинну нашедшего тега от начала
      let startText = withoutTag.index + withoutTag[0].length + currentCutLength;
      // Строка без тега
      let workString = withoutTag.input.slice(withoutTag[0].length, withoutTag.input.length);
      // Ищем в строке первый пробел
      let emptySpace = workString.indexOf(' ');
      // Позиция до первого пробела от начала
      let longside = startText + emptySpace + 1;
      let decor = workString.slice(0, emptySpace)
      this.setState({
        currentCutLength: longside
      })

      pwa = this.getResult({startText, base, longside, decor})
      
    } else {
      let emptySpace = str.indexOf(' ');
      let startText = currentCutLength
      let longside = startText + emptySpace + 1;
      let decor = str.slice(0, emptySpace)

      this.setState({
        currentCutLength: longside
      })
     
      pwa = this.getResult({startText, base, longside, decor})
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
    let launchHTMLdecor = setInterval(function() {
      let { html, currentCutLength, count } = self.state;
      let second = html.slice(currentCutLength, html.length).trim();
      self.setState({
        renderHtml: self.prepares(second, html).result,
        count: count + 1
      })

    }, 3000)

    this.setState({
      counter: launchHTMLdecor
    })

  }

  componentWillUnmount() {
    if(this.state.count > 5) {
     
      clearInterval(this.state.counter)
    }
  }
  render() {
    let prepared = {__html: this.state.html}
    let anotherVarian = new DOMParser();

    let a = anotherVarian.parseFromString(this.state.html, "text/xml")
    let content = document.querySelector('.content');


    return (

      <div className="App">
        <div dangerouslySetInnerHTML={this.returnReRender()} />;
      </div>
    );
  }
}

export default App;
