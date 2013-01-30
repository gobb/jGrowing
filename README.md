jGrowing
========

jQuery plugin to implement the growing/shrinking effect for a single element on `hover` event.


# Status

This plugin is currently in beta state; testers and contributors are welcome ;)

# Usage

html:

```
<div class="container">

    <img id="growable" src="path/to/asset.jpg">

</div>
```

javascript:

```
$(function() {
    $("#growable").jGrowing({

        animationParams: {
            width:  100,
            height: 160
        },

        beforeOn: function(el) {
            // call a function before growing
        },
        afterOn: function(el) {
            // call a function after growing
        },
        beforeOff: function(el) {
            // call a function defore shrinking
        },
        afterOff: function(el) {
            // call a function after shrinking
        }

    });
)};
```