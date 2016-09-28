function notag() {
  return function (text) {
    return text.replace(/<.*?>/g, '');
  };
}

module.exports = notag;
