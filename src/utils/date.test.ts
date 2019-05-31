import { setInputMonth, setInputDay, setInputYear, setInputHour, setInputMinutes, editMonthForFormatting, addDigitToDateSection } from "./date";

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

test("addDigitToDateSection should receive 2 strings and concatenate the first with the last", () => {
    const digit = addDigitToDateSection("8", "1");
    expect(digit).toBe("81");

    const string = addDigitToDateSection("test1", "test2");
    expect(string).toBe("test1test2");
})