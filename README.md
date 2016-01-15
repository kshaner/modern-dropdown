# Touch Dropdown

Touch Dropdown is a utility javascript with no dependencies that covers all the bases for modern dropdown menus.

It handles:

* W3C Touch Events
* Pointer Events
* Mouse Events
* Hover Intent

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
    menu : '> ul' // selector for submenu, events will not be added if menu is not found
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
