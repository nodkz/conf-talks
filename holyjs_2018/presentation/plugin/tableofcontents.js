/**
 * reveal.js table of contents plugin
 *
 * A plugin which generates automatically a table of contents slide.
 *
 * Demo https://naamor.github.io/reveal.js-tableofcontents/
 *
 * MIT License
 * Copyright (c) 2018 Roman Stocker
 */

const RevealTableOfContents =
  window.RevealTableOfContents ||
  (function() {
    loadResource('plugin/table-of-contents/table-of-contents.css', 'stylesheet');

    // Set all option defaults
    const options = Reveal.getConfig().tableofcontents || {};
    let titleTagSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    let title = options.title || 'Table of Contents';
    const position = options.position || 2;
    const fadeInElements = options.fadeInElements || false;

    let ignoreFirstSlide = options.ignoreFirstSlide;
    if (typeof ignoreFirstSlide === 'undefined') ignoreFirstSlide = true;

    initialize();

    function initialize() {
      if (typeof options.titleTagSelector === 'string') {
        titleTagSelector = options.titleTagSelector.split(',').map(item => {
          return item.trim();
        });
      }

      generateTableOfContentsSlide();
    }

    function generateTableOfContentsSlide() {
      const slides = document.getElementsByClassName('slides')[0];

      const section = document.createElement('section');

      const h1 = document.createElement('h1');
      h1.innerText = title;
      section.appendChild(h1);

      const list = generateList();
      section.appendChild(list);

      // Subtract by one because index starts with zero
      const slideAfter = slides.children[position - 1];

      // Check if there are enough slides for the configured table of contents slide position
      // or set the table of contents slide automatically after the last slide
      if (slideAfter !== undefined) {
        slides.insertBefore(section, slideAfter);
      } else {
        slides.appendChild(section);
      }
    }

    // Generate list with the title of each slide
    function generateList() {
      const slides = Reveal.getSlides();

      const ul = document.createElement('ul');

      let counter = 0;

      // Ignore first slide with counter 0
      if (ignoreFirstSlide) {
        counter++;
      }

      for (counter; counter < slides.length; counter++) {
        const title = getTitle(slides[counter]);

        if (title !== undefined) {
          const li = document.createElement('li');

          // Add attributes for use reveal.js fragment functionality
          if (fadeInElements) {
            li.className = 'fragment';
            li.setAttribute('data-fragment-index', counter);
          }

          li.innerText = title;

          ul.appendChild(li);
        }
      }

      return ul;
    }

    // Select the text of the most important heading tag of every slide
    function getTitle(slide) {
      return (title = Array.from(slide.childNodes)
        .filter(node => filterSlideTagElements(node))
        .sort((a, b) => sortHeadingTagElements(a, b))
        .map(node => node.textContent)[0]);
    }

    // Filter tags based on options
    function filterSlideTagElements(element) {
      if (element.tagName === undefined) {
        return false;
      }

      return (
        titleTagSelector.indexOf(element.tagName.toLowerCase()) >= 0 && element.textContent !== ''
      );
    }

    // Sort heading tags based on importance
    function sortHeadingTagElements(valueA, valueB) {
      if (valueA.tagName < valueB.tagName) return -1;
      if (valueA.tagName > valueB.tagName) return 1;
      return 0;
    }

    // Modified from math plugin
    function loadResource(url, type, callback) {
      const head = document.querySelector('head');
      let resource;

      if (type === 'script') {
        resource = document.createElement('script');
        resource.type = 'text/javascript';
        resource.src = url;
      } else if (type === 'stylesheet') {
        resource = document.createElement('link');
        resource.rel = 'stylesheet';
        resource.href = url;
      }

      // Wrapper for callback to make sure it only fires once
      const finish = function() {
        if (typeof callback === 'function') {
          callback.call();
          callback = null;
        }
      };

      resource.onload = finish;

      // IE
      resource.onreadystatechange = function() {
        if (this.readyState === 'loaded') {
          finish();
        }
      };

      // Normal browsers
      head.appendChild(resource);
    }
  })();
