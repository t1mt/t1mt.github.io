(function () {
  function showMainPage () {
    document.getElementById('main').className = 'container';  // remove class 'hide'
    document.getElementById('loading').className += ' hide';  // add class 'hide'
  }

  function showError (message) {
    document.getElementById('alert-box').innerHTML
      += '<div class="alert alert-danger">'
      +    '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
      +    message
      +  '</div>';
  }

  // 1. check query string
  var query = location.search.substring(1);
  if (query.length === 0) {
    showMainPage();
    return;
  }

  // 2. get id and file name
  query = query.split('/');
  var myid = query[0];
  var fileName = decodeURIComponent(query[1] || '');

  // 3. fetch data
  fetch('https://api.github.com/gists/' + myid)
  .then(function (res) {
    return res.json().then(function (body) {
      if (res.status === 200) {
        return body;
      }
      // console.log(res, body); // debug
      throw new Error('<strong>' + myid + '</strong>, ' + body.message.replace(/\(.*\)/, ''));
    });
  })
  .then(function (info) {
    if (fileName === '') {
      for (var file in info.files) {
        // index.html or the first file
        if (fileName === '' || file === 'index.html') {
          fileName = file;
        }
      }
    }

    if (info.files.hasOwnProperty(fileName) === false) {
      throw new Error('File <strong>' + fileName + '</strong> is not exist');
    }

    // 5. write data
    var content = info.files[fileName].content;
    document.write(content);
  })
  .catch(function (err) {
    showMainPage();
    showError(err.message);
  });
})();
