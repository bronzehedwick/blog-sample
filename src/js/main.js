(function sampleBlog() {
  'use strict';

  const mobileBreak = 721;

  function postLink(link, post) {
    link.addEventListener('click', function(e) {
      var mainEl = document.getElementById('main');
          mainEl.setAttribute('style', 'display:none;');
          mainEl.innerHTML = '';

      history.pushState(null, null, link.pathname);
      e.preventDefault();

      parsePost(post, link.href);
    }, false);
  }

  function tagLink(link) {
    link.addEventListener('click', function(e) {
      var articlesEls = document.getElementById('main').childNodes,
          tag = link.pathname.split('/')[1], i;

      history.pushState(null, null, link.href);
      e.preventDefault();

      for (i = 0; i < articlesEls.length; i++) {
        if (articlesEls[i].className.indexOf(tag) === -1) {
          articlesEls[i].setAttribute('style', 'display:none;');
        }
        else {
          articlesEls[i].setAttribute('style', 'display:block;');
        }
      }
    });
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
        date      = new Date(post.date),
        tagsEl    = document.createElement('p'),
        tags      = post.tags, i;

    articleEl.setAttribute('class', 'dragend-page ' + tags.join(' '));
    aEl.href = id;
    postLink(aEl, post);
    h2El.innerHTML = post.title;
    timeEl.setAttribute('datetime', date);
    timeEl.innerHTML = (date.getMonth() + 1) + '/' + date.getDay() + '/' + date.getFullYear();
    imgEl.src = window.location.origin + '/images/' + post.image;
    pEl.innerHTML = post.description;

    tagsEl.setAttribute('class', 'tags');
    tagsEl.innerHTML = 'tags: ';

    for (i = 0; i < tags.length; i++) {
      var tagAEl = document.createElement('a');
      tagAEl.href = tags[i];
      tagAEl.innerHTML = tags[i];

      if (i !== 0) {
        tagsEl.innerHTML += ', ';
      }

      tagsEl.appendChild(tagAEl);
    }

    aEl.appendChild(h2El);
    headingEl.appendChild(aEl);
    headingEl.appendChild(timeEl);
    articleEl.appendChild(headingEl);
    articleEl.appendChild(imgEl);
    articleEl.appendChild(pEl);
    articleEl.appendChild(tagsEl);

    mainEl.appendChild(articleEl);
    mainEl.setAttribute('style', 'display:block;');

    for (var j = 0; j < tagsEl.childNodes.length; j++) {
      tagLink(tagsEl.childNodes[j]);
    }
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
