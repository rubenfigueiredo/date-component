
type HandleFn = (
    keyboardValue: string,
    monthValue?: string
) => { value: string; moveToNextSection: boolean }

export const handleMonth: HandleFn = (
    keyboardValue: string,
    monthValue?: string
) => {
    let moveToNextSection: boolean = false;
    //if its an entry value
    if (monthValue == null) {
        console.log("keyboardValue", keyboardValue);

        if (parseInt(keyboardValue) > 1) {
            moveToNextSection = true;
        }

        return { value: keyboardValue, moveToNextSection };
        //if its not an entry value
    } else {
        //because the month in js starts with 0
        moveToNextSection = true;
        let newMonthValue: string;
        let tempIntSubValue: string = addDigitToDateSection(
            monthValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 12) {
            newMonthValue = tempIntSubValue;
        } else {
            newMonthValue = keyboardValue;
        }
        return { value: newMonthValue, moveToNextSection };
    }
};

export const handleDay: HandleFn = (keyboardValue: string, monthValue?: string): { value: string; moveToNextSection: boolean } => {
    //if its an entry value in the section
    let moveToNextSection: boolean = false;
    if (monthValue == null) {
        if (parseInt(keyboardValue) > 3) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        moveToNextSection = true;
        let newDayValue: string;
        let tempIntSubValue: string = addDigitToDateSection(
            monthValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 31) {
            newDayValue = tempIntSubValue;
        } else {
            newDayValue = keyboardValue
        }
        return { value: newDayValue, moveToNextSection };
    }
}

export const handleYear: HandleFn = (keyboardValue: string, yearValue?: string): { value: string; moveToNextSection: boolean } => {
    let moveToNextSection: boolean = false;
    //if its an entry value in the section
    if (yearValue == null) {
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        if (yearValue.length === 3) {
            moveToNextSection = true;
            let newYearValue: string = addDigitToDateSection(yearValue, keyboardValue);
            return { value: newYearValue, moveToNextSection };
        } else if (yearValue.length < 3) {
            moveToNextSection = false;
            let newYearValue: string = addDigitToDateSection(yearValue, keyboardValue);
            return { value: newYearValue, moveToNextSection };
        }
        else {
            moveToNextSection = true;
            return { value: keyboardValue, moveToNextSection };
        }
    }
}

export const handleHour: HandleFn = (keyboardValue: string, hourValue?: string) => {
    let moveToNextSection = false;
    if (hourValue == null) {
        if (parseInt(keyboardValue) > 2) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        moveToNextSection = true;
        let newHourValue: string;
        let tempIntSubValue: string = addDigitToDateSection(
            hourValue,
            keyboardValue
        );
        if (parseInt(tempIntSubValue) <= 23) {
            newHourValue = tempIntSubValue;
        } else {
            newHourValue = keyboardValue
        }
        return { value: newHourValue, moveToNextSection };
    }
}

export const handleMinutes: HandleFn = (keyboardValue: string, minuteValue?: string) => {
    let moveToNextSection = false;
    if (minuteValue == null) {
        if (parseInt(keyboardValue) > 5) {
            moveToNextSection = true;
        }
        return { value: keyboardValue, moveToNextSection };
    } else {
        //if its not an entry value in the section
        console.log("minuteValue", minuteValue);

        moveToNextSection = true;
        let tempIntSubValue: string = addDigitToDateSection(
            minuteValue,
            keyboardValue
        );
        console.log("tempIntSubValue", tempIntSubValue);

        return { value: tempIntSubValue, moveToNextSection };
    }
}

const addDigitToDateSection = (
    dateSectionValue: string,
    keyboardValue: string
): string => {
    let newStringSubValue: string =
        dateSectionValue.toString() + keyboardValue.toString();
    return newStringSubValue;
};

const getNumberLength = (number: number) => number.toString().length;
export const setDateSection = (date: string, newSubDateValue: string, startingPosition: number, endingPosition: number, section: string, char: string) => {
    let firstSubStringPart = date.substring(0, startingPosition);
    let lastSubstringPart = date.substring(endingPosition, date.length);
    //edit section
    let substring = date.substring(startingPosition, endingPosition);
    let intFromSubString = substring.match(/\d+/g);
    let newSubDateValueString = newSubDateValue.toString();
    let numberOfExtraFields = section.length - newSubDateValue.length;

    for (let index = 0; index < numberOfExtraFields; index++) {
        newSubDateValueString = newSubDateValueString + char;
    }

    let newInputValueSubString = "";
    if (intFromSubString != null) {
        let tempString: string = substring.split(char).join('');
        newInputValueSubString = tempString.replace(intFromSubString[0], newSubDateValueString);
    }
    let newInputValue =
        newInputValueSubString != null
            ? firstSubStringPart + newInputValueSubString + lastSubstringPart
            : undefined;
    return newInputValue;
}

export const getNumberFromString = (string: string | undefined, startingPosition: number, endingPosition: number) => {
    if (string == null) {
        return undefined;
    }
    let substring = string.substring(startingPosition, endingPosition);
    let intFromSubString = substring.match(/\d+/g);
    return intFromSubString != null ? intFromSubString[0] : undefined;
}

export const handleFn: Record<string, HandleFn> = {
    "MM": handleMonth,
    "dd": handleDay,
    "yyyy": handleYear,
    "HH": handleHour,
    "mm": handleMinutes
}