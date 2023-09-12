// <Summary>
// UI JS central.
// TODO: Modularize the everliving shit out of it.
// </Summary>

"use strict";

// path to config
const confurl = "/assets/cfg/constants.json";

// Init
// Load config if not loaded
const loadCFG = $.ajax( {
    url: confurl,
    dataType: "json"
}).done(function(data) {
    let cfgdata = {};
    cfgdata.totopdiv = data.totopdiv;
    cfgdata.totopdivtext = data.totopdivtext;  
    cfgdata.scrollthreshold = data.scrollthreshold;

    return cfgdata

}).fail(function() {
    console.log('JavaScript was unable to load config data from constansts.json!');
})

const clickabsorberdiv = '<div class="clickabsorber" id="cad" onclick="closeItems();"></div>';
const contentContainers = ['.content-full', '.content-top-half', '.content-top-threequarter', '.content-quarter-left-top', '.content-left-half', '.content-col-1', '.content-left-onethird', '.content-left-twothird', '.content-left-threequarter'];

var navstate = Cookies.get('navistate') || 0;
var tablebase = null;
var tablebaseclass;
var globalscrollvalue;
var scrollbaroffset;

// scrollbarwidth if any
function setScrollBarOffset() {
    let thecontent = document.querySelector('[class^="container-content"]') || document.querySelector('[class^="container-content-cardpage"]');
    return scrollbaroffset = getScrollbarWidth(thecontent);
}

function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";

    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    // Pad with leading 0 if necessary
    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;
  
    return "#" + r + g + b;
}

function matches(elem, filter) {
  if (elem && elem.nodeType === 1) {
    if (filter) {
      return elem.matches(filter);
    }
    return true;
  }
  return false;
}

function getBaseFontSize() {
    let currfontsize;
    return currfontsize = getComputedStyle(document.body).fontSize;
}

// This will find all siblings EXCEPT the calling element <element>
// 2022-06-29: NOTE: this will be deprecated soon, use the refactored getAllSiblings(elem, filter, exclude_self<bool>).
// That function currently resides in cards.js, should be moved to a helper library after release.
function getAllSiblingsExceptCaller(elem, filter) {
    let sibs = [];
    let caller = elem;
    elem = elem.parentNode.firstChild;

    while (elem = elem.nextSibling) {
        if (matches(elem, filter)) {
            sibs.push(elem);
        } 
        sibs.filter(child => child !== caller);
    } 
  return sibs;
}


// Theme switching
// Needs refactoring because it's quite wet
function switchTheme(theme) {
    let thebody = document.querySelector('body');
    let currclass = thebody.classList[0];
    let navicontainer = document.querySelector('.container-navi');
    let highlight = document.querySelectorAll('[class*="navibg-active"]');
    let related = document.querySelectorAll('[class*="navibg-related"]');
    let servicenav = (navicontainer !== null) ? navicontainer.querySelector('ul:nth-of-type(2)') : {};
    let navalignment = Cookies.get('navalignment');
    
    // document.querySelectorAll('.navibg-active').length === 0 ? document.querySelectorAll('.navibg-active-dark' + '-' + navalignment) : document.querySelectorAll('.navibg-active' + '-' + navalignment);
    
    thebody.classList.remove(currclass);
    thebody.classList.add(theme);
  
    // Refine some elements which break the color theme rules otherwise and align them
    if (theme === 'theme-dark' && navicontainer) {
        let bgcolor = 'rgb(17, 17, 17)';
        
        navicontainer.style.backgroundColor = bgcolor;
        servicenav.style.boxShadow = '0px -24px 48px 24px rgba(60, 60, 60, .5)';

        highlight.forEach((element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-active-dark' + '-' + navalignment);
        })

        related.forEach( (element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-related' + '-' + navalignment);
        })

    } else if (theme === 'theme-contrast' && navicontainer) {
        let bgcolor = 'rgb(0, 0, 0)';
        let color = 'rgb(255, 255, 255)'
        let navicontent = navicontainer.querySelector('#navi');
        
        navicontainer.style.backgroundColor = bgcolor;
        navicontent.style.color = color;
        servicenav.style.boxShadow = 'none';

        highlight.forEach((element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-active-dark' + '-' + navalignment);
        })

        related.forEach( (element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-related' + '-' + navalignment);
        })
    
    } else if (navicontainer) { // theme-ok-standard 
        navicontainer.removeAttribute('style');
        servicenav.style.boxShadow = '0px -24px 48px 24px rgba(235, 235, 235, .5)';

        highlight.forEach((element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-active' + '-' + navalignment);
        })

        related.forEach( (element) => {
            element.classList.remove(...element.classList);
            element.classList.add('navibg-related' + '-' + navalignment);
        })
    }

    Cookies.set('theme', theme, {
        'SameSite': 'strict',
        'Max-Age': '31536000', // one year
        'Path': '/'
    })
}

// Makeshift shortcut manager; just closes all 'popups' and removes the clickabsorber on "Escape"
var isCtrlHold = false;
var isShiftHold = false;

$(document).keyup(function(e) {
    if (e.key == "Control")
        isCtrlHold = false;
    if (e.key == "Shift")
        isShiftHold = false;
})

$(document).keydown(function(e) {
    if (e.key == "Control")
        isCtrlHold = true;
    if (e.key == "Shift")
        isShiftHold = true;
    
    ShortcutManager(e);
})

// register "popups" here that should close when pressing ESC.
function ShortcutManager(e) {
//ESC:
    if (e.key == "Escape") { 
        e.preventDefault();
        $('.container-msg-showall').hide();
        $('.container-dialogue').hide(100);
        $('.clickabsorber').remove();
        $('#usermenu').addClass('hide-this');
        $('#jl_fullscreendiv').hide();
        $('.indicator-connectivity').addClass('hide-this');
    }
}

// Checks the whole window height and subtracts fixed elemnents of the app, then returns the pixel dimensions
function checkHeight() {
    let win_height = window.outerHeight;
    // last three numbers should be dynamic, not fixed! We don't have an action bar on every page necessarily
    // probably use 'getComputedStyle()'
    return (win_height - 60 - 20 - 30); 
}


// Checks the width of an element and returns it
function checkWidth(element) {
    return element.clientWidth;
}


// Opens a Dialogue
function addDialogue() {
    $('.container-dialogue').show(100);
    drawClickAbsorber();
}

// Switches navi position, sets a cookie and refreshes the theme and navigation.
function changeNavPos(navalignment) {
    let navpos = navalignment || determineNavPos(); // function is used if caller failed to supply an argument.
    let contenttype = document.querySelector('[class^="container-page"]') || document.querySelector('.container-page-rightside');
    let currtheme = Cookies.get('theme');

    if (navpos === 'right') { 
        contenttype.classList.remove('container-page');
        contenttype.classList.add('container-page-rightside');
        
    } else if (navpos === 'left') {
        contenttype.classList.remove('container-page-rightside');
        contenttype.classList.add('container-page');   
    }
    
    Cookies.set('navalignment', navpos, {
        'SameSite': 'strict',
        'Max-Age': '31536000', // one year
        'Path': '/'
    })
    
    showHideNav(false);
    switchTheme(currtheme);
}

function determineNavPos() {
    let np;
    return (document.querySelector('.container-page') === null) ? np = 'right' : np = 'left';
}

function changeNavWidth(nav_grid_width, navposition) {
    let $contenttype = {};

    if (navposition === 'left') {
        $contenttype = $('.container-page');
        $contenttype.css('grid-template-columns', nav_grid_width+'rem' + ' ' + nav_grid_width+'rem' + ' ' + 'repeat(14, 1fr)');
    } else if (navposition === 'right') {
        $contenttype = $('.container-page-rightside');
        $contenttype.css('grid-template-columns', 'repeat(14, 1fr)' + nav_grid_width+'rem' + ' ' + nav_grid_width+'rem');
    }
}

// Handling the navigation based on preferences
function showHideNav(changestate, directstate) {
    // states: 0 = full | 1 = icons | 2 = hidden - Probably should make an enum in TS
    let state = Number(Cookies.get('navistate'));
    let thenavi = document.querySelector('#navi');
    let arr_spans = [], navposition, navisubhl, navisubhlicon;

    // get the needed elements from the navigation
    if (thenavi) {
        arr_spans = Array.from(thenavi.querySelectorAll('span'));
        navposition = determineNavPos();
        navisubhl = navi.querySelector('div > p');
        navisubhlicon = navi.querySelector('div > p:nth-of-type(2)');
        
        // checks if the nav needs to be changed or just resetted
        if (changestate) {
            (state < 2) ? state++ : state = 0;
        }
        
        directstate !== undefined ? state = directstate : state = state;

        // set the navigation according to state
        switch(state) {
            case 0:
                for (let i = 0; i < arr_spans.length; i++) {
                    arr_spans[i].style.display = 'inline-block';
                    arr_spans[i].style.fontSize = i % 2 ? 'none' : ('1em');
                    arr_spans[i].style.paddingLeft = i % 2 ? 'none' : ('0');
                    navisubhl.classList.remove('hide-this');
                    navisubhlicon.style.width = '25%';
                }
                changeNavWidth(7, navposition);
                break;

            case 1:
                for (let i = 0; i < arr_spans.length; i++) {
                    arr_spans[i].style.display = i % 2 ? 'none' : ('inline-block');
                    arr_spans[i].style.fontSize = i % 2 ? 'none' : ('1.6em');
                    arr_spans[i].style.paddingLeft = i % 2 ? 'none' : ('0em');
                    navisubhl.classList.add('hide-this');
                    navisubhlicon.style.width = '100%';
                }
                changeNavWidth(2, navposition);
                break;

            case 2:
                for (let i = 0; i < arr_spans.length; i++) {
                    arr_spans[i].style.display = 'none'
                }
                changeNavWidth(0, navposition);
                break;
                
            default:
                console.log(`Navigation is in an unknown state! Statenumber: ${state}\nPlease delete your cookies`);
        }
    }

    // set the cookie to the new state
    Cookies.set('navistate', state, {
        'SameSite': 'strict',
        'Max-Age': '31536000', // one year
        'Path': '/'
    })
}


// Draw the transparent div which will close all open menus defined in closeItems()
function drawClickAbsorber() {
    let has_cad = document.querySelector('#cad');

    if (!has_cad) {
        $('body').append(clickabsorberdiv);
    }
}


// Searchbar magnifying glass swagger
function toggleIconOnFocus(caller, direction) {

    let inputicon = (caller.previousElementSibling.tagName === 'I') ? caller.previousElementSibling : false;
    
    if (direction === 'enter') {
      inputicon.classList.remove('ani-opacity-on');
      inputicon.classList.add('ani-opacity-off');
      
    } else if (direction === 'leave') {
      inputicon.classList.remove('ani-opacity-off');
      inputicon.classList.add('ani-opacity-on');
    }
}

function closeItems() {
// register all menus to be closed via the clickabsorber here
// last one has to be the clickabsorber itself
// more complex menus should have their own function to be called

    $(document).on('click', '#cad', function() {
        $('.container-msg-showall').hide();
        $('#dialogue').hide();
        $('.clickabsorber').remove();
    });
}

// Removes an object and children from the DOM, needs an ID
// Also checks for clickabsorber and removes that as well.
function removeFromDOM(obj_to_remove) {
    let has_cad = document.getElementById('cad')

    obj_to_remove.remove();

    if (has_cad) {
        $('#cad').remove();
    }
}

function hideObject(objtohide, ms) {
    const clickabsorber_status = document.getElementById('cad');
    const msgcontainer_status = getComputedStyle(document.querySelector('.container-msg-showall')).display;

    $('#' + objtohide).hide(ms);

    if (clickabsorber_status) {
        if (msgcontainer_status === 'block') {
            return
        } else {
            $('#cad').remove();
        }
    }
}

// Opens all messages and errors
function showAllMessages() {
    $('.container-msg-showall').show(200);
    drawClickAbsorber();
}


// check if an element is currently overflown via its properties
function isOverflown(element) {
    return (element.scrollWidth > element.offsetWidth);
}


// Shows debug output in the title area
function showDebugPanel() {

    let t = document.querySelector('#AWESOME').innerHTML.trim();

    if (t === '') {
        $('.SUPER_AWESOME_DEBUG_PANEL').css('display', 'none');
    }
}


// Detects if there is more information obtainable for a message and makes it accessible
function showMoreInfo() {
    let msglinks;
    let additionalinfo = [];
    let pdiv = [];

    msglinks = document.querySelectorAll('.container-msg-showall div div a');

    msglinks?.forEach((element, index) => {
        element.setAttribute('id', 'smi-' + index);
        pdiv.push(element.parentElement.parentElement); // this is the container
    });
    
    msglinks?.forEach((element) => {

        if (element.nextElementSibling.innerHTML.length !== 0) {
            additionalinfo.push(true);

        } else {
            additionalinfo.push(false);
        }
    });

    
    for (let i = 0; i < msglinks.length; i++) {
        let fnstore;
        // msglinks[i].replaceWith(msglinks[i].cloneNode(true));
        // msglinks[i] = msglinks[i].parentNode.replaceChild(msglinks[i].cloneNode(true), msglinks[i]);
        
        if (additionalinfo[i] === true) {
            fnstore = msglinks[i].removeEventListener('click', bindShowMoreActions(msglinks, pdiv, i), false);
            fnstore = msglinks[i].addEventListener('click', bindShowMoreActions(msglinks, pdiv, i), false);
        
        } else if (additionalinfo[i] === false) {
            msglinks[i].textContent = '';
        }   
    }
}

// Just to toggle the text of the "show more info" link in the message box
function bindShowMoreActions(msglinks, pdiv, i) {
    return function() {
        // event.preventDefault();

        pdiv[i].classList.toggle('info-expanded');
          (msglinks[i].innerHTML === 'show more info') 
        ? msglinks[i].innerHTML = 'show less info' 
        : (msglinks[i].innerHTML = 'show less info') 
            ? msglinks[i].innerHTML = 'show more info' 
            : msglinks[i].innerHTML = 'show less info';
    };
}


// Toggles the service navigation
function toggleServiceNav() {
    $('.theNavi > ul:last-of-type li').toggle(100);
}


function findContentContainer(){
    let theContent;

    for (let i = 0; i < contentContainers.length; i++) {
        if (document.querySelector(contentContainers[i]) != null) {
            theContent = document.querySelector(contentContainers[i]);
        }
    }
    return theContent || false;
}

function determinePageType() {
    return document.querySelector('.container-content') || document.querySelector('.container-content-cardpage');
}

async function manipulateHeadline(headline, firstrender) {
    if (!headline.classList.contains('hl-resizable')) {
        headline.classList.add('fixed-headline');

        if (firstrender) {
            headline.classList.add('transition-instant');
        } else {
            headline.classList.remove('transition-instant');
            headline.classList.add('transition-standard');
        }
    }
}

function initScrollToTop(totopdiv) {
    totopdiv.addEventListener('click', setScrollToTop(totopdiv));
}

function setScrollToTop() {
    return function() {
        scrollToTop();
    }
}


// finish and use once we actually have more than one scrollable container on the page
class ScrollableContainer {
    constructor(container) {
        this.container = container;
    }
}

// Check content scroll reference based
// contentcontainer may not appear on every page, pass {false} in that case.
async function checkContentScroll(pagecontainer, contentcontainer) {
    const page = pagecontainer;
    const container = contentcontainer ?? false;
    const nofooter = document.querySelector('.container-page-nofooter');
    let headline = page.querySelectorAll('h1')[0] ?? false;
        
    // used to set a 0ms animation time on first call; this prevents the whole content from being animated.
    let firstrender = true;
    
    // init scrollvalues
    var scrollvalue1 = 0;
    var scrollvalue2 = 0;

    // prepare content headline
    if (firstrender && headline) {
        await manipulateHeadline(headline, firstrender);
        firstrender = false;
    } else if (headline) {
        await manipulateHeadline(headline, firstrender);
    }

    // async scroll events, uses the JSON config file
    const scrollresult = await loadCFG
    .then(result => {
        let $totop = $('#totop');
        let $totoptext = $('#totop > p');
        // we have to (allegedly) check if there is already text present in the target element and only add it once!
        $totoptext.text() === "" ? $totoptext.append(result.totopdivtext.toUpperCase()) : $totoptext.text();
        $totop.hide(200);

        return result 
    })
    .then(result => {
        let $totop = $('#totop');

        window.setInterval( () => {
            if (headline) {
                manipulateHeadline(headline, firstrender);
            }
            
            // acquire scroll values here
            scrollvalue1 = page.scrollTop;
            scrollvalue2 = container.scrollTop  === undefined ? 0 : container.scrollTop; // basically a check for card pages 

            // set the global scroll value
            globalscrollvalue = scrollvalue1 + scrollvalue2;

            // animate headline if the threshold is reached
            if (headline) {
                (scrollvalue1 > result.scrollthreshold || scrollvalue2 > result.scrollthreshold) ? headline.classList.add('border-and-shadow') : headline.classList.remove('border-and-shadow');
            }
                
            if (scrollvalue1 > result.scrollthreshold || scrollvalue2 > result.scrollthreshold) {
                let currnavwidth = parseInt(getComputedStyle(document.querySelector('.container-navi')).width);
                let currwindowwidth = window.innerWidth;
                let navpos = determineNavPos();
                let totopleft;

                // the to top div dynamically changes position if the viewport changes,
                // also takes the navigation width and -position into account
                if (navpos === 'left') {
                    totopleft = ((currwindowwidth + currnavwidth) / 2 - 60).toString();
                } else if (navpos === 'right') {
                    totopleft = ((currwindowwidth - currnavwidth) / 2 - 60).toString();
                }

                // standard y position
                if (!nofooter) {
                    $totop.show(200);
                    $totop.css('bottom', '5em');
                    $totop.css('left', totopleft + 'px');

                // need other y coordinates if there's no footer on the page
                } else if (nofooter) {
                    $totop.show(200);
                    $totop.css('bottom', '0em');
                    $totop.css('left', totopleft + 'px');
                }
                    
            } else if (scrollvalue1 === 0 || scrollvalue2 === 0) {
                $totop.hide(200);
            }
        }, 500);
    });
}

function scrollToTop() {
    const theContent = findContentContainer()  || document.querySelector('.container-content-cardpage');
    // const scrollable = theContent.className !== 'container-content-cardpage' ? theContent.parentElement : theContent;
    const scrollable = theContent.className !== 'content-full' ? theContent : theContent.parentElement;

    scrollable.scrollBy({
        top: -(globalscrollvalue),
        left: 0,
        behavior: "smooth"
    });
}   

// Range Slider ~ TODO: reference based!
function displayRange() {
    let slider = document.getElementById('myRange');
    if (slider) {
        let _minRange = slider.getAttribute('min');
        let _maxRange = slider.getAttribute('max');
        let currRange = document.querySelector('#rangeoutput');

        currRange.innerHTML = slider.value;

        range_min.innerHTML = _minRange;
        range_max.innerHTML = _maxRange;

        slider.oninput = function() {
            currRange.innerHTML = this.value; 
        };
    }
}


function getCurrentVal(elname) {
    return parseInt(document.getElementById(elname).value);
}

// New table function with better initialization
function findTableRows(table) {
    let arr_tablerows = [], arr_tablecells = [], arr_radios = [];

    const tablerows = table.querySelectorAll('#' + table.id + '> div:nth-of-type(3) > div');
    const tablecells = table.querySelectorAll('#' + table.id + ' > div:nth-of-type(3) > div div');
    const radios = table.querySelectorAll('#' + table.id + ' input[type = radio]');

    arr_tablerows = [...tablerows];
    arr_tablecells = [...tablecells];
    arr_radios = [...radios];
    
    const columncount = tablerows.item(0).childElementCount;
    const addedclass = 'bg-positive';
    let tablefields = [];

    for (let i = 0; i < arr_tablerows.length; i++) {
        
        tablefields[i] = [];

        for (let j = 0; j < arr_tablecells.length; j++) {
            if (j < (i + 1) * columncount && j >= i * columncount) {
                tablefields[i][j - (i * columncount)] = arr_tablecells[j];
            }
        }
    }

    for (let i = 0; i < arr_tablerows.length; i++) {
        tablefields[i].forEach((element) => {

            if (element.getAttribute('data-listen-click') !== 'true') {
                element.addEventListener('click', () => {
                    
                    clearTableStyles(tablefields, addedclass);
                    element.setAttribute('data-listen-click', 'true');
                    
                    if (arr_radios[i].getAttribute('disabled') !== 'disabled') {
                        arr_radios[i].focus();
                        arr_radios[i].checked = true;
                    }
                                            
                    for (let j = 0; j < tablefields[i].length; j++) {
                        tablefields[i][j].classList.toggle(addedclass);
                    }
                }) 
            }
        })
    }
}


function clearTableStyles(tablearray, addedclass) {
    for (let i = 0; i < tablearray.length; i++) {
        tablearray[i].forEach((element) => {
            element.classList.remove(addedclass)
        });
    }
}

// find cards, maximize/minimize them or hide the content
function findFullscreenDiv() {
    return document.getElementById('fullscreendiv');
}


function setOpacity(element, state) {
    let inputfields = element.querySelectorAll('input:not([class="hide-OSrender"])');
    let dropdowns = element.querySelectorAll('select');

    if (state === true) {
        inputfields.forEach((el) => { el.disabled = false})
        dropdowns.forEach((el) => { el.disabled = false})
        element.style.opacity = "1";

    } else {
        inputfields.forEach((el) => { el.disabled = true})
        dropdowns.forEach((el) => { el.disabled = true})
        element.style.opacity  = ".25";
    }
}

function toggleElState(element) {
    let caller = element.querySelector('.hide-OSrender');
    let state = caller.checked;

    if (state !== true) {
        setOpacity(element, state);
        caller.checked = state;
        caller.setAttribute('razorckd', 'false');
        
    } else {
        setOpacity(element, state);
        caller.checked = state;
        caller.setAttribute('razorckd', 'true');
    }
}


function multiSelect(mastercheckboxid, mastercheckboxpos) {
    var master;
    // find the master 
    let findmasterid = document.querySelector(mastercheckboxid);

    // this is the separator for IDs by convention, should be a global value
    const separator = '_';

    // determine the prefix of the ID and the length of it
    let prefix = mastercheckboxid.split(separator)[0];
    let prefixlength = prefix.length;

    // find the subs
    let subs = Array.from(document.querySelectorAll('input[id^='+prefix+separator+']'));

    // pop or shift the master from the array. 
    // This will allow you to place the master checkbox anywhere relative to the subs. (i.e. above or below)
    // This solution looks weird, but since you can't rely on array.sort() at all, this was way safer
    if (mastercheckboxpos === 'top') {
        master = subs.shift();
        
    } else if (mastercheckboxpos === 'bottom') {
         master = subs.pop();
    }
    
    // cut off the prefix
    mastercheckboxid.substr(0, prefixlength);

    // change the corresponding checkboxes when the master is clicked
    if (master.checked === true) {
      subs.forEach((element) => {
        element.checked = true;
      });

    } else if (master.checked === false) {
        subs.forEach((element) => {
          element.checked = false;
      });
    }
}

function togglePasswordToTextInput(pwfield) {
    const pwswitch = pwfield.nextElementSibling;

    pwswitch.addEventListener('click', () => {
      pwfield.type === 'password' 
      ? pwfield.type = 'text' 
        : pwfield.type === 'text' 
        ? pwfield.type = 'password'
        : pwfield.type = 'password';
    });
}

function sentPasswordOnEnter(pwfield, loginbutton) {
    pwfield.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        loginbutton.click();
      }
    });
}

function getAntiForgeryToken() {
    const tokenfield = document.querySelector('#__RequestVerificationToken');
    return tokenfield ? tokenfield.value : null
};

function setDisplayUserMenu(menu, actionbutton, actionbuttontext) {
    return function() {
      toggleUserMenu(menu, actionbutton, actionbuttontext);
    };
}

function toggleUserMenu(menu, actionbutton, actionbuttontext) {
    menu.classList.toggle('hide-this');
    actionbutton.value = actionbuttontext;
}

// Faking the progress bar progress
async function slowProgress() {

    let progress = 0; //[sic]
    let hasbar = document.querySelector('.ldBar');

    if (hasbar) {
        while (progress < 101) {
            bar.set(progress);
            progress += 10;
            await sleep(400);
        };
    };
}

// Adds a separator after each innerText of <a> in the breadcrumb navigation.
// The CSS will look for the contents of the custom attribute named "data-separator",
// which we set here with a default value of ">".
function placeBreadcrumbSeparator(separator) {
    const bclinks = document.querySelectorAll('.breadcrumb > div > span:first-of-type > a');
    const sepdefault = '>';
    const sep = separator.toString() || sepdefault;

    bclinks.forEach( (el) => {
        el.innerText = el.innerText.toLowerCase();
        el.setAttribute('data-separator', sep);
    }) 
}

// If you want to check the content, measure the content section; the page body itself NEVER has a horizontal scrollbar in this app!
// I will find you wherever you may hide if it does.
function getScrollbarWidth(element) {
    return element.offsetWidth - element.clientWidth;
}

// Looks up custom HTML attributes pertaining to tooltips. It then deletes empty ones and calls a function which rearranges the
// display positions of the remaining elements.
function deleteEmptyTooltips() {
    // Much safer to collect both variants seperately.
    let allmouseover = document.querySelectorAll('[data-mouseover]');
    let alltooltips = document.querySelectorAll('[data-tooltip]');
    let mouseovercontent;
    let tooltipcontent;
    
    let arr_mouseover = [...allmouseover];
    let arr_tooltips = [...alltooltips];
    
    arr_mouseover.forEach( (el) => {
        mouseovercontent = el.getAttribute('data-mouseover');
        
        if (mouseovercontent == null || mouseovercontent === "") {
            el.removeAttribute('data-mouseover');
        }
    })

    arr_tooltips.forEach( (el) => {
            tooltipcontent = el.getAttribute('data-tooltip');
            
        if (tooltipcontent == null || tooltipcontent === "") {
            el.removeAttribute('data-tooltip');
        }
    })
    
    // Now we can merge both arrays for simplified handling
    let arr_alltips = [...arr_mouseover, ...arr_tooltips];
    
    configureTooltipPosition(arr_alltips);

    // Finally, we check and configure tooltip position every 2.5secs.
    // Another way to handle this: Attach 'onresize' event handlers to the window and the navigation container.
    window.setInterval( () => configureTooltipPosition(arr_alltips), 2500);  
}

// @PARAM: Array of Elements
// Sets variant classes for the tooltips depending on tooltip horizontal position in the viewport.
function configureTooltipPosition(tooltiplist) {
    const thecontent = findContentContainer() || null;
    const thepage = determinePageType();
    const halfcontent = thecontent === null ? thepage.getBoundingClientRect().width / 2 : (thecontent.getBoundingClientRect().width / 2);
    // Also we need to display the tooltip differently for the navigation, so let's find the navigation
    const thenavi = document.querySelector('#navi');

    tooltiplist.forEach( (el) => {
        // This is just an approximation, can be refined if you feel like it.
        if (((el.getBoundingClientRect().left + el.getBoundingClientRect().width / 4) > halfcontent) && !thenavi.contains(el)) {
            el.classList.add('tooltip-leftside');
        } else if (thenavi.contains(el)) {
            el.classList.add('tooltip-navi');
        }
    })
}

function showTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = timePad(m);
    s = timePad(s);
    
    let clockdisplay = document.querySelector('#pageclock');
    clockdisplay.innerHTML =  h + ":" + m + ":" + s;
    
    // Example for software degradation ;)
    // This will just update the displayed time irregularly 

    // let degrader = Math.random() * 1000;
    // setTimeout(showTime, 500 + degrader);
    setTimeout(showTime, 1000);
}

function timePad(i){
    // Clever use of language features. Also, who needs npm left-pad anyway? :D
    return (i < 10) ? i = "0" + i : i
}

// Helper function because JS has no thread.sleep()
async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}