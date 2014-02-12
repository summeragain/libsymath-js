/*jslint white: true, node: true, plusplus: true, vars: true */
/*global module */
'use strict';

function Lexer(buffer) {  
  this.buffer = buffer;
  this.offset = 0;
}

var WHITESPACE  = /\s/,
    S_DIGIT     = /[\d\.]/,
    NUMBER      = /^(\d*\.\d+|\d+)$/,
    S_LETTER    = /[\wа-я]/,
    LITERAL     = /^[\wа-я]+$/,
    OPERATOR    = /^(\+|\-|\*|\/)$/,
    S_BRACKET   = /(\(|\[|\]|\))/,
    BRACKET     = /^(\(|\[|\]|\))$/;

Lexer.prototype.getNextToken = function() {
  var length = this.buffer.length;
  
  while(this.offset < length && WHITESPACE.test(this.buffer[this.offset])) {
    ++this.offset;
  }
  
  if(this.offset === length) {
    return;
  }
  
  var start = this.offset;
  
  if(S_DIGIT.test(this.buffer[this.offset])) {
    while(this.offset < length && S_DIGIT.test(this.buffer[this.offset])) {
      ++this.offset;
    }
  }
  else if(S_LETTER.test(this.buffer[this.offset])) {
    while(this.offset < length && S_LETTER.test(this.buffer[this.offset])) {
      ++this.offset;
    }
  }
  else if(S_BRACKET.test(this.buffer[this.offset])) {
    ++this.offset;
  }
  else {
    while(this.offset < length && !WHITESPACE.test(this.buffer[this.offset])) {
      ++this.offset;
    }
  }
  
  return {
    text: this.buffer.substr(start, this.offset - start),
    loc: {
      start: start,
      end: this.offset
    }
  };
};

Lexer.prototype.getTokenType = function(token) {
  if(!token || !token.text || token.loc.start === undefined || token.loc.end === undefined) {
    throw new ReferenceError('getTokenType() failed: wrong input');
  }
  
  if(NUMBER.test(token.text)) {
    return {
      type: 'number',
      value: parseFloat(token.text),
      loc: token.loc
    };
  }
  
  if(LITERAL.test(token.text)) {
    return {
      type: 'literal',
      value: token.text,
      loc: token.loc
    };
  }
  
  if(OPERATOR.test(token.text)) {
    return {
      type: 'operator',
      value: token.text,
      loc: token.loc
    };
  }
  
  if(BRACKET.test(token.text)) {
    return {
      type: 'bracket',
      value: token.text,
      loc: token.loc
    };
  }
  
  var error = new SyntaxError('invalid token: "' + token.text + '"');
  error.loc = token.loc;
  
  throw error;
};

module.exports = Lexer;