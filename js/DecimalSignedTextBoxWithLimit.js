function adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal){
    element.value = formatZerosAfterDecimalPoint(element.value, maxLengthAfterDecimal);
}

function formatZerosAfterDecimalPoint(inputValue, maxLengthAfterDecimal) {
    var value = inputValue;

    if (value.indexOf('.') != -1) {
        var val = value.split('.');
        if (typeof (val) != 'undefined' && val != null) {
            var newVal;
            var zeros = '';
            var sizeBefore = (val.length == 2) ? val[1].length : 0

            var numberOfZeros = maxLengthAfterDecimal - sizeBefore;

            if (numberOfZeros < 0) {
                value = value.substring(0, value.length + numberOfZeros);
            }
            else {
                for (var i = 0; i < numberOfZeros; i++) {
                    zeros = zeros + "0";
                }
                value = value + zeros;
            }
        }
    }
    else {
        var zeros = '';
        for (var i = 0; i < maxLengthAfterDecimal; i++) {
            zeros = zeros + "0";
        }
        value = value + "." + zeros;
    }

    return value;
}

function adjustNumbersBeforeDecimalPoint(element, maxLengthBeforeDecimal){
    element.value = formatNumbersBeforeDecimalPoint(element.value, maxLengthBeforeDecimal);
}

function formatNumbersBeforeDecimalPoint(inputValue, maxLengthBeforeDecimal) {
    var value = inputValue;

    if (value.length != 0) {
        if (value.indexOf('.') != -1) {
            var val = value.split('.');
            if (typeof (val) != 'undefined' && val != null) {
                var firstPart = val[0];
                var secondPart = val[1];
                var lengthBefore = replaceAll(replaceAll(firstPart, ",", ""), "-", "").length;

                if (lengthBefore > maxLengthBeforeDecimal) {
                    var negativeSign = (firstPart.indexOf('-') != -1) ? '-' : '';
                    firstPart = replaceAll(replaceAll(firstPart, ",", ""), "-", "").substring(0, maxLengthBeforeDecimal);
                    firstPart = negativeSign + firstPart;
                }
                firstPart = (firstPart) ? firstPart : ''
                secondPart = (secondPart) ? secondPart : '';
                value = firstPart + "." + secondPart;
            }
        }
        else {
            if (value.length > maxLengthBeforeDecimal) {
                var negativeSign = (value.indexOf('-') != -1) ? '-' : '';
                value = replaceAll(replaceAll(value, ",", ""), "-", "").substring(0, maxLengthBeforeDecimal);
                value = negativeSign + value;
            }
        }
    }

    return value;
}
		
//this function used to allow only numbers in a text field
function checkNumber(element) {
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

//this function used to allow only decimals in a text field
function checkDecimal(element) {
    var oldText = element.value;
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && oldText.indexOf('.') < 0))
        return true;
    return false;
}

function GetCarterPosition(el) {
    var sel, rng, r2, i = -1;

    if (typeof el.selectionStart == "number") {
        i = el.selectionStart;
    }
    else if (document.selection && el.createTextRange) {
        sel = document.selection;
        if (sel) {
            r2 = sel.createRange();
            rng = el.createTextRange();
            rng.setEndPoint("EndToStart", r2);
            i = rng.text.length;
        }
    }
    else {
        //  el.onkeyup=null;
        // el.onclick=null;
    }

    return i;
}

//Added by Mehra
//Source:http://home.pacific.net.sg/~firehzrd/jsarc/unWebify.html
function replaceAll(oldStr, findStr, repStr) {
    var srchNdx = 0;  // srchNdx will keep track of where in the whole line
    // of oldStr are we searching.
    var newStr = "";  // newStr will hold the altered version of oldStr.
    while (oldStr.indexOf(findStr, srchNdx) != -1)
    // As long as there are strings to replace, this loop
    // will run. 
    {
        newStr += oldStr.substring(srchNdx, oldStr.indexOf(findStr, srchNdx));
        // Put it all the unaltered text from one findStr to
        // the next findStr into newStr.
        newStr += repStr;
        // Instead of putting the old string, put in the
        // new string instead. 
        srchNdx = (oldStr.indexOf(findStr, srchNdx) + findStr.length);
        // Now jump to the next chunk of text till the next findStr.           
    }
    newStr += oldStr.substring(srchNdx, oldStr.length);
    // Put whatever's left into newStr.             
    return newStr;
}

//Added by Mehra
//Source:http://www.btinternet.com/~st_rise/main/mainfram.htm?../scripts/string.htm
//but did some minor modifications to make it reusable
function charCount(searchString, searchChar) {
    //searchString=myForm.Text.value // text to search
    charPos = searchString.indexOf(searchChar) // position of char to count
    //searchChar=myForm.letter.value // character to search for
    charPos = searchString.indexOf(searchChar) // position of char

    count = 0
    while (charPos != -1) {
        count++
        charPos = searchString.indexOf(searchChar, charPos + 1) // number of occurances
    }
    return count;
}

//this function used to allow only decimals in a text field
function checkDecimalWithLimit(element, maxLengthBeforeDecimal, hdnMaxLengthAfterDecimal, trigger) {
    //46: Decimal point 
    //44: comma
    var maxLengthAfterDecimal;
    if (document.getElementById(hdnMaxLengthAfterDecimal) == null)
        maxLengthAfterDecimal = 2;
    else maxLengthAfterDecimal = document.getElementById(hdnMaxLengthAfterDecimal).value;
    var oldText = element.value;
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    var carterPos = GetCarterPosition(element);
    var NoOfComma = charCount(oldText, ',')
    carterPos = carterPos - NoOfComma;

    //if maxLengthAfterDecimal == 0, we do not allow decimal
    if (maxLengthAfterDecimal == 0 && charCode == 46)
        return false;

    //We allow comma, we do not do any validations
    if (charCode == 44)
        return true;


    if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && oldText.indexOf('.') < 0)) {
        oldText = replaceAll(oldText, ",", "");

        var decimalTest = oldText.split('.');

        if (decimalTest[0] != null) {
            var decimalIndex = oldText.indexOf('.');

            //if decimal, check if there are numbers after it
            //if there are, check that it is not more than the maxLengthAfterDecimal
            if (charCode == 46) {
                if (oldText.length - carterPos > maxLengthAfterDecimal) {
                    return false;
                }
            }

            if (charCode != 46 && (decimalIndex < 0 || carterPos <= decimalIndex)) {

                if (decimalTest[0].length >= maxLengthBeforeDecimal) {
                    return false;
                }
            }
        }

        if (decimalTest[1] != null) {
            if (carterPos > decimalIndex) {
                if (decimalTest[1].length >= maxLengthAfterDecimal) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

//this function used to allow only decimals in a text field
function checkSignedDecimalWithLimit(element, maxLengthBeforeDecimal, maxLengthAfterDecimal, trigger) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;
	
	
    //46: Decimal point 
    //44: comma
    //45: negative
    var oldText = element.value;
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    //We don't allow comma
    if (charCode == 44)
        return false;

    var orgcarterPos = GetCarterPosition(element);
    var NoOfComma = charCount(oldText, ',')
    var carterPos = orgcarterPos - NoOfComma;

    if (maxLengthAfterDecimal == 0 && charCode == 46)
        return false;

    if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && oldText.indexOf('.') < 0) || (charCode == 45 && orgcarterPos == 0 && oldText.indexOf('-') < 0)) {
        oldText = replaceAll(oldText, ",", "");
        oldText = replaceAll(oldText, "-", "");

        var decimalTest = oldText.split('.');

        if (decimalTest[0] != null) {
            var decimalIndex = oldText.indexOf('.');

            //if decimal, check if there are numbers after it
            //if there are, check that it is not more than the maxLengthAfterDecimal
            if (charCode == 46) {
                if (oldText.length - carterPos > maxLengthAfterDecimal) {
                    return false;
                }
            }
            
			if (charCode != 45 && charCode != 46 && (decimalIndex < 0 || carterPos <= decimalIndex)) {
                var lengthBefore = replaceAll(replaceAll(decimalTest[0], ",", ""), "-", "").length;
				if (lengthBefore >= maxLengthBeforeDecimal) {
                    return false;
                }
            }
        }

        if (decimalTest[1] != null) {
			var originalDecimalIndex = element.value.indexOf('.');
            if (carterPos > originalDecimalIndex) {
                if (decimalTest[1].length >= maxLengthAfterDecimal) {
                    return false;
                }
            }
			else if (carterPos <= originalDecimalIndex) {
                var lengthBefore = replaceAll(replaceAll(decimalTest[0], ",", ""), "-", "").length;
				if (charCode != 45 && lengthBefore >= maxLengthBeforeDecimal) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

function checkUnSignedDecimalWithLimit(element, maxLengthBeforeDecimal, maxLengthAfterDecimal, trigger) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    //46: Decimal point 
    //44: comma
    //45: negative
    var oldText = element.value;
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    //We don't allow comma and negative sign
    if (charCode == 44 || charCode == 45) {
        return false;
    }

    var orgcarterPos = GetCarterPosition(element);
    var NoOfComma = charCount(oldText, ',')
    var carterPos = orgcarterPos - NoOfComma;

    if (maxLengthAfterDecimal == 0 && charCode == 46)
        return false;

    if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && oldText.indexOf('.') < 0) || (charCode == 45 && orgcarterPos == 0 && oldText.indexOf('-') < 0)) {
        oldText = replaceAll(oldText, ",", "");
        oldText = replaceAll(oldText, "-", "");

        var decimalTest = oldText.split('.');

        if (decimalTest[0] != null) {
            var decimalIndex = oldText.indexOf('.');

            //if decimal, check if there are numbers after it
            //if there are, check that it is not more than the maxLengthAfterDecimal
            if (charCode == 46) {
                if (oldText.length - carterPos > maxLengthAfterDecimal) {
                    return false;
                }
            }

            if (charCode != 45 && charCode != 46 && (decimalIndex < 0 || carterPos <= decimalIndex)) {
                var lengthBefore = replaceAll(replaceAll(decimalTest[0], ",", ""), "-", "").length;
                if (lengthBefore >= maxLengthBeforeDecimal) {
                    return false;
                }
            }
        }

        if (decimalTest[1] != null) {
            var originalDecimalIndex = element.value.indexOf('.');
            if (carterPos > originalDecimalIndex) {
                if (decimalTest[1].length >= maxLengthAfterDecimal) {
                    return false;
                }
            }
            else if (carterPos <= originalDecimalIndex) {
                var lengthBefore = replaceAll(replaceAll(decimalTest[0], ",", ""), "-", "").length;
                if (charCode != 45 && lengthBefore >= maxLengthBeforeDecimal) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

function validateDecimal(sender) {
    if (sender.value.match(/^(\d+)?\.\d$/))
        alert("YES"); // Approval, No Message Required
    else
        alert("NO"); // Can output a friendly message to the user here
}

function checkForSecondDecimal(sender, e) {
    formatBox = document.getElementById(sender.id);
    strLen = sender.value.length;
    strVal = sender.value;
    hasDec = false;
    e = (e) ? e : (window.event) ? event : null;

    if (e) {
        var charCode = (e.charCode) ? e.charCode :
                       ((e.keyCode) ? e.keyCode :
                       ((e.which) ? e.which : 0));

        if ((charCode == 46) || (charCode == 110) || (charCode == 190)) {
            for (var i = 0; i < strLen; i++) {
                hasDec = (strVal.charAt(i) == '.');
                if (hasDec)
                    return false;
            }
        }
    }
    return true;
}
/*MG Issue 1062*/
// Allow Paste only Digists , Comma, and decimal
function checkPasteSigned(element) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value.replace('-', ''))) {
        element.value = "";
        alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        return false;
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    element.value = CommaFormattedN(element);
}

function checkPasteSigned(element, maxAllowed, maxLengthAfterDecimal, onBlur) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;
	
    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value.replace('-', ''))) {
        element.value = "";
        alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        return false;
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    //element.value = element.value.substr(0, parseInt(maxAllowed))

    if (onBlur)
	{
	    if (typeof (element.value) != 'undefined' && null != element.value && element.value != '')
	    {
	        adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal);
	        adjustNumbersBeforeDecimalPoint(element, maxAllowed);
	    }
    }
	//element.value = CommaFormattedN(element);
}

function checkPasteSigned(element) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value.replace('-', ''))) {
        element.value = "";
        alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        return false;
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    element.value = CommaFormattedN(element);
}

function checkPasteSigned(element, maxAllowed, maxLengthAfterDecimal, defaultValue, invalidInputCallack, onBlur) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value.replace('-', ''))) {
        if (typeof (defaultValue) != 'undefined' && null != defaultValue) {
            element.value = defaultValue;
            adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal);
            adjustNumbersBeforeDecimalPoint(element, maxAllowed);
        }
        else {
            element.value = "";
        }

        if (typeof (invalidInputCallack) != 'undefined' && null != invalidInputCallack) {
            invalidInputCallack(element);
        }
        else {
            alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        }

        return false;
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    //element.value = element.value.substr(0, parseInt(maxAllowed))

    if (onBlur) {
        if (typeof (element.value) == 'undefined' || null == element.value || element.value == '') {
            if (typeof (defaultValue) != 'undefined' && null != defaultValue) {
                element.value = defaultValue;
            }
        }

        adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal);
        adjustNumbersBeforeDecimalPoint(element, maxAllowed);
    }
    //element.value = CommaFormattedN(element);
} function checkPasteUnSigned(element) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value)) {
        element.value = "";
        alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        return false;
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    element.value = CommaFormattedN(element);
}

function checkPasteUnSigned(element, maxAllowed, maxLengthAfterDecimal, defaultValue, invalidInputCallack, onBlur) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;

    // First Trim spaces
    while (element.value.indexOf(' ') > 0)
        element.value = element.value.replace(' ', '');
    //Check if numeric
    if (!isNumeric(element.value)) {
        if (typeof (defaultValue) != 'undefined' && null != defaultValue) {
            element.value = defaultValue;
            adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal);
            adjustNumbersBeforeDecimalPoint(element, maxAllowed);
        }
        else {
            element.value = "";
        }

        if (typeof (invalidInputCallack) != 'undefined' && null != invalidInputCallack) {
            invalidInputCallack(element);
        }
        else {
            alert('You entered an alphabetic character that is not allowed. Please enter a numeric value.');
        }
    }
    //Delete Commas
    while (element.value.indexOf(',') > 0) {
        element.value = element.value.replace(',', '');
    }
    //element.value = element.value.substr(0, parseInt(maxAllowed))

    if (onBlur) {
        if (typeof (element.value) == 'undefined' || null == element.value || element.value == '') {
            if (typeof (defaultValue) != 'undefined' && null != defaultValue) {
                element.value = defaultValue;
            }
        }

        adjustZerosAfterDecimalPoint(element, maxLengthAfterDecimal);
        adjustNumbersBeforeDecimalPoint(element, maxAllowed);
    }
    //element.value = CommaFormattedN(element);
}

function RoundDecimal(element, hdnMaxLengthAfterDecimal) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;
    if (element.value != '') {
        while (element.value.indexOf(',') > 0) {
            element.value = element.value.replace(',', '');
        }
        maxLengthAfterDecimal = hdnMaxLengthAfterDecimal;
        //        if (document.getElementById(hdnMaxLengthAfterDecimal) == null)
        //            maxLengthAfterDecimal = 6;
        //        else maxLengthAfterDecimal = document.getElementById(hdnMaxLengthAfterDecimal).value;
        if (element.value.split('.').length > 1 && element.value.split('.')[1] != "") {
            element.value = round_decimals(element.value, maxLengthAfterDecimal);
            return element.value = CommaFormattedN(element);
        }
        else
            return element.value = CommaFormattedN(element);
    }
}

function RoundDecimal(element, hdnMaxLengthAfterDecimal, hdnMaxLengthBeforeDecimal) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;
    if (element.value != '') {
        while (element.value.indexOf(',') > 0) {
            element.value = element.value.replace(',', '');
        }
        maxLengthAfterDecimal = hdnMaxLengthAfterDecimal;
        element.value = element.value.substr(0, parseInt(hdnMaxLengthBeforeDecimal));
        //        if (document.getElementById(hdnMaxLengthAfterDecimal) == null)
        //            maxLengthAfterDecimal = 6;
        //        else maxLengthAfterDecimal = document.getElementById(hdnMaxLengthAfterDecimal).value;
        if (element.value.split('.').length > 1 && element.value.split('.')[1] != "") {
            element.value = round_decimals(element.value, maxLengthAfterDecimal);
            return element.value = CommaFormattedN(element);
        }
        else
            return element.value = CommaFormattedN(element);
    }
}

function isNumeric(strNum) {
    var isNumber = true;
    var VarDec = 0;
    var validChars = "0123456789.,";
    var thisChar;
    for (i = 0; i < strNum.length && isNumber == true; i++) {
        thisChar = strNum.charAt(i);
        if (thisChar == "-" && i > 0) isNumber = false;
        if (thisChar == ".") {
            VarDec = VarDec + 1;
            if ((i == 0 || i == strNum.length - 1) && strNum.length == 1) isNumber = false;
            if (VarDec > 1) isNumber = false;
        }
        if (validChars.indexOf(thisChar) == -1) isNumber = false;
    }
    return isNumber;
}
function CommaFormattedN(element) {
    var key = window.event.keyCode;
    if (key == 9 || (key >= 35 && key <= 40)) return;
    var dec = '';
    if (element.value.split('.').length > 1)
        dec = '.' + element.value.split('.')[1];
    var amount = element.value;
    while (amount.indexOf(',') > 0) {
        amount = amount.replace(',', '');
    }
    var delimiter = ",";
    var i = parseInt(amount);

    if (isNaN(i)) { if (amount == "-") return '-'; return ''; }

    var origi = i;  // store original to check sign
    i = Math.abs(i);

    var minus = '';
    if (origi < 0) { minus = '-'; } // sign based on original

    var n = new String(i);
    var a = [];

    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }

    if (n.length > 0) { a.unshift(n); }

    n = a.join(delimiter);

    amount = minus + n;

    var eval = amount;
    if (dec != '') eval = eval + dec
    element.value = eval;
    return eval
}
function round_decimals(original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals)
    var result2 = Math.round(result1)
    var result3 = result2 / Math.pow(10, decimals)
    return result3;
    //return pad_with_zeros(result3, decimals)
}

function pad_with_zeros(rounded_value, decimal_places) {

    var value_string = rounded_value.toString()
    var decimal_location = value_string.indexOf(".")
    if (decimal_location == -1) {
        decimal_part_length = 0
        value_string += decimal_places > 0 ? "." : ""
    }
    else {
        decimal_part_length = value_string.length - decimal_location - 1
    }
    var pad_total = decimal_places - decimal_part_length

    if (pad_total > 0) {
        for (var counter = 1; counter <= pad_total; counter++)
            value_string += "0"
    }
    return value_string
}

/**/
//Trimming function
function jsfnTrim(jsTextValue) {

    if (jsTextValue != "" && jsTextValue != null) {
        jsTextValue = jsfnRTrim(jsfnLTrim(jsTextValue));
        return jsTextValue;
    }

    return jsTextValue;
}
function jsfnLTrim(jsValue) {
    var jsModString = jsValue;

    for (i = 0; i < jsValue.length; i++) {
        if (jsValue.charAt(i) != " ") {
            return jsModString;
        }
        else {
            jsModString = jsModString.substring(1, jsModString.length);
        }
    }
    return "";
}

function jsfnRTrim(jsValue) {
    var jsModString = jsValue;

    for (i = (jsValue.length) - 1; i >= 0; i--) {
        if (jsValue.charAt(i) != " ")
            return jsModString;
        else
            jsModString = jsModString.substring(0, i);
    }
    return "";

}
function compareText(option1, option2) {
    return option1.text < option2.text ? -1 :
    option1.text > option2.text ? 1 : 0;
}

function checkNumbers() {
    var ValidChars = /^[0-9].-$/;
    var pasteData = window.clipboardData.getData("Text");
    if (ValidChars.test(pasteData))
    { return true; }
    else {
        alert("invalid number");
        return false;
    }
}
function checkTextAreaMaxLength(textBox, e, length) {
    var mLen = textBox["MaxLength"];
    if (null == mLen)
        mLen = length;

    var maxLength = parseInt(mLen);
    if (!checkSpecialKeys(e)) {
        if (textBox.value.length > maxLength - 1) {
            if (window.event)//IE
                e.returnValue = false;
            else//Firefox
                e.preventDefault();
        }
    }
}

function checkSpecialKeys(e) {
    if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
        return false;
    else
        return true;
}