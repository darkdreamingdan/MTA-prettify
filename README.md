# MTA Prettify extension
This is an extension to Google's Prettify library.  More specifically, it extends Prettify's own Lua syntax highlighting to markup Multi Theft Auto: San Andreas functions and events.  Here's the difference in what highlighting looks like:

Only Google Prettify:
![Lua code without MTA Prettify](http://i.imgur.com/bEOLh4d.png)

Google Prettify + MTA Prettify:
![Lua code with MTA Prettify](http://i.imgur.com/Kiy86x1.png)

All relevant functions and events are linked to the MTA Wiki or Lua documentation as appropriate.

# Installation
Usage is really simple, and it sits very well with Google's own prettify library.  Note, that you'll need a version of JQuery for the functions to work.

In your HTML HEAD includes, add the following:
```html
<!-- Add JQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<!-- Add Google Prettify library -->
<script src="//cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
<!-- Lua not added by default, add it-->
<script src="//cdn.rawgit.com/google/code-prettify/master/src/lang-lua.js"></script> 

<!-- Get the latest function definitions from MTA Forums -->
<script type='text/javascript' src='//forum.mtasa.com/uploads/javascript_syntax/luafuncs.js'></script>
<script type='text/javascript' src='//forum.mtasa.com/uploads/javascript_syntax/mtafuncs.js'></script>
<!-- Add MTA-prettify library -->
<link rel="stylesheet" type="text/css" href="//cdn.rawgit.com/darkdreamingdan/MTA-prettify/master/mtahighlight.min.css">
<script type='text/javascript' src="//cdn.rawgit.com/darkdreamingdan/MTA-prettify/master/mtahighlight.min.js"></script>
```

You'll then need some JavaScript to use Google's Prettify and apply MTA's markup:
```javascript
$(function () {
    // Perform Google Prettify
    PR.prettyPrint();
    // Add MTA markup
    applyMTAMarkup();
});
```

# Usage
Usage is just like Google's own Prettify, but you'll need to add `lang-lua` as a class to your `<pre/>` snippets.  For example:
```html
<pre class="prettyprint lang-lua">
function onWasted() 
  if not( isGuestAccount (getPlayerAccount(source)) ) then 
    local jailtime = getAccountData(getPlayerAccount(source), "Jailtime" ) or 0 
    local theWeapon = getPedWeapon (source) 
    local weaponAmmo = getPedTotalAmmo (source) 
    if tonumber(jailtime) == nil or 0 then 
    outputChatBox ("1", root) 
    fadeCamera (source, false) 
    setTimer (setElementHealth, 1500, 1, source, 10) 
    setTimer (setCameraTarget, 1250, 1, source, source) 
    setTimer (fadeCamera, 2000, 1, source, true) 
    setTimer (giveWeapon, 2000, 1, source, theWeapon, weaponAmmo, true) 
    elseif tonumber(jailtime) > 0 then 
    outputChatBox ("2", root) 
    fadeCamera (source, false) 
    setTimer (portjail, 1500, 1) 
    setTimer (setElementHealth, 1500, 1, source, 10) 
    setTimer (setCameraTarget, 1250, 1, source, source) 
    setTimer (fadeCamera, 2000, 1, source, true) 
    setTimer (giveWeapon, 2000, 1, source, theWeapon, weaponAmmo, true) 
    end 
  end 
end 
addEventHandler ("onPlayerWasted", getRootElement(), onWasted) 
</pre>
```

# Example
An example JSFiddle is available here:
https://jsfiddle.net/darkdreamingdan/0uvzbL1n/