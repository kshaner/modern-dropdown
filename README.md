# Modern Dropdown

Modern Dropdown is a utility javascript with no dependencies that covers all the bases for modern dropdown menus.

It handles:

* W3C Touch Events
* Pointer Events
* Mouse Events
* Hover Intent
* Focus Events

If a menu has a top level link and is opened with touch, the menu is opened and the link is not followed.  Then if it is touched again while the menu is open, the link followed.  This behavior is similar to aria-haspopup.

To use pass the node reference or query selector of the container that contains the menu to the constructor.  This is where the open class will be added along with the event listeners.

Note: All styling including display is left to css.  This script only adds the class at the appropriate time. You must add display:block or similar with the open class.

```javascript
new Dropdown('#node', options);
```

```javascript
jQuery('#node').dropdown(options);
```

### Options
```javascript
{
    delay: 250, // delay in milliseconds for hover intent
    openClass: 'dropdown--open', // class that is added to node when dropdown is open
    menu : '> ul', // selector for submenu, events will not be added if menu is not found
    spa  : false, // set to true for single page application mode - the links will not be followed in the menu but will close the menu on click
    beforeOpen: function() {}, // is called as the class is about to be added, return false to cancel the rest of the open event, 'this' refers to dropdown object
    afterOpen: function() {}, // is called after the open class has been added, useful in case measurements need to be made, 'this' refers to dropdown object
    beforeClose: function() {}, // is called before the open class is about to be removed, return false to cancel the rest of the close event, 'this' refers to dropdown object
    afterClose: function() {} // is called after the open class has been removed, 'this' refers to dropdown object
}
```

### Browser Support

* Firefox
* Chrome
* Safari
* Mobile Safari
* Android 4+ (haven't tested with 2.3)
* Edge
* IE8+

### Develop Notes
Use uglifyjs to create minified version: uglifyjs dropdown.js -o dropdown.min.js --mangle --compress
