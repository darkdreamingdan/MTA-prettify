var typeToClass = [
    "", "",
    "MTA_KWD", // 2
    "LUA_PLN", // 3
    "MTA_PLN_TYPE", // 4
    "MTA_PLN_BOTH", // 5
    "MTA_PLN_CLIENT", // 6
    "MTA_PLN_SERVER", // 7
    "MTA_STR_CLIENT_EV", // 8
    "MTA_STR_SERVER_EV", // 9
]


var mta_highlight = (mh === undefined) ? {} : mh;
var mta_highlight_groups = {} // Stores { coroutine : { '.' : { 'yield' = 2, 'resume' = 2 } } }

// First, we compile a nested dict of Library functions with . seperators and their class
for (var key in mta_highlight) {
    var sp = key.replace(".", "~.~").split("~");
    if (sp.length > 1) {
        var child = mta_highlight_groups;
        for (var splitKey in sp) {
            var luaVar = sp[splitKey];
            child = child || {};
            if (splitKey == sp.length - 1) {
                // Final child, let's just store our class
                child[luaVar] = mta_highlight[key];
                break;
            }

            child[luaVar] = child[luaVar] || {};
            child = child[luaVar];
        }
    }
}

// applyWordMarkup: Apply MTA/Lua colouring and URLs to a specific word in a JQuery Element
// Parameters: 	jqElem: The jQuery element ot apply markup to
// 				fnName: String of the full function name/word to apply markup to
//				type: int of the type of highlight to perform.
//				childName (optional): Name of the component of a library function. e.g. 'yield', that appears in the specified element
function applyWordMarkup(jqElem, fnName, type, childName) {
    childName = childName || fnName;
    className = typeToClass[type];
    // Is our string marked up already?
    if (jqElem.html().search(childName + "</a>") != -1)
        return;

    switch (className) {
        case "MTA_KWD":
        case "MTA_PLN_TYPE":
        case "MTA_PLN_BOTH":
        case "MTA_PLN_CLIENT":
        case "MTA_PLN_SERVER":
        case "MTA_STR_CLIENT_EV":
        case "MTA_STR_SERVER_EV":
            jqElem.html(jqElem.html().replace(childName, "<span class='mta_highlight " + className + "'><a class='mta_highlight' href='https://wiki.multitheftauto.com/wiki/" + fnName + "'>" + childName + "</a></span>"));
            break;
        case "LUA_PLN":
            jqElem.html(jqElem.html().replace(childName, "<span class='mta_highlight " + className + "'><a class='mta_highlight' href='http://www.lua.org/manual/5.1/manual.html#pdf-" + fnName + "'>" + childName + "</a></span>"))
            break;
        default:
            break;
    }
}

// applyElementMarkup: Apply MTA/Lua colouring and URLs to all words in a JQuery Element.
// 					   Also scans forward to next elements to find a keywords split across multiple elements
// Parameters: 	jqElem: The jQuery element ot apply markup to
// 				allowedTypes: List of integers for which types are allowed to be marked up
function applyElementMarkup(jqElem, allowedTypes) {
    var hArray = jqElem.text().match(/\w+/g);
    if (!hArray || jqElem.hasClass("mtaMarkup"))
        return;
    for (var i = 0; i < hArray.length; i++) {
        h = hArray[i];
        if (!mta_highlight_groups[h]) { // If we're not a group
            if ((allowedTypes.indexOf(mta_highlight[h]) != -1)) // And we're an allowed type
                applyWordMarkup(jqElem, h, mta_highlight[h]);
        } else { // If our group is allowed
            // First, loop through to see if the full function name is found 
            var child = mta_highlight_groups[h];
            var next = jqElem;
            var targetClass = -1;
            var fnName = "";
            var first = true;
            while (typeof(child) != "undefined") {
                fnName = fnName + (first ? h : next.text().trim());
                first = false;
                if (typeof(child) == "object") {
                    next = next.next();
                    child = child[next.text().trim()];
                } else if (typeof(child) == "number") {
                    targetClass = child;
                    break;
                } else
                    break;
            }

            if (targetClass == -1 || allowedTypes.indexOf(targetClass) == -1)
                if ((allowedTypes.indexOf(mta_highlight[h]) != -1)) // Maybe we're just e.g. 'table'
                    applyWordMarkup(jqElem, h, mta_highlight[h]);

                // Succeeded in checking this, now apply the class
            child = mta_highlight_groups[h];
            next = jqElem;
            first = true;
            while (typeof(child) != "undefined") {
                applyWordMarkup(next, fnName, targetClass, (first ? h : next.text().trim()));
                first = false;
                if (typeof(child) == "object") {
                    next = next.next();
                    child = child[next.text().trim()];
                } else
                    break;
            }
        }
    }
    return;
};

function applyMTAMarkupToPre(i, e) {
    $(e).find('a').replaceWith(function() {
        return $(this).contents();
    });
    $(e).find('span:not([class])').replaceWith(function() {
        return $(this).contents();
    });
    $(e).find('span.pln').each(function(i, e) {
        applyElementMarkup($(e), [3, 4, 5, 6, 7])
    })
    $(e).find('span.kwd').each(function(i, e) {
        applyElementMarkup($(e), [2])
    })
    $(e).find('span.str').each(function(i, e) {
        applyElementMarkup($(e), [4, 8, 9])
    })
    $(e).addClass("mtaMarkup");
}

function applyMTAMarkup() {
    $('pre.lang-lua:not(.mtaMarkup)').each(applyMTAMarkupToPre)
};