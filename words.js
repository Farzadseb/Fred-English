// words.js - در پوشه اصلی پروژه
const words = [
    {
        english: "book",
        persian: "کتاب",
        definition: "something you read"
    },
    {
        english: "teacher",
        persian: "معلم",
        definition: "a person who teaches"
    },
    {
        english: "work",
        persian: "کار کردن",
        definition: "to do a job"
    },
    {
        english: "go",
        persian: "رفتن",
        definition: "to move to a place"
    },
    {
        english: "hello",
        persian: "سلام",
        definition: "greeting"
    },
    {
        english: "water",
        persian: "آب",
        definition: "clear liquid"
    },
    {
        english: "computer",
        persian: "کامپیوتر",
        definition: "electronic device"
    },
    {
        english: "friend",
        persian: "دوست",
        definition: "person you like"
    },
    {
        english: "house",
        persian: "خانه",
        definition: "place where people live"
    },
    {
        english: "car",
        persian: "ماشین",
        definition: "road vehicle"
    },
    {
        english: "school",
        persian: "مدرسه",
        definition: "place for learning"
    },
    {
        english: "time",
        persian: "زمان",
        definition: "what clocks measure"
    },
    {
        english: "food",
        persian: "غذا",
        definition: "what people eat"
    },
    {
        english: "money",
        persian: "پول",
        definition: "used to buy things"
    },
    {
        english: "family",
        persian: "خانواده",
        definition: "group of related people"
    },
    {
        english: "city",
        persian: "شهر",
        definition: "large town"
    },
    {
        english: "country",
        persian: "کشور",
        definition: "nation with government"
    },
    {
        english: "student",
        persian: "دانش‌آموز",
        definition: "person who studies"
    },
    {
        english: "apple",
        persian: "سیب",
        definition: "red or green fruit"
    },
    {
        english: "sun",
        persian: "خورشید",
        definition: "star that gives light"
    }
];

console.log(`✅ ${words.length} words loaded`);
window.words = words;

// تست در کنسول
if (typeof window !== 'undefined') {
    setTimeout(() => {
        console.log('words available:', typeof words !== 'undefined', words ? words.length : 0);
    }, 100);
}
