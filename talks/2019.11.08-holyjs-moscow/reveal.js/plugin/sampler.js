/**
 * sampler.js is a plugin to display code samples from specially-formatted
 * source files in reveal.js slides.
 *
 * See https://github.com/ldionne/reveal-sampler for documentation,
 * bug reports and more.
 *
 *
 * Author: Louis Dionne
 * License: MIT (see https://github.com/ldionne/reveal-sampler/blob/master/LICENSE.md)
 */

(function() {
    // Escape a string so it can be used to match in a regular expression, even
    // if it contains characters that are special for regular expressions.
    var escapeForRegexp = function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    // Fetches a file at the given URL, and calls the `done` callback with the
    // contents of the file as a string.
    var fetch = function(url, done) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function(xhr) {
            return function() {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) ||
                        (xhr.status === 0 && xhr.responseText !== '')) {
                        done(xhr.responseText);
                    }
                }
            };
        })(xhr);
        xhr.open("GET", url);
        try {
            xhr.send();
        }
        catch (e) {
            console.log('Failed to get the file ' + url);
        }
    };

    // Given a string, returns a sub-string starting at the `index`th line,
    // and stopping at the `index + length`th line.
    var getLines = function(s, index, length) {
        var match = s.match(
            new RegExp('(?:.*\n){' + index + '}((?:.*(?:\n|$)){' + length + '})')
        );
        return match[1] || '';
    };

    // Parses a string representing a single line number, a (start-end) range,
    // or a comma-separated list thereof, and returns a list of ranges
    // representing the union of those ranges. An individual line is
    // considered a single-line range for that purpose.
    var parseRanges = function(value) {
        var result = [];
        var ranges, range, start, end;
        if (ranges = value.match(/(^|[,\s])\d+(-\d+)?/g)) {
            for (var i = 0, c = ranges.length; i < c; i++) {
                if (range = ranges[i].match(/(\d+)(?:-(\d+))?/)) {
                    start = parseInt(range[1]) || 0;
                    end = parseInt(range[2]) || start;
                    result.push(
                        {
                            index: start - 1,
                            length: end - start + 1
                        }
                    )
                }
            }
        }
        return result.length > 0 ? result : null;
    };

    // Given ranges (as returned by `parseRanges`), returns a list of all the
    // individual lines contained in that set of ranges.
    var expandRangesToLinesIndex = function(ranges) {
        var lines = {};
        if (ranges instanceof Array && ranges.length > 0) {
            for (var i = 0, c = ranges.length; i < c; i++) {
                for (var x = 0; x < ranges[i].length; x++) {
                    lines[ranges[i].index + x] = true;
                }
            }
            return lines;
        }
        return null;
    };

    // Given the right side of a `#` in `path/to/file#selector`, returns a
    // function that extracts the code snippet represented by `selector`
    // from a string representing a source file.
    var getSnippetExtractor = function(selector) {
        var ranges = null, extractor = null;

        // By default, match the whole file.
        if (selector === undefined) {
            extractor = function(code) { return code; }

        // Selector for line numbers and ranges thereof.
        } else if (ranges = parseRanges(selector)) {
            extractor = function(code) {
                return ranges.reduce(function(sample, range) {
                    return sample + getLines(code, range.index, range.length);
                }, '');
            };

        // Selector for named code samples.
        } else {
            extractor = function(code) {
                var namedSampleRegexp = new RegExp(
                    // match 'sample(sampleName)'
                    /sample\(/.source + escapeForRegexp(selector) + /\)[^\n]*\n/.source +
                    // match anything in between
                    /^([\s\S]*?)/.source +
                    // match 'end-sample'
                    /^[^\n]*end-sample/.source, 'mg');
                var sample = '', match = null;
                while ((match = namedSampleRegexp.exec(code)) !== null) {
                    sample += match[1];
                }
                return sample;
            };
        }

        var postProcess = function(code) {
            // Strip trailing newline in the sample (if any), since that is
            // only required to insert the 'end-sample' tag.
            code = code.replace(/\n$/, "");

            // Skip lines that contain the `skip-sample` tag.
            var lines = code.split("\n");
            lines = lines.filter(function(line) {
                return line.indexOf('skip-sample') == -1;
            });

            return lines.join('\n');
        };

        return function(code) { return postProcess(extractor(code)); };
    };

    var elements = document.querySelectorAll('[data-sample]');
    elements.forEach(function(element) {
        var slug = element.getAttribute('data-sample').match(/([^#]+)(?:#(.+))?/);
        var file = slug[1];
        var selector = slug[2];
        var extractor = getSnippetExtractor(selector);

        fetch(file, function(code) {
            // Extract the sample from the source file
            var sample = extractor(code);
            if (sample === '') {
                throw "Could not find sample '" + selector + "' in file '" + file + "'.";
            }

            // Mark lines in the sample, if requested.
            var marked = expandRangesToLinesIndex(
                parseRanges(element.getAttribute('data-sample-mark') || '')
            );
            if (marked) {
                element.textContent = '';
                element.setAttribute('data-noescape', '');
                var lines = sample.split("\n");
                for (var j = 0; j < lines.length; j++) {
                    if (j > 0) {
                        element.appendChild(document.createTextNode("\n"));
                    }
                    if (marked[j]) {
                        element.appendChild(document.createElement('mark'))
                               .appendChild(document.createTextNode(lines[j]))
                    } else {
                        element.appendChild(document.createTextNode(lines[j]));
                    }
                }
            } else {
                element.textContent = sample;
            }

            // Add the right `language-xyz` class to the code block, if required.
            var extension = file.split('.').pop();
            var classString = element.getAttribute('class') || '';
            if (!classString.match(/(^|\s)lang(uage)?-/)) {
                element.setAttribute('class', classString + ' language-' + extension);
            }
            if (typeof hljs !== 'undefined') {
                hljs.highlightBlock(element);
            }
        });
    });
})();
