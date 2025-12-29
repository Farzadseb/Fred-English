// words.js - لغات انگلیسی سطح A1 با تعریف

const words = [
  { english: 'be', persian: 'بودن', level: 'A1', definition: 'وجود داشتن، بودن' },
  { english: 'am', persian: 'هستم', level: 'A1', definition: 'صورت اول شخص مفرد از فعل be' },
  { english: 'is', persian: 'هست', level: 'A1', definition: 'صورت سوم شخص مفرد از فعل be' },
  { english: 'are', persian: 'هستید / هستند', level: 'A1', definition: 'صورت جمع از فعل be' },
  { english: 'have', persian: 'داشتن', level: 'A1', definition: 'مالک چیزی بودن' },
  { english: 'has', persian: 'دارد', level: 'A1', definition: 'صورت سوم شخص مفرد از have' },
  { english: 'do', persian: 'انجام دادن', level: 'A1', definition: 'کاری را انجام دادن' },
  { english: 'does', persian: 'انجام می‌دهد', level: 'A1', definition: 'صورت سوم شخص مفرد از do' },
  { english: 'work', persian: 'کار کردن', level: 'A1', definition: 'اشتغال داشتن، شاغل بودن' },
  { english: 'go', persian: 'رفتن', level: 'A1', definition: 'حرکت کردن به سمت جایی' },
  
  { english: 'come', persian: 'آمدن', level: 'A1', definition: 'حرکت کردن به سمت اینجا' },
  { english: 'get', persian: 'گرفتن / شدن', level: 'A1', definition: 'به دست آوردن یا تبدیل شدن' },
  { english: 'make', persian: 'ساختن', level: 'A1', definition: 'چیزی را تولید کردن' },
  { english: 'use', persian: 'استفاده کردن', level: 'A1', definition: 'به کار بردن چیزی' },
  { english: 'need', persian: 'نیاز داشتن', level: 'A1', definition: 'احتیاج به چیزی داشتن' },
  { english: 'want', persian: 'خواستن', level: 'A1', definition: 'تمایل به داشتن چیزی' },
  { english: 'like', persian: 'دوست داشتن', level: 'A1', definition: 'علاقه به چیزی داشتن' },
  { english: 'love', persian: 'دوست داشتن', level: 'A1', definition: 'عشق ورزیدن، علاقه شدید' },
  { english: 'help', persian: 'کمک کردن', level: 'A1', definition: 'کمک رساندن به کسی' },
  { english: 'try', persian: 'تلاش کردن', level: 'A1', definition: 'سعی و کوشش کردن' },
  
  { english: 'start', persian: 'شروع کردن', level: 'A1', definition: 'آغاز کردن کاری' },
  { english: 'stop', persian: 'متوقف کردن', level: 'A1', definition: 'پایان دادن، توقف کردن' },
  { english: 'say', persian: 'گفتن', level: 'A1', definition: 'اظهار کردن، بیان کردن' },
  { english: 'tell', persian: 'گفتن (به کسی)', level: 'A1', definition: 'به کسی اطلاع دادن' },
  { english: 'ask', persian: 'پرسیدن', level: 'A1', definition: 'سؤال کردن' },
  { english: 'answer', persian: 'جواب دادن', level: 'A1', definition: 'پاسخ دادن به سؤال' },
  { english: 'talk', persian: 'صحبت کردن', level: 'A1', definition: 'با کسی گفتگو کردن' },
  { english: 'speak', persian: 'صحبت کردن', level: 'A1', definition: 'صحبت کردن به زبانی' },
  { english: 'see', persian: 'دیدن', level: 'A1', definition: 'با چشم مشاهده کردن' },
  { english: 'look', persian: 'نگاه کردن', level: 'A1', definition: 'با دقت نگاه کردن' },
  
  { english: 'hear', persian: 'شنیدن', level: 'A1', definition: 'با گوش شنیدن' },
  { english: 'listen', persian: 'گوش دادن', level: 'A1', definition: 'با دقت گوش کردن' },
  { english: 'feel', persian: 'احساس داشتن', level: 'A1', definition: 'حسی را تجربه کردن' },
  { english: 'think', persian: 'فکر کردن', level: 'A1', definition: 'در ذهن پردازش کردن' },
  { english: 'know', persian: 'دانستن', level: 'A1', definition: 'آگاهی داشتن از چیزی' },
  { english: 'live', persian: 'زندگی کردن', level: 'A1', definition: 'در جایی سکونت داشتن' },
  { english: 'stay', persian: 'ماندن', level: 'A1', definition: 'در جایی باقی ماندن' },
  { english: 'leave', persian: 'ترک کردن', level: 'A1', definition: 'جایی را ترک کردن' },
  { english: 'move', persian: 'حرکت کردن', level: 'A1', definition: 'جا به جا شدن' },
  { english: 'happen', persian: 'اتفاق افتادن', level: 'A1', definition: 'رخ دادن، پیش آمدن' },
  
  { english: 'people', persian: 'مردم', level: 'A1', definition: 'اشخاص به صورت جمع' },
  { english: 'person', persian: 'شخص', level: 'A1', definition: 'انسان به صورت مفرد' },
  { english: 'man', persian: 'مرد', level: 'A1', definition: 'شخص مرد' },
  { english: 'woman', persian: 'زن', level: 'A1', definition: 'شخص زن' },
  { english: 'friend', persian: 'دوست', level: 'A1', definition: 'رفیق، همدم' },
  { english: 'family', persian: 'خانواده', level: 'A1', definition: 'اعضای یک خانه' },
  { english: 'job', persian: 'شغل', level: 'A1', definition: 'حرفه، کار' },
  { english: 'work', persian: 'کار', level: 'A1', definition: 'فعالیت کاری' },
  { english: 'money', persian: 'پول', level: 'A1', definition: 'واسطه مبادله کالا' },
  { english: 'time', persian: 'زمان', level: 'A1', definition: 'بُعد چهارم، ساعت' },
  
  { english: 'day', persian: 'روز', level: 'A1', definition: '۲۴ ساعت، روزانه' },
  { english: 'week', persian: 'هفته', level: 'A1', definition: 'هفت روز' },
  { english: 'year', persian: 'سال', level: 'A1', definition: 'دوازده ماه' },
  { english: 'today', persian: 'امروز', level: 'A1', definition: 'روز جاری' },
  { english: 'tomorrow', persian: 'فردا', level: 'A1', definition: 'روز بعد' },
  { english: 'yesterday', persian: 'دیروز', level: 'A1', definition: 'روز قبل' },
  { english: 'now', persian: 'الان', level: 'A1', definition: 'در این لحظه' },
  { english: 'later', persian: 'بعداً', level: 'A1', definition: 'در زمان دیگر' },
  { english: 'early', persian: 'زود', level: 'A1', definition: 'قبل از وقت معین' },
  { english: 'late', persian: 'دیر', level: 'A1', definition: 'بعد از وقت معین' },
  
  { english: 'here', persian: 'اینجا', level: 'A1', definition: 'در این مکان' },
  { english: 'there', persian: 'آنجا', level: 'A1', definition: 'در آن مکان' },
  { english: 'home', persian: 'خانه', level: 'A1', definition: 'محل سکونت' },
  { english: 'place', persian: 'مکان', level: 'A1', definition: 'موقعیت، جا' },
  { english: 'city', persian: 'شهر', level: 'A1', definition: 'شهر بزرگ' },
  { english: 'country', persian: 'کشور', level: 'A1', definition: 'ملت، سرزمین' },
  { english: 'school', persian: 'مدرسه', level: 'A1', definition: 'محل تحصیل' },
  { english: 'office', persian: 'اداره', level: 'A1', definition: 'محل کار' },
  { english: 'shop', persian: 'مغازه', level: 'A1', definition: 'محل خرید' },
  { english: 'street', persian: 'خیابان', level: 'A1', definition: 'راه عبور وسایل نقلیه' },
  
  { english: 'good', persian: 'خوب', level: 'A1', definition: 'با کیفیت، مناسب' },
  { english: 'bad', persian: 'بد', level: 'A1', definition: 'بی کیفیت، نامناسب' },
  { english: 'easy', persian: 'آسان', level: 'A1', definition: 'ساده، بدون مشکل' },
  { english: 'hard', persian: 'سخت', level: 'A1', definition: 'دشوار، مشکل' },
  { english: 'big', persian: 'بزرگ', level: 'A1', definition: 'حجیم، بزرگ' },
  { english: 'small', persian: 'کوچک', level: 'A1', definition: 'ریز، کوچک' },
  { english: 'new', persian: 'جدید', level: 'A1', definition: 'تازه، نو' },
  { english: 'old', persian: 'قدیمی', level: 'A1', definition: 'کهنه، قدیمی' },
  { english: 'same', persian: 'یکسان', level: 'A1', definition: 'مشابه، مانند هم' },
  { english: 'different', persian: 'متفاوت', level: 'A1', definition: 'متفاوت، غیرمشابه' },
  
  { english: 'busy', persian: 'مشغول', level: 'A1', definition: 'درگیر کار، سرگرم' },
  { english: 'free', persian: 'آزاد', level: 'A1', definition: 'آزاد، بدون کار' },
  { english: 'tired', persian: 'خسته', level: 'A1', definition: 'بی رمق، خسته' },
  { english: 'happy', persian: 'خوشحال', level: 'A1', definition: 'شاد، مسرور' },
  { english: 'sad', persian: 'ناراحت', level: 'A1', definition: 'غمگین، ناراحت' },
  { english: 'right', persian: 'درست', level: 'A1', definition: 'صحیح، درست' },
  { english: 'wrong', persian: 'غلط', level: 'A1', definition: 'نادرست، اشتباه' },
  { english: 'important', persian: 'مهم', level: 'A1', definition: 'با اهمیت، حیاتی' },
  { english: 'possible', persian: 'ممکن', level: 'A1', definition: 'عملی، شدنی' },
  { english: 'ready', persian: 'آماده', level: 'A1', definition: 'آماده، حاضر' },
  
  { english: 'and', persian: 'و', level: 'A1', definition: 'حرف ربط جمع' },
  { english: 'but', persian: 'اما', level: 'A1', definition: 'حرف ربط تقابل' },
  { english: 'because', persian: 'چون', level: 'A1', definition: 'حرف ربط علت' },
  { english: 'so', persian: 'پس', level: 'A1', definition: 'حرف ربط نتیجه' },
  { english: 'if', persian: 'اگر', level: 'A1', definition: 'حرف شرط' },
  { english: 'when', persian: 'وقتی که', level: 'A1', definition: 'حرف ربط زمان' },
  { english: 'before', persian: 'قبل از', level: 'A1', definition: 'پیش از زمانی' },
  { english: 'after', persian: 'بعد از', level: 'A1', definition: 'پس از زمانی' },
  { english: 'about', persian: 'درباره', level: 'A1', definition: 'در مورد، پیرامون' },
  { english: 'with', persian: 'با', level: 'A1', definition: 'همراه با' },
  
  { english: 'without', persian: 'بدون', level: 'A1', definition: 'فاقد، بی' },
  { english: 'for', persian: 'برای', level: 'A1', definition: 'به خاطر، به منظور' },
  { english: 'from', persian: 'از', level: 'A1', definition: 'از مکانی یا زمانی' },
  { english: 'to', persian: 'به', level: 'A1', definition: 'به سمت، به منظور' },
  { english: 'in', persian: 'در', level: 'A1', definition: 'درون، داخل' },
  { english: 'on', persian: 'روی', level: 'A1', definition: 'بر روی سطحی' },
  { english: 'at', persian: 'در', level: 'A1', definition: 'در نقطه‌ای خاص' },
  { english: 'of', persian: 'ِ', level: 'A1', definition: 'حرف اضافه مالکیت' },
  { english: 'this', persian: 'این', level: 'A1', definition: 'اشاره به نزدیک' },
  { english: 'that', persian: 'آن', level: 'A1', definition: 'اشاره به دور' },
  
  { english: 'these', persian: 'این‌ها', level: 'A1', definition: 'جمع this' },
  { english: 'those', persian: 'آن‌ها', level: 'A1', definition: 'جمع that' },
  { english: 'something', persian: 'چیزی', level: 'A1', definition: 'یک چیز نامشخص' },
  { english: 'someone', persian: 'کسی', level: 'A1', definition: 'یک شخص نامشخص' },
  { english: 'nothing', persian: 'هیچ‌چیز', level: 'A1', definition: 'هیچ چیزی' },
  { english: 'everything', persian: 'همه‌چیز', level: 'A1', definition: 'تمام چیزها' },
  { english: 'one', persian: 'یک', level: 'A1', definition: 'عدد ۱' },
  { english: 'two', persian: 'دو', level: 'A1', definition: 'عدد ۲' },
  { english: 'many', persian: 'زیاد', level: 'A1', definition: 'تعداد زیاد' },
  { english: 'few', persian: 'کم', level: 'A1', definition: 'تعداد کم' },
  
  { english: 'a lot', persian: 'خیلی', level: 'A1', definition: 'به مقدار زیاد' },
  { english: 'more', persian: 'بیشتر', level: 'A1', definition: 'مقدار اضافه' },
  { english: 'less', persian: 'کمتر', level: 'A1', definition: 'مقدار کمتر' },
  { english: 'all', persian: 'همه', level: 'A1', definition: 'تمام، همگی' },
  { english: 'some', persian: 'بعضی', level: 'A1', definition: 'تعدادی، برخی' },
  { english: 'any', persian: 'هیچ / هر', level: 'A1', definition: 'هر، هیچ' },
  { english: 'other', persian: 'دیگر', level: 'A1', definition: 'غیر از این' },
  { english: 'another', persian: 'یکی دیگر', level: 'A1', definition: 'یک عدد دیگر' },
  { english: 'kind', persian: 'نوع', level: 'A1', definition: 'مدل، گونه' },
  { english: 'morning', persian: 'صبح', level: 'A1', definition: 'ساعت اولیه روز' },
  
  { english: 'afternoon', persian: 'بعدازظهر', level: 'A1', definition: 'ساعت میانی روز' },
  { english: 'evening', persian: 'عصر', level: 'A1', definition: 'ساعت پایانی روز' },
  { english: 'night', persian: 'شب', level: 'A1', definition: 'ساعت تاریکی' },
  { english: 'again', persian: 'دوباره', level: 'A1', definition: 'یک بار دیگر' },
  { english: 'always', persian: 'همیشه', level: 'A1', definition: 'در تمام زمان‌ها' },
  { english: 'usually', persian: 'معمولاً', level: 'A1', definition: 'در بیشتر موارد' },
  { english: 'sometimes', persian: 'گاهی', level: 'A1', definition: 'در بعضی مواقع' },
  { english: 'often', persian: 'اغلب', level: 'A1', definition: 'بارها، مکرر' },
  { english: 'never', persian: 'هرگز', level: 'A1', definition: 'در هیچ زمانی' },
  { english: 'fast', persian: 'سریع', level: 'A1', definition: 'با سرعت بالا' },
  
  { english: 'slow', persian: 'آهسته', level: 'A1', definition: 'با سرعت کم' },
  { english: 'very', persian: 'خیلی', level: 'A1', definition: 'به میزان زیاد' },
  { english: 'really', persian: 'واقعاً', level: 'A1', definition: 'در واقعیت، حقیقتاً' },
  { english: 'just', persian: 'فقط', level: 'A1', definition: 'تنها، فقط' },
  { english: 'also', persian: 'همچنین', level: 'A1', definition: 'نیز، همچنین' },
  { english: 'maybe', persian: 'شاید', level: 'A1', definition: 'احتمالاً، شاید' },
  { english: 'sure', persian: 'مطمئن', level: 'A1', definition: 'قطعاً، مطمئن' },
  { english: 'yes', persian: 'بله', level: 'A1', definition: 'تأیید، موافقت' },
  { english: 'no', persian: 'نه', level: 'A1', definition: 'رد، مخالفت' },
  { english: 'okay', persian: 'باشه', level: 'A1', definition: 'قبول، موافقت' },
  
  { english: 'please', persian: 'لطفاً', level: 'A1', definition: 'خواهش، درخواست مؤدبانه' },
  { english: 'thanks', persian: 'ممنون', level: 'A1', definition: 'تشکر، سپاس' },
  { english: 'sorry', persian: 'ببخشید', level: 'A1', definition: 'عذرخواهی، پوزش' },
  { english: 'hello', persian: 'سلام', level: 'A1', definition: 'درود، احوالپرسی' },
  { english: 'hi', persian: 'سلام', level: 'A1', definition: 'سلام غیررسمی' },
  { english: 'bye', persian: 'خداحافظ', level: 'A1', definition: 'خداحافظی' },
  { english: 'welcome', persian: 'خوش آمدید', level: 'A1', definition: 'خوشامدگویی' },
  { english: 'question', persian: 'سؤال', level: 'A1', definition: 'پرسش، استفهام' },
  { english: 'problem', persian: 'مشکل', level: 'A1', definition: 'مسئله، دشواری' },
  { english: 'reason', persian: 'دلیل', level: 'A1', definition: 'علت، سبب' },
  
  { english: 'idea', persian: 'ایده', level: 'A1', definition: 'فکر، نظر' },
  { english: 'thing', persian: 'چیز', level: 'A1', definition: 'شیء، مورد' },
  { english: 'way', persian: 'راه', level: 'A1', definition: 'مسیر، روش' },
  { english: 'part', persian: 'بخش', level: 'A1', definition: 'قطعه، قسمت' },
  { english: 'life', persian: 'زندگی', level: 'A1', definition: 'حیات، زیست' },
  { english: 'world', persian: 'دنیا', level: 'A1', definition: 'جهان، عالم' },
  { english: 'workday', persian: 'روز کاری', level: 'A1', definition: 'روز کار و فعالیت' },
  { english: 'weekend', persian: 'آخر هفته', level: 'A1', definition: 'روزهای استراحت' },
  { english: 'break', persian: 'استراحت', level: 'A1', definition: 'وقفه، تنفس' },
  { english: 'rest', persian: 'استراحت', level: 'A1', definition: 'آرامش، استراحت' },
  
  { english: 'plan', persian: 'برنامه', level: 'A1', definition: 'برنامه‌ریزی، نقشه' },
  { english: 'change', persian: 'تغییر', level: 'A1', definition: 'تغییر دادن، تبدیل' },
  { english: 'result', persian: 'نتیجه', level: 'A1', definition: 'حاصل، پیامد' },
  { english: 'example', persian: 'مثال', level: 'A1', definition: 'نمونه، مصداق' },
  { english: 'point', persian: 'نکته', level: 'A1', definition: 'نقطه، موضوع' },
  { english: 'level', persian: 'سطح', level: 'A1', definition: 'درجه، مرحله' },
  { english: 'begin', persian: 'شروع کردن', level: 'A1', definition: 'آغاز کردن' },
  { english: 'finish', persian: 'تمام کردن', level: 'A1', definition: 'پایان دادن' },
  { english: 'wait', persian: 'صبر کردن', level: 'A1', definition: 'انتظار کشیدن' },
  { english: 'meet', persian: 'ملاقات کردن', level: 'A1', definition: 'دیدار کردن' },
  
  { english: 'call', persian: 'تماس گرفتن', level: 'A1', definition: 'صدا زدن، تلفن کردن' },
  { english: 'open', persian: 'باز کردن', level: 'A1', definition: 'گشودن، باز کردن' },
  { english: 'close', persian: 'بستن', level: 'A1', definition: 'بسته کردن، پایان دادن' },
  { english: 'buy', persian: 'خریدن', level: 'A1', definition: 'خریداری کردن' },
  { english: 'pay', persian: 'پرداخت کردن', level: 'A1', definition: 'پول دادن' },
  { english: 'bring', persian: 'آوردن', level: 'A1', definition: 'آوردن چیزی' },
  { english: 'take', persian: 'برداشتن', level: 'A1', definition: 'گرفتن، بردن' },
  { english: 'find', persian: 'پیدا کردن', level: 'A1', definition: 'یافتن، کشف کردن' },
  { english: 'keep', persian: 'نگه داشتن', level: 'A1', definition: 'حفظ کردن، نگهداری' },
  { english: 'give', persian: 'دادن', level: 'A1', definition: 'اعطا کردن، دادن' },
  
  { english: 'receive', persian: 'دریافت کردن', level: 'A1', definition: 'گرفتن، دریافت کردن' },
  { english: 'learn', persian: 'یاد گرفتن', level: 'A1', definition: 'آموختن، فراگیری' },
  { english: 'teach', persian: 'درس دادن', level: 'A1', definition: 'آموزش دادن' },
  { english: 'practice', persian: 'تمرین کردن', level: 'A1', definition: 'تمرین، تکرار' },
  { english: 'understand', persian: 'فهمیدن', level: 'A1', definition: 'درک کردن، فهمیدن' },
  { english: 'remember', persian: 'به خاطر سپردن', level: 'A1', definition: 'یادآوری، حفظ کردن' }
];

// توابع کمکی
const wordUtils = {
  // جستجوی لغت بر اساس انگلیسی
  findByEnglish: function(word) {
    return words.find(item => item.english.toLowerCase() === word.toLowerCase());
  },
  
  // جستجوی لغت بر اساس فارسی
  findByPersian: function(word) {
    return words.find(item => item.persian.includes(word));
  },
  
  // جستجوی لغت بر اساس تعریف
  findByDefinition: function(keyword) {
    return words.filter(item => item.definition.includes(keyword));
  },
  
  // دریافت همه لغات
  getAll: function() {
    return words;
  },
  
  // دریافت تعداد لغات
  getCount: function() {
    return words.length;
  },
  
  // دریافت لغت تصادفی
  getRandom: function(count = 1) {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return count === 1 ? shuffled[0] : shuffled.slice(0, count);
  }
};

// Export برای Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    words,
    wordUtils
  };
}

// Export برای مرورگر
if (typeof window !== 'undefined') {
  window.EnglishWords = {
    words,
    wordUtils
  };
  }
