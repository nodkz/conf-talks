/*
 * https://github.com/janschoepke/reveal_external/blob/master/external/external.js
 * external.js
 * Jan Schoepke <janschoepke@me.com>
 * Released under the MIT license
 * Load external files into a reveal.js presentation.
 *
 * This is a reveal.js plugin to load external html files. It replaces the
 * content of any element with a data-external="file.ext#selector" with the contents
 * part of file.ext specified by the selector. If you use
 * data-external-replace="file.ext#selector" the container element itself will get
 * replaced.
 *
 * Relative paths in "src" attributes in the loaded fragments will get prefixed
 * with the path.
 *
 * external: {
 *   async: false,
 *   mapAttributes: ['src']
 * } 
 *
 * This started life as markdown.js. Thank you to whomever wrote it.
 * This version is based on external.js by Cal Evans. Thanks Cal!
 * Thanks to Thomas Weinert (https://github.com/ThomasWeinert) for massive improvements in version 1.3!
 */
(function() {
  const config = Reveal.getConfig() || {};

  let options;
  config.external = config.external || {};
  options = {
    /*
		  Some plugins run into problems, because they expect to have access
		  to the all of the slides. Enable on your own risk.
		 */
    async: !!config.external.async,
    /*
		  This will prefix the attributes (by default "src") in the loaded
		  HTML with the path if they are relative paths (start with a dot).
		 */
    mapAttributes:
      config.external.mapAttributes instanceof Array
        ? config.external.mapAttributes
        : config.external.mapAttributes
          ? ['src']
          : [],
  };

  const getTarget = function(node) {
    let url;
    let isReplace;
    url = node.getAttribute('data-external') || '';
    isReplace = false;
    if (url === '') {
      url = node.getAttribute('data-external-replace') || '';
      isReplace = true;
    }
    if (url.length > 0) {
      const r = url.match(/^([^#]+)(?:#(.+))?/);
      return {
        url: r[1] || '',
        fragment: r[2] || '',
        isReplace,
      };
    }
    return null;
  };

  const convertUrl = function(src, path) {
    if (path !== '' && src.indexOf('.') === 0) {
      return `${path}/${src}`;
    }
    return src;
  };

  const convertAttributes = function(attributeName, container, path) {
    const nodes = container.querySelectorAll(`[${attributeName}]`);
    if (container.getAttribute(attributeName)) {
      container.setAttribute(
        attributeName,
        convertUrl(container.getAttribute(attributeName), path)
      );
    }
    for (let i = 0, c = nodes.length; i < c; i++) {
      nodes[i].setAttribute(attributeName, convertUrl(nodes[i].getAttribute(attributeName), path));
    }
  };

  const convertUrls = function(container, path) {
    for (let i = 0, c = options.mapAttributes.length; i < c; i++) {
      convertAttributes(options.mapAttributes[i], container, path);
    }
  };

  const updateSection = function(section, target, path) {
    const url = path !== '' ? `${path}/${target.url}` : target.url;
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (function(xhr, target, url, fragment, replace) {
      return function() {
        let html;
        let nodes;
        let node;
        let path;
        if (xhr.readyState === 4) {
          /*
                      file protocol yields status code 0
                      (useful for local debug, mobile applications etc.)
                     */
          if (
            (xhr.status >= 200 && xhr.status < 300) ||
            (xhr.status === 0 && xhr.responseText !== '')
          ) {
            path = url.substr(0, url.lastIndexOf('/'));
            html = new DOMParser().parseFromString(xhr.responseText, 'text/html');
            if (fragment !== '') {
              nodes = html.querySelectorAll(fragment);
            } else {
              nodes = html.querySelector('body').childNodes;
            }
            if (!replace) {
              target.innerHTML = '';
            }
            for (let i = 0, c = nodes.length; i < c; i++) {
              convertUrls(nodes[i], path);
              node = document.importNode(nodes[i], true);
              replace ? target.parentNode.insertBefore(node, target) : target.appendChild(node);

              if (options.async) {
                Reveal.sync();
                Reveal.setState(Reveal.getState());
              }

              if (node instanceof Element) {
                loadExternal(node, path);
              }
            }
            if (replace) {
              target.parentNode.removeChild(target);
            }
          } else {
            console.log(
              `ERROR: The attempt to fetch ${url} failed with HTTP status ${xhr.status}.`
            );
          }
        }
      };
    })(xhr, section, url, target.fragment, target.isReplace);

    xhr.open('GET', url, options.async);
    try {
      xhr.send();
    } catch (e) {
      console.log(
        `Failed to get the file ${url}. Make sure that the presentation and the file are served by a ` +
          `HTTP server and the file can be found there. ${e}`
      );
    }
  };

  function loadExternal(container, path) {
    let target;
    let section;
    let sections;
    path = typeof path === 'undefined' ? '' : path;
    if (
      container instanceof Element &&
      (container.getAttribute('data-external') || container.getAttribute('data-external-replace'))
    ) {
      target = getTarget(container);
      if (target) {
        updateSection(container, target, path);
      }
    } else {
      sections = container.querySelectorAll('[data-external], [data-external-replace]');
      for (let i = 0; i < sections.length; i += 1) {
        section = sections[i];
        target = getTarget(section);
        if (target) {
          updateSection(section, target, path);
        }
      }
    }
  }

  loadExternal(document);
})();
