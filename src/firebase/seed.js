import { getFirestoreDb } from './config';

const INITIAL_PRODUCTS = [
  {
    name_en: "Royal Lapis Lazuli Copper Cuff",
    name_ar: "سوار النحاس واللاجورد الملكي",
    price: 1950,
    category_en: "Handmade Copper",
    category_ar: "النحاس الهاند ميد",
    subcategory_en: "Bracelets",
    subcategory_ar: "أساور",
    collection_en: "El Kawthar",
    collection_ar: "الكوثر",
    stone_en: "Lapis Lazuli",
    stone_ar: "لازورد",
    material_en: "Pure Hand-hammered Copper",
    material_ar: "نحاس نقي مطروق يدوياً",
    description_en: "A majestic piece of deep royal blue Lapis Lazuli, flecked with golden pyrite, set in a sturdy, organic hand-hammered pure copper cuff. Handcrafted by heritage artisans in Cairo, this piece combines the grounding energy of copper with the spiritual clarity of celestial lapis.",
    description_ar: "قطعة مهيبة من حجر اللازورد الطبيعي بلونه الأزرق الملكي العميق الممزوج بالبيريت الذهبي، مثبتة على سوار صلب من النحاس النقي المطروق يدوياً بشكل عضوي. صُنعت يدوياً على يد حرفيين متوارثين في القاهرة، وتجمع بين طاقة النحاس وحكمة اللازورد الروحية.",
    details_en: [
      "Material: 100% Pure Egyptian Copper",
      "Stone: Raw organic Lapis Lazuli gemstone",
      "Width: Adjustable open-back design",
      "Features natural oxidation character over time"
    ],
    details_ar: [
      "المواد: نحاس مصري نقي 100%",
      "الأحجار: حجر لازورد طبيعي خام",
      "المقاس: تصميم مفتوح قابل للتعديل ليناسب الجميع",
      "يتميز بأكسدة طبيعية تعزز طابعه الأثري بمرور الوقت"
    ],
    stock: 2, // Low stock to trigger badge!
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Turquoise Halo Copper Ring",
    name_ar: "خاتم هالة الفيروز النحاسي",
    price: 1350,
    category_en: "Precious Stones",
    category_ar: "الأحجار الكريمة الهاند ميد",
    subcategory_en: "Rings",
    subcategory_ar: "خواتم",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Turquoise",
    stone_ar: "فيروز",
    material_en: "Copper & 18k Gold Plating",
    material_ar: "نحاس مطلي بذهب عيار 18",
    description_en: "A beautiful hand-polished natural turquoise stone sits center-stage, wrapped in an intricate halo of textured copper beadwork. The warm gold-plated finish adds an elegant luxury shine to this vintage-inspired treasure.",
    description_ar: "حجر فيروز طبيعي مصقول بعناية يتوسط الخاتم، محاط بهالة معقدة من حبيبات النحاس المزخرفة. يضفي الطلاء الذهبي الدافئ عيار 18 بريقاً فاخراً وأنيقاً على هذه القطعة المستوحاة من الطراز العتيق والأثري.",
    details_en: [
      "Material: 18k Gold Plated Brass, Copper Base",
      "Stone: Oval natural Persian Turquoise",
      "Tarnish-resistant clear nano-coating",
      "Available sizes: 6, 7, 8"
    ],
    details_ar: [
      "المواد: نحاس مطلي بذهب عيار 18، قاعدة نحاسية",
      "الأحجار: حجر فيروز فارسي طبيعي بيضاوي",
      "مقاوم للبهتان بفضل طلاء النانو الشفاف",
      "المقاسات المتاحة: 6، 7، 8"
    ],
    stock: 8,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Copper Calligraphy Love Pin",
    name_ar: "دبوس الحب النحاسي بالخط العربي",
    price: 950,
    category_en: "Handmade Copper",
    category_ar: "النحاس الهاند ميد",
    subcategory_en: "Pins",
    subcategory_ar: "دبابيس بروش",
    collection_en: "Calligraphy",
    collection_ar: "الخط العربي",
    stone_en: "None",
    stone_ar: "لا يوجد حجر",
    material_en: "Pure Solid Copper",
    material_ar: "نحاس صلب نقي",
    description_en: "An elegant, editorial accent piece. Features the classic Arabic word 'Hob' (Love) sculpted in timeless golden copper calligraphy. Designed to be pinned onto blazers, linen scarves, or winter coats.",
    description_ar: "دبوس برّاق يمثل لمسة كلاسيكية إضافية بالغة الأناقة. يجسد كلمة 'حب' بالخط العربي الأنيق بشكل نحاسي دافئ، صُمم خصيصاً ليُزيّن السترات، الأوشحة الكتانية، أو المعاطف الشتوية الفخمة.",
    details_en: [
      "Material: 100% Pure Solid Copper",
      "Dimensions: 3.5 cm x 2.5 cm",
      "Features high-security double-lock backing pin",
      "Polished to a warm, antique copper luster"
    ],
    details_ar: [
      "المواد: نحاس صلب نقي 100%",
      "الأبعاد: 3.5 سم × 2.5 سم",
      "يتميز بدبوس تثبيت خلفي بنظام قفل مزدوج الأمان",
      "مصقول بلمعة نحاسية دافئة عتيقة"
    ],
    stock: 15,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Royal Amethyst Copper Necklace",
    name_ar: "قلادة الأميثيست والنحاس الملكية",
    price: 2200,
    category_en: "Precious Stones",
    category_ar: "الأحجار الكريمة الهاند ميد",
    subcategory_en: "Necklaces",
    subcategory_ar: "قلادات",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Amethyst",
    stone_ar: "أميثيست",
    material_en: "Copper & Amethyst",
    material_ar: "نحاس وأميثيست طبيعي",
    description_en: "Crowned with a large, raw-cut deep purple Amethyst stone. The setting features hand-hammered organic copper sheets forming a beautiful crown-like basket. Suspended from an elegant, adjustable copper chain.",
    description_ar: "تتوج هذه القلادة بحجر أميثيست طبيعي كبير بلون بنفسجي عميق ومقطع بشكل خام. تتميز القاعدة برقائق من النحاس العضوي المطروق باليد لتشكل سلة تحاكي التاج الفخم، تتدلى من سلسلة نحاسية أنيقة قابلة للتعديل.",
    details_en: [
      "Material: 100% Pure Copper setting and chain",
      "Stone: Raw purple Amethyst crystal",
      "Chain Length: 50 cm (adjustable)",
      "Promotes mental peace and spiritual balance"
    ],
    details_ar: [
      "المواد: قاعدة وسلسلة من النحاس النقي 100%",
      "الأحجار: بلورة أميثيست بنفسجية طبيعية خام",
      "طول السلسلة: 50 سم (قابل للتعديل)",
      "يعزز السلام الداخلي والتوازن الروحي الكامل"
    ],
    stock: 1, // Low stock!
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Beige Agate Copper Drop Earrings",
    name_ar: "أقراط تتدلى بالعقيق والنحاس",
    price: 1650,
    category_en: "Precious Stones",
    category_ar: "الأحجار الكريمة الهاند ميد",
    subcategory_en: "Earrings",
    subcategory_ar: "أقراط",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Beige Agate",
    stone_ar: "عقيق بيج",
    material_en: "Copper & 18k Gold Plating",
    material_ar: "نحاس مطلي بذهب عيار 18",
    description_en: "Soft neutral tones meet textured copper sheet artistry. Featuring hand-faceted beige agate beads suspended from delicate gold-plated copper discs, providing an heirloom accessory to elevate any occasion.",
    description_ar: "ألوان ترابية دافئة تلتقي مع فن تشكيل رقائق النحاس. تتميز الأقراط بحبات عقيق بيج طبيعي مصقولة تتدلى من أقراص نحاسية مذهبة، لتكون قطعة أثرية تضفي لمسة ساحرة على إطلالتك.",
    details_en: [
      "Material: Gold-Plated Copper, 925 Sterling Silver posts",
      "Stone: Natural hand-faceted Beige Agate beads",
      "Drop Length: 4.8 cm",
      "Extremely light on the ears for daily luxury wear"
    ],
    details_ar: [
      "المواد: نحاس مطلي بالذهب، خطافات من الفضة الإسترلينية 925",
      "الأحجار: خرز عقيق بيج طبيعي مصقول يدوياً",
      "طول القرط: 4.8 سم",
      "خفيف الوزن للغاية لراحة تامة طوال اليوم"
    ],
    stock: 6,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Earthy Malachite Copper Cuff",
    name_ar: "سوار المالاشيت والنحاس المطروق",
    price: 1850,
    category_en: "Handmade Copper",
    category_ar: "النحاس الهاند ميد",
    subcategory_en: "Bracelets",
    subcategory_ar: "أساور",
    collection_en: "El Eila",
    collection_ar: "العائلة",
    stone_en: "Malachite",
    stone_ar: "مالاشيت",
    material_en: "Pure Egyptian Copper",
    material_ar: "نحاس مصري نقي",
    description_en: "An artistic fusion of pure, oxidized Egyptian copper and polished green Malachite gemstone. Known for its gorgeous banded green lines, this Malachite cuff symbolizes transformation and positive energy.",
    description_ar: "دمج فني بين النحاس المصري النقي المؤكسد وحجر المالاشيت الأخضر المصقول. يشتهر المالاشيت بخطوطه الخضراء الجذابة المتعرجة، ويرمز السوار إلى التجدد والتحول الإيجابي للطاقة.",
    details_en: [
      "Material: 100% Pure Egyptian Copper",
      "Stone: Genuine green Malachite cabochon",
      "Width: 2 cm thick statement cuff",
      "Fully adjustable flexible frame"
    ],
    details_ar: [
      "المواد: نحاس مصري نقي 100%",
      "الأحجار: حجر مالاشيت أخضر طبيعي فاخر",
      "العرض: سوار عريض يبلغ 2 سم لإطلالة لافتة",
      "إطار مرن بالكامل وقابل للتعديل ليناسب معصمك"
    ],
    stock: 4,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Lazuli Empress Jewelry Gift Box",
    name_ar: "صندوق الإمبراطورة لاجولي الفاخر",
    price: 3800,
    category_en: "Gift Boxes & Bundles",
    category_ar: "الهدايا والبوكسات",
    subcategory_en: "Gift Sets",
    subcategory_ar: "علب هدايا",
    collection_en: "Oumy",
    collection_ar: "أمي",
    stone_en: "Multi-Stone",
    stone_ar: "متعدد الأحجار",
    material_en: "Velvet Box, Gold plated Copper",
    material_ar: "علبة قطيفة، نحاس مطلي بالذهب",
    description_en: "The ultimate royal curation. Features the Royal Lapis Lazuli Copper Cuff and the Turquoise Halo Copper Ring, nested inside an emerald green luxury velvet box lined with soft silk. Comes with a calligraphy greeting card.",
    description_ar: "مجموعة ملكية متكاملة لتقديم أرقى الهدايا. تحتوي على سوار النحاس واللاجورد مع خاتم هالة الفيروز، موضوعة داخل صندوق هدايا فاخر من القطيفة الخضراء الزمردية المبطنة بالحرير. تأتي مع كارت إهداء مكتوب بالخط العربي.",
    details_en: [
      "Includes 1x Lapis Lazuli Cuff, 1x Turquoise Ring",
      "Packaging: Emerald green custom velvet box",
      "Includes a complimentary handwritten calligraphy card",
      "Save 15% compared to purchasing individually"
    ],
    details_ar: [
      "يحتوي على: سوار اللازورد النحاسي + خاتم هالة الفيروز النحاسي",
      "التعبئة والتغليف: صندوق قطيفة أخضر زمردي مصنوع خصيصاً",
      "يتضمن كارت إهداء مجاني مكتوب بخط يد خبير الخط العربي",
      "وفر 15% مقارنة بشراء كل قطعة على حدة"
    ],
    stock: 5,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Heritage Copper & Pearl Bundle",
    name_ar: "مجموعة التراث النحاسي واللؤلؤ",
    price: 3400,
    category_en: "Gift Boxes & Bundles",
    category_ar: "الهدايا والبوكسات",
    subcategory_en: "Bundles",
    subcategory_ar: "مجموعات هدايا",
    collection_en: "Calligraphy",
    collection_ar: "الخط العربي",
    stone_en: "Freshwater Pearl",
    stone_ar: "لؤلؤ المياه العذبة",
    material_en: "Copper & Natural Pearl",
    material_ar: "نحاس ولؤلؤ طبيعي",
    description_en: "An elegant, bespoke jewelry bundle combining raw organic copper calligraphy pendants with glowing freshwater pearls. Nestled inside a luxury wooden keepsake box, this bundle celebrates standard Egyptian art and craft.",
    description_ar: "مجموعة مجوهرات فاخرة تجمع بين دلايات النحاس والخط العربي ولآلئ المياه العذبة المتألقة. موضوعة داخل صندوق خشبي أنيق محفور باليد، تحتفي هذه المجموعة بالفن والصياغة المصرية العريقة.",
    details_en: [
      "Includes 1x Copper Calligraphy Necklace, 1x Pearl Drop Earrings",
      "Packaging: Hand-carved wooden keepsake box",
      "Perfect premium gift for anniversaries or Mother's Day",
      "Comes with certificate of authenticity for the stones"
    ],
    details_ar: [
      "يحتوي على: قلادة النحاس والخط العربي + أقراط لؤلؤ المياه العذبة",
      "التعبئة والتغليف: صندوق خشبي محفور يدوياً لحفظ التذكارات",
      "هدية مثالية وفخمة للمناسبات الخاصة وعيد الأم",
      "تأتي مع شهادة ضمان معتمدة للأحجار الكريمة ولؤلؤ المياه العذبة"
    ],
    stock: 3,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
  }
];

export const seedDatabase = async () => {
  try {
    const db = getFirestoreDb();
    const result = await db.getProducts();
    
    // Check if the mock list is empty or if we want to overwrite to ensure new category taxonomy
    const shouldSeed = result.empty || result.docs.length === 0 || 
                       !result.docs.some(doc => doc.data().category_en === "Handmade Copper");

    if (shouldSeed) {
      console.log("🌱 Database is empty or lacks the new copper category. Seeding premium LAZULI catalog...");
      
      // If we are in mock mode, reset the entire local list to guarantee the new catalog is active
      if (localStorage.getItem('mock_products')) {
        localStorage.setItem('mock_products', JSON.stringify([]));
      }

      for (const prod of INITIAL_PRODUCTS) {
        const completeProduct = {
          ...prod,
          name: prod.name_en,
          category: prod.category_en,
          collection: prod.collection_en,
          stone: prod.stone_en,
          description: prod.description_en,
          details: prod.details_en
        };
        await db.addProduct(completeProduct);
      }
      console.log("✅ Successfully seeded 8 luxury copper & precious stone items under the new taxonomy!");
    } else {
      console.log("💎 Products matching the new categories already exist. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Seeding database failed:", error);
  }
};
