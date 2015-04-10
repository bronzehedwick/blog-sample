(function sampleBlog() {
  'use strict';

  function parsePosts(posts) {
    if (window.location.hash) {
      // We are on a single post page
    }
    else {
      // We are on the main page
      for (var post in posts) {
        if (posts.hasOwnProperty(post)) {
          var articleEl = document.createElement('article'),
              headingEl = document.createElement('heading'),
              h2El      = document.createElement('h2'),
              timeEl    = document.createElement('time'),
              imgEl     = document.createElement('img'),
              pEl       = document.createElement('p'),
              mainEl    = document.getElementById('main'),
              date      = new Date(posts[post].date);

          h2El.innerHTML = posts[post].title;
          timeEl.setAttribute('datetime', date);
          timeEl.innerHTML = (date.getMonth() + 1) + '/' + date.getDay() + '/' + date.getFullYear();
          imgEl.src = posts[post].image;
          pEl.innerHTML = posts[post].description;

          headingEl.appendChild(h2El);
          headingEl.appendChild(timeEl);
          articleEl.appendChild(headingEl);
          articleEl.appendChild(imgEl);
          articleEl.appendChild(pEl);

          mainEl.appendChild(articleEl);
          mainEl.setAttribute('style', 'display:block;');
        }
      }
    }
  }

  // Fetch post data
  fetch('../data/posts.json')
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      parsePosts(json);
    }).catch(function(ex) {
      Error(ex);
    });

}());
