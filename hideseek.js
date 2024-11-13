/**
 * HideSeek jQuery plugin
 *
 * @copyright Copyright 2015, Dimitris Krestos
 * @license   Apache License, Version 2.0 (http://www.opensource.org/licenses/apache2.0.php)
 * @link      http://vdw.staytuned.gr
 * @version   v0.8.0
 *
 * Dependencies are include in minified versions at the bottom:
 * 1. Highlight v4 by Johann Burkard
 *
 */

  /* Sample html structure

  <input name="search" placeholder="Start typing here" type="text" data-list=".list">
  <ul class="list">
    <li>item 1</li>
    <li>...</li>
    <li><a href="#">item 2</a></li>
  </ul>

  or

  <input name="search" placeholder="Start typing here" type="text" data-list=".list">
  <div class="list">
    <span>item 1</span>
    <span>...</span>
    <span>item 2</span>
  </div>

  or any similar structure...

  */

  (function($) {
    "use strict";

    $.fn.hideseek = function(options) {
        var defaults = {
            list: ".hideseek-data",
            nodata: "",
            attribute: "text",
            matches: false,
            highlight: false,
            ignore: "",
            headers: "",
            navigation: false,
            ignore_accents: false,
            hidden_mode: false,
            min_chars: 1
        };

        options = $.extend(defaults, options);

        return this.each(function() {
            var input = $(this);
            input.opts = [];

            $.map([
                "list", "nodata", "attribute", "matches", "highlight",
                "ignore", "headers", "navigation", "ignore_accents",
                "hidden_mode", "min_chars"
            ], function(option) {
                input.opts[option] = input.data(option) || options[option];
            });

            if (input.opts.headers) {
                input.opts.ignore += input.opts.ignore ? ", " + input.opts.headers : input.opts.headers;
            }

            var list = $(input.opts.list);

            if (input.opts.navigation) {
                input.attr("autocomplete", "off");
            }

            if (input.opts.hidden_mode) {
                list.children().hide();
            }

            input.on('input', function(event) {
                function showMatch(element) {
                    if (input.opts.highlight) {
                        element.removeHighlight().highlight(query).show();
                    } else {
                        element.show();
                    }
                }

                function getSelected(element) {
                    return element.children(".selected:visible");
                }

                function getPrev(element) {
                    return getSelected(element).prevAll(":visible:first");
                }

                function getNext(element) {
                    return getSelected(element).nextAll(":visible:first");
                }

                if ([38, 40, 13].indexOf(e.keyCode) === -1 && 
    (e.keyCode !== 8 && e.keyCode !== 46 ? $this.val().length >= $this.opts.min_chars : true)) {
                    var query = input.val().toLowerCase();

                    list.children(input.opts.ignore.trim() ? ":not(" + input.opts.ignore + ")" : "")
                        .removeClass("selected")
                        .each(function() {
                            var text = (input.opts.attribute !== "text" ? $(this).attr(input.opts.attribute) || "" : $(this).text()).toLowerCase();
                            var notMatched = text.removeAccents(input.opts.ignore_accents).indexOf(query) === -1 || query === (input.opts.hidden_mode ? "" : false);

                            if (notMatched) {
                                $(this).hide();
                            } else {
                                showMatch($(this));

                                if (input.opts.matches && query.match(new RegExp(Object.keys(input.opts.matches)[0]))) {
                                    text.match(new RegExp(Object.values(input.opts.matches)[0])) ? showMatch($(this)) : $(this).hide();
                                }
                            }

                            input.trigger("_after_each");
                        });

                    if (input.opts.nodata) {
                        list.find(".no-results").remove();

                        if (!list.children(':not([style*="display: none"])').length) {
                            list.children().first().clone().removeHighlight().addClass("no-results").show().prependTo(input.opts.list).text(input.opts.nodata);
                            input.trigger("_after_nodata");
                        }
                    }

                    if (input.opts.headers) {
                        $(input.opts.headers, list).each(function() {
                            $(this).nextUntil(input.opts.headers).not('[style*="display: none"],' + input.opts.ignore).length ? $(this).show() : $(this).hide();
                        });
                    }

                    input.trigger("_after");
                }

                if (input.opts.navigation) {
                    if (event.keyCode === 38) {
                        if (getSelected(list).length) {
                            getPrev(list).addClass("selected");
                            getSelected(list).last().removeClass("selected");
                        } else {
                            list.children(":visible").last().addClass("selected");
                        }
                    } else if (event.keyCode === 40) {
                        if (getSelected(list).length) {
                            getNext(list).addClass("selected");
                            getSelected(list).first().removeClass("selected");
                        } else {
                            list.children(":visible").first().addClass("selected");
                        }
                    } else if (event.keyCode === 13) {
                        if (getSelected(list).find("a").length) {
                            document.location = getSelected(list).find("a").attr("href");
                        } else {
                            input.val(getSelected(list).text());
                        }
                    }
                }
            });
        });
    };

    $(document).ready(function() {
        $('[data-toggle="hideseek"]').hideseek();
    });
}(jQuery));
/*

highlight v4

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/
jQuery.fn.highlight=function(t){function e(t,i){var n=0;if(3==t.nodeType){var a=t.data.removeAccents(true).toUpperCase().indexOf(i);if(a>=0){var s=document.createElement("mark");s.className="highlight";var r=t.splitText(a);r.splitText(i.length);var o=r.cloneNode(!0);s.appendChild(o),r.parentNode.replaceChild(s,r),n=1}}else if(1==t.nodeType&&t.childNodes&&!/(script|style)/i.test(t.tagName))for(var h=0;h<t.childNodes.length;++h)h+=e(t.childNodes[h],i);return n}return this.length&&t&&t.length?this.each(function(){e(this,t.toUpperCase())}):this},jQuery.fn.removeHighlight=function(){return this.find("mark.highlight").each(function(){with(this.parentNode.firstChild.nodeName,this.parentNode)replaceChild(this.firstChild,this),normalize()}).end()};

// Ignore accents
String.prototype.removeAccents=function(e){return e?this.replace(/[áàãâä]/gi,"a").replace(/[éè¨ê]/gi,"e").replace(/[íìïî]/gi,"i").replace(/[óòöôõ]/gi,"o").replace(/[úùüû]/gi,"u").replace(/[ç]/gi,"c").replace(/[ñ]/gi,"n"):this};
