// English-Persian Vocabulary Database v1.0
// Format: English — Persian — Definition — Example

const rawWords = `apple — سیب — A round fruit — I eat an apple every day.
ball — توپ — A round object for playing — Children play with a ball.
cat — گربه — A small furry animal — The cat is sleeping.
dog — سگ — A common pet animal — The dog is barking.
egg — تخم مرغ — From chickens — I eat eggs for breakfast.
fish — ماهی — Lives in water — The fish is swimming.
girl — دختر — A female child — The girl is reading.
hat — کلاه — For head — He wears a hat.
ice — یخ — Frozen water — The ice is cold.
juice — آب میوه — From fruits — I drink orange juice.
key — کلید — For locking — This is my house key.
lion — شیر — A big cat — The lion is strong.
moon — ماه — In the sky — The moon is beautiful.
nose — بینی — On face — I smell with my nose.
orange — پرتقال — A citrus fruit — Orange juice is tasty.
pen — خودکار — For writing — I write with a pen.
queen — ملکه — Female ruler — The queen is kind.
rain — باران — From sky — The rain is falling.
sun — خورشید — In the sky — The sun is hot.
table — میز — Furniture — The book is on the table.
umbrella — چتر — For rain — I use an umbrella.
vegetable — سبزیجات — For eating — Carrots are vegetables.
water — آب — For drinking — I drink water.
window — پنجره — In a wall — I look out the window.
x-ray — اشعه ایکس — For seeing inside — The doctor uses x-ray.
yellow — زرد — A color — The sun is yellow.
zoo — باغ وحش — For animals — We go to the zoo.
book — کتاب — A set of pages — I read a book.
chair — صندلی — For sitting — Sit on the chair.
door — در — For entering — Open the door.
family — خانواده — Parents and children — I love my family.
garden — باغ — With plants — We have a garden.
house — خانه — A building to live in — This is my house.
juice — آب میوه — Liquid from fruits — Apple juice is sweet.
kitchen — آشپزخانه — For cooking — Mom is in the kitchen.
light — نور — Makes things visible — Turn on the light.
money — پول — For buying things — I need money.
name — اسم — What you are called — My name is Ali.
office — دفتر — For work — Dad goes to the office.
paper — کاغذ — For writing — Write on paper.
question — سوال — What you ask — I have a question.
river — رودخانه — Flowing water — The river is long.
school — مدرسه — For learning — I go to school.
teacher — معلم — Teaches students — The teacher is kind.
umbrella — چتر — For rain — It's raining, use an umbrella.
voice — صدا — What you hear — I hear your voice.
water — آب — For drinking — Drink water every day.
year — سال — 12 months — Happy new year!
zero — صفر — The number 0 — One minus one is zero.
ant — مورچه — A small insect — The ant is working.
bird — پرنده — Has feathers — The bird is flying.
car — ماشین — A vehicle — Dad drives a car.
doctor — دکتر — Helps sick people — See a doctor.
elephant — فیل — A big animal — The elephant has a trunk.
flower — گل — A plant — This flower is beautiful.
grape — انگور — A fruit — Grapes are sweet.
horse — اسب — An animal — The horse runs fast.
insect — حشره — A small animal — An insect has six legs.
jump — پریدن — To go up — The rabbit can jump.
kangaroo — کانگورو — An Australian animal — The kangaroo hops.
lemon — لیمو — A sour fruit — Lemon juice is sour.
monkey — میمون — An animal — The monkey climbs trees.
nest — لانه — For birds — Birds live in a nest.
owl — جغد — A night bird — The owl sees at night.
penguin — پنگوئن — A bird — Penguins live in cold places.
rabbit — خرگوش — A small animal — The rabbit hops.
snake — مار — A long animal — The snake is dangerous.
tiger — ببر — A big cat — The tiger has stripes.
uniform — یونیفرم — Special clothes — Students wear uniform.
volcano — آتشفشان — A mountain — The volcano is erupting.
whale — نهنگ — A big sea animal — The whale is huge.
xylophone — زیلوفون — A musical instrument — Play the xylophone.
yacht — قایق تفریحی — A boat — The yacht is on the sea.
zebra — گورخر — An animal — The zebra has stripes.
airplane — هواپیما — Flies in sky — The airplane is flying.
basket — سبد — For carrying things — Put fruits in the basket.
camera — دوربین — Takes photos — I have a camera.
diamond — الماس — A precious stone — The diamond is shiny.
engine — موتور — Makes things move — The car has an engine.
finger — انگشت — On hand — I have ten fingers.
glove — دستکش — For hand — Wear gloves in winter.
helmet — کلاه ایمنی — For head — Riders wear helmet.
island — جزیره — Land in water — We visit an island.
jacket — ژاکت — For body — Wear a jacket.
kite — بادبادک — Flies in sky — Fly a kite.
ladder — نردبان — For climbing — Use a ladder.
magnet — آهنربا — Attracts metal — The magnet is strong.
notebook — دفترچه — For writing — Write in notebook.
ocean — اقیانوس — Big sea — Ships sail on ocean.
pencil — مداد — For writing — Write with pencil.
quilt — لحاف — For bed — The quilt is warm.
robot — ربات — A machine — The robot works.
stamp — تمبر — For letters — Put a stamp on letter.
telescope — تلسکوپ — For seeing far — Look through telescope.
violin — ویولن — A musical instrument — Play the violin.
wheel — چرخ — Round part — The car has four wheels.
xylophone — زیلوفون — Musical instrument — The xylophone makes music.
yogurt — ماست — A food — Eat yogurt.
zipper — زیپ — For clothes — Close the zipper.
`;

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rawWords };
}
