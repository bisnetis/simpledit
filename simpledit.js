

//Content editable div jQuery plugin
$.fn.simplEdit = function() {
    this.each(function() {
        setTimeout(function(){  }, 100);
        var $this = $(this);
        var selected_text = null;
        var uniqid = "se" + new Date().getTime();
        
        //set element unique ID
        $this.attr('data-owner', uniqid);
        
        //set options
        var options = {
            'bold' : true,
            'italics' : true,
            'underline' : true,
            'strike' : true,
            'align' : true
        };
        
        //implementation
            //get current selected text
        function getSelected() {
            var selection = window.getSelection();
            range = selection.getRangeAt(0);
            return range;
        }
            //bold selected text
        function waitForPasteData(context, content) {
            if (context.childNodes && context.childNodes.length > 0) {
                processPaste(context, content);
            } else {
                that = {
                    e : context,
                    s : content
                };
                that.callself = function () {
                    waitForPasteData(that.e, that.s);
                }
                setTimeout(that.callself, 20);
            }
        }
        
        function stripTags(context) {
        	var selection=getHTMLOfSelection();
            var txt;
            txt = selection.replace(/<\/?[^>]+(>|$)/g, "");
            var text;
            text = context.replace(selection,txt);
            return text;
        }
        function getHTMLOfSelection () {
            var range;
            if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                return range.htmlText;
            }
            else if (window.getSelection) {
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                    var clonedSelection = range.cloneContents();
                    var div = document.createElement('div');
                    div.appendChild(clonedSelection);
                    return div.innerHTML;
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        }
        
        function processPaste (context, content) {
            paste_data = context.innerHTML;
            
            context.innerHTML = content;
            
            var $div = $('<div></div>');
            $div.html(paste_data);
            $(context).append($div.text());
        }
        
            //binding logic
        $this.on('mouseup', function() {
            //get current selected text
            selected_text = getSelected();
        });
        
        $this.on('paste', function(e) {
            //manipulate paste-text
            var saved_content = $(this).html();
            if (e && e.clipboardData && e.clipboardData.getData) {
                if (/text\/html/.test(e.clipboardData.types)) {
                    $(this).html(e.clipboardData.getData('text/html'));
                } else if (/text\/plain/.test(e.clipboardData.types)) {
                    $(this).html(e.clipboardData.getData('text/plain'));
                } else {
                    $(this).html('');
                }
                waitForPasteData($(this)[0], saved_content);
                if (e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return false;
            } else {
                $(this).html('');
                waitForPasteData($(this)[0], saved_content);
                return true;
            }
        });
        
            //add WYSIWYG UI
        $this.before("<div><button class='simplEdit-btn " + uniqid + "' type='button' data-tag='bold' style='font-weight: bold;'>B</button><button class='simplEdit-btn " + uniqid + "' type='button' style='font-style: italic;' data-tag='italic'>I</button><button class='simplEdit-btn " + uniqid + "' type='button' data-tag='underline' style='text-decoration: underline;'>U</button><button class='simplEdit-btn " + uniqid + "' type='button' data-tag='strikeThrough' style='text-decoration: line-through;'>S</button><button class='simplEdit-btn-lg' type='button' onclick=\"$(this).parent().next().html(stripTags($(this).parent().next().html()));\">Clear Formatting</button></div>");
        
            //prevent mouse down on buttons from causing content edit div to lose focus
        $('button[class="simplEdit-btn ' + uniqid + '"], button[class="simplEdit-btn-lg ' + uniqid + '"]').on('mousedown', function(e) {
            e.preventDefault();
        });
        
        $('button[class="simplEdit-btn ' + uniqid + '"], button[class="simplEdit-btn-lg ' + uniqid + '"]').on('click', function(e) {
            //bind execCommand
            
            //check if appropriate text selected
            //var selection = window.getSelection();
            //var $parent = $(selection.anchorNode.parentElement);
            //if ($parent.data('owner') == uniqid && $parent.is(':focus')) {
            var tag = $(this).data('tag');
            alert(tag);
            var bool;
            switch (tag) {
                default:
                    bool=document.execCommand(tag);
            }
            //}
            //e.preventDefault();
        });
        
        //interface
        
    });
};
