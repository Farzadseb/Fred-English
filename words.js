// =======================
// a1-words.js (FULL - ساختار کامل)
// =======================

const A1Words = {
  level: "A1",
  totalWords: 200,
  words: [
    // ✅ شما فعلاً 100 تا گذاشتی. مشکلی نیست.
    // هر وقت 100 تای بعدی رو اضافه کنی سیستم اتومات می‌خونه.
    // (کدهای اپ به totalWords وابسته نیستند؛ به words.length تکیه می‌کنند.)

    { id: 1, english: "hello", persian: "سلام", pronunciation: "/həˈloʊ/", example: "Hello, my name is John.", examplePersian: "سلام، اسم من جان است.", definition: "A greeting or expression of goodwill used when meeting someone", collocation: "say hello, hello everyone, hello there", phrasalVerbs: [], difficulty: "easy", category: "greetings" },
    { id: 2, english: "goodbye", persian: "خداحافظ", pronunciation: "/ˌɡʊdˈbaɪ/", example: "Goodbye, see you tomorrow!", examplePersian: "خداحافظ، فردا می‌بینمت!", definition: "A farewell expression used when leaving", collocation: "say goodbye, kiss goodbye, wave goodbye", phrasalVerbs: [], difficulty: "easy", category: "greetings" },

    /* ... ادامه لیست شما ... */

    { id: 100, english: "woman", persian: "زن", pronunciation: "/ˈwʊmən/", example: "She is a strong woman.", examplePersian: "او یک زن قوی است.", definition: "An adult human female", collocation: "young woman, old woman, woman and child", phrasalVerbs: [], difficulty: "easy", category: "people" }

    // TODO: 101..200 را همین‌جا اضافه کنید
  ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = A1Words;
else window.A1Words = A1Words;
