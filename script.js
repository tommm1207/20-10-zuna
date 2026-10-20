/* ==========================================================
   VƯỜN HOA ONLINE - SOOTHING PASTEL GARDEN
   Javascript logic: Sinh hoa ngẫu nhiên, hiệu ứng đung đưa tự nhiên,
   tương tác gieo hoa, hạt bay và âm thanh chuông gió Web Audio.
   ========================================================== */

(function () {
  'use strict';

  // DOM Elements
  const gardenWrapper = document.getElementById('gardenWrapper');
  const backLayer = document.getElementById('backFlowerLayer');
  const midLayer = document.getElementById('midFlowerLayer');
  const frontLayer = document.getElementById('frontFlowerLayer');
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ctx = ambientCanvas.getContext('2d');

  // Controls
  const btnWind = document.getElementById('btnWind');
  const windLabel = document.getElementById('windLabel');
  const btnTheme = document.getElementById('btnTheme');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const btnReplant = document.getElementById('btnReplant');
  const btnAudio = document.getElementById('btnAudio');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');

  // Flower Wish Bubble Elements
  const flowerBubble = document.getElementById('flowerBubble');
  const bubbleText = document.getElementById('bubbleText');
  let bubbleTimeout = null;
  let lastWishIndex = -1;

  /* ==========================================================
     ĐA NGÔN NGỮ (EN / MN / VI) - mặc định tiếng Anh
     ========================================================== */
  const LANGS = ['en', 'mn', 'vi'];

  const i18n = {
    en: {
      pageTitle: 'Healing Garden – For Hongor Zul',
      badge: '🌸 October 20 • For Hongor Zul',
      title: 'Healing Garden',
      subtitle: 'Tap a flower for a little note • Tap the ground to plant more',
      bubbleTag: '🌸 A note for Hongor Zul',
      dockAria: 'Garden controls',
      langAria: 'Language',
      windTitle: 'Change wind strength',
      themeTitle: 'Change time of day',
      replantTitle: 'Water the garden to refresh it',
      replantLabel: 'Water',
      audioTitle: 'Turn wind chimes on/off',
      audioOff: 'Wind chimes',
      audioOn: 'Chimes on',
      winds: ['Gentle breeze', 'Fresh wind', 'Still air'],
      themes: ['Sunrise', 'Sunset', 'Moonlit night'],
      wishes: [
        "Don't stay up too late, okay?",
        "Not even deadlines can beat Hongor Zul.",
        "Remember to eat something delicious today.",
        "Wishing you a peaceful, light-hearted October 20!",
        "If you're tired, rest a little. No need to push so hard.",
        "Remember to drink enough water and eat on time.",
        "Wishing you a super chill October 20 with no one bothering you.",
        "Some days, a calm heart is all you need. You've got this!",
        "Try to sleep early tonight and recharge, okay?",
        "Just do your part well and don't let the rest weigh on you.",
        "May Hongor Zul always keep this strength and this smile.",
        "However busy you are, put yourself first today.",
        "Take a deep breath, let it out slowly. Everything will be okay!",
        "Happy October 20! May the gentlest things find their way to you.",
        "It's totally fine to give yourself a little break now and then!",
        "Take care of your health. It's easy to get worn out these days.",
        "Wishing you a deep, sound sleep tonight, free of worries.",
        "Hope you find little joys around you every single day.",
        "Hongor Zul has worked so hard. Treat yourself today!",
        "May you always have good friends nearby, ready to listen.",
        "Overthink a little less. Relax and let your mind breathe.",
        "Hope everything you do today feels easy and pressure-free!",
        "Take a moment to play a song you love and recharge.",
        "Wishing you an October 20 full of laughter and kindness!"
      ]
    },
    mn: {
      pageTitle: 'Сэтгэл амраах цэцэрлэг – Хонгорзулд',
      badge: '🌸 10-р сарын 20 • Хонгорзулд зориулав',
      title: 'Сэтгэл амраах цэцэрлэг',
      subtitle: 'Цэцэг дээр дарж захиас аваарай • Газар дээр дарж цэцэг тарина уу',
      bubbleTag: '🌸 Хонгорзулд өгөх захиас',
      dockAria: 'Цэцэрлэгийн удирдлага',
      langAria: 'Хэл',
      windTitle: 'Салхины хүчийг өөрчлөх',
      themeTitle: 'Өдрийн цагийг солих',
      replantTitle: 'Цэцэрлэгээ услаж сэргээх',
      replantLabel: 'Услах',
      audioTitle: 'Салхин хонхыг асаах/унтраах',
      audioOff: 'Салхин хонх',
      audioOn: 'Асаалттай',
      winds: ['Зөөлөн салхи', 'Сэрүүн салхи', 'Салхигүй'],
      themes: ['Нар мандах', 'Нар жаргах', 'Сарны шөнө'],
      wishes: [
        "Битгий хэт оройтож унтаарай.",
        "Deadline ч гэсэн Хонгорзулыг ялж чадахгүй шүү.",
        "Өнөөдөр амттай юм идэхээ мартуузай.",
        "10-р сарын 20-нд чамд амар тайван, хөнгөн сэтгэл хүсье!",
        "Ядарвал жаахан амраарай, хэт их чармайх хэрэггүй.",
        "Хангалттай ус ууж, цагтаа хооллохоо мартуузай.",
        "Хэн ч саад болохгүй, тайван сайхан 10-р сарын 20 байх болтугай.",
        "Заримдаа сэтгэл амар байхад л хангалттай. Чи чадна!",
        "Өнөө орой эрт унтаж, хүчээ сэлбээрэй.",
        "Өөрийнхөө ажлыг л сайн хий, бусад зүйлд битгий их санаа зов.",
        "Хонгорзул үргэлж ийм тэсвэр тэвчээр, инээмсэглэлтэй байгаарай.",
        "Хичнээн завгүй байсан ч өнөөдөр өөрийгөө нэгдүгээрт тавиарай.",
        "Гүнзгий амьсгаа аваад аажуухан гаргаарай. Бүх зүйл зүгээр болно!",
        "10-р сарын 20-ны баярын мэнд! Хамгийн зөөлөн, сайхан зүйлс чамд ирэх болтугай.",
        "Хааяа өөртөө жаахан амралт өгөх нь огт буруу биш шүү!",
        "Эрүүл мэнддээ анхаараарай, энэ үед амархан ядардаг шүү.",
        "Өнөө шөнө санаа зоволтгүй, тайван сайхан нойрсоорой.",
        "Өдөр бүр эргэн тойрноосоо жижиг баяр баясгаланг олж байгаарай.",
        "Хонгорзул маш их хичээсэн. Өнөөдөр өөрийгөө шагнаарай!",
        "Чамайг сонсоход үргэлж бэлэн сайн найзууд дэргэд чинь байх болтугай.",
        "Жаахан бага бодож, тайвшраад толгойгоо амраагаарай.",
        "Өнөөдөр юу ч хийсэн дарамтгүй, тав тухтай байх болтугай!",
        "Дуртай дуугаа сонсож, эрч хүчээ сэргээгээрэй.",
        "10-р сарын 20 чинь инээд хөөр, халуун дулаан сэтгэлээр дүүрэн байх болтугай!"
      ]
    },
    // Lời nhắn quan tâm, healing, ấm áp, động viên Hongor Zul (không nói lương, không khen nhan sắc, không sến)
    vi: {
      pageTitle: 'Vườn healing - 20/10 Gửi Hongor Zul',
      badge: '🌸 20 Tháng 10 • Gửi Hongor Zul',
      title: 'Vườn healing',
      subtitle: 'Nhấn vào từng bông hoa để nhận lời nhắn • Chạm vào đất để gieo thêm hoa',
      bubbleTag: '🌸 Lời nhắn gửi Hongor Zul',
      dockAria: 'Điều khiển vườn hoa',
      langAria: 'Ngôn ngữ',
      windTitle: 'Đổi sức gió',
      themeTitle: 'Đổi thời gian trong ngày',
      replantTitle: 'Tưới nước làm tươi mới khu vườn',
      replantLabel: 'Tưới nước',
      audioTitle: 'Bật/Tắt giai điệu chuông gió',
      audioOff: 'Tiếng gió',
      audioOn: 'Đang bật',
      winds: ['Gió dịu êm', 'Gió vừa', 'Lặng gió'],
      themes: ['Bình minh', 'Hoàng hôn', 'Đêm trăng'],
      wishes: [
        "Đừng thức khuya nhiều quá nhé",
        "Deadline cũng không thắng được Hongor Zul đâu",
        "Hôm nay nhớ ăn gì ngon nhé",
        "Chúc bà 20/10 thật bình yên và nhẹ nhõm nha!",
        "Mệt thì cứ nghỉ ngơi một chút, đừng gồng quá nha bà.",
        "Bà nhớ uống đủ nước và ăn uống đúng bữa nghen.",
        "Chúc bà một ngày 20/10 thật chill, không ai làm phiền.",
        "Có những ngày chỉ cần lòng mình an yên là đủ rồi, cố lên bà!",
        "Tối nay nhớ đi ngủ sớm một hôm cho lại sức nhé bà.",
        "Cứ làm tốt việc của mình thôi, chuyện khác đừng bận lòng quá.",
        "Chúc Hongor Zul lúc nào cũng giữ được sự kiên cường và nụ cười này.",
        "Dù bận rộn thế nào thì hôm nay cũng ưu tiên bản thân trước nha bà.",
        "Hít một hơi thật sâu, thở ra nhẹ nhõm, mọi chuyện rồi sẽ ổn cả thôi!",
        "20/10 vui vẻ nghen bà, mong những điều êm đềm nhất sẽ đến với bà.",
        "Lâu lâu cho phép mình được nghỉ xả hơi một chút cũng chẳng sao đâu bà!",
        "Bà nhớ giữ gìn sức khoẻ, dạo này trời dễ mệt lắm đấy.",
        "Chúc bà tối nay có một giấc ngủ thật ngon, không mộng mị, không lo nghĩ.",
        "Mong bà mỗi ngày đều tìm thấy những niềm vui nho nhỏ xung quanh.",
        "Hongor Zul đã cố gắng rất nhiều rồi, hôm nay hãy tự thưởng cho mình nhé!",
        "Chúc bà luôn có những người bạn tốt bên cạnh sẵn sàng lắng nghe khi bà cần.",
        "Bà ơi, bớt suy nghĩ lại một chút, thả lỏng ra cho đầu óc thảnh thơi nè.",
        "Chúc bà hôm nay làm gì cũng thấy thoải mái, không bị áp lực!",
        "Dành chút thời gian nghe bài nhạc bà thích để nạp lại năng lượng nhé.",
        "Chúc bà ngày 20/10 thật nhiều tiếng cười và sự dịu dàng!"
      ]
    }
  };

  // Ưu tiên: ?lang= trên URL → lựa chọn đã lưu → tiếng Anh
  function getInitialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem('garden-lang');
      if (LANGS.includes(saved)) return saved;
    } catch (e) {
      // Storage bị chặn, dùng mặc định
    }
    return 'en';
  }
  let currentLang = getInitialLang();
  const t = () => i18n[currentLang];

  // Butterflies
  const butterfly1 = document.getElementById('butterfly1');
  const butterfly2 = document.getElementById('butterfly2');

  // Audio state
  let audioEnabled = false;
  let audioCtx = null;

  // Garden State
  // Nhãn hiển thị lấy từ i18n theo cùng thứ tự
  const windModes = [
    { factor: 1.0, particleSpeed: 1.0 },
    { factor: 1.6, particleSpeed: 1.8 },
    { factor: 0.35, particleSpeed: 0.4 }
  ];
  let currentWindIndex = 0;

  const themes = [
    { name: 'theme-sunrise', icon: '🌅' },
    { name: 'theme-sunset', icon: '🌇' },
    { name: 'theme-moonlight', icon: '🌙' }
  ];
  let currentThemeIndex = 0;

  // Flower Types Configuration
  const flowerTypes = ['cosmos', 'tulip', 'daisy', 'lavender', 'rose'];

  // Harmonious Color Palettes (Pastel dịu nhẹ, không gắt)
  const pastelColors = {
    cosmos: [
      { petal: '#fcd5ce', blush: '#f4acb7' },
      { petal: '#f8edeb', blush: '#fcd5ce' },
      { petal: '#fec5bb', blush: '#fae1dd' },
      { petal: '#e8d7f1', blush: '#d3bccc' }
    ],
    tulip: [
      { peach: '#ffd7ba', rose: '#f28482' },
      { peach: '#ffe5d9', rose: '#f4978e' },
      { peach: '#f8edeb', rose: '#ea9ab2' }
    ],
    daisy: [
      { petal: '#ffffff', cream: '#fffaf0' },
      { petal: '#fdfbf7', cream: '#fceddb' },
      { petal: '#f4f1de', cream: '#e0ded3' }
    ],
    lavender: [
      { light: '#e2d4f0', dark: '#b39ddb' },
      { light: '#d8b4e2', dark: '#9c88ff' },
      { light: '#eedbf7', dark: '#c5a3ff' }
    ],
    rose: [
      { l1: '#fcd5ce', l2: '#f4acb7', l3: '#f28482' },
      { l1: '#fae1dd', l2: '#f7cad0', l3: '#e07a5f' },
      { l1: '#f8edeb', l2: '#ffcad4', l3: '#d87088' }
    ]
  };

  /* ==========================================================
     WEB AUDIO API - PENTATONIC CHIMES (Âm thanh thư giãn)
     ========================================================== */
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play gentle bell/chime note (Pentatonic scale: C5, D5, E5, G5, A5, C6)
  const pentatonicFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  function playChime(freqIndex = null) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const freq = freqIndex !== null 
        ? pentatonicFrequencies[freqIndex % pentatonicFrequencies.length]
        : pentatonicFrequencies[Math.floor(Math.random() * pentatonicFrequencies.length)];

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Soft envelope (Gentle kalimba/tinkle)
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.25);
    } catch (e) {
      // Audio fallback silent
    }
  }

  /* ==========================================================
     BUILD INDIVIDUAL FLOWER DOM
     ========================================================== */
  function createFlowerElement(type, height, swayDuration, swayDelay, xPercent, isSprouting = false) {
    const flower = document.createElement('div');
    flower.className = `flower-item flower-type-${type} ${isSprouting ? 'sprouting' : ''}`;
    flower.style.left = `${xPercent}%`;

    // Apply unique swaying duration and offset
    flower.style.animation = `naturalSway ${swayDuration}s ease-in-out infinite alternate`;
    flower.style.animationDelay = `${swayDelay}s`;

    // Stem
    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    stem.style.height = `${height}px`;

    // Add leaves at random heights
    if (Math.random() > 0.3) {
      const leafL = document.createElement('div');
      leafL.className = 'flower-leaf leaf-left';
      leafL.style.top = `${30 + Math.random() * 40}%`;
      stem.appendChild(leafL);
    }
    if (Math.random() > 0.3) {
      const leafR = document.createElement('div');
      leafR.className = 'flower-leaf leaf-right';
      leafR.style.top = `${25 + Math.random() * 45}%`;
      stem.appendChild(leafR);
    }

    // Flower Head
    const head = document.createElement('div');
    head.className = 'flower-head';
    head.style.animation = `headSway ${swayDuration * 0.9}s ease-in-out infinite alternate`;
    head.style.animationDelay = `${swayDelay - 0.4}s`; // Inertia phase shift

    // Construct petals based on type
    if (type === 'cosmos') {
      const palette = pastelColors.cosmos[Math.floor(Math.random() * pastelColors.cosmos.length)];
      for (let i = 0; i < 8; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.transform = `rotate(${i * 45}deg)`;
        petal.style.background = `linear-gradient(180deg, ${palette.petal} 0%, ${palette.blush} 100%)`;
        head.appendChild(petal);
      }
      const core = document.createElement('div');
      core.className = 'flower-core';
      head.appendChild(core);
    } else if (type === 'tulip') {
      const palette = pastelColors.tulip[Math.floor(Math.random() * pastelColors.tulip.length)];
      const cup = document.createElement('div');
      cup.className = 'tulip-cup';
      
      const pL = document.createElement('div');
      pL.className = 'tulip-petal p-left';
      pL.style.background = `linear-gradient(180deg, ${palette.peach} 0%, ${palette.rose} 90%)`;
      
      const pR = document.createElement('div');
      pR.className = 'tulip-petal p-right';
      pR.style.background = `linear-gradient(180deg, ${palette.peach} 0%, ${palette.rose} 90%)`;
      
      const pC = document.createElement('div');
      pC.className = 'tulip-petal p-center';
      pC.style.background = `linear-gradient(180deg, #fff2eb 0%, ${palette.rose} 85%)`;

      cup.appendChild(pL);
      cup.appendChild(pR);
      cup.appendChild(pC);
      head.appendChild(cup);
    } else if (type === 'daisy') {
      const palette = pastelColors.daisy[Math.floor(Math.random() * pastelColors.daisy.length)];
      for (let i = 0; i < 12; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.transform = `rotate(${i * 30}deg)`;
        petal.style.background = `linear-gradient(180deg, ${palette.petal} 0%, ${palette.cream} 100%)`;
        head.appendChild(petal);
      }
      const core = document.createElement('div');
      core.className = 'flower-core';
      head.appendChild(core);
    } else if (type === 'lavender') {
      const stalk = document.createElement('div');
      stalk.className = 'lavender-stalk';
      const palette = pastelColors.lavender[Math.floor(Math.random() * pastelColors.lavender.length)];
      for (let i = 0; i < 6; i++) {
        const bud = document.createElement('div');
        bud.className = 'lavender-bud';
        bud.style.background = `linear-gradient(135deg, ${palette.light} 0%, ${palette.dark} 100%)`;
        bud.style.transform = `scale(${1 - i * 0.08}) rotate(${i % 2 === 0 ? 10 : -10}deg)`;
        stalk.appendChild(bud);
      }
      head.appendChild(stalk);
    } else if (type === 'rose') {
      const palette = pastelColors.rose[Math.floor(Math.random() * pastelColors.rose.length)];
      const bloom = document.createElement('div');
      bloom.className = 'rose-bloom';

      const l1 = document.createElement('div');
      l1.className = 'rose-layer rose-layer-1';
      l1.style.background = `radial-gradient(circle, ${palette.l1} 0%, ${palette.l2} 100%)`;

      const l2 = document.createElement('div');
      l2.className = 'rose-layer rose-layer-2';
      l2.style.background = `radial-gradient(circle, #fff 0%, ${palette.l3} 100%)`;

      const l3 = document.createElement('div');
      l3.className = 'rose-layer rose-layer-3';
      
      const core = document.createElement('div');
      core.className = 'rose-core';

      bloom.appendChild(l1);
      bloom.appendChild(l2);
      bloom.appendChild(l3);
      bloom.appendChild(core);
      head.appendChild(bloom);
    }

    flower.appendChild(head);
    flower.appendChild(stem);

    // Hover & Click interaction
    flower.addEventListener('mouseenter', () => {
      playChime();
    });

    flower.addEventListener('click', (e) => {
      e.stopPropagation();
      playChime(Math.floor(Math.random() * 6));
      spawnRipple(e.clientX, e.clientY);
      showFlowerWish(flower);
      // Gentle bloom bounce
      head.style.transform = 'scale(1.25)';
      setTimeout(() => {
        head.style.transform = '';
      }, 400);
    });

    return flower;
  }

  /* ==========================================================
     POPULATE INITIAL GARDEN (3 Tầng hoa tạo chiều sâu không gian)
     ========================================================== */
  function populateGarden() {
    backLayer.innerHTML = '';
    midLayer.innerHTML = '';
    frontLayer.innerHTML = '';

    const width = window.innerWidth;
    const isMobile = width < 768;

    // Density based on screen size
    const backCount = isMobile ? 16 : 32;
    const midCount = isMobile ? 12 : 24;
    const frontCount = isMobile ? 8 : 16;

    // 1. Back Layer (Tầng hoa xa: nhỏ hơn, thân cao vừa, màu mờ dịu)
    for (let i = 0; i < backCount; i++) {
      const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const xPercent = (i / backCount) * 100 + (Math.random() * 4 - 2);
      const height = 110 + Math.random() * 65;
      const swayDuration = 4.2 + Math.random() * 2.2;
      const swayDelay = -(Math.random() * 6);
      const flower = createFlowerElement(type, height, swayDuration, swayDelay, xPercent);
      backLayer.appendChild(flower);
    }

    // 2. Mid Layer (Tầng hoa giữa: kích thước chuẩn, đa dạng sắc thái)
    for (let i = 0; i < midCount; i++) {
      const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const xPercent = (i / midCount) * 100 + (Math.random() * 5 - 2.5);
      const height = 150 + Math.random() * 95;
      const swayDuration = 3.6 + Math.random() * 1.8;
      const swayDelay = -(Math.random() * 6);
      const flower = createFlowerElement(type, height, swayDuration, swayDelay, xPercent);
      midLayer.appendChild(flower);
    }

    // 3. Front Layer (Tầng hoa cận cảnh: rõ nét, nổi bật)
    for (let i = 0; i < frontCount; i++) {
      const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const xPercent = (i / frontCount) * 100 + (Math.random() * 6 - 3);
      const height = 190 + Math.random() * 110;
      const swayDuration = 3.2 + Math.random() * 1.6;
      const swayDelay = -(Math.random() * 6);
      const flower = createFlowerElement(type, height, swayDuration, swayDelay, xPercent);
      frontLayer.appendChild(flower);
    }
  }

  /* ==========================================================
     INTERACTIVE PLANTING (Chạm để gieo hoa)
     ========================================================== */
  gardenWrapper.addEventListener('click', (e) => {
    // If click inside bottom dock, ignore
    if (e.target.closest('.garden-dock')) {
      return;
    }

    const rect = gardenWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;

    // Stem height is proportional to distance from bottom ground
    const groundY = rect.height - 30;
    const stemHeight = Math.max(80, Math.min(320, groundY - y));

    const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
    const swayDuration = 3.5 + Math.random() * 1.5;
    const swayDelay = -(Math.random() * 4);

    const flower = createFlowerElement(type, stemHeight, swayDuration, swayDelay, xPercent, true);
    midLayer.appendChild(flower);

    // Audio & Visual feedback
    initAudio();
    playChime();
    spawnRipple(e.clientX, e.clientY);
    createFloatingPetals(e.clientX, e.clientY, 8);
    showFlowerWish(flower);
  });

  // Ripple effect on click
  function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '12px';
    ripple.style.height = '12px';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.border = '2px solid rgba(244, 172, 183, 0.7)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '99';
    ripple.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.width = '70px';
      ripple.style.height = '70px';
      ripple.style.opacity = '0';
    });

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /* ==========================================================
     AMBIENT PARTICLES & FLOATING PETALS (Canvas)
     ========================================================== */
  let width, height;
  const particles = [];
  const maxParticles = 65;

  function resizeCanvas() {
    width = ambientCanvas.width = window.innerWidth;
    height = ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => {
    resizeCanvas();
    populateGarden();
  });
  resizeCanvas();

  class Particle {
    constructor(x, y, isBurst = false) {
      this.reset(x, y, isBurst);
    }

    reset(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : (isBurst ? y : Math.random() * height);
      this.size = Math.random() * 6 + 4;
      this.speedY = isBurst ? (Math.random() * -3 - 1) : (Math.random() * 0.8 + 0.3);
      this.speedX = (Math.random() * 1.5 - 0.2);
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() * 0.03 - 0.015);
      this.opacity = Math.random() * 0.6 + 0.2;
      this.color = ['#fcd5ce', '#ffd7ba', '#fed0bb', '#f7cad0', '#e2d4f0', '#fff9ed'][Math.floor(Math.random() * 6)];
      this.isPetal = Math.random() > 0.4;
      this.isBurst = isBurst;
      this.life = isBurst ? 90 : Infinity;
    }

    update(windFactor) {
      this.y += this.speedY;
      this.x += (this.speedX + 0.5) * windFactor;
      this.angle += this.angularSpeed;

      if (this.isBurst) {
        this.life--;
        this.opacity *= 0.98;
        if (this.life <= 0) return false;
      } else {
        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
        }
        if (this.x > width + 20) {
          this.x = -20;
        }
      }
      return true;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      if (this.isPetal) {
        // Draw soft petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw glowing light mote / pollen
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Populate ambient particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function createFloatingPetals(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x + (Math.random() * 20 - 10), y + (Math.random() * 20 - 10), true));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    const windFactor = windModes[currentWindIndex].particleSpeed;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const alive = p.update(windFactor);
      if (!alive) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* ==========================================================
     BUTTERFLIES FLIGHT PATH (Bay lượn nhẹ nhàng)
     ========================================================== */
  function moveButterfly(butterfly) {
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight * 0.65;
    const targetX = 50 + Math.random() * maxX;
    const targetY = 80 + Math.random() * maxY;
    const rotation = (Math.random() * 40 - 20);

    butterfly.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg)`;

    const nextHop = 2500 + Math.random() * 3000;
    setTimeout(() => moveButterfly(butterfly), nextHop);
  }
  setTimeout(() => moveButterfly(butterfly1), 500);
  setTimeout(() => moveButterfly(butterfly2), 2000);

  /* ==========================================================
     CONTROLS: WIND, THEME, REPLANT, AUDIO
     ========================================================== */
  // 1. Wind intensity
  btnWind.addEventListener('click', () => {
    currentWindIndex = (currentWindIndex + 1) % windModes.length;
    const mode = windModes[currentWindIndex];
    document.documentElement.style.setProperty('--wind-factor', mode.factor);
    windLabel.textContent = t().winds[currentWindIndex];
    btnWind.classList.toggle('active', currentWindIndex === 1);
    initAudio();
    playChime();
  });

  // 2. Theme Switcher (Sunrise / Sunset / Moonlight)
  btnTheme.addEventListener('click', () => {
    document.body.classList.remove(themes[currentThemeIndex].name);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.body.classList.add(newTheme.name);
    themeIcon.textContent = newTheme.icon;
    themeLabel.textContent = t().themes[currentThemeIndex];
    initAudio();
    playChime();
  });

  // 3. Tưới nước (Watering - Refresh Garden)
  btnReplant.addEventListener('click', () => {
    initAudio();
    // Play harp arpeggio
    [0, 1, 2, 3, 4, 5].forEach((idx, i) => {
      setTimeout(() => playChime(idx), i * 90);
    });

    // Animate all flowers with a happy sprout wave
    const flowers = document.querySelectorAll('.flower-item');
    flowers.forEach((f, i) => {
      setTimeout(() => {
        f.classList.remove('sprouting');
        void f.offsetWidth; // Trigger reflow
        f.classList.add('sprouting');
      }, (i % 15) * 40);
    });

    // Shower of fresh petals from center
    createFloatingPetals(window.innerWidth / 2, window.innerHeight * 0.4, 25);
  });

  // 4. Audio Toggle
  btnAudio.addEventListener('click', () => {
    initAudio();
    audioEnabled = !audioEnabled;
    btnAudio.classList.toggle('active', audioEnabled);
    btnAudio.setAttribute('aria-pressed', String(audioEnabled));
    audioIcon.textContent = audioEnabled ? '🎵' : '🔔';
    audioLabel.textContent = audioEnabled ? t().audioOn : t().audioOff;
    if (audioEnabled) {
      playChime(0);
      playChime(2);
      playChime(4);
    }
  });

  // 5. Language Switcher
  const langSwitch = document.getElementById('langSwitch');

  function applyLanguage(lang) {
    currentLang = lang;
    const dict = t();
    document.documentElement.lang = lang;
    document.title = dict.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = dict[el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = dict[el.dataset.i18nTitle];
      el.setAttribute('aria-label', dict[el.dataset.i18nTitle]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', dict[el.dataset.i18nAria]);
    });
    langSwitch.setAttribute('aria-label', dict.langAria);

    windLabel.textContent = dict.winds[currentWindIndex];
    themeLabel.textContent = dict.themes[currentThemeIndex];
    audioLabel.textContent = audioEnabled ? dict.audioOn : dict.audioOff;

    langSwitch.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Lời nhắn đang mở sẽ đổi sang ngôn ngữ mới
    if (lastWishIndex >= 0) {
      bubbleText.textContent = dict.wishes[lastWishIndex];
    }

    try {
      localStorage.setItem('garden-lang', lang);
    } catch (e) {
      // Bỏ qua nếu không lưu được
    }
  }

  langSwitch.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn || btn.dataset.lang === currentLang) return;
    applyLanguage(btn.dataset.lang);
    initAudio();
    playChime();
  });

  /* ==========================================================
     SHOW FLOWER WISH (Hiện lời nhắn khi ấn vào bông hoa)
     ========================================================== */
  function showFlowerWish(flowerElement) {
    if (!flowerBubble || !bubbleText) return;

    // Lấy ngẫu nhiên câu chúc không bị lặp liên tiếp
    let nextIndex;
    const wishes = t().wishes;
    do {
      nextIndex = Math.floor(Math.random() * wishes.length);
    } while (nextIndex === lastWishIndex && wishes.length > 1);
    lastWishIndex = nextIndex;
    const wish = wishes[nextIndex];

    const headElement = flowerElement.querySelector('.flower-head') || flowerElement;
    const rect = headElement.getBoundingClientRect();

    let left = rect.left + rect.width / 2;
    let top = rect.top - 14;

    bubbleText.textContent = wish;

    // Giữ bóng thoại không bị tràn màn hình (đo theo bề rộng thật của bóng)
    const screenWidth = window.innerWidth;
    const halfBubble = flowerBubble.offsetWidth / 2 + 12;
    left = Math.max(halfBubble, Math.min(screenWidth - halfBubble, left));

    // Không để bóng thoại đè lên tiêu đề phía trên
    const minTop = flowerBubble.offsetHeight + 16;
    flowerBubble.classList.toggle('below', top < minTop);
    if (top < minTop) {
      top = rect.bottom + 14;
    }

    // Mũi tên luôn chỉ đúng vào bông hoa dù bóng thoại bị dịch ngang
    const flowerX = rect.left + rect.width / 2;
    const arrowX = Math.max(22, Math.min(flowerBubble.offsetWidth - 22, flowerX - left + flowerBubble.offsetWidth / 2));
    flowerBubble.style.setProperty('--arrow-x', `${arrowX}px`);

    flowerBubble.style.left = `${left}px`;
    flowerBubble.style.top = `${top}px`;

    // Kích hoạt hiệu ứng xuất hiện
    flowerBubble.classList.remove('active');
    void flowerBubble.offsetWidth; // Force reflow
    flowerBubble.classList.add('active');

    // Tự biến mất sau 4.5 giây
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      flowerBubble.classList.remove('active');
    }, 4500);
  }

  // Ẩn bóng thoại khi chạm ra ngoài
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.flower-item')) {
      flowerBubble.classList.remove('active');
    }
  });

  // Nhấn Esc để đóng lời nhắn
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') flowerBubble.classList.remove('active');
  });

  // Tự động tìm và xoá badge 'Powered by Netlify' nếu bị chèn vào trang
  // (chỉ kiểm tra các node mới được thêm thay vì quét toàn trang liên tục)
  const removeNetlifyBadge = (root) => {
    if (!(root instanceof HTMLElement) || root.closest('.garden-wrapper')) return;
    const text = root.textContent || '';
    if (text.includes('Powered by Netlify') && root !== document.body) {
      root.remove();
    }
  };
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach(removeNetlifyBadge));
  }).observe(document.body, { childList: true, subtree: true });

  // Initialize Garden
  applyLanguage(currentLang);
  populateGarden();
})();
