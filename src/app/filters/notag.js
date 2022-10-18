function notag() {
  return function (text) {
    if (text) {
      return text.replace(/<.*?>/g, '');
    }
  };
}

module.exports = notag;
