(function sampleBlog() {
  'use strict';

  const mobileBreak = 721;

  function postLink(link, post) {
    link.addEventListener('click', function(e) {
      var mainEl = document.getElementById('main');
          mainEl.setAttribute('style', 'display:none;');
          mainEl.innerHTML = '';

      history.pushState(null, null, link.href);
      e.preventDefault();

      parsePost(post, link.href);
    }, false);
  }

  function parsePost(post, id) {
    var mainEl    = document.getElementById('main'),
        articleEl = document.createElement('article'),
        headingEl = document.createElement('heading'),
        h2El      = document.createElement('h2'),
        aEl       = document.createElement('a'),
        timeEl    = document.createElement('time'),
        imgEl     = document.createElement('img'),
        pEl       = document.createElement('p'),
        date      = new Date(post.date);

    articleEl.setAttribute('class', 'dragend-page');
    aEl.href = id;
    postLink(aEl, post);
    h2El.innerHTML = post.title;
    timeEl.setAttribute('datetime', date);
    timeEl.innerHTML = (date.getMonth() + 1) + '/' + date.getDay() + '/' + date.getFullYear();
    imgEl.src = post.image;
    pEl.innerHTML = post.description;

    aEl.appendChild(h2El);
    headingEl.appendChild(aEl);
    headingEl.appendChild(timeEl);
    articleEl.appendChild(headingEl);
    articleEl.appendChild(imgEl);
    articleEl.appendChild(pEl);

    mainEl.appendChild(articleEl);
    mainEl.setAttribute('style', 'display:block;');
  }

  function parsePosts(posts) {
    for (var post in posts) {
      if (posts.hasOwnProperty(post)) {
        parsePost(posts[post], post);
      }
    }

    window.onpopstate = function(e) {
      var mainEl = document.getElementById('main');
      mainEl.innerHTML = '';
      parsePosts(posts);
    };

    if (window.innerWidth < mobileBreak) {
      var mainEl  = document.getElementById('main'),
          dragend = new Dragend(mainEl, {pageClass: 'dragend-page', direction: 'horizontal'});
    }
  }

  window.addEventListener('load', function(e) {
    if (window.innerWidth < mobileBreak) {
    }
  });

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
