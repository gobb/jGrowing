// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "jGrowing",
        defaults = {
            onHover: true,
            childSelector: false,
            animationParams: {},
            beforeOn: function(el) {},
            afterOn: function() {},
            beforeOff: function() {},
            afterOff: function() {}
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            //console.log('init()');
            // element to animate
            this._elementToAnimate = (this.options.childSelector != false) ? $(this.element).find(this.options.childSelector) : $(this.element);

            /**
             * wrap this._elementToAnimate with <div class="j-genius-effect-wrapper">
             */
            $(this.element).wrap('<div class="j-genius-effect-wrapper" style="position: relative;" />');

            /**
             * store initial conditions
             */
            this._initialParams = {
                "width":        $(this.element).width(),
                "height":       $(this.element).height(),
                //"margin-top":   this._elementToAnimate.position().top
                "margin-top":   0
            };

            // attach the hover behavior
            if (this.options.onHover == true) {
                this._attachHoverBehavior(this.element, this.options);
            }
        },

        /**
         *
         *
         * @param el
         * @param options
         * @private
         */
        _attachHoverBehavior: function(el, options) {

            var _instance = this;

            this._elementToAnimate.mouseover(function() {
                _instance._on(el);
            }).mouseout(function(){
                _instance._off(el);
            });

        },

        /**
         *
         * @param el
         * @param options
         * @private
         */
        _on: function(el) {
            var _initialParams = this._initialParams;

            /*
             * calculate the (negative) margin-top to simulate the growing direction up
             */
            var _margin_top = (_initialParams.height - this.options.animationParams.height)*0.5;

            /*
             * merge the user defined animation parameters with the calculated margin-top
             * user cannot define a resulting margin-top
             */
            var _animationParams = $.extend({}, this.options.animationParams, {'margin-top': _margin_top});


            // run beforeOn() function
            if (typeof this.options.beforeOn === 'function') {
                this.options.beforeOn(el);
            }

            var afterOn = this.options.afterOn;

            $(el).animate(_animationParams, 200, function() {
                // Animation complete.

                $(this).addClass('j-genius-effect-on');

                // run afterOn() function
                if (typeof afterOn === 'function') {
                    afterOn(el);
                }
            });
        },

        /**
         *
         * @param el
         * @param options
         * @private
         */
        _off: function(el) {
            var _initialParams = this._initialParams;

            // run beforeOff() function
            if (typeof this.options.beforeOff === 'function') {
                this.options.beforeOff(el);
            }

            var afterOff = this.options.afterOff;

            $(el).animate(_initialParams, 200, function() {
                // Animation complete.

                $(this).removeClass('j-genius-effect-on');

                // run afterOff() function
                if (typeof afterOff === 'function') {
                    afterOff(el);
                }
            });
        },

        /**
         *
         * @param el
         */
        on: function(el) {
            this._on(el);
        },

        /**
         *
         * @param el
         */
        off: function(el) {
            this._off(el);
        }
    };

    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });

            // If the first parameter is a string and it doesn't start
            // with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    //returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                    returns = instance[options].apply( instance, [this] );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})( jQuery, window, document );
