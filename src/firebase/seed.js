import { getFirestoreDb } from './config';

const INITIAL_PRODUCTS = [
  {
    name_en: "Beige Agate Golden Earrings",
    name_ar: "قرط العقيق البيج المذهب",
    price: 1650,
    category_en: "Earrings",
    category_ar: "أقراط",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Beige Agate",
    stone_ar: "عقيق بيج",
    description_en: "Soft neutral tones meet warm golden textures in the Beige Agate Golden Earrings. Designed with faceted beige agate stones and textured gold-plated details, these earrings bring together natural elegance and modern statement design. The smooth, earthy tones of the agate contrast beautifully with warm golden finishes, handcrafted in Cairo.",
    description_ar: "درجات الألوان الطبيعية الهادئة تلتقي مع الزخارف الذهبية الدافئة في قرط العقيق البيج المذهب. تم تصميم هذه الأقراط من أحجار العقيق الطبيعية المصقولة والتفاصيل المطلية بالذهب عيار 18، لتجمع بين الأناقة الطبيعية وروح العصر الحديث. يتناقض لون العقيق الترابي الناعم بشكل رائع مع البريق الذهبي الدافئ، صُنع يدوياً في القاهرة.",
    details_en: [
      "Material: 18k Gold Plated Brass, 925 Sterling Silver Posts",
      "Stones: Hand-faceted Natural Beige Agate",
      "Drop Length: 4.5 cm",
      "Handcrafted in Cairo, Egypt"
    ],
    details_ar: [
      "المواد: نحاس مطلي بذهب عيار 18، خطافات من الفضة الإسترلينية 925",
      "الأحجار: حجر عقيق بيج طبيعي مصقول يدوياً",
      "طول القرط: 4.5 سم",
      "صُنع يدوياً بالكامل في ورش القاهرة، مصر"
    ],
    stock: 8,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Turquoise Calligraphy Necklace",
    name_ar: "قلادة الخط العربي والفيروز",
    price: 2400,
    category_en: "Necklaces",
    category_ar: "قلادات",
    collection_en: "Calligraphy",
    collection_ar: "الخط العربي",
    stone_en: "Turquoise",
    stone_ar: "فيروز",
    description_en: "An absolute masterpiece celebrating Arabic heritage. Features classical script lettering in fluid gold-plated silver, interlaced with natural turquoise beads that embody protection and tranquility. Every letter is hand-sculpted in Cairo.",
    description_ar: "تحفة فنية تحتفي بالتراث والخط العربي الأصيل. تتميز القلادة بحروف عربية انسيابية مطلية بالذهب على فضة إسترلينية، متداخلة مع خرز الفيروز الطبيعي الفريد الذي يرمز للحماية والسلام الروحي. كل حرف صُمم ونُحت باليد في استوديو القاهرة الخاص بنا.",
    details_en: [
      "Material: 18k Gold Plated 925 Sterling Silver",
      "Stones: Natural Persian Turquoise beads",
      "Chain Length: 45 cm (adjustable)",
      "Features handwritten signature calligraphy stamp"
    ],
    details_ar: [
      "المواد: فضة إسترلينية 925 مطلية بذهب عيار 18",
      "الأحجار: خرز فيروز طبيعي عالي الجودة",
      "طول السلسلة: 45 سم (قابل للتعديل)",
      "تتميز بختم الماركة الحصري للخطوط اليدوية"
    ],
    stock: 5,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "El Kawthar Lapis Cuff",
    name_ar: "سوار الكوثر باللاجورد الفاخر",
    price: 1950,
    category_en: "Bracelets",
    category_ar: "أساور",
    collection_en: "El Kawthar",
    collection_ar: "الكوثر",
    stone_en: "Lapis Lazuli",
    stone_ar: "لازورد",
    description_en: "A bold statement cuff that encapsulates raw strength and celestial beauty. Hand-hammered golden brass patterns encase a majestic piece of deep royal blue Lapis Lazuli, flecked with golden pyrite like stars in the night sky.",
    description_ar: "سوار صلب عريض يجسد القوة الخام والجمال الفلكي الأخاذ. نقوش ذهبية مطروقة يدوياً تحيط بقطعة مهيبة من حجر اللازورد الطبيعي بلونه الأزرق الملكي العميق الممزوج بخطوط البيريت الذهبية اللامعة كالنجوم في السماء.",
    details_en: [
      "Material: Heavily Gold-Plated Artisan Brass",
      "Stones: Raw, organic Lapis Lazuli chunk",
      "Diameter: Flexible open-back fit (resizable)",
      "Tarnish-resistant clear protective coating"
    ],
    details_ar: [
      "المواد: نحاس صائغين مطروق ومطلي بالذهب الثقيل",
      "الأحجار: حجر لازورد طبيعي بتفاصيل ذهبية خام",
      "القطر: مرن ومفتوح من الخلف ليناسب جميع المقاسات",
      "مطلي بطبقة حماية شفافة ومقاومة للبهتان"
    ],
    stock: 4,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Oumy Amethyst Ring",
    name_ar: "خاتم أمي بالأميثيست البنفسجي",
    price: 1350,
    category_en: "Rings",
    category_ar: "خواتم",
    collection_en: "Oumy",
    collection_ar: "أمي",
    stone_en: "Amethyst",
    stone_ar: "أميثيست",
    description_en: "Crowned with an organic, raw-cut faceted Amethyst stone, this ring symbolizes spiritual wisdom and clarity. The thick band is crafted with an antique hammered finish, creating a beautifully raw, organic aesthetic.",
    description_ar: "متوج بحجر الأميثيست (الجمشت) البنفسجي الطبيعي المصقول بشكل عضوي، يرمز هذا الخاتم للحكمة والنقاء الروحي. تم تشكيل حلقة الخاتم السميكة بلمسة مطرقة أثرية مذهبة، مما يخلق لمسة كلاسيكية خام بالغة الفخامة.",
    details_en: [
      "Material: 18k Gold Plated Sterling Silver",
      "Stones: Raw natural purple Amethyst",
      "Ring Size: Available in sizes 6, 7, 8",
      "Symbolizes protection and mental clarity"
    ],
    details_ar: [
      "المواد: فضة إسترلينية 925 مطلية بذهب عيار 18",
      "الأحجار: حجر أميثيست بنفسجي طبيعي مصقول",
      "المقاسات: متاح في مقاسات 6، 7، 8",
      "يرمز إلى الحماية الروحية والصفاء الذهني الكامل"
    ],
    stock: 12,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Earthy Onyx Drop Earrings",
    name_ar: "أقراط أونيكس الترابية المستديرة",
    price: 1750,
    category_en: "Earrings",
    category_ar: "أقراط",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Black Onyx",
    stone_ar: "أونيكس أسود",
    description_en: "Sophisticated contrast defines the Earthy Onyx Drops. Smooth, glistening black onyx beads dangle gracefully beneath hand-textured gold-plated bronze sheets, providing a versatile statement accessory suitable for day or night.",
    description_ar: "تباين فني يحدد روعة أقراط الأونيكس الترابية. حبات الأونيكس الأسود اللامعة تتدلى بجاذبية تحت رقائق مذهبة مطروقة باليد من البرونز الفاخر، لتمنحك قطعة مميزة ومتعددة الاستخدامات تناسب إطلالتك النهارية والمسائية.",
    details_en: [
      "Material: 18k Gold Plated Bronze",
      "Stones: Genuine smooth Black Onyx cabochons",
      "Length: 5.2 cm",
      "Extremely lightweight for all-day comfort"
    ],
    details_ar: [
      "المواد: برونز صائغين مطلي بذهب عيار 18",
      "الأحجار: أحجار أونيكس أسود طبيعية دائرية ناعمة",
      "الطول: 5.2 سم",
      "خفيف الوزن للغاية لراحة تامة طوال اليوم"
    ],
    stock: 9,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Lapis Lazuli Mosaic Necklace",
    name_ar: "قلادة فسيفساء اللازورد الفاخرة",
    price: 2800,
    category_en: "Necklaces",
    category_ar: "قلادات",
    collection_en: "Nature's Mosaic",
    collection_ar: "فسيفساء الطبيعة",
    stone_en: "Lapis Lazuli",
    stone_ar: "لازورد",
    description_en: "A rich, multi-textured layered necklace featuring a mosaic-like assembly of Lapis Lazuli fragments, natural freshwater pearls, and warm gold-plated accent beads. Inspired by Mediterranean seaside tiles.",
    description_ar: "قلادة غنية ومتعددة الطبقات تتميز بتجميع شبيه بالفسيفساء من شظايا اللازورد الزرقاء العميقة، لآلئ المياه العذبة الطبيعية، وخرز ذهبي مصقول ودافئ. مستوحاة من تفاصيل وزخارف بلاط البحر الأبيض المتوسط التاريخي.",
    details_en: [
      "Material: 18k Gold-Plated Brass and Sterling Silver",
      "Stones: Natural Lapis Lazuli, White Freshwater Pearls",
      "Length: 50 cm layered design",
      "Hand-strung with high durability jewelry wire"
    ],
    details_ar: [
      "المواد: نحاس صائغين وفضة إسترلينية مطلية بالذهب",
      "الأحجار: أحجار لازورد زرقاء، لآلئ مياه عذبة طبيعية بيضاء",
      "طول القلادة: تصميم متعدد الطبقات بطول 50 سم",
      "مشدود ومصنوع يدوياً بأسلاك مجوهرات فائقة القوة والتحمل"
    ],
    stock: 3,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Turquoise Halo Heirloom Ring",
    name_ar: "خاتم الفيروز الأثري العتيق",
    price: 1450,
    category_en: "Rings",
    category_ar: "خواتم",
    collection_en: "El Eila",
    collection_ar: "العائلة",
    stone_en: "Turquoise",
    stone_ar: "فيروز",
    description_en: "An elegant tribute to vintage heirlooms. A hand-polished natural turquoise stone sits center-stage, wrapped in a highly intricate halo of gold beadwork that evokes memories of family jewelry boxes.",
    description_ar: "تحية تقدير راقية لقطع المجوهرات الأثرية المتوارثة. يتوسط الخاتم قطعة فيروز طبيعية مصقولة بعناية باليد، محاطة بهالة معقدة ومفصلة من الخرز الذهبي الصغير التي تعيد إلى الأذهان دفء صناديق مجوهرات العائلة التاريخية.",
    details_en: [
      "Material: 18k Gold Plated 925 Silver",
      "Stones: Natural Turquoise oval cut",
      "Face Width: 1.8 cm",
      "Comes with velvet editorial pouch"
    ],
    details_ar: [
      "المواد: فضة إسترلينية 925 مطلية بذهب عيار 18",
      "الأحجار: حجر فيروز طبيعي بيضاوي الشكل مصقول يدوياً",
      "عرض واجهة الخاتم: 1.8 سم",
      "يأتي مع حقيبة قطيفة فاخرة من تصميم الماركة"
    ],
    stock: 7,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name_en: "Classic Calligraphy Love Pin",
    name_ar: "بروش دبوس الحب بالخط العربي",
    price: 950,
    category_en: "Pins",
    category_ar: "دبابيس بروش",
    collection_en: "Calligraphy",
    collection_ar: "الخط العربي",
    stone_en: "None",
    stone_ar: "لا يوجد حجر",
    description_en: "An elegant editorial accent piece. Features the classic Arabic word 'Hob' (Love) sculpted in timeless golden calligraphy, designed to be pinned onto blazers, linen scarves, or winter coats.",
    description_ar: "بروش برّاق يمثل لمسة كلاسيكية إضافية غاية في الأناقة. يجسد كلمة 'حب' بالخط العربي الأنيق بشكل ذهبي انسيابي خالد، صُمم خصيصاً ليُزيّن السترات، الأوشحة الكتانية، أو المعاطف الشتوية الفخمة.",
    details_en: [
      "Material: 18k Gold Plated Silver",
      "Dimensions: 3.5 cm x 2.5 cm",
      "Security double-lock backing pin",
      "Signature collection jewelry box included"
    ],
    details_ar: [
      "المواد: فضة إسترلينية 925 مطلية بذهب عيار 18",
      "الأبعاد: 3.5 سم × 2.5 سم",
      "دبوس تثبيت خلفي بنظام قفل مزدوج الأمان",
      "يصل داخل صندوق هدايا فاخر من تشكيلة الصياغة الحصرية"
    ],
    stock: 15,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    hoverImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
  }
];

export const seedDatabase = async () => {
  try {
    const db = getFirestoreDb();
    const result = await db.getProducts();
    
    if (result.empty || result.docs.length === 0) {
      console.log("🌱 Database is empty. Seeding bilingual jewelry products catalog...");
      for (const prod of INITIAL_PRODUCTS) {
        // Also map default fields to English for absolute backward compatibility
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
      console.log("✅ Successfully seeded 8 bilingual luxury jewelry products!");
    } else {
      console.log("💎 Products already exist in the database catalog. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Seeding database failed:", error);
  }
};
