export const coursesData = [
  {
    id: 1,
    title: 'تطوير المواقع الكاملة - Full Stack',
    instructor: 'أحمد محمد',
    category: 'برمجة',
    rating: 4.8,
    reviewsCount: 1250,
    price: 499,
    originalPrice: 999,
    duration: '40 ساعة',
    level: 'متوسط',
    studentsCount: 5420,
    image: '/images/1.jpg',
    description: 'كورس شامل لتعلم تطوير المواقع من الصفر حتى الاحتراف. تعلم HTML, CSS, JavaScript, React, Node.js والمزيد.',
    detailedDescription: 'هذا الكورس يأخذك في رحلة شاملة لتعلم تطوير المواقع الكاملة من البداية حتى الاحتراف. ستتعلم تطوير واجهات المستخدم الجذابة والتفاعلية، وبناء خوادم قوية وآمنة، والتعامل مع قواعد البيانات، ونشر المشاريع على الإنترنت.',
    topics: [
      'أساسيات HTML و CSS',
      'JavaScript المتقدم',
      'React و Redux',
      'Node.js و Express',
      'MongoDB و Mongoose',
      'مصادقة المستخدمين و JWT',
      'نشر المشاريع على Heroku و Netlify'
    ],
    requirements: [
      'معرفة أساسية بالكمبيوتر',
      'لا يتطلب خبرة برمجية سابقة',
      'اتصال بالإنترنت'
    ],
    whatYouWillLearn: [
      'بناء مواقع ويب كاملة من الصفر',
      'تطوير واجهات تفاعلية باستخدام React',
      'إنشاء APIs قوية باستخدام Node.js',
      'التعامل مع قواعد البيانات',
      'نشر المشاريع على الإنترنت'
    ],
    faqs: [
      {
        question: 'هل أحتاج خبرة سابقة؟',
        answer: 'لا، الكورس مصمم للمبتدئين ويبدأ من الصفر.'
      },
      {
        question: 'كم المدة المتوقعة لإنهاء الكورس؟',
        answer: 'يمكنك إنهاؤه في 8-10 أسابيع بمعدل 5 ساعات أسبوعياً.'
      },
      {
        question: 'هل يوجد شهادة؟',
        answer: 'نعم، ستحصل على شهادة إتمام معتمدة.'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة عن Full Stack', duration: '15:30', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'إعداد بيئة العمل', duration: '22:45', completed: false, videoUrl: 'https://www.youtube.com/embed/t-bCLbmgesI?si=5JnhXIhk9-Q4hAgO' },
      { id: 3, title: 'HTML الأساسيات', duration: '35:20', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 4, title: 'CSS والتنسيق', duration: '42:15', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 5, title: 'JavaScript المتقدم', duration: '55:30', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 6, title: 'مقدمة في React', duration: '48:20', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 7, title: 'بناء مشروع React', duration: '65:10', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 8, title: 'Node.js والخادم', duration: '52:40', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'محمد علي', rating: 5, comment: 'كورس رائع جداً، شرح واضح ومفصل', date: '2025-09-15' },
      { id: 2, name: 'فاطمة أحمد', rating: 5, comment: 'أفضل كورس تطوير ويب بالعربي', date: '2025-09-10' },
      { id: 3, name: 'عمر خالد', rating: 4, comment: 'ممتاز لكن يحتاج تمارين أكثر', date: '2025-09-05' }
    ]
  },
  {
    id: 2,
    title: 'تصميم واجهات المستخدم UI/UX',
    instructor: 'سارة حسن',
    category: 'تصميم',
    rating: 4.9,
    reviewsCount: 980,
    price: 399,
    originalPrice: 799,
    duration: '28 ساعة',
    level: 'مبتدئ',
    studentsCount: 3200,
    image: '/images/2.png',
    description: 'تعلم تصميم واجهات مستخدم احترافية وتجربة مستخدم مميزة باستخدام Figma و Adobe XD.',
    detailedDescription: 'كورس شامل لتعلم أساسيات وأدوات تصميم واجهات المستخدم وتجربة المستخدم. ستتعلم كيفية إنشاء تصاميم جذابة وسهلة الاستخدام تلبي احتياجات المستخدمين.',
    topics: [
      'مبادئ التصميم الأساسية',
      'نظرية الألوان والطباعة',
      'Figma من البداية',
      'Adobe XD',
      'تصميم الأيقونات',
      'Wireframing و Prototyping',
      'اختبار تجربة المستخدم'
    ],
    requirements: [
      'لا يتطلب خبرة سابقة',
      'حاسوب متوسط المواصفات',
      'حس فني وإبداعي'
    ],
    whatYouWillLearn: [
      'تصميم واجهات احترافية',
      'فهم سلوك المستخدم',
      'استخدام Figma و Adobe XD',
      'إنشاء نماذج تفاعلية',
      'مبادئ التصميم الحديثة'
    ],
    faqs: [
      {
        question: 'هل أحتاج معرفة بالبرمجة؟',
        answer: 'لا، الكورس مخصص للتصميم فقط ولا يتطلب برمجة.'
      },
      {
        question: 'ما البرامج المطلوبة؟',
        answer: 'Figma (مجاني) و Adobe XD (نسخة تجريبية متاحة).'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة في UI/UX', duration: '18:20', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'مبادئ التصميم', duration: '25:15', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 3, title: 'البدء مع Figma', duration: '30:40', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 4, title: 'تصميم صفحة الهبوط', duration: '45:10', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 5, title: 'Prototyping', duration: '35:25', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'ليلى أحمد', rating: 5, comment: 'كورس ممتاز للمبتدئين', date: '2025-09-12' },
      { id: 2, name: 'يوسف محمود', rating: 5, comment: 'شرح مبسط وواضح', date: '2025-09-08' }
    ]
  },
  {
    id: 3,
    title: 'الذكاء الاصطناعي والتعلم الآلي',
    instructor: 'د. خالد إبراهيم',
    category: 'ذكاء اصطناعي',
    rating: 4.7,
    reviewsCount: 750,
    price: 599,
    originalPrice: 1199,
    duration: '50 ساعة',
    level: 'متقدم',
    studentsCount: 2100,
    image: '/images/4.jpg',
    description: 'تعلم أساسيات ومفاهيم الذكاء الاصطناعي والتعلم الآلي باستخدام Python وTensorFlow.',
    detailedDescription: 'كورس متقدم يغطي جميع جوانب الذكاء الاصطناعي والتعلم الآلي من النظرية إلى التطبيق العملي. ستتعلم بناء نماذج ذكية قادرة على التعلم واتخاذ القرارات.',
    topics: [
      'مقدمة في AI و ML',
      'Python للذكاء الاصطناعي',
      'الجبر الخطي والإحصاء',
      'خوارزميات التعلم الآلي',
      'الشبكات العصبية',
      'TensorFlow و Keras',
      'مشاريع عملية'
    ],
    requirements: [
      'معرفة جيدة بالبرمجة',
      'أساسيات الرياضيات',
      'Python (يفضل)'
    ],
    whatYouWillLearn: [
      'فهم مفاهيم AI و ML',
      'بناء نماذج تعلم آلي',
      'استخدام TensorFlow',
      'معالجة البيانات',
      'تطبيقات عملية'
    ],
    faqs: [
      {
        question: 'هل أحتاج خلفية رياضية قوية؟',
        answer: 'معرفة أساسية بالرياضيات كافية، وسنشرح ما تحتاجه.'
      },
      {
        question: 'ما هي المشاريع العملية؟',
        answer: 'ستبني نماذج للتعرف على الصور، ومعالجة اللغة، والتنبؤات.'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة في الذكاء الاصطناعي', duration: '20:30', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'Python للـ AI', duration: '35:45', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 3, title: 'أساسيات التعلم الآلي', duration: '40:20', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 4, title: 'الشبكات العصبية', duration: '55:10', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'أحمد سامي', rating: 5, comment: 'كورس احترافي جداً', date: '2025-09-14' },
      { id: 2, name: 'نور الدين', rating: 4, comment: 'محتوى قوي لكن صعب للمبتدئين', date: '2025-09-11' }
    ]
  },
  {
    id: 4,
    title: 'تطوير تطبيقات الموبايل - Flutter',
    instructor: 'مريم عبدالله',
    category: 'موبايل',
    rating: 4.8,
    reviewsCount: 1100,
    price: 449,
    originalPrice: 899,
    duration: '35 ساعة',
    level: 'متوسط',
    studentsCount: 4300,
    image: '/images/5.jpg',
    description: 'تعلم تطوير تطبيقات الموبايل لنظامي iOS و Android باستخدام Flutter و Dart.',
    detailedDescription: 'كورس شامل لتطوير تطبيقات الموبايل الاحترافية باستخدام Flutter. ستتعلم كيفية بناء تطبيقات جميلة وسريعة تعمل على جميع المنصات.',
    topics: [
      'أساسيات Dart',
      'مقدمة في Flutter',
      'Widgets والتخطيطات',
      'إدارة الحالة',
      'التعامل مع APIs',
      'Firebase Integration',
      'نشر التطبيقات'
    ],
    requirements: [
      'معرفة أساسية بالبرمجة',
      'لا يشترط معرفة Dart مسبقاً'
    ],
    whatYouWillLearn: [
      'بناء تطبيقات موبايل كاملة',
      'استخدام Flutter و Dart',
      'التعامل مع Firebase',
      'نشر التطبيقات على المتاجر',
      'أفضل الممارسات'
    ],
    faqs: [
      {
        question: 'هل أحتاج جهاز Mac؟',
        answer: 'لا، يمكنك التطوير على Windows أو Linux أيضاً.'
      },
      {
        question: 'هل يغطي iOS و Android؟',
        answer: 'نعم، Flutter يسمح بالتطوير للمنصتين معاً.'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة في Flutter', duration: '16:40', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'لغة Dart', duration: '28:30', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 3, title: 'أول تطبيق Flutter', duration: '35:15', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 4, title: 'Widgets المتقدمة', duration: '42:20', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'حسن محمد', rating: 5, comment: 'ممتاز للمبتدئين في Flutter', date: '2025-09-13' },
      { id: 2, name: 'سلمى أحمد', rating: 5, comment: 'شرح رائع ومشاريع عملية', date: '2025-09-09' }
    ]
  },
  {
    id: 5,
    title: 'التسويق الرقمي والسوشيال ميديا',
    instructor: 'ياسمين محمود',
    category: 'تسويق',
    rating: 4.6,
    reviewsCount: 890,
    price: 349,
    originalPrice: 699,
    duration: '25 ساعة',
    level: 'مبتدئ',
    studentsCount: 6500,
    image: '/images/6.jpg',
    description: 'تعلم استراتيجيات التسويق الرقمي الفعالة وإدارة حسابات السوشيال ميديا بشكل احترافي.',
    detailedDescription: 'كورس كامل يغطي جميع جوانب التسويق الرقمي من استراتيجيات المحتوى إلى الإعلانات المدفوعة وتحليل البيانات.',
    topics: [
      'أساسيات التسويق الرقمي',
      'استراتيجيات المحتوى',
      'إدارة السوشيال ميديا',
      'الإعلانات المدفوعة',
      'SEO و SEM',
      'التحليل والقياس',
      'Email Marketing'
    ],
    requirements: [
      'لا يتطلب خبرة سابقة',
      'معرفة أساسية بالإنترنت'
    ],
    whatYouWillLearn: [
      'بناء استراتيجية تسويقية',
      'إدارة حسابات احترافية',
      'إنشاء حملات إعلانية',
      'تحليل البيانات',
      'زيادة المبيعات'
    ],
    faqs: [
      {
        question: 'هل يناسب أصحاب المشاريع الصغيرة؟',
        answer: 'نعم، الكورس مثالي لأصحاب الأعمال والمسوقين.'
      },
      {
        question: 'هل يشمل إعلانات فيسبوك وإنستجرام؟',
        answer: 'نعم، نغطي جميع منصات السوشيال ميديا الرئيسية.'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة في التسويق الرقمي', duration: '14:25', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'استراتيجية المحتوى', duration: '22:30', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 3, title: 'إعلانات فيسبوك', duration: '30:15', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'علي حسين', rating: 5, comment: 'استفدت كثيراً في مشروعي', date: '2025-09-16' },
      { id: 2, name: 'هدى سعيد', rating: 4, comment: 'كورس جيد ومفيد', date: '2025-09-12' }
    ]
  },
  {
    id: 6,
    title: 'الأمن السيبراني وحماية المعلومات',
    instructor: 'م. طارق فهمي',
    category: 'أمن سيبراني',
    rating: 4.9,
    reviewsCount: 650,
    price: 549,
    originalPrice: 1099,
    duration: '45 ساعة',
    level: 'متقدم',
    studentsCount: 1800,
    image: '/images/7.jpg',
    description: 'تعلم أساسيات وتقنيات الأمن السيبراني لحماية الأنظمة والشبكات من الهجمات.',
    detailedDescription: 'كورس شامل يغطي جميع جوانب الأمن السيبراني من الأساسيات إلى التقنيات المتقدمة للحماية من الهجمات الإلكترونية.',
    topics: [
      'مقدمة في الأمن السيبراني',
      'أنواع الهجمات الإلكترونية',
      'حماية الشبكات',
      'التشفير والأمان',
      'اختبار الاختراق',
      'أدوات الحماية',
      'إدارة المخاطر'
    ],
    requirements: [
      'معرفة بأساسيات الشبكات',
      'خبرة في نظام Linux'
    ],
    whatYouWillLearn: [
      'تأمين الأنظمة والشبكات',
      'اكتشاف الثغرات',
      'اختبار الاختراق الأخلاقي',
      'أدوات الحماية',
      'إدارة الحوادث الأمنية'
    ],
    faqs: [
      {
        question: 'هل يؤهل للعمل كمختبر اختراق؟',
        answer: 'نعم، الكورس يغطي أساسيات اختبار الاختراق الأخلاقي.'
      },
      {
        question: 'ما المتطلبات التقنية؟',
        answer: 'ستحتاج جهاز قادر على تشغيل آلات وهمية (Virtual Machines).'
      }
    ],
    lessons: [
      { id: 1, title: 'مقدمة في الأمن السيبراني', duration: '18:50', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 2, title: 'أنواع الهجمات', duration: '32:40', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' },
      { id: 3, title: 'أساسيات التشفير', duration: '40:25', completed: false, videoUrl: 'https://www.youtube.com/embed/h3VCQjyaLws?si=4-6sIJxopgK08F4w' }
    ],
    reviews: [
      { id: 1, name: 'عمر صلاح', rating: 5, comment: 'كورس احترافي بكل المقاييس', date: '2025-09-15' },
      { id: 2, name: 'رانيا خالد', rating: 5, comment: 'أفضل كورس أمن سيبراني', date: '2025-09-10' }
    ]
  }
]

export const categories = [
  'الكل',
  'برمجة',
  'تصميم',
  'ذكاء اصطناعي',
  'موبايل',
  'تسويق',
  'أمن سيبراني'
]
