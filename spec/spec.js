var args = phantom.args;
var pages = [], page, address, resultsKey;

var setupPageFn = function(p, k) {
    return function() {
        overloadPageEvaluate(p);
        setupWriteFileFunction(p, k);
        loadLibraries(p);
        loadFiles(p);
        loadSpecs(p);
    };
};

// phantom.args is object, not array.
if(args.length === 0) {
    args = {0: './spec/runner.html'};
}
for (var i in args) {
    var fs = require('fs');
    address = "file://localhost" + fs.absolute(args[i]);
    console.log("Loading " + address);

    page = new WebPage();
    page.url = address;

    resultsKey = "__jr" + Math.ceil(Math.random() * 1000000);
    page.onInitialized = setupPageFn(page, resultsKey);
    page.open(address, processPage(null, page, resultsKey));
    pages.push(page);
}

// bail when all pages have been processed
setInterval(function(){
    var exit_code = 0;
    for (var i in pages) {
        page = pages[i];
        if (page.__exit_code === null) {
            // wait until later
            return;
        }
        exit_code |= page.__exit_code;
    }
    phantom.exit(exit_code);
}, 100);

// Thanks to hoisting, these helpers are still available when needed above
/**
 * Stringifies the function, replacing any %placeholders% with mapped values.
 *
 * @param {function} fn The function to replace occurrences within.
 * @param {object} replacements Key => Value object of string replacements.
 */
function replaceFunctionPlaceholders(fn, replacements) {
    if (replacements && typeof replacements === "object") {
        fn = fn.toString();
        for (var p in replacements) {
            if (replacements.hasOwnProperty(p)) {
                var match = new RegExp("%" + p + "%", "g");
                do {
                    fn = fn.replace(match, replacements[p]);
                } while(fn.indexOf(match) !== -1);
            }
        }
    }
    return fn;
}

/**
 * Replaces the "evaluate" method with one we can easily do substitution with.
 *
 * @param {phantomjs.WebPage} page The WebPage object to overload
 */
function overloadPageEvaluate(page) {
    page._evaluate = page.evaluate;
    page.evaluate = function(fn, replacements) { return page._evaluate(replaceFunctionPlaceholders(fn, replacements)); };
    return page;
}

/** Stubs a fake writeFile function into the test runner.
 *
 * @param {phantomjs.WebPage} page The WebPage object to inject functions into.
 * @param {string} key The name of the global object in which file data should
 *                     be stored for later retrieval.
 */
// TODO: not bothering with error checking for now (closed environment)
function setupWriteFileFunction(page, key) {
    page.evaluate(function(){
        window["%resultsObj%"] = {};
        window.__phantom_writeFile = function(filename, text) {
            window["%resultsObj%"][filename] = text;
        };
    }, {resultsObj: key});
}

/** Load required libraries
 *
 * @param {phantomjs.WebPage} page The WebPage object to inject functions into.
 */
function loadLibraries(page) {
    page.injectJs('./spec/lib/jquery-1.7.2.min.js');
    page.injectJs('./spec/lib/jasmine-1.1.0/jasmine.js');
    page.injectJs('./spec/lib/jasmine-1.1.0/jasmine-html.js');
    page.injectJs('./spec/lib/mock-ajax.js');
    page.injectJs('./spec/lib/jasmine.junit_reporter.js');

    page.injectJs('./spec/mock/schedule.js');
}

/** Load Testing javascripts
 *
 * @param {phantomjs.WebPage} page The WebPage object to inject functions into.
 */
//TODO move it to spec_helper.js
function loadFiles(page) {
    page.injectJs('./lib/underscore-min.js');
    page.injectJs('./lib/backbone-min.js');
    page.injectJs('./init.js');
    page.injectJs('./models/schedule.js');
    page.injectJs('./collections/schedule.js');
}

/** Load testing files
 *
 * @param {phantomjs.WebPage} page The WebPage object to inject functions into.
 */
function loadSpecs(page) {
    var fs = require('fs');
    var files = filesRecursively(fs, './spec', []);
    for(var i in files){
        page.injectJs(files[i]);
    }
}

/** return files Array recursively by directory path.
 *
 * @param {CommonJS.fs} fs CommonJs filesystem API module.
 * @param {String} path directory path.
 * @param {files} Array save files for recursive function.
 */
function filesRecursively(fs, path, files) {
    var list = fs.list(path);
    list = Array.prototype.slice.call(list);
    list.splice(list.indexOf('.'), 1);
    list.splice(list.indexOf('..'), 1);
    for(var i in list){
        var file = fs.absolute(path + '/' + list[i]);
        if(fs.isDirectory(file) && file.indexOf('lib') < 0){
            filesRecursively(fs, file, files);
        }else{
            if(file.indexOf('.js') >= 0 && list[i] != 'spec.js'){
                files.push(file);
            }
        }
    }

    return files;
}


/**
 * Returns the loaded page's filename => output object.
 *
 * @param {phantomjs.WebPage} page The WebPage object to retrieve data from.
 * @param {string} key The name of the global object to be returned. Should
 *                     be the same key provided to setupWriteFileFunction.
 */
function getXmlResults(page, key) {
    return page.evaluate(function(){
        return window["%resultsObj%"] || {};
    }, {resultsObj: key});
}

/**
 * Processes a page.
 *
 * @param {string} status The status from opening the page via WebPage#open.
 * @param {phantomjs.WebPage} page The WebPage to be processed.
 */
function processPage(status, page, resultsKey) {
    if (status === null && page) {
        page.__exit_code = null;
        return function(stat){
            processPage(stat, page, resultsKey);
        };
    }
    if (status !== "success") {
        console.error("Unable to load resource: " + address);
        page.__exit_code = 2;
    } else {
        var isFinished = function() {
            return page.evaluate(function(){
                // if there's a JUnitXmlReporter, return a boolean indicating if it is finished
                if (jasmine.JUnitXmlReporter) {
                    return jasmine.JUnitXmlReporter.finished_at !== null;
                }
                // otherwise, see if there is anything in a "finished-at" element
                return document.getElementsByClassName("finished-at").length &&
                    document.getElementsByClassName("finished-at")[0].innerHTML.length > 0;
            });
        };
        var getResults = function() {
            return page.evaluate(function(){
                return document.getElementsByClassName("description").length &&
                    document.getElementsByClassName("description")[0].innerHTML.match(/(\d+) spec.* (\d+) failure.*/) ||
["Unable to determine success or failure."];
            });
        };
        var ival = setInterval(function(){
            if (isFinished()) {
                // get the results that need to be written to disk
                var fs = require("fs"),
                xml_results = getXmlResults(page, resultsKey),
                output;
                for (var filename in xml_results) {
                    if (xml_results.hasOwnProperty(filename) && (output = xml_results[filename]) && typeof(output) === "string") {
                        fs.write(filename, output, "w");
                    }
                }

                // print out a success / failure message of the results
                var results = getResults();
                var specs = Number(results[1]);
                var failures = Number(results[2]);
                console.log("Results for url " + page.url + ":");
                if (failures > 0) {
                    console.error("  FAILURE: " + results[0]);
                    page.__exit_code = 1;
                    clearInterval(ival);
                } else {
                    console.log("  SUCCESS: " + results[0]);
                    page.__exit_code = 0;
                    clearInterval(ival);
                }
            }
        }, 100);
    }
}
