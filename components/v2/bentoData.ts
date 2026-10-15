export interface BentoItem {
  id: string;
  slug: string;
  type: 'hero' | 'wide' | 'tall' | 'compact' | 'stat' | 'quote';
  category_id: 'pmf' | 'pricing' | 'growth' | 'moats' | 'funding' | 'mental_models';
  category_ar: string;
  category_en: string;
  badge_ar?: string;
  badge_en?: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  highlight_ar: string;
  highlight_en: string;
  statNumber?: string;
  statLabel_ar?: string;
  statLabel_en?: string;
  quote_ar?: string;
  quote_en?: string;
  accentColor: string; // Tailwind color class or hex
  gradient: string;
}

export const BENTO_ITEMS: BentoItem[] = [
  // 1. HERO Bento (2x2): PMF Formula
  {
    id: 'bento_pmf_formula',
    slug: 'product-market-fit-formula',
    type: 'hero',
    category_id: 'pmf',
    category_ar: 'التحقق وملاءمة السوق',
    category_en: 'PMF & Validation',
    badge_ar: 'النموذج الذهبي 🎯',
    badge_en: 'The Golden Formula 🎯',
    title_ar: 'معادلة ملاءمة المنتج للسوق (PMF Formula)',
    title_en: 'The Product/Market Fit Formula',
    subtitle_ar: 'كيف تعرف بيقين علمي أن السوق يسحب منتجك بقوة ولا يجاملك؟',
    subtitle_en: 'How to scientifically verify market pull vs polite founder feedback',
    highlight_ar: 'إذا لم يكن 40% على الأقل من عملائك "سيخيب أملهم بشدة" عند اختفاء منتجك، فأنت لم تصل لملاءمة السوق بعد.',
    highlight_en: 'Unless 40%+ of users would be "very disappointed" without your product, you do not have PMF yet.',
    statNumber: '> 40%',
    statLabel_ar: 'مؤشر شون إليس للطلب الحقيقي',
    statLabel_en: 'Sean Ellis Disappointment Benchmark',
    accentColor: '#3b82f6',
    gradient: 'from-blue-500/10 via-indigo-500/10 to-blue-600/15',
  },

  // 2. WIDE Bento (2x1): Pricing dictates business model
  {
    id: 'bento_pricing_model',
    slug: 'pricing-determines-your-business-model',
    type: 'wide',
    category_id: 'pricing',
    category_ar: 'هندسة التسعير',
    category_en: 'Pricing Strategy',
    badge_ar: 'قانون التسعير الأساسي 💰',
    badge_en: 'Core Pricing Law 💰',
    title_ar: 'التسعير هو ما يحدد نموذج عملك بالكامل',
    title_en: 'Pricing Determines Your Entire Business Model',
    subtitle_ar: 'السعر ليس رقماً تضعه، بل هو المحرك الذي يفرض طريقة بيعك ودعمك لعملائك.',
    subtitle_en: 'Price is not an afterthought; it dictates your entire go-to-market structure.',
    highlight_ar: 'اشتراك 5$ شهرياً يفرض دعماً آلياً 100%، بينما 1,000$ يتيح مندوبين مبيعات ودعماً بشرياً فائقاً.',
    highlight_en: '$5/mo forces 100% self-serve automation, while $1,000/mo enables white-glove human support.',
    accentColor: '#10b981',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/15',
  },

  // 3. TALL Bento (1x2): SLC vs MVP
  {
    id: 'bento_slc',
    slug: 'slc',
    type: 'tall',
    category_id: 'pmf',
    category_ar: 'تطوير المنتجات',
    category_en: 'Product Strategy',
    badge_ar: 'وداعاً MVP 🛹',
    badge_en: 'Goodbye MVP 🛹',
    title_ar: 'عملاؤك يكرهون الـ MVP: ابنِ بدلاً منه منتجاً بسيطاً ومحبوباً (SLC)',
    title_en: 'Customers Hate MVPs: Build Simple, Lovable, Complete (SLC)',
    subtitle_ar: 'لا تبنِ سيارة بنصف عجلات وبدون مقود، ابنِ لوح تزلج ممتاز يوصل العميل لغايته الآن.',
    subtitle_en: 'Do not build half a car with no steering wheel; build a great skateboard.',
    highlight_ar: 'المنتج الصغير المكتمل والمحبوب يمنح قيمة فورية ويكسب ولاء العميل من اليوم الأول.',
    highlight_en: 'A tiny, lovable, polished product creates real delight from day one.',
    accentColor: '#f59e0b',
    gradient: 'from-amber-500/10 via-orange-500/10 to-amber-600/15',
  },

  // 4. STAT Bento (1x1): The Testimonial Test
  {
    id: 'bento_testimonial_test',
    slug: 'target-market',
    type: 'compact',
    category_id: 'pmf',
    category_ar: 'تجزئة السوق المستهدف',
    category_en: 'Target Market',
    badge_ar: 'اختبار التحقق 🎯',
    badge_en: 'Validation Test 🎯',
    title_ar: 'اختبار التزكية (The Testimonial Test)',
    title_en: 'The Testimonial Test',
    subtitle_ar: 'هل العميل [ب] سيتأثر بشهادة حقيقية يقدمها العميل [أ]؟',
    subtitle_en: 'Would Customer B be swayed by Customer A’s genuine testimonial?',
    highlight_ar: 'إذا كان الجواب "لا"، فإنهما ليسا في نفس السوق المستهدف إطلاقاً مهما تشابهت بياناتهم الديموغرافية.',
    highlight_en: 'If not, they are in completely different target segments regardless of demographics.',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-500/10 via-violet-500/10 to-purple-600/15',
  },

  // 5. QUOTE Bento (1x1): Never compete on price
  {
    id: 'bento_never_price',
    slug: 'never-compete-on-price',
    type: 'quote',
    category_id: 'pricing',
    category_ar: 'استراتيجية المنافسة',
    category_en: 'Competitive Pricing',
    badge_ar: 'حكمة جيسون ⚠️',
    badge_en: 'Jason’s Razor ⚠️',
    title_ar: 'لا تنافس أبداً على خفض الأسعار',
    title_en: 'Never Compete On Price',
    subtitle_ar: 'المنافسة السعرية سباق نحو الإفلاس',
    subtitle_en: 'Price wars are a race to bankruptcy',
    highlight_ar: 'المنافسة على السعر لعبة خاسرة. الفائز الوحيد في حرب الأسعار هو من يفلس أولاً! ضاعف سعرك وقدم قيمة فريدة.',
    highlight_en: 'Competing on price is a losing game. The only winner in a price war is whoever goes broke first.',
    quote_ar: '«التسعير المنخفض مقبرة للمؤسسين المستقلين. ارفع أسعارك لتتمكن من تقديم منتج فائق ودعم استثنائي.»',
    quote_en: '“Low prices are the graveyard of bootstrappers. Double your price and build unfair value.”',
    accentColor: '#ef4444',
    gradient: 'from-red-500/10 via-rose-500/10 to-red-600/15',
  },

  // 6. WIDE Bento (2x1): True Moats
  {
    id: 'bento_moats',
    slug: 'moats',
    type: 'wide',
    category_id: 'moats',
    category_ar: 'الخنادق التنافسية',
    category_en: 'Enduring Moats',
    badge_ar: 'الحصانة الاستراتيجية 🛡️',
    badge_en: 'Strategic Defensibility 🛡️',
    title_ar: 'الخنادق التنافسية الحقيقية والمزايا المستحيلة النسخ',
    title_en: 'Enduring Moats & True Unfair Advantages',
    subtitle_ar: 'الميزات البرمجية سريعة الزوال ويمكن نسخها في أسابيع، فما هو الخندق الحقيقي؟',
    subtitle_en: 'Features are commodities copied in weeks. What is your true moat?',
    highlight_ar: 'الخنادق الحقيقية: تكاليف التحويل المرتفعة، السمعة والموثوقية، وتأثيرات الشبكة داخل منظومة العميل.',
    highlight_en: 'True moats: prohibitive switching costs, trusted brand reputation, and systemic ecosystem lock-in.',
    accentColor: '#0ea5e9',
    gradient: 'from-sky-500/10 via-cyan-500/10 to-sky-600/15',
  },

  // 7. HERO Bento (2x2): Rocks, Pebbles, Sand
  {
    id: 'bento_rocks',
    slug: 'rocks-pebbles-sand',
    type: 'hero',
    category_id: 'mental_models',
    category_ar: 'النماذج الفكرية وصناعة القرار',
    category_en: 'Mental Models & Strategy',
    badge_ar: 'إدارة الأولويات ⏳',
    badge_en: 'Priority Architecture ⏳',
    title_ar: 'الصخور الكبيرة، الحصى، والرمال: إدارة أولويات المؤسس',
    title_en: 'Rocks, Pebbles, and Sand: Executive Prioritization',
    subtitle_ar: 'كيف تركز على المهام الاستراتيجية الضخمة دون أن تبتلعك تفاصيل العمل اليومية التافهة؟',
    subtitle_en: 'How to focus on game-changing strategic priorities before daily trivia floods your schedule.',
    highlight_ar: 'إذا ملأت الإناء بالرمال والحصى أولاً، فلن تجد متسعاً للصخور الكبيرة أبداً. ضع الصخور الاستراتيجية أولاً.',
    highlight_en: 'If you fill your jar with pebbles and sand first, the big rocks will never fit. Place big rocks first.',
    statNumber: '1 - 3',
    statLabel_ar: 'صخور استراتيجية كبرى فقط لكل ربع سنوي',
    statLabel_en: 'Maximum Big Strategic Rocks Per Quarter',
    accentColor: '#f97316',
    gradient: 'from-amber-500/10 via-orange-500/10 to-amber-600/15',
  },

  // 8. TALL Bento (1x2): Rich vs King
  {
    id: 'bento_rich_king',
    slug: 'rich-vs-king-sold-company',
    type: 'tall',
    category_id: 'funding',
    category_ar: 'مسار التأسيس',
    category_en: 'Founder Paths',
    badge_ar: 'معضلة المؤسس ⚖️',
    badge_en: 'Founder Dilemma ⚖️',
    title_ar: 'أن تكون ثرياً أم ملكاً؟ (Rich vs. King)',
    title_en: 'Rich vs. King: Why I Sold My Company',
    subtitle_ar: 'هل تؤسس شركتك لتكون الحاكم المطلق لحريتك أم لبناء ثروة ضخمة تتطلب مشاركة المستثمرين؟',
    subtitle_en: 'Do you optimize for absolute autonomy and freedom, or enterprise valuation with investors?',
    highlight_ar: 'الملك (King) يمتلك القرار بنسبة 100% ويتمول ذاتياً. الثري (Rich) يضحي بالسيطرة لبناء وحيد قرن ملياري.',
    highlight_en: 'Kings maintain 100% autonomy via bootstrapping; Rich founders dilute to build high-velocity scale.',
    accentColor: '#ec4899',
    gradient: 'from-pink-500/10 via-rose-500/10 to-pink-600/15',
  },

  // 9. COMPACT Bento (1x1): The One Channel Rule
  {
    id: 'bento_one_channel',
    slug: 'one-channel',
    type: 'compact',
    category_id: 'growth',
    category_ar: 'التوزيع العضوي',
    category_en: 'Customer Acquisition',
    badge_ar: 'قانون التوزيع 🚀',
    badge_en: 'Distribution Law 🚀',
    title_ar: 'قاعدة القناة التسويقية الواحدة',
    title_en: 'The One Channel Rule',
    subtitle_ar: 'تعمق في قناة واحدة بدلاً من التشتت في خمس قنوات',
    subtitle_en: 'Dominate exactly one distribution channel',
    highlight_ar: 'الشركات الناشئة لا تفشل لقلة القنوات، بل لأنها تجرب كل القنوات بسطحية. اتقن قناة واحدة حتى تحقق ملايين الدولارات.',
    highlight_en: 'Startups fail from shallow diversification. Master ONE channel until you hit scale.',
    accentColor: '#6366f1',
    gradient: 'from-indigo-500/10 via-blue-500/10 to-indigo-600/15',
  },

  // 10. WIDE Bento (2x1): Worse but unique
  {
    id: 'bento_worse_unique',
    slug: 'worse-but-unique',
    type: 'wide',
    category_id: 'moats',
    category_ar: 'التموضع التنافسي',
    category_en: 'Positioning',
    badge_ar: 'التموضع الذكي ⚡',
    badge_en: 'Asymmetric Positioning ⚡',
    title_ar: 'أن تكون أسوأ لكن فريداً ومميزاً خير من أن تكون نسخة مكررة',
    title_en: 'Worse But Unique Beats A Mediocre Copy',
    subtitle_ar: 'العملاء لا يبحثون عن منتج أفضل بنسبة 10%، بل يبحثون عمن يحل معضلتهم الخاصة بشكل جذري.',
    subtitle_en: 'Customers do not want a 10% better clone; they want a radically unique answer.',
    highlight_ar: 'يمكن لمنتجك أن يكون أضعف في 90% من الميزات التقليدية، لكنه يفوز لأنه يقدم شيئاً لا يستطيع أي عملاق آخر تقديمه.',
    highlight_en: 'You can be worse in 90% of benchmark features, yet win because you own the one dimension that counts.',
    accentColor: '#14b8a6',
    gradient: 'from-teal-500/10 via-emerald-500/10 to-teal-600/15',
  },

  // 11. STAT Bento (1x1): Zero-Sum Marketing
  {
    id: 'bento_zero_sum',
    slug: 'zero-sum-marketing',
    type: 'compact',
    category_id: 'growth',
    category_ar: 'التسويق والاستحواذ',
    category_en: 'Marketing Strategy',
    badge_ar: 'تنبيه إعلاني 🛑',
    badge_en: 'Ad Warning 🛑',
    title_ar: 'فخ التسويق ذو المحصلة الصفرية',
    title_en: 'Zero-Sum Marketing Trap',
    subtitle_ar: 'لماذا تخسر الشركات الناشئة في مزادات الإعلانات الممولة؟',
    subtitle_en: 'Why startups get crushed in paid ad auctions',
    highlight_ar: 'مزادات Google و Facebook تصمم ليفوز صاحب الجيوب الأكبر. الشركات الصغيرة تفوز بالمحتوى العميق والتوزيع غير المتماثل.',
    highlight_en: 'Ad auctions favor deep pockets. Startups win through content moats and asymmetric distribution.',
    accentColor: '#eab308',
    gradient: 'from-yellow-500/10 via-amber-500/10 to-yellow-600/15',
  },

  // 12. COMPACT Bento (1x1): Needs Stack
  {
    id: 'bento_needs_stack',
    slug: 'needs-stack',
    type: 'compact',
    category_id: 'mental_models',
    category_ar: 'هرم الاحتياجات',
    category_en: 'Needs Stack',
    badge_ar: 'هيكل النمو 📊',
    badge_en: 'Growth Hierarchy 📊',
    title_ar: 'هرم احتياجات المؤسس (The Needs Stack)',
    title_en: 'The Founder Needs Stack',
    subtitle_ar: 'البقاء أولاً، ثم الربحية، ثم التوسع، ثم الأثر',
    subtitle_en: 'Survival -> Profitability -> Scale -> Impact',
    highlight_ar: 'لا تحاول حل مشاكل التوسع (Scale) وأنت لم تؤمّن النجاة والربحية الأساسية بعد.',
    highlight_en: 'Never solve scale problems while trapped in basic survival and unit economics.',
    accentColor: '#84cc16',
    gradient: 'from-lime-500/10 via-green-500/10 to-lime-600/15',
  },
];
