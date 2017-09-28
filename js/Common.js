jQuery.fn.highlight = function (str, className) {
    var regex = new RegExp(str, "gi");
    return this.each(function () {
        $(this).contents().filter(function() {
            return this.nodeType == 3 && regex.test(this.nodeValue);
        }).replaceWith(function() {
            return (this.nodeValue || "").replace(regex, function(match) {
                return "<span class=\"" + className + "\">" + match + "</span>";
            });
        });
    });
};

function isBound(elemenId) {
    var result = false;
    var x = ko.dataFor($("#" + elemenId)[0]);

    if (typeof (x) != 'undefined' & null != x) {
        result = true;
    }

    return result;
};

function IsNullOrUndefinedOrEmpty(obj) {
    return (typeof (obj) == 'undefined' || undefined == obj || null == obj || '' == obj);
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getMaxOccurance(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

/*-----------------------------------KO Extenders-------------------------------*/
ko.bindingHandlers.isDecimalSignedTextBoxWithLimit = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        // Grab some more data from another binding property
        var noOfDigitsBeforeDecimal = allBindings.get('noOfDigitsBeforeDecimal') || 10;
        var noOfDigitsAfterDecimal = allBindings.get('noOfDigitsAfterDecimal') || 10;
        var defaultValue = allBindings.get('defaultValue') || 0;
        var invalidInputCallack = allBindings.get('invalidInputCallack') || null;

        // Now manipulate the DOM element
        if (valueUnwrapped == true) {
            $(element).on("keypress", function () {
                return checkSignedDecimalWithLimit(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal);
            });

            $(element).on("keyup", function () {
                checkPasteSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, false);
            });

            $(element).on("change", function () {
                checkPasteSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, false);
            });

            $(element).on("blur", function () {
                checkPasteSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, true);
            });
        }
    },
    init: function (element, valueAccessor, allBindings) {
        var noOfDigitsBeforeDecimal = allBindings.get('noOfDigitsBeforeDecimal') || 10; // 10 is default duration unless otherwise specified
        var noOfDigitsAfterDecimal = allBindings.get('noOfDigitsAfterDecimal') || 10; // 10 is default duration unless otherwise specified

        adjustZerosAfterDecimalPoint(element, noOfDigitsAfterDecimal);
        adjustNumbersBeforeDecimalPoint(element, noOfDigitsBeforeDecimal);
    }
};

ko.bindingHandlers.isDecimalUnSignedTextBoxWithLimit = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        // Grab some more data from another binding property
        var noOfDigitsBeforeDecimal = allBindings.get('noOfDigitsBeforeDecimal') || 10;
        var noOfDigitsAfterDecimal = allBindings.get('noOfDigitsAfterDecimal') || 10;
        var defaultValue = allBindings.get('defaultValue') || 0;
        var invalidInputCallack = allBindings.get('invalidInputCallack') || null;

        // Now manipulate the DOM element
        if (valueUnwrapped == true) {
            $(element).on("keypress", function () {
                return checkUnSignedDecimalWithLimit(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal);
            });

            $(element).on("keyup", function () {
                checkPasteUnSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, false);
            });

            $(element).on("change", function () {
                checkPasteUnSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, false);
            });

            $(element).on("blur", function () {
                checkPasteUnSigned(this, noOfDigitsBeforeDecimal, noOfDigitsAfterDecimal, defaultValue, function (elem) { invalidInputCallack(elem); }, true);
            });

            $(element).on("focus", function () {
                var value = $(this).val();
                var formattedDefaultValue = formatZerosAfterDecimalPoint(defaultValue.toString(), noOfDigitsAfterDecimal);
                formattedDefaultValue = formatNumbersBeforeDecimalPoint(formattedDefaultValue, noOfDigitsBeforeDecimal);

                if (value == formattedDefaultValue) {
                    $(this).val('');
                }
            });
        }
    },
    init: function (element, valueAccessor, allBindings) {
        var noOfDigitsBeforeDecimal = allBindings.get('noOfDigitsBeforeDecimal') || 10; // 10 is default duration unless otherwise specified
        var noOfDigitsAfterDecimal = allBindings.get('noOfDigitsAfterDecimal') || 10; // 10 is default duration unless otherwise specified

        adjustZerosAfterDecimalPoint(element, noOfDigitsAfterDecimal);
        adjustNumbersBeforeDecimalPoint(element, noOfDigitsBeforeDecimal);
    }
};

ko.bindingHandlers.isUnSignedIntegerTextBox = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        // Grab some more data from another binding property
        var defaultValue = allBindings.get('defaultValue') || 0;

        // Now manipulate the DOM element
        if (valueUnwrapped == true) {
            $(element).on("keypress", function (event) {
                return isNumber(event)
            });

            $(element).bind("paste", function (e) {
                e.preventDefault();
            });

            $(element).on("focus", function () {
                var value = $(this).val();

                if (value == defaultValue) {
                    $(this).val('');
                }
            });

            $(element).on("blur", function () {
                var value = $(this).val();

                if (null == value || '' == value) {
                    $(this).val(defaultValue);
                }
            });
        }
    }
};

ko.bindingHandlers.shortenAt = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        // Grab some more data from another binding property
        var moreText = allBindings.get('moreText') || "more";
        var lessText = allBindings.get('lessText') || "less";

        // Now manipulate the DOM element
        if (valueUnwrapped > 0) {
            var content = $(element).text();
            if (content.length > valueUnwrapped) {
                var con = content.substr(0, valueUnwrapped);
                var hcon = content.substr(valueUnwrapped, content.length - valueUnwrapped);
                var txt = con + '<span class="dots">...</span><span class="morecontent"><span>' + hcon + '</span>&nbsp;&nbsp;<a href="" class="moretxt">' + moreText + '</a></span>';
                $(element).html(txt);

                $(element).find(".moretxt").click(function () {
                    if ($(this).hasClass("sample")) {
                        $(this).removeClass("sample");
                        $(this).text(moreText);
                    } else {
                        $(this).addClass("sample");
                        $(this).text(lessText);
                    }
                    $(this).parent().prev().toggle();
                    $(this).prev().toggle();
                    return false;
                });
            }
        }
    }
};

ko.bindingHandlers.highlightThis = {
    update: function (element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Grab some more data from another binding property
        //var moreText = allBindings.get('moreText') || "more";
        //var lessText = allBindings.get('lessText') || "less";

        // Now manipulate the DOM element
        if (typeof(valueUnwrapped) != 'undefined' && null != valueUnwrapped && valueUnwrapped.toString() != '') {
			if (!$(element).is("[backup]")) {
				$(element).attr("backup", $(element).html());
			}
			
			var backup = $(element).attr("backup");
			$(element).html(backup);
			$(element).highlight(valueUnwrapped, "highlighted-search-text");
        }
		else {
			var backupAttr = $(this).attr('backup');

			if ($(element).is("[backup]")) {debugger;
				var backup = $(element).attr("backup");
				$(element).html(backup);
			}
		}
    }
};
/*-----------------------------------KO Extenders-------------------------------*/