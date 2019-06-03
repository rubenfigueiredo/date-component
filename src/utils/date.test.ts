import { setInputMonth, setInputDay, setInputYear, setInputHour, setInputMinutes, editMonthForFormatting, concatenateStrings, replaceNumberInDate, setDateSection, getNumberFromString, focusNext } from "./date";
import { fireEvent } from '@testing-library/react'
test("Month should receive 2 string values and output an object with a string called value and a boolean called moveToNextSection", () => {
    const date1 = setInputMonth("1");
    expect(date1).toEqual({ value: "1", moveToNextSection: false });

    const date2 = setInputMonth("2", "1");
    expect(date2).toEqual({ value: "11", moveToNextSection: true });

    const date3 = setInputMonth("3", "1");
    expect(date3).toEqual({ value: "2", moveToNextSection: true });

    const date4 = setInputMonth("1", "4");
    expect(date4).toEqual({ value: "0", moveToNextSection: true });

    const date5 = setInputMonth("55", "1");
    expect(date5).toEqual({ value: "54", moveToNextSection: true });
});

test("Day should receive 2 string values and output an object with a string called value and a boolean called moveToNextSection", () => {
    const date1 = setInputDay("1");
    expect(date1).toEqual({ value: "1", moveToNextSection: false });

    const date2 = setInputDay("2", "2");
    expect(date2).toEqual({ value: "22", moveToNextSection: true });

    const date3 = setInputDay("3", "3");
    expect(date3).toEqual({ value: "3", moveToNextSection: true });

    const date4 = setInputDay("9");
    expect(date4).toEqual({ value: "9", moveToNextSection: true });

    const date5 = setInputDay("55", "1");
    expect(date5).toEqual({ value: "55", moveToNextSection: true });
});

test("Year should receive 2 string values and output an object with a string called value and a boolean called moveToNextSection", () => {
    const date1 = setInputYear("9");
    expect(date1).toEqual({ value: "9", moveToNextSection: false });

    const date2 = setInputYear("9", "29");
    expect(date2).toEqual({ value: "299", moveToNextSection: false });

    const date3 = setInputYear("9", "385");
    expect(date3).toEqual({ value: "3859", moveToNextSection: true });

    const date4 = setInputYear("5", "2000");
    expect(date4).toEqual({ value: "5", moveToNextSection: true });
});

test("Hour should receive 2 string values and output an object with a string called value and a boolean called moveToNextSection", () => {
    const date1 = setInputHour("5");
    expect(date1).toEqual({ value: "5", moveToNextSection: true });

    const date2 = setInputHour("2");
    expect(date2).toEqual({ value: "2", moveToNextSection: false });

    const date3 = setInputHour("3", "2");
    expect(date3).toEqual({ value: "23", moveToNextSection: true });

    const date4 = setInputHour("4", "2");
    expect(date4).toEqual({ value: "4", moveToNextSection: true });

    const date5 = setInputHour("4", "3");
    expect(date5).toEqual({ value: "4", moveToNextSection: true });
});

test("Minutes should receive 2 string values and output an object with a string called value and a boolean called moveToNextSection", () => {
    const date1 = setInputMinutes("5");
    expect(date1).toEqual({ value: "5", moveToNextSection: false });

    const date2 = setInputMinutes("6");
    expect(date2).toEqual({ value: "6", moveToNextSection: true });

    const date3 = setInputMinutes("9", "3");
    expect(date3).toEqual({ value: "39", moveToNextSection: true });

    const date4 = setInputMinutes("5", "6");
    expect(date4).toEqual({ value: "5", moveToNextSection: true });
});

test("editMonthForFormatting should receive a number in form of string decrease one unit and return the number in string form ", () => {
    const monthValue = editMonthForFormatting("8");
    expect(monthValue).toBe("7");

    const monthValue2 = editMonthForFormatting("0");
    expect(monthValue2).toBe("-1");
});

test("concatenateStrings should receive 2 strings and concatenate the first with the last", () => {
    const digit = concatenateStrings("8", "1");
    expect(digit).toBe("81");

    const string = concatenateStrings("test1", "test2");
    expect(string).toBe("test1test2");
});

test("replaceNumberInDate replace or concatenate a string in other string on a initial position and final position", () => {
    const date1 = replaceNumberInDate("testsString", "2019", 1, 6);
    expect(date1).toBe("t2019String");

    const date2 = replaceNumberInDate("testString", "2019", 3, 4);
    expect(date2).toBe("tes2019tString");

    const date3 = replaceNumberInDate("testString", "2018", 3, 2);
    expect(date3).toBe("tes2018estString");

    const date4 = replaceNumberInDate("tes", "2019", 0, 4);
    expect(date4).toBe("2019");

    const date5 = replaceNumberInDate("test", "2019", 6, 7);
    expect(date5).toBe("test2019");

    const date6 = replaceNumberInDate("test", "2019", -2, 7);
    expect(date6).toBe("2019");

    const date7 = replaceNumberInDate("2018 20 9 23:18", "31", 5, 8);
    expect(date7).toBe("2018 31 9 23:18");

    const date8 = replaceNumberInDate("2018 20 9 23:18", "31 ", 5, 8);
    expect(date7).toBe("2018 31 9 23:18");
});

test(" replace a string section inside a string , if its not the the same section length add char placeholders", () => {
    const date1 = setDateSection("--20 31 9 23:18", "-201", 0, 5, "yyyy", "-");
    expect(date1).toBe("-201 31 9 23:18");

    const date2 = setDateSection("--20-31-9 23:18", "-201", 0, 5, "yyyy", "-");
    expect(date2).toBe("-201-31-9 23:18");

    const date3 = setDateSection("-*20/31/9 23:18", "-201", 0, 5, "yyyy", "-");
    expect(date3).toBe("-201/31/9 23:18");

    const date4 = setDateSection("---2/31/9 23:18", "*20", 0, 5, "yyyy", "-");
    expect(date4).toBe("*20-/31/9 23:18");

    const date5 = setDateSection("2018/31/9 23:18", "20", 5, 8, "MM", "-");
    expect(date5).toBe("2018/20/9 23:18");

    const date6 = setDateSection("2018/31/9 23:18", "20", 5, 8, "yyyyy", "-");
    expect(date6).toBe("2018/20---/9 23:18");

    const date7 = setDateSection("2018/31/9 23:18", "20", 8, 10, "M", "-");
    expect(date7).toBe("2018/31/20 23:18");

    const date8 = setDateSection("2018/31/9 23:18", "20", 8, 10, "M", "-");
    expect(date8).toBe("2018/31/20 23:18");

    const date9 = setDateSection("2018/31/9 23:18", "2", 8, 10, "MMM", "-");
    expect(date9).toBe("2018/31/2-- 23:18");

    const date10 = setDateSection("2018/31/9 23:18", "2", 0, -2, "MM", "-");
    expect(date10).toBe("2-2018/31/9 23:18");

    const date11 = setDateSection("2018/31/9 23:18", "2", 0, 10, "MM", "_");
    expect(date11).toBe("2_ 23:18");

    const date12 = setDateSection("201", "2025", 0, 10, "mm", "_");
    expect(date12).toBe("2025");
});

test("getNumberFromString should receive string and find a number and return  a parsed string of the found number", () => {
    const digit1 = getNumberFromString("teststring81", 0, 10);
    expect(digit1).toBe(undefined);

    const digit2 = getNumberFromString("teststring81", 0, 13);
    expect(digit2).toBe("81");

    const digit3 = getNumberFromString("teststring81", 0, 50);
    expect(digit3).toBe("81");

    const digit4 = getNumberFromString("teststring81", 0, -2);
    expect(digit4).toBe(undefined);

    const digit5 = getNumberFromString("1", 0, 5);
    expect(digit5).toBe("1");
});


