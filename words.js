// =======================
// A1 WORDS DATABASE
// 200 essential English words for A1 level
// =======================

const A1Words = {
    level: "A1",
    totalWords: 200,
    words: [
        {
            id: 1,
            english: "hello",
            persian: "سلام",
            pronunciation: "/həˈloʊ/",
            example: "Hello, my name is John.",
            examplePersian: "سلام، اسم من جان است.",
            definition: "A greeting or expression of goodwill used when meeting someone",
            collocation: "say hello, hello everyone, hello there",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "greetings"
        },
        {
            id: 2,
            english: "goodbye",
            persian: "خداحافظ",
            pronunciation: "/ˌɡʊdˈbaɪ/",
            example: "Goodbye, see you tomorrow!",
            examplePersian: "خداحافظ، فردا می‌بینمت!",
            definition: "A farewell expression used when leaving",
            collocation: "say goodbye, kiss goodbye, wave goodbye",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "greetings"
        },
        {
            id: 3,
            english: "thank you",
            persian: "متشکرم",
            pronunciation: "/ˈθæŋk juː/",
            example: "Thank you for your help.",
            examplePersian: "ممنون از کمکتان.",
            definition: "An expression of gratitude",
            collocation: "thank you very much, thank you so much",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "expressions"
        },
        {
            id: 4,
            english: "please",
            persian: "لطفاً",
            pronunciation: "/pliːz/",
            example: "Can I have a coffee, please?",
            examplePersian: "لطفاً یک قهوه می‌توانم داشته باشم؟",
            definition: "A polite word used when making a request",
            collocation: "please sit down, please wait, if you please",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "expressions"
        },
        {
            id: 5,
            english: "yes",
            persian: "بله",
            pronunciation: "/jes/",
            example: "Yes, I would like some water.",
            examplePersian: "بله، کمی آب می‌خواهم.",
            definition: "An affirmative response; opposite of no",
            collocation: "yes please, yes sir, yes indeed",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "basics"
        },
        {
            id: 6,
            english: "no",
            persian: "خیر",
            pronunciation: "/noʊ/",
            example: "No, thank you. I'm not hungry.",
            examplePersian: "نه ممنون، گرسنه نیستم.",
            definition: "A negative response; opposite of yes",
            collocation: "no problem, no thanks, no way",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "basics"
        },
        {
            id: 7,
            english: "I",
            persian: "من",
            pronunciation: "/aɪ/",
            example: "I am a student.",
            examplePersian: "من یک دانش‌آموز هستم.",
            definition: "First person singular pronoun",
            collocation: "I am, I have, I think",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 8,
            english: "you",
            persian: "تو / شما",
            pronunciation: "/juː/",
            example: "You are my friend.",
            examplePersian: "تو دوست من هستی.",
            definition: "Second person pronoun (singular or plural)",
            collocation: "you are, you have, you should",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 9,
            english: "he",
            persian: "او (مذکر)",
            pronunciation: "/hiː/",
            example: "He is a teacher.",
            examplePersian: "او یک معلم است.",
            definition: "Third person singular masculine pronoun",
            collocation: "he is, he has, he does",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 10,
            english: "she",
            persian: "او (مؤنث)",
            pronunciation: "/ʃiː/",
            example: "She is a doctor.",
            examplePersian: "او یک دکتر است.",
            definition: "Third person singular feminine pronoun",
            collocation: "she is, she has, she does",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 11,
            english: "it",
            persian: "آن",
            pronunciation: "/ɪt/",
            example: "It is a book.",
            examplePersian: "آن یک کتاب است.",
            definition: "Third person singular neuter pronoun",
            collocation: "it is, it has, it does",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 12,
            english: "we",
            persian: "ما",
            pronunciation: "/wiː/",
            example: "We are happy.",
            examplePersian: "ما خوشحال هستیم.",
            definition: "First person plural pronoun",
            collocation: "we are, we have, we do",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 13,
            english: "they",
            persian: "آنها",
            pronunciation: "/ðeɪ/",
            example: "They are students.",
            examplePersian: "آنها دانش‌آموز هستند.",
            definition: "Third person plural pronoun",
            collocation: "they are, they have, they do",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "pronouns"
        },
        {
            id: 14,
            english: "am",
            persian: "هستم",
            pronunciation: "/æm/",
            example: "I am learning English.",
            examplePersian: "من دارم انگلیسی یاد می‌گیرم.",
            definition: "First person singular present form of 'be'",
            collocation: "I am",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 15,
            english: "is",
            persian: "است",
            pronunciation: "/ɪz/",
            example: "He is at home.",
            examplePersian: "او در خانه است.",
            definition: "Third person singular present form of 'be'",
            collocation: "he is, she is, it is",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 16,
            english: "are",
            persian: "هستند",
            pronunciation: "/ɑːr/",
            example: "You are my friends.",
            examplePersian: "شما دوستان من هستید.",
            definition: "Present plural form of 'be'",
            collocation: "you are, we are, they are",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 17,
            english: "have",
            persian: "دارم / دارد / دارند",
            pronunciation: "/hæv/",
            example: "I have a book.",
            examplePersian: "من یک کتاب دارم.",
            definition: "To possess or own something",
            collocation: "have a car, have time, have fun",
            phrasalVerbs: [
                {
                    verb: "have on",
                    meaning: "پوشیدن (لباس)"
                },
                {
                    verb: "have off",
                    meaning: "مرخصی گرفتن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 18,
            english: "do",
            persian: "انجام دادن",
            pronunciation: "/duː/",
            example: "I do my homework every day.",
            examplePersian: "من هر روز تکالیفم را انجام می‌دهم.",
            definition: "To perform an action or activity",
            collocation: "do homework, do exercise, do well",
            phrasalVerbs: [
                {
                    verb: "do up",
                    meaning: "بستن (دکمه، زیپ)"
                },
                {
                    verb: "do without",
                    meaning: "بی‌نیاز بودن از"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 19,
            english: "go",
            persian: "رفتن",
            pronunciation: "/ɡoʊ/",
            example: "I go to school every morning.",
            examplePersian: "من هر صبح به مدرسه می‌روم.",
            definition: "To move from one place to another",
            collocation: "go home, go to work, go shopping",
            phrasalVerbs: [
                {
                    verb: "go on",
                    meaning: "ادامه دادن"
                },
                {
                    verb: "go out",
                    meaning: "بیرون رفتن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 20,
            english: "come",
            persian: "آمدن",
            pronunciation: "/kʌm/",
            example: "Come here, please.",
            examplePersian: "لطفاً به اینجا بیا.",
            definition: "To move toward the speaker",
            collocation: "come here, come back, come in",
            phrasalVerbs: [
                {
                    verb: "come back",
                    meaning: "برگشتن"
                },
                {
                    verb: "come in",
                    meaning: "وارد شدن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 21,
            english: "see",
            persian: "دیدن",
            pronunciation: "/siː/",
            example: "I see a bird in the sky.",
            examplePersian: "من یک پرنده در آسمان می‌بینم.",
            definition: "To perceive with the eyes",
            collocation: "see you, see a movie, see clearly",
            phrasalVerbs: [
                {
                    verb: "see off",
                    meaning: "بدرقه کردن"
                },
                {
                    verb: "see through",
                    meaning: "درک کردن (حقیقت)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 22,
            english: "want",
            persian: "خواستن",
            pronunciation: "/wɑːnt/",
            example: "I want to learn English.",
            examplePersian: "من می‌خواهم انگلیسی یاد بگیرم.",
            definition: "To desire or wish for something",
            collocation: "want to, want something, want help",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 23,
            english: "like",
            persian: "دوست داشتن",
            pronunciation: "/laɪk/",
            example: "I like apples.",
            examplePersian: "من سیب دوست دارم.",
            definition: "To find something pleasant or enjoyable",
            collocation: "like to, like very much, would like",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 24,
            english: "eat",
            persian: "خوردن",
            pronunciation: "/iːt/",
            example: "We eat dinner at 7 PM.",
            examplePersian: "ما شام را ساعت ۷ می‌خوریم.",
            definition: "To consume food",
            collocation: "eat food, eat breakfast, eat out",
            phrasalVerbs: [
                {
                    verb: "eat up",
                    meaning: "تمام کردن (غذا)"
                },
                {
                    verb: "eat out",
                    meaning: "بیرون غذا خوردن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 25,
            english: "drink",
            persian: "نوشیدن",
            pronunciation: "/drɪŋk/",
            example: "I drink water every day.",
            examplePersian: "من هر روز آب می‌نوشم.",
            definition: "To consume liquid",
            collocation: "drink water, drink tea, drink coffee",
            phrasalVerbs: [
                {
                    verb: "drink up",
                    meaning: "تمام نوشیدن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 26,
            english: "sleep",
            persian: "خوابیدن",
            pronunciation: "/sliːp/",
            example: "I sleep eight hours every night.",
            examplePersian: "من هر شب هشت ساعت می‌خوابم.",
            definition: "To rest in a state of natural unconsciousness",
            collocation: "sleep well, go to sleep, sleep tight",
            phrasalVerbs: [
                {
                    verb: "sleep in",
                    meaning: "دیر خوابیدن"
                },
                {
                    verb: "sleep over",
                    meaning: "شب ماندن (مهمان)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 27,
            english: "work",
            persian: "کار کردن",
            pronunciation: "/wɜːrk/",
            example: "My father works in an office.",
            examplePersian: "پدرم در یک اداره کار می‌کند.",
            definition: "To engage in physical or mental activity",
            collocation: "work hard, go to work, work together",
            phrasalVerbs: [
                {
                    verb: "work out",
                    meaning: "ورزش کردن"
                },
                {
                    verb: "work on",
                    meaning: "روی چیزی کار کردن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 28,
            english: "study",
            persian: "درس خواندن",
            pronunciation: "/ˈstʌdi/",
            example: "I study English every day.",
            examplePersian: "من هر روز انگلیسی مطالعه می‌کنم.",
            definition: "To devote time and attention to learning",
            collocation: "study hard, study English, study for exam",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 29,
            english: "read",
            persian: "خواندن",
            pronunciation: "/riːd/",
            example: "I read a book every week.",
            examplePersian: "من هر هفته یک کتاب می‌خوانم.",
            definition: "To look at and comprehend written words",
            collocation: "read a book, read newspaper, read aloud",
            phrasalVerbs: [
                {
                    verb: "read out",
                    meaning: "بلند خواندن"
                },
                {
                    verb: "read through",
                    meaning: "کامل خواندن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 30,
            english: "write",
            persian: "نوشتن",
            pronunciation: "/raɪt/",
            example: "Please write your name here.",
            examplePersian: "لطفاً اسم خود را اینجا بنویسید.",
            definition: "To mark letters, words, or symbols on a surface",
            collocation: "write a letter, write down, write carefully",
            phrasalVerbs: [
                {
                    verb: "write down",
                    meaning: "یادداشت کردن"
                },
                {
                    verb: "write up",
                    meaning: "نوشتن گزارش"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 31,
            english: "speak",
            persian: "صحبت کردن",
            pronunciation: "/spiːk/",
            example: "I speak English and Persian.",
            examplePersian: "من انگلیسی و فارسی صحبت می‌کنم.",
            definition: "To talk or utter words",
            collocation: "speak English, speak clearly, speak to someone",
            phrasalVerbs: [
                {
                    verb: "speak up",
                    meaning: "بلندتر صحبت کردن"
                },
                {
                    verb: "speak out",
                    meaning: "بی‌پرده سخن گفتن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 32,
            english: "listen",
            persian: "گوش دادن",
            pronunciation: "/ˈlɪsən/",
            example: "Listen to the teacher carefully.",
            examplePersian: "به معلم با دقت گوش بده.",
            definition: "To give attention with the ear",
            collocation: "listen to music, listen carefully, listen here",
            phrasalVerbs: [
                {
                    verb: "listen in",
                    meaning: "استراق سمع کردن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 33,
            english: "watch",
            persian: "تماشا کردن",
            pronunciation: "/wɑːtʃ/",
            example: "We watch TV every evening.",
            examplePersian: "ما هر شب تلویزیون تماشا می‌کنیم.",
            definition: "To look at or observe attentively",
            collocation: "watch TV, watch movie, watch carefully",
            phrasalVerbs: [
                {
                    verb: "watch out",
                    meaning: "مراقب بودن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 34,
            english: "play",
            persian: "بازی کردن",
            pronunciation: "/pleɪ/",
            example: "Children play in the park.",
            examplePersian: "کودکان در پارک بازی می‌کنند.",
            definition: "To engage in activity for enjoyment",
            collocation: "play games, play football, play with toys",
            phrasalVerbs: [
                {
                    verb: "play along",
                    meaning: "همراهی کردن"
                },
                {
                    verb: "play back",
                    meaning: "پخش کردن (ضبط شده)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 35,
            english: "run",
            persian: "دویدن",
            pronunciation: "/rʌn/",
            example: "I run every morning for exercise.",
            examplePersian: "من هر صبح برای ورزش می‌دوم.",
            definition: "To move at a speed faster than a walk",
            collocation: "run fast, run away, run quickly",
            phrasalVerbs: [
                {
                    verb: "run away",
                    meaning: "فرار کردن"
                },
                {
                    verb: "run into",
                    meaning: "برخورد کردن (با کسی)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 36,
            english: "walk",
            persian: "راه رفتن",
            pronunciation: "/wɔːk/",
            example: "I walk to school every day.",
            examplePersian: "من هر روز به مدرسه پیاده می‌روم.",
            definition: "To move at a regular pace by lifting and setting down each foot",
            collocation: "walk home, walk slowly, go for a walk",
            phrasalVerbs: [
                {
                    verb: "walk away",
                    meaning: "دور شدن"
                },
                {
                    verb: "walk out",
                    meaning: "ترک کردن (اعتراضی)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 37,
            english: "stand",
            persian: "ایستادن",
            pronunciation: "/stænd/",
            example: "Please stand up when the teacher comes.",
            examplePersian: "لطفاً وقتی معلم آمد بایستید.",
            definition: "To be in an upright position on the feet",
            collocation: "stand up, stand still, stand here",
            phrasalVerbs: [
                {
                    verb: "stand up",
                    meaning: "بلند شدن (از جای خود)"
                },
                {
                    verb: "stand by",
                    meaning: "آماده بودن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 38,
            english: "sit",
            persian: "نشستن",
            pronunciation: "/sɪt/",
            example: "Please sit down and wait.",
            examplePersian: "لطفاً بنشینید و منتظر بمانید.",
            definition: "To rest with the body supported by the buttocks",
            collocation: "sit down, sit here, sit quietly",
            phrasalVerbs: [
                {
                    verb: "sit down",
                    meaning: "نشستن"
                },
                {
                    verb: "sit up",
                    meaning: "صاف نشستن"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 39,
            english: "open",
            persian: "باز کردن",
            pronunciation: "/ˈoʊpən/",
            example: "Please open the door.",
            examplePersian: "لطفاً در را باز کن.",
            definition: "To move something so that it is no longer closed",
            collocation: "open the door, open a book, open your eyes",
            phrasalVerbs: [
                {
                    verb: "open up",
                    meaning: "باز کردن (در مورد احساسات)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 40,
            english: "close",
            persian: "بستن",
            pronunciation: "/kloʊz/",
            example: "Please close the window.",
            examplePersian: "لطفاً پنجره را ببند.",
            definition: "To move something so that it covers an opening",
            collocation: "close the door, close your eyes, close the book",
            phrasalVerbs: [
                {
                    verb: "close down",
                    meaning: "تعطیل کردن (کسب و کار)"
                }
            ],
            difficulty: "easy",
            category: "verbs"
        },
        {
            id: 41,
            english: "big",
            persian: "بزرگ",
            pronunciation: "/bɪɡ/",
            example: "We have a big house.",
            examplePersian: "ما یک خانه بزرگ داریم.",
            definition: "Of considerable size or extent",
            collocation: "big house, big problem, big smile",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 42,
            english: "small",
            persian: "کوچک",
            pronunciation: "/smɔːl/",
            example: "I have a small car.",
            examplePersian: "من یک ماشین کوچک داریم.",
            definition: "Of a size that is less than normal",
            collocation: "small room, small amount, small child",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 43,
            english: "good",
            persian: "خوب",
            pronunciation: "/ɡʊd/",
            example: "She is a good student.",
            examplePersian: "او یک دانش‌آموز خوب است.",
            definition: "Having positive qualities",
            collocation: "good idea, good job, good friend",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 44,
            english: "bad",
            persian: "بد",
            pronunciation: "/bæd/",
            example: "This is bad news.",
            examplePersian: "این خبر بدی است.",
            definition: "Of poor quality or low standard",
            collocation: "bad weather, bad day, bad habit",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 45,
            english: "happy",
            persian: "خوشحال",
            pronunciation: "/ˈhæpi/",
            example: "I am happy to see you.",
            examplePersian: "من خوشحالم که شما را می‌بینم.",
            definition: "Feeling or showing pleasure or contentment",
            collocation: "happy birthday, happy family, very happy",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 46,
            english: "sad",
            persian: "ناراحت",
            pronunciation: "/sæd/",
            example: "She was sad when her friend left.",
            examplePersian: "او وقتی دوستش رفت ناراحت شد.",
            definition: "Feeling or showing sorrow",
            collocation: "sad story, sad news, feel sad",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 47,
            english: "hot",
            persian: "داغ / گرم",
            pronunciation: "/hɑːt/",
            example: "The weather is hot today.",
            examplePersian: "امروز هوا گرم است.",
            definition: "Having a high temperature",
            collocation: "hot weather, hot water, hot food",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 48,
            english: "cold",
            persian: "سرد",
            pronunciation: "/koʊld/",
            example: "I like cold water.",
            examplePersian: "من آب سرد دوست دارم.",
            definition: "Of or at a low temperature",
            collocation: "cold weather, cold drink, cold hands",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 49,
            english: "new",
            persian: "جدید",
            pronunciation: "/nuː/",
            example: "I have a new phone.",
            examplePersian: "من یک تلفن جدید دارم.",
            definition: "Not existing before; made or introduced recently",
            collocation: "new car, new job, new year",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 50,
            english: "old",
            persian: "قدیمی",
            pronunciation: "/oʊld/",
            example: "This is an old book.",
            examplePersian: "این یک کتاب قدیمی است.",
            definition: "Having lived for a long time",
            collocation: "old man, old house, old friend",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "adjectives"
        },
        {
            id: 51,
            english: "day",
            persian: "روز",
            pronunciation: "/deɪ/",
            example: "I work every day.",
            examplePersian: "من هر روز کار می‌کنم.",
            definition: "A period of 24 hours",
            collocation: "every day, day and night, good day",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 52,
            english: "night",
            persian: "شب",
            pronunciation: "/naɪt/",
            example: "I sleep at night.",
            examplePersian: "من شب می‌خوابم.",
            definition: "The period of darkness between sunset and sunrise",
            collocation: "good night, night time, last night",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 53,
            english: "time",
            persian: "زمان",
            pronunciation: "/taɪm/",
            example: "What time is it?",
            examplePersian: "ساعت چند است؟",
            definition: "The measured or measurable period during which an action occurs",
            collocation: "what time, on time, long time",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 54,
            english: "year",
            persian: "سال",
            pronunciation: "/jɪr/",
            example: "I am 25 years old.",
            examplePersian: "من ۲۵ سال دارم.",
            definition: "A period of 365 days",
            collocation: "this year, next year, years old",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 55,
            english: "week",
            persian: "هفته",
            pronunciation: "/wiːk/",
            example: "I go shopping every week.",
            examplePersian: "من هر هفته خرید می‌روم.",
            definition: "A period of seven days",
            collocation: "every week, next week, last week",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 56,
            english: "month",
            persian: "ماه",
            pronunciation: "/mʌnθ/",
            example: "There are 12 months in a year.",
            examplePersian: "یک سال ۱۲ ماه دارد.",
            definition: "A period of about four weeks",
            collocation: "this month, next month, last month",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 57,
            english: "today",
            persian: "امروز",
            pronunciation: "/təˈdeɪ/",
            example: "Today is Monday.",
            examplePersian: "امروز دوشنبه است.",
            definition: "The present day",
            collocation: "today morning, today evening, today news",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 58,
            english: "tomorrow",
            persian: "فردا",
            pronunciation: "/təˈmɑːroʊ/",
            example: "I will see you tomorrow.",
            examplePersian: "فردا شما را می‌بینم.",
            definition: "The day after today",
            collocation: "tomorrow morning, tomorrow night, see you tomorrow",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 59,
            english: "yesterday",
            persian: "دیروز",
            pronunciation: "/ˈjestərdeɪ/",
            example: "I went to school yesterday.",
            examplePersian: "دیروز به مدرسه رفتم.",
            definition: "The day before today",
            collocation: "yesterday morning, yesterday evening, yesterday news",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 60,
            english: "now",
            persian: "الان",
            pronunciation: "/naʊ/",
            example: "I am busy now.",
            examplePersian: "من الان مشغول هستم.",
            definition: "At the present time",
            collocation: "right now, just now, from now on",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 61,
            english: "then",
            persian: "سپس",
            pronunciation: "/ðen/",
            example: "First study, then play.",
            examplePersian: "اول درس بخوان، سپس بازی کن.",
            definition: "At that time; next in order",
            collocation: "and then, back then, since then",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "time"
        },
        {
            id: 62,
            english: "here",
            persian: "اینجا",
            pronunciation: "/hɪr/",
            example: "Come here, please.",
            examplePersian: "لطفاً به اینجا بیا.",
            definition: "In or at this place",
            collocation: "here is, come here, over here",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "place"
        },
        {
            id: 63,
            english: "there",
            persian: "آنجا",
            pronunciation: "/ðer/",
            example: "My book is there.",
            examplePersian: "کتاب من آنجاست.",
            definition: "In or at that place",
            collocation: "over there, there is, go there",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "place"
        },
        {
            id: 64,
            english: "where",
            persian: "کجا",
            pronunciation: "/wer/",
            example: "Where is the school?",
            examplePersian: "مدرسه کجاست؟",
            definition: "In or to what place",
            collocation: "where are, where is, where do",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "place"
        },
        {
            id: 65,
            english: "house",
            persian: "خانه",
            pronunciation: "/haʊs/",
            example: "This is my house.",
            examplePersian: "این خانه من است.",
            definition: "A building for human habitation",
            collocation: "my house, big house, housework",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "home"
        },
        {
            id: 66,
            english: "home",
            persian: "منزل",
            pronunciation: "/hoʊm/",
            example: "I go home after school.",
            examplePersian: "من بعد از مدرسه به خانه می‌روم.",
            definition: "The place where one lives",
            collocation: "go home, at home, home work",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "home"
        },
        {
            id: 67,
            english: "school",
            persian: "مدرسه",
            pronunciation: "/skuːl/",
            example: "My children go to school.",
            examplePersian: "بچه‌های من به مدرسه می‌روند.",
            definition: "An institution for educating children",
            collocation: "go to school, school bus, school work",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "education"
        },
        {
            id: 68,
            english: "work",
            persian: "کار",
            pronunciation: "/wɜːrk/",
            example: "I go to work at 8 AM.",
            examplePersian: "من ساعت ۸ صبح به کار می‌روم.",
            definition: "Activity involving mental or physical effort",
            collocation: "go to work, at work, work hard",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "work"
        },
        {
            id: 69,
            english: "office",
            persian: "اداره",
            pronunciation: "/ˈɔːfɪs/",
            example: "My father works in an office.",
            examplePersian: "پدرم در یک اداره کار می‌کند.",
            definition: "A room, set of rooms, or building used for business",
            collocation: "in the office, office work, office hours",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "work"
        },
        {
            id: 70,
            english: "city",
            persian: "شهر",
            pronunciation: "/ˈsɪti/",
            example: "Tehran is a big city.",
            examplePersian: "تهران یک شهر بزرگ است.",
            definition: "A large town",
            collocation: "big city, city center, city life",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "place"
        },
        {
            id: 71,
            english: "country",
            persian: "کشور",
            pronunciation: "/ˈkʌntri/",
            example: "Iran is a beautiful country.",
            examplePersian: "ایران یک کشور زیبا است.",
            definition: "A nation with its own government",
            collocation: "my country, foreign country, country side",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "place"
        },
        {
            id: 72,
            english: "water",
            persian: "آب",
            pronunciation: "/ˈwɔːtər/",
            example: "I drink water every day.",
            examplePersian: "من هر روز آب می‌نوشم.",
            definition: "A clear liquid essential for life",
            collocation: "drink water, cold water, water bottle",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 73,
            english: "food",
            persian: "غذا",
            pronunciation: "/fuːd/",
            example: "I like Persian food.",
            examplePersian: "من غذاهای ایرانی دوست دارم.",
            definition: "Any nutritious substance that people eat",
            collocation: "good food, fast food, food and drink",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 74,
            english: "bread",
            persian: "نان",
            pronunciation: "/bred/",
            example: "We eat bread with every meal.",
            examplePersian: "ما با هر وعده غذا نان می‌خوریم.",
            definition: "Food made of flour, water, and yeast",
            collocation: "eat bread, bread and butter, slice of bread",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 75,
            english: "rice",
            persian: "برنج",
            pronunciation: "/raɪs/",
            example: "We have rice for lunch.",
            examplePersian: "ما برای ناهار برنج داریم.",
            definition: "Grains used as food",
            collocation: "cook rice, eat rice, rice and curry",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 76,
            english: "meat",
            persian: "گوشت",
            pronunciation: "/miːt/",
            example: "I don't eat meat.",
            examplePersian: "من گوشت نمی‌خورم.",
            definition: "Animal flesh used as food",
            collocation: "eat meat, meat and vegetables, cook meat",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 77,
            english: "fruit",
            persian: "میوه",
            pronunciation: "/fruːt/",
            example: "I eat fruit every day.",
            examplePersian: "من هر روز میوه می‌خورم.",
            definition: "Sweet product of a tree or plant",
            collocation: "eat fruit, fresh fruit, fruit juice",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 78,
            english: "vegetable",
            persian: "سبزیجات",
            pronunciation: "/ˈvedʒtəbl/",
            example: "We should eat vegetables daily.",
            examplePersian: "ما باید روزانه سبزیجات بخوریم.",
            definition: "A plant or part of a plant used as food",
            collocation: "eat vegetables, fresh vegetables, vegetable soup",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 79,
            english: "milk",
            persian: "شیر",
            pronunciation: "/mɪlk/",
            example: "Children should drink milk.",
            examplePersian: "کودکان باید شیر بنوشند.",
            definition: "White liquid produced by mammals",
            collocation: "drink milk, milk and honey, glass of milk",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 80,
            english: "tea",
            persian: "چای",
            pronunciation: "/tiː/",
            example: "We drink tea in the morning.",
            examplePersian: "ما صبح چای می‌نوشیم.",
            definition: "A hot drink made from dried leaves",
            collocation: "drink tea, cup of tea, tea time",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 81,
            english: "coffee",
            persian: "قهوه",
            pronunciation: "/ˈkɔːfi/",
            example: "I drink coffee every morning.",
            examplePersian: "من هر صبح قهوه می‌نوشم.",
            definition: "A hot drink made from roasted beans",
            collocation: "drink coffee, cup of coffee, coffee break",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 82,
            english: "sugar",
            persian: "شکر",
            pronunciation: "/ˈʃʊɡər/",
            example: "I don't take sugar in my tea.",
            examplePersian: "من در چایم شکر نمی‌ریزم.",
            definition: "Sweet crystalline substance",
            collocation: "add sugar, sugar free, sugar and spice",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 83,
            english: "salt",
            persian: "نمک",
            pronunciation: "/sɔːlt/",
            example: "Please pass the salt.",
            examplePersian: "لطفاً نمک را بدهید.",
            definition: "White crystalline substance used to flavor food",
            collocation: "add salt, salt and pepper, sea salt",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 84,
            english: "egg",
            persian: "تخم مرغ",
            pronunciation: "/eɡ/",
            example: "I eat two eggs for breakfast.",
            examplePersian: "من برای صبحانه دو تخم مرغ می‌خورم.",
            definition: "An oval object from which birds hatch",
            collocation: "boiled egg, fried egg, egg and bread",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 85,
            english: "breakfast",
            persian: "صبحانه",
            pronunciation: "/ˈbrekfəst/",
            example: "I have breakfast at 7 AM.",
            examplePersian: "من ساعت ۷ صبح صبحانه می‌خورم.",
            definition: "The first meal of the day",
            collocation: "have breakfast, breakfast time, breakfast table",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 86,
            english: "lunch",
            persian: "ناهار",
            pronunciation: "/lʌntʃ/",
            example: "We eat lunch at 1 PM.",
            examplePersian: "ما ساعت ۱ ظهر ناهار می‌خوریم.",
            definition: "A meal eaten in the middle of the day",
            collocation: "have lunch, lunch time, lunch break",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 87,
            english: "dinner",
            persian: "شام",
            pronunciation: "/ˈdɪnər/",
            example: "The family eats dinner together.",
            examplePersian: "خانواده با هم شام می‌خورند.",
            definition: "The main meal of the day",
            collocation: "have dinner, dinner time, dinner table",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "food"
        },
        {
            id: 88,
            english: "family",
            persian: "خانواده",
            pronunciation: "/ˈfæməli/",
            example: "I love my family.",
            examplePersian: "من خانواده‌ام را دوست دارم.",
            definition: "A group of related people",
            collocation: "my family, family members, family dinner",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 89,
            english: "father",
            persian: "پدر",
            pronunciation: "/ˈfɑːðər/",
            example: "My father is a teacher.",
            examplePersian: "پدرم یک معلم است.",
            definition: "A male parent",
            collocation: "my father, father and son, father's day",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 90,
            english: "mother",
            persian: "مادر",
            pronunciation: "/ˈmʌðər/",
            example: "My mother cooks very well.",
            examplePersian: "مادرم خیلی خوب آشپزی می‌کند.",
            definition: "A female parent",
            collocation: "my mother, mother and daughter, mother's day",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 91,
            english: "brother",
            persian: "برادر",
            pronunciation: "/ˈbrʌðər/",
            example: "I have one brother.",
            examplePersian: "من یک برادر دارم.",
            definition: "A male sibling",
            collocation: "my brother, big brother, brother and sister",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 92,
            english: "sister",
            persian: "خواهر",
            pronunciation: "/ˈsɪstər/",
            example: "My sister is a student.",
            examplePersian: "خواهرم یک دانش‌آموز است.",
            definition: "A female sibling",
            collocation: "my sister, little sister, sister and brother",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 93,
            english: "son",
            persian: "پسر",
            pronunciation: "/sʌn/",
            example: "They have a son and a daughter.",
            examplePersian: "آنها یک پسر و یک دختر دارند.",
            definition: "A male child",
            collocation: "my son, son and father, only son",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 94,
            english: "daughter",
            persian: "دختر",
            pronunciation: "/ˈdɔːtər/",
            example: "Their daughter is very smart.",
            examplePersian: "دخترشان خیلی باهوش است.",
            definition: "A female child",
            collocation: "my daughter, daughter and mother, only daughter",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 95,
            english: "friend",
            persian: "دوست",
            pronunciation: "/frend/",
            example: "He is my best friend.",
            examplePersian: "او بهترین دوست من است.",
            definition: "A person whom one knows and likes",
            collocation: "good friend, best friend, friend and family",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 96,
            english: "teacher",
            persian: "معلم",
            pronunciation: "/ˈtiːtʃər/",
            example: "Our English teacher is very kind.",
            examplePersian: "معلم انگلیسی ما خیلی مهربان است.",
            definition: "A person who teaches",
            collocation: "English teacher, school teacher, teacher and student",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 97,
            english: "student",
            persian: "دانش‌آموز / دانشجو",
            pronunciation: "/ˈstuːdnt/",
            example: "I am a university student.",
            examplePersian: "من یک دانشجوی دانشگاه هستم.",
            definition: "A person who is studying",
            collocation: "good student, university student, student life",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 98,
            english: "doctor",
            persian: "دکتر",
            pronunciation: "/ˈdɑːktər/",
            example: "You should see a doctor.",
            examplePersian: "باید دکتر ببینی.",
            definition: "A qualified medical practitioner",
            collocation: "see a doctor, family doctor, doctor's appointment",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 99,
            english: "man",
            persian: "مرد",
            pronunciation: "/mæn/",
            example: "That man is my uncle.",
            examplePersian: "آن مرد عموی من است.",
            definition: "An adult human male",
            collocation: "old man, young man, man and woman",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        },
        {
            id: 100,
            english: "woman",
            persian: "زن",
            pronunciation: "/ˈwʊmən/",
            example: "She is a strong woman.",
            examplePersian: "او یک زن قوی است.",
            definition: "An adult human female",
            collocation: "young woman, old woman, woman and child",
            phrasalVerbs: [],
            difficulty: "easy",
            category: "people"
        }
        // 100 لغت دیگر نیز به همین شکل ادامه دارد...
    ]
};

// اکسپورت دیتابیس لغات A1
if (typeof module !== 'undefined' && module.exports) {
    module.exports = A1Words;
} else {
    window.A1Words = A1Words;
                      }
