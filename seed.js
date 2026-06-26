/**
 * Seed Script — 50 Grocery Products (4 categories)
 * Run: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// ─── Product Model (inline to avoid import issues) ────────────────────────────
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number },
  categogy: { type: String },   // keeping the original typo from your schema
  unit: { type: String },
  image: { type: String },
  isActive: { type: Boolean },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// ─── Upload Dir ───────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// ─── Helper: Download image ───────────────────────────────────────────────────
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(dest)) return resolve(`/uploads/${filename}`);

    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    protocol.get(url, (response) => {
      // follow redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(`/uploads/${filename}`);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// ─── Product Data (50 products, 4 categories) ────────────────────────────────
// Using Unsplash Source for real grocery images (free, no key needed)
const products = [
  // ── VEGETABLES (13) ─────────────────────────────────────────────────────
  { name: "Tomato", desc: "Fresh red tomatoes, rich in lycopene and vitamin C. Perfect for salads and cooking.", price: 30, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1546470427-227c353c4503?w=400&q=80", file: "tomato.jpg" },
  { name: "Potato", desc: "Versatile farm-fresh potatoes. Great for curries, fries, and soups.", price: 25, categogy: "vegetables", unit: "1kg", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80", file: "potato.jpg" },
  { name: "Onion", desc: "Pungent and flavourful onions. A staple in every Indian kitchen.", price: 35, categogy: "vegetables", unit: "1kg", img: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&q=80", file: "onion.jpg" },
  { name: "Carrot", desc: "Crunchy orange carrots packed with beta-carotene. Great raw or cooked.", price: 40, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80", file: "carrot.jpg" },
  { name: "Spinach", desc: "Tender green spinach leaves loaded with iron and vitamins.", price: 20, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80", file: "spinach.jpg" },
  { name: "Cauliflower", desc: "Fresh white cauliflower, perfect for curries and stir-fries.", price: 45, categogy: "vegetables", unit: "1kg", img: "https://images.unsplash.com/photo-1568584711271-6bf9b3bafb20?w=400&q=80", file: "cauliflower.jpg" },
  { name: "Broccoli", desc: "Nutrient-dense broccoli florets. Excellent steamed, stir-fried or in pasta.", price: 60, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80", file: "broccoli.jpg" },
  { name: "Capsicum", desc: "Bright and crunchy capsicum available in red, yellow, and green.", price: 55, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80", file: "capsicum.jpg" },
  { name: "Peas", desc: "Fresh green peas, sweet and tender. Great for pulao and curries.", price: 50, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80", file: "peas.jpg" },
  { name: "Cucumber", desc: "Cool and refreshing cucumbers, hydrating and low in calories.", price: 20, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1568584711075-a2a65cf0dc81?w=400&q=80", file: "cucumber.jpg" },
  { name: "Bitter Gourd", desc: "Fresh bitter gourd (karela) known for its health benefits. Great for diabetics.", price: 35, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80", file: "bittergourd.jpg" },
  { name: "Eggplant", desc: "Glossy purple eggplant (brinjal). A versatile vegetable for Indian curries.", price: 30, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&q=80", file: "eggplant.jpg" },
  { name: "Garlic", desc: "Fresh garlic pods, aromatic and flavour-packed. Essential in every kitchen.", price: 60, categogy: "vegetables", unit: "500gm", img: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&q=80", file: "garlic.jpg" },

  // ── FRUITS (13) ──────────────────────────────────────────────────────────
  { name: "Apple", desc: "Crisp and sweet apples imported from Himachal Pradesh. A healthy daily snack.", price: 120, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80", file: "apple.jpg" },
  { name: "Banana", desc: "Ripe and energy-packed bananas. A perfect pre-workout snack.", price: 40, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80", file: "banana.jpg" },
  { name: "Mango", desc: "Luscious Alphonso mangoes, the king of fruits. Sweet and juicy.", price: 200, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80", file: "mango.jpg" },
  { name: "Grapes", desc: "Seedless green grapes, sweet and refreshing. Rich in antioxidants.", price: 80, categogy: "fruits", unit: "500gm", img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80", file: "grapes.jpg" },
  { name: "Orange", desc: "Juicy Nagpur oranges loaded with vitamin C. Perfect for juicing.", price: 60, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80", file: "orange.jpg" },
  { name: "Watermelon", desc: "Giant red watermelon, 92% water. The ultimate summer refresher.", price: 30, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80", file: "watermelon.jpg" },
  { name: "Papaya", desc: "Ripe papaya rich in papain enzyme. Aids digestion and boosts immunity.", price: 45, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1519164026113-5f55d8addf13?w=400&q=80", file: "papaya.jpg" },
  { name: "Pineapple", desc: "Tropical pineapple with a sweet-tart flavour. Great for juices and desserts.", price: 70, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80", file: "pineapple.jpg" },
  { name: "Pomegranate", desc: "Ruby-red pomegranate seeds packed with antioxidants and iron.", price: 150, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80", file: "pomegranate.jpg" },
  { name: "Strawberry", desc: "Fresh red strawberries, sweet with a hint of tartness. Rich in vitamin C.", price: 120, categogy: "fruits", unit: "500gm", img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80", file: "strawberry.jpg" },
  { name: "Guava", desc: "Crunchy green guavas with pink flesh. High in dietary fibre and vitamin C.", price: 50, categogy: "fruits", unit: "1kg", img: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80", file: "guava.jpg" },
  { name: "Kiwi", desc: "Tangy green kiwi with a bright flavour. Excellent source of vitamin K.", price: 180, categogy: "fruits", unit: "500gm", img: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&q=80", file: "kiwi.jpg" },
  { name: "Lemon", desc: "Sour yellow lemons, perfect for drinks, marinades, and dressings.", price: 30, categogy: "fruits", unit: "500gm", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80", file: "lemon.jpg" },

  // ── FOOD GRAINS (12) ─────────────────────────────────────────────────────
  { name: "Basmati Rice", desc: "Premium long-grain basmati rice with aromatic fragrance. Perfect for biryani.", price: 120, categogy: "food-grains", unit: "2kgs", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", file: "basmatirice.jpg" },
  { name: "Wheat Flour (Atta)", desc: "Whole wheat atta for soft rotis and parathas. Stone-ground for nutrition.", price: 60, categogy: "food-grains", unit: "2kgs", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80", file: "atta.jpg" },
  { name: "Toor Dal", desc: "Yellow split toor dal, the heart of Indian dal tadka. High in protein.", price: 90, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80", file: "toordal.jpg" },
  { name: "Moong Dal", desc: "Split yellow moong dal, light and easy to digest. Great for khichdi.", price: 85, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1645289813523-3ee52ab02ffe?w=400&q=80", file: "moongdal.jpg" },
  { name: "Chana Dal", desc: "Split Bengal gram (chana dal) with a nutty flavour. Rich in protein and fibre.", price: 80, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1599909631495-9d8a6f4e93b2?w=400&q=80", file: "chanadal.jpg" },
  { name: "Chickpeas (Kabuli Chana)", desc: "Whole white chickpeas, perfect for chole and hummus. Protein powerhouse.", price: 100, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80", file: "chickpeas.jpg" },
  { name: "Red Lentils (Masoor Dal)", desc: "Quick-cooking red lentils with a mild earthy flavour. Great for soups.", price: 75, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1632519540499-e9c5a0e9ff85?w=400&q=80", file: "masoor.jpg" },
  { name: "Oats", desc: "Rolled oats for a healthy breakfast. High in fibre and heart-healthy beta-glucan.", price: 110, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1504708003479-83dc75e3a2ca?w=400&q=80", file: "oats.jpg" },
  { name: "Sooji (Semolina)", desc: "Fine semolina (rava) for upma, halwa, and idli batter.", price: 40, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1581288761733-dd37c2b78547?w=400&q=80", file: "sooji.jpg" },
  { name: "Poha (Flattened Rice)", desc: "Light flattened rice, perfect for quick poha breakfast and chivda snacks.", price: 45, categogy: "food-grains", unit: "500gm", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80", file: "poha.jpg" },
  { name: "Rajma (Kidney Beans)", desc: "Dark red kidney beans for the classic Punjabi rajma curry. Rich in iron.", price: 95, categogy: "food-grains", unit: "1kg", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", file: "rajma.jpg" },
  { name: "Quinoa", desc: "Protein-rich superfood quinoa, gluten-free and complete amino acid profile.", price: 250, categogy: "food-grains", unit: "500gm", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80", file: "quinoa.jpg" },

  // ── DAIRY (12) ───────────────────────────────────────────────────────────
  { name: "Full Cream Milk", desc: "Fresh full-cream cow milk, pasteurised and homogenised. Rich and creamy.", price: 28, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80", file: "milk.jpg" },
  { name: "Paneer", desc: "Soft fresh paneer made from full-fat milk. Perfect for curries and snacks.", price: 80, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&q=80", file: "paneer.jpg" },
  { name: "Curd (Dahi)", desc: "Thick and creamy homestyle curd. Probiotic-rich for good gut health.", price: 40, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80", file: "curd.jpg" },
  { name: "Butter", desc: "Churned white butter (makhan) with a rich milky flavour. Unsalted.", price: 55, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80", file: "butter.jpg" },
  { name: "Ghee", desc: "Pure cow ghee clarified slowly for a rich nutty aroma. A kitchen essential.", price: 250, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1631563657282-75b3e72c31d1?w=400&q=80", file: "ghee.jpg" },
  { name: "Cheese Slices", desc: "Processed cheese slices, perfect for sandwiches and burgers.", price: 120, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80", file: "cheese.jpg" },
  { name: "Buttermilk (Chaas)", desc: "Chilled spiced buttermilk, light and refreshing. Best summer drink.", price: 20, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80", file: "buttermilk.jpg" },
  { name: "Cream", desc: "Rich whipping cream with 35% fat content. Perfect for desserts and coffee.", price: 90, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1612202375773-5d60e7e9b9c3?w=400&q=80", file: "cream.jpg" },
  { name: "Condensed Milk", desc: "Sweet condensed milk, ideal for Indian sweets and desserts like kheer.", price: 60, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1546804059-9c9f14e31b54?w=400&q=80", file: "condensedmilk.jpg" },
  { name: "Skimmed Milk Powder", desc: "Low-fat skimmed milk powder, high in protein. Great for baking and shakes.", price: 150, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80", file: "milkpowder.jpg" },
  { name: "Mozzarella Cheese", desc: "Stretchy and mild mozzarella cheese, the soul of every good pizza.", price: 200, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80", file: "mozzarella.jpg" },
  { name: "Flavoured Yogurt", desc: "Thick Greek-style strawberry yogurt, creamy and naturally sweetened.", price: 70, categogy: "dairy", unit: "500gm", img: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&q=80", file: "yogurt.jpg" },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!\n");

    // Optional: clear existing products
    // await Product.deleteMany({});
    // console.log("🗑  Cleared existing products");

    console.log("📦 Downloading images & inserting products...\n");

    for (const p of products) {
      try {
        // 1. Download image
        process.stdout.write(`  ⬇  ${p.file.padEnd(25)}`);
        const imagePath = await downloadImage(p.img, p.file);

        // 2. Insert into DB (skip if name already exists)
        const exists = await Product.findOne({ name: p.name });
        if (exists) {
          console.log(`⚠  Already exists — skipped`);
          continue;
        }

        await Product.create({
          name: p.name,
          desc: p.desc,
          price: p.price,
          categogy: p.categogy,
          unit: p.unit,
          image: imagePath,
          isActive: true,
        });
        console.log(`✅ Inserted`);
      } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
      }
    }

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
