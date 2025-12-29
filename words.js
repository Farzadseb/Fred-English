// =======================
// WORDS DATABASE - سطح A1 واقعی (200 کلمه)
// =======================

const words = [
    // 1-20: افعال پایه
    {
        english: "be",
        persian: "بودن",
        definition: "to exist"
    },
    {
        english: "am",
        persian: "هستم",
        definition: "I exist"
    },
    {
        english: "is",
        persian: "هست",
        definition: "he/she/it exists"
    },
    {
        english: "are",
        persian: "هستید / هستند",
        definition: "you/they exist"
    },
    {
        english: "have",
        persian: "داشتن",
        definition: "to possess"
    },
    {
        english: "has",
        persian: "دارد",
        definition: "he/she/it possesses"
    },
    {
        english: "do",
        persian: "انجام دادن",
        definition: "to perform an action"
    },
    {
        english: "does",
        persian: "انجام می‌دهد",
        definition: "he/she/it performs"
    },
    {
        english: "work",
        persian: "کار کردن",
        definition: "to do a job"
    },
    {
        english: "go",
        persian: "رفتن",
        definition: "to move from one place to another"
    },
    {
        english: "come",
        persian: "آمدن",
        definition: "to move toward someone"
    },
    {
        english: "get",
        persian: "گرفتن / شدن",
        definition: "to obtain or become"
    },
    {
        english: "make",
        persian: "ساختن",
        definition: "to create something"
    },
    {
        english: "use",
        persian: "استفاده کردن",
        definition: "to employ something"
    },
    {
        english: "need",
        persian: "نیاز داشتن",
        definition: "to require something"
    },
    {
        english: "want",
        persian: "خواستن",
        definition: "to desire something"
    },
    {
        english: "like",
        persian: "دوست داشتن",
        definition: "to enjoy something"
    },
    {
        english: "love",
        persian: "دوست داشتن",
        definition: "to have strong affection"
    },
    {
        english: "help",
        persian: "کمک کردن",
        definition: "to assist someone"
    },
    {
        english: "try",
        persian: "تلاش کردن",
        definition: "to attempt something"
    },

    // 21-40: افعال دیگر
    {
        english: "start",
        persian: "شروع کردن",
        definition: "to begin something"
    },
    {
        english: "stop",
        persian: "متوقف کردن",
        definition: "to end movement"
    },
    {
        english: "say",
        persian: "گفتن",
        definition: "to speak words"
    },
    {
        english: "tell",
        persian: "گفتن (به کسی)",
        definition: "to inform someone"
    },
    {
        english: "ask",
        persian: "پرسیدن",
        definition: "to question someone"
    },
    {
        english: "answer",
        persian: "جواب دادن",
        definition: "to reply to a question"
    },
    {
        english: "talk",
        persian: "صحبت کردن",
        definition: "to speak with someone"
    },
    {
        english: "speak",
        persian: "صحبت کردن",
        definition: "to use your voice"
    },
    {
        english: "see",
        persian: "دیدن",
        definition: "to use your eyes"
    },
    {
        english: "look",
        persian: "نگاه کردن",
        definition: "to direct your eyes"
    },
    {
        english: "hear",
        persian: "شنیدن",
        definition: "to perceive sound"
    },
    {
        english: "listen",
        persian: "گوش دادن",
        definition: "to pay attention to sound"
    },
    {
        english: "feel",
        persian: "احساس داشتن",
        definition: "to experience emotion"
    },
    {
        english: "think",
        persian: "فکر کردن",
        definition: "to use your mind"
    },
    {
        english: "know",
        persian: "دانستن",
        definition: "to have information"
    },
    {
        english: "live",
        persian: "زندگی کردن",
        definition: "to be alive"
    },
    {
        english: "stay",
        persian: "ماندن",
        definition: "to remain in place"
    },
    {
        english: "leave",
        persian: "ترک کردن",
        definition: "to go away from"
    },
    {
        english: "move",
        persian: "حرکت کردن",
        definition: "to change position"
    },
    {
        english: "happen",
        persian: "اتفاق افتادن",
        definition: "to occur"
    },

    // 41-60: افراد و زمان
    {
        english: "people",
        persian: "مردم",
        definition: "human beings"
    },
    {
        english: "person",
        persian: "شخص",
        definition: "an individual human"
    },
    {
        english: "man",
        persian: "مرد",
        definition: "adult male human"
    },
    {
        english: "woman",
        persian: "زن",
        definition: "adult female human"
    },
    {
        english: "friend",
        persian: "دوست",
        definition: "person you like"
    },
    {
        english: "family",
        persian: "خانواده",
        definition: "parents and children"
    },
    {
        english: "job",
        persian: "شغل",
        definition: "work for money"
    },
    {
        english: "work",
        persian: "کار",
        definition: "activity to earn money"
    },
    {
        english: "money",
        persian: "پول",
        definition: "used to buy things"
    },
    {
        english: "time",
        persian: "زمان",
        definition: "hours, minutes, seconds"
    },
    {
        english: "day",
        persian: "روز",
        definition: "24-hour period"
    },
    {
        english: "week",
        persian: "هفته",
        definition: "7 days"
    },
    {
        english: "year",
        persian: "سال",
        definition: "12 months"
    },
    {
        english: "today",
        persian: "امروز",
        definition: "this day"
    },
    {
        english: "tomorrow",
        persian: "فردا",
        definition: "the next day"
    },
    {
        english: "yesterday",
        persian: "دیروز",
        definition: "the day before today"
    },
    {
        english: "now",
        persian: "الان",
        definition: "at this moment"
    },
    {
        english: "later",
        persian: "بعداً",
        definition: "at a future time"
    },
    {
        english: "early",
        persian: "زود",
        definition: "before the expected time"
    },
    {
        english: "late",
        persian: "دیر",
        definition: "after the expected time"
    },

    // 61-80: مکان‌ها
    {
        english: "here",
        persian: "اینجا",
        definition: "at this place"
    },
    {
        english: "there",
        persian: "آنجا",
        definition: "at that place"
    },
    {
        english: "home",
        persian: "خانه",
        definition: "where you live"
    },
    {
        english: "place",
        persian: "مکان",
        definition: "a location"
    },
    {
        english: "city",
        persian: "شهر",
        definition: "large town"
    },
    {
        english: "country",
        persian: "کشور",
        definition: "a nation"
    },
    {
        english: "school",
        persian: "مدرسه",
        definition: "place for learning"
    },
    {
        english: "office",
        persian: "اداره",
        definition: "place for work"
    },
    {
        english: "shop",
        persian: "مغازه",
        definition: "place to buy things"
    },
    {
        english: "street",
        persian: "خیابان",
        definition: "road in a town"
    },

    // 81-100: صفات پایه
    {
        english: "good",
        persian: "خوب",
        definition: "of high quality"
    },
    {
        english: "bad",
        persian: "بد",
        definition: "of low quality"
    },
    {
        english: "easy",
        persian: "آسان",
        definition: "not difficult"
    },
    {
        english: "hard",
        persian: "سخت",
        definition: "difficult"
    },
    {
        english: "big",
        persian: "بزرگ",
        definition: "large in size"
    },
    {
        english: "small",
        persian: "کوچک",
        definition: "little in size"
    },
    {
        english: "new",
        persian: "جدید",
        definition: "recently made"
    },
    {
        english: "old",
        persian: "قدیمی",
        definition: "not new"
    },
    {
        english: "same",
        persian: "یکسان",
        definition: "not different"
    },
    {
        english: "different",
        persian: "متفاوت",
        definition: "not the same"
    },
    {
        english: "busy",
        persian: "مشغول",
        definition: "having much to do"
    },
    {
        english: "free",
        persian: "آزاد",
        definition: "not busy"
    },
    {
        english: "tired",
        persian: "خسته",
        definition: "needing rest"
    },
    {
        english: "happy",
        persian: "خوشحال",
        definition: "feeling pleasure"
    },
    {
        english: "sad",
        persian: "ناراحت",
        definition: "feeling unhappy"
    },
    {
        english: "right",
        persian: "درست",
        definition: "correct"
    },
    {
        english: "wrong",
        persian: "غلط",
        definition: "incorrect"
    },
    {
        english: "important",
        persian: "مهم",
        definition: "of great value"
    },
    {
        english: "possible",
        persian: "ممکن",
        definition: "able to happen"
    },
    {
        english: "ready",
        persian: "آماده",
        definition: "prepared"
    },

    // 101-120: حروف اضافه و کلمات ارتباطی
    {
        english: "and",
        persian: "و",
        definition: "used to connect words"
    },
    {
        english: "but",
        persian: "اما",
        definition: "used to show contrast"
    },
    {
        english: "because",
        persian: "چون",
        definition: "for the reason that"
    },
    {
        english: "so",
        persian: "پس",
        definition: "therefore"
    },
    {
        english: "if",
        persian: "اگر",
        definition: "on condition that"
    },
    {
        english: "when",
        persian: "وقتی که",
        definition: "at what time"
    },
    {
        english: "before",
        persian: "قبل از",
        definition: "earlier than"
    },
    {
        english: "after",
        persian: "بعد از",
        definition: "later than"
    },
    {
        english: "about",
        persian: "درباره",
        definition: "on the subject of"
    },
    {
        english: "with",
        persian: "با",
        definition: "accompanied by"
    },
    {
        english: "without",
        persian: "بدون",
        definition: "not having"
    },
    {
        english: "for",
        persian: "برای",
        definition: "intended to be given to"
    },
    {
        english: "from",
        persian: "از",
        definition: "starting at"
    },
    {
        english: "to",
        persian: "به",
        definition: "in the direction of"
    },
    {
        english: "in",
        persian: "در",
        definition: "inside something"
    },
    {
        english: "on",
        persian: "روی",
        definition: "touching the surface"
    },
    {
        english: "at",
        persian: "در",
        definition: "expressing location"
    },
    {
        english: "of",
        persian: "ِ",
        definition: "belonging to"
    },
    {
        english: "this",
        persian: "این",
        definition: "referring to something near"
    },
    {
        english: "that",
        persian: "آن",
        definition: "referring to something far"
    },

    // 121-140: کلمات اشاره و مقدار
    {
        english: "these",
        persian: "این‌ها",
        definition: "plural of this"
    },
    {
        english: "those",
        persian: "آن‌ها",
        definition: "plural of that"
    },
    {
        english: "something",
        persian: "چیزی",
        definition: "an unspecified thing"
    },
    {
        english: "someone",
        persian: "کسی",
        definition: "an unspecified person"
    },
    {
        english: "nothing",
        persian: "هیچ‌چیز",
        definition: "not anything"
    },
    {
        english: "everything",
        persian: "همه‌چیز",
        definition: "all things"
    },
    {
        english: "one",
        persian: "یک",
        definition: "the number 1"
    },
    {
        english: "two",
        persian: "دو",
        definition: "the number 2"
    },
    {
        english: "many",
        persian: "زیاد",
        definition: "a large number"
    },
    {
        english: "few",
        persian: "کم",
        definition: "a small number"
    },
    {
        english: "a lot",
        persian: "خیلی",
        definition: "very much"
    },
    {
        english: "more",
        persian: "بیشتر",
        definition: "greater amount"
    },
    {
        english: "less",
        persian: "کمتر",
        definition: "smaller amount"
    },
    {
        english: "all",
        persian: "همه",
        definition: "the whole of"
    },
    {
        english: "some",
        persian: "بعضی",
        definition: "an unspecified amount"
    },
    {
        english: "any",
        persian: "هیچ / هر",
        definition: "used in questions"
    },
    {
        english: "same",
        persian: "یکسان",
        definition: "identical"
    },
    {
        english: "other",
        persian: "دیگر",
        definition: "different"
    },
    {
        english: "another",
        persian: "یکی دیگر",
        definition: "one more"
    },
    {
        english: "kind",
        persian: "نوع",
        definition: "type or sort"
    },

    // 141-160: زمان‌ها و قیدها
    {
        english: "morning",
        persian: "صبح",
        definition: "early part of the day"
    },
    {
        english: "afternoon",
        persian: "بعدازظهر",
        definition: "time after midday"
    },
    {
        english: "evening",
        persian: "عصر",
        definition: "end of the day"
    },
    {
        english: "night",
        persian: "شب",
        definition: "time of darkness"
    },
    {
        english: "today",
        persian: "امروز",
        definition: "the present day"
    },
    {
        english: "now",
        persian: "الان",
        definition: "at the present time"
    },
    {
        english: "again",
        persian: "دوباره",
        definition: "one more time"
    },
    {
        english: "always",
        persian: "همیشه",
        definition: "at all times"
    },
    {
        english: "usually",
        persian: "معمولاً",
        definition: "most of the time"
    },
    {
        english: "sometimes",
        persian: "گاهی",
        definition: "occasionally"
    },
    {
        english: "often",
        persian: "اغلب",
        definition: "frequently"
    },
    {
        english: "never",
        persian: "هرگز",
        definition: "at no time"
    },
    {
        english: "fast",
        persian: "سریع",
        definition: "quick"
    },
    {
        english: "slow",
        persian: "آهسته",
        definition: "not fast"
    },
    {
        english: "very",
        persian: "خیلی",
        definition: "to a high degree"
    },
    {
        english: "really",
        persian: "واقعاً",
        definition: "in actual fact"
    },
    {
        english: "just",
        persian: "فقط",
        definition: "only"
    },
    {
        english: "also",
        persian: "همچنین",
        definition: "in addition"
    },
    {
        english: "maybe",
        persian: "شاید",
        definition: "perhaps"
    },
    {
        english: "sure",
        persian: "مطمئن",
        definition: "certain"
    },

    // 161-180: عبارات روزمره
    {
        english: "yes",
        persian: "بله",
        definition: "affirmative answer"
    },
    {
        english: "no",
        persian: "نه",
        definition: "negative answer"
    },
    {
        english: "okay",
        persian: "باشه",
        definition: "agreement"
    },
    {
        english: "please",
        persian: "لطفاً",
        definition: "polite request"
    },
    {
        english: "thanks",
        persian: "ممنون",
        definition: "expression of gratitude"
    },
    {
        english: "sorry",
        persian: "ببخشید",
        definition: "apology"
    },
    {
        english: "hello",
        persian: "سلام",
        definition: "greeting"
    },
    {
        english: "hi",
        persian: "سلام",
        definition: "informal greeting"
    },
    {
        english: "bye",
        persian: "خداحافظ",
        definition: "farewell"
    },
    {
        english: "welcome",
        persian: "خوش آمدید",
        definition: "greeting to a visitor"
    },
    {
        english: "question",
        persian: "سؤال",
        definition: "sentence asking something"
    },
    {
        english: "answer",
        persian: "جواب",
        definition: "response to a question"
    },
    {
        english: "problem",
        persian: "مشکل",
        definition: "difficult situation"
    },
    {
        english: "reason",
        persian: "دلیل",
        definition: "cause or explanation"
    },
    {
        english: "idea",
        persian: "ایده",
        definition: "thought or suggestion"
    },
    {
        english: "thing",
        persian: "چیز",
        definition: "object or item"
    },
    {
        english: "way",
        persian: "راه",
        definition: "method or direction"
    },
    {
        english: "part",
        persian: "بخش",
        definition: "piece or segment"
    },
    {
        english: "life",
        persian: "زندگی",
        definition: "state of being alive"
    },
    {
        english: "world",
        persian: "دنیا",
        definition: "the earth"
    },

    // 181-200: افعال اضافی
    {
        english: "workday",
        persian: "روز کاری",
        definition: "day for working"
    },
    {
        english: "weekend",
        persian: "آخر هفته",
        definition: "Saturday and Sunday"
    },
    {
        english: "break",
        persian: "استراحت",
        definition: "pause from work"
    },
    {
        english: "rest",
        persian: "استراحت",
        definition: "relaxation"
    },
    {
        english: "plan",
        persian: "برنامه",
        definition: "arrangement for future"
    },
    {
        english: "change",
        persian: "تغییر",
        definition: "make different"
    },
    {
        english: "result",
        persian: "نتیجه",
        definition: "outcome"
    },
    {
        english: "example",
        persian: "مثال",
        definition: "sample"
    },
    {
        english: "point",
        persian: "نکته",
        definition: "main idea"
    },
    {
        english: "level",
        persian: "سطح",
        definition: "position on a scale"
    },
    {
        english: "begin",
        persian: "شروع کردن",
        definition: "to start"
    },
    {
        english: "finish",
        persian: "تمام کردن",
        definition: "to complete"
    },
    {
        english: "wait",
        persian: "صبر کردن",
        definition: "stay until something happens"
    },
    {
        english: "meet",
        persian: "ملاقات کردن",
        definition: "come together"
    },
    {
        english: "call",
        persian: "تماس گرفتن",
        definition: "telephone someone"
    },
    {
        english: "open",
        persian: "باز کردن",
        definition: "not closed"
    },
    {
        english: "close",
        persian: "بستن",
        definition: "shut"
    },
    {
        english: "buy",
        persian: "خریدن",
        definition: "purchase"
    },
    {
        english: "pay",
        persian: "پرداخت کردن",
        definition: "give money"
    },
    {
        english: "bring",
        persian: "آوردن",
        definition: "carry to a place"
    },
    {
        english: "take",
        persian: "برداشتن",
        definition: "carry from a place"
    },
    {
        english: "find",
        persian: "پیدا کردن",
        definition: "discover"
    },
    {
        english: "keep",
        persian: "نگه داشتن",
        definition: "retain possession"
    },
    {
        english: "give",
        persian: "دادن",
        definition: "hand over"
    },
    {
        english: "receive",
        persian: "دریافت کردن",
        definition: "be given"
    },
    {
        english: "learn",
        persian: "یاد گرفتن",
        definition: "gain knowledge"
    },
    {
        english: "teach",
        persian: "درس دادن",
        definition: "impart knowledge"
    },
    {
        english: "practice",
        persian: "تمرین کردن",
        definition: "do repeatedly to improve"
    },
    {
        english: "understand",
        persian: "فهمیدن",
        definition: "comprehend"
    },
    {
        english: "remember",
        persian: "به خاطر سپردن",
        definition: "keep in memory"
    }
];

// برای دیباگ: نمایش تعداد کلمات
console.log(`✅ بانک لغات بارگذاری شد: ${words.length} کلمه سطح A1`);
