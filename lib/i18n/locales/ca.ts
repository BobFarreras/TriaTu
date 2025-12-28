export const ca = {
  common: {
    loading: 'Pensant...',
    error: 'Alguna cosa ha anat malament',
    start_over: 'Tornar a començar',
    switch_lang: 'Canviar idioma'
  },
  dashboard: {
    level: 'Nivell 1: La vida fàcil',
    config: 'Configuració',
    quick_decision: 'Decisió Ràpida',
    create_room: 'Crear Sala',
    create_desc: 'Convida amics i decidiu junts',
    join_room: 'Unir-se',
    join_desc: 'Tens un codi d\'invitació?',
    active_rooms_title: 'Les teves Sales',
    active_rooms_empty: 'No tens cap sala activa.',
    continue_btn: 'Continuar'
  },
  decision: {
    // --- NOVES CLAUS NECESSÀRIES ---
    title_food: 'Què mengem avui? 🍽️',
    energy_label: 'Nivell d\'Energia',
    time_label: 'Temps disponible',
    button_decide: '🎲 Decideix per mi!',
    disclaimer: '*Sense devolucions, el destí és definitiu.',

    // Resultat
    fate_spoken: 'El destí ha parlat',
    why: 'Per què?',
    roll_again: '🔄 Tornar a tirar',

    // Etiquetes dinàmiques d'energia
    energy_levels: {
      low: 'Mode peresa',
      mid: 'Ni fu ni fa',
      high: 'A menjar-se el món!'
    },
    // ✅ NOVES CLAUS PER A LES RAONS
    reasons: {
      high_energy: "Tens bona energia! He triat alguna cosa dels teus favorits a l'atzar.",
      low_energy: "Energia baixa detectada. He triat una opció fàcil i reconfortant.",
      balanced: "Una opció equilibrada per al temps que tens.",
      random: "El destí ha decidit completament a l'atzar.",
      default: "Sembla una bona opció per ara."
    }
  },
  room: {
    // General
    back_home: '← Tornar a l\'inici',
    new_room_title: 'Nova Sala',
    id_label: 'ID',

    // Header
    copy_code: 'Copiar Codi',
    code_copied: 'Codi copiat al porta-retalls! 📋',
    kick_confirm: 'Vols expulsar aquest jugador?',
    host_badge: '👑 Host',
    you_badge: 'Tu',
    user_prefix: 'User',

    // Controls
    mode_auto: '✨ AUTO',
    mode_manual: '📝 MANUAL',

    // Visibility
    voting_blind: 'Votació Oculta',
    voting_public: 'Votació Pública',
    blind_desc: 'Ningú veu les opcions dels altres.',
    public_desc: 'Tothom veu el que s\'escriu.',
    btn_change: 'Canviar',

    // Candidates
    empty_options: 'Encara no hi ha opcions',
    input_placeholder: 'Escriu una opció...',
    add_btn: 'Afegir',
    hidden_candidate: '??????',

    // Magic Mode
    magic_title: 'El Destí Mana',
    magic_desc: 'L\'algoritme analitzarà els perfils de menjar de tots els participants per trobar la coincidència matemàtica perfecta.',

    // Actions
    decide_magic: '✨ Fer Màgia i Decidir',
    decide_roll: '🎲 Tirar els Daus!',
    waiting_host: 'Esperant al Host...',

    // History
    history_title: 'Historial',
    trophy_empty_title: 'Sala de Trofeus buida',
    trophy_empty_desc: 'Encara no s\'ha pres cap decisió.',
    wall_fame: 'Mur de la Fama',
    view_more: '✨ Veure {count} victòries més...',
    clean_room: '💣 Netejar sala',
    clean_confirm: 'Segur que vols esborrar l\'historial?',

    // Errors
    err_kick: 'Error expulsant usuari',
    err_clean: 'Error netejant historial',
    err_add: 'Error afegint opció',
    err_general: 'Error desconegut'
  },
  landing: {
    // Frases del carrusel (Typewriter)
    phrases: [
      { text: "No sé, decideix tu...", emoji: "🙄" },
      { text: "A mi m'és igual, de debò...", emoji: "🥱" },
      { text: "On anem a sopar?", emoji: "😫" },
      { text: "Una altra vegada pizza?", emoji: "🍕" },
      { text: "Tria tu que jo no vull pensar", emoji: "🤯" }
    ],
    // Hero Principal
    hero_title: 'Adéu a perdre temps decidint.',
    hero_subtitle: 'Hola a quedar més i pensar menys.',

    // Botons
    btn_login: 'Ja tinc compte',
    btn_start: '🚀 COMENÇAR'
  },
  auth: {
    // Shared
    email_label: 'Email',
    email_placeholder: 'nom@exemple.com',
    password_label: 'Contrasenya',
    password_placeholder: '••••••••',
    password_min: 'Mínim 6 caràcters',
    back: 'ENRERE',

    // Login
    login_title: 'Hola de nou!',
    login_subtitle: 'La teva sala t\'espera.',
    forgot_password: 'Has oblidat la contrasenya?',
    login_btn: 'ENTRAR',
    no_account: 'No tens compte?',
    register_link: "Registra't aquí",

    // Register
    register_title: 'Uneix-te al club',
    register_subtitle: 'Comença l\'aventura avui.',
    register_btn: 'CREAR COMPTE',
    has_account: 'Ja tens compte?',
    login_link: 'Entra per aquí'
  },
  // ✅ NOVES CLAUS PER A CREAR/UNIR
  create_room: {
    back_cancel: '← CANCEL·LAR',
    hero_title: 'Nova Aventura',
    hero_subtitle: 'Crea un espai per decidir amb el teu grup.',
    label_name: 'Nom de la Sala',
    placeholder_name: 'ex: Sopar de Divendres 🍕',
    btn_create: '🪄 CREAR SALA',
    host_info: 'Tu seràs l\'amfitrió (Host) 👑',
    err_name_required: 'El nom de la sala és obligatori.',
    err_unknown: 'Error desconegut al crear la sala.'
  },

  join_room: {
    back: '← ENRERE',
    hero_title: 'Tens una invitació?',
    hero_subtitle: 'Introdueix el codi per unir-te a la festa.',
    label_code: 'CODI DE LA SALA (UUID)',
    placeholder_code: 'enganxa-ho-aqui...',
    btn_join: 'ENTRAR ARA 🍿',
    err_code_required: 'El codi és obligatori.'
  },
  profile: {
    back: '🔙',
    title: 'El teu Personatge',
    subtitle: 'Configuració del perfil',
    saved: '✅ Guardat!',
    save_btn: '💾 Guardar Canvis',

    // Secció 1: Menjar
    menu_title: 'El teu Menú',
    menu_desc: 'Què t\'agrada menjar habitualment?',
    search_food: '🍕 Buscar menjar (ex: Sushi...)',

    // Secció 2: Exclusions
    blacklist_title: 'La Llista Negra',
    blacklist_desc: 'Al·lèrgies i coses que no suportes.',
    search_allergy: '🥜 Buscar al·lèrgia (ex: Gluten...)',
    warning_title: '⚠️ Altres Restriccions',
    warning_text: 'T\'has deixat alguna cosa important?',
    warning_example: 'Ex: Coriandre, Préssec, Colorant E-120...',
    warning_placeholder: 'Escriu aquí i prem Enter...',

    // Secció 3: Tolerància
    flexibility_title: 'Flexibilitat',
    flexibility_desc: 'Com de fàcil ets de convèncer?',
    rigid: 'Rígid',
    flexible: 'Flexible',
    levels: {
      low: 'NO NEGOCIABLE',
      mid: 'NI FU NI FA',
      high: 'M\'ADAPTO A TOT'
    },

    // --- DADES MESTRES COMPLETES ---
    food: {
      // Categories
      cat_world_west: "🌍 Cuines del Món (Europa & Amèrica)",
      cat_world_east: "🥢 Cuines del Món (Àsia & Orient)",
      cat_fast: "🍔 Fast Food & Casual",
      cat_specific: "🍣 Plats Específics i Delicatessen",
      cat_healthy: "🥗 Saludable i Lleuger",
      cat_sweet: "🧁 Esmorzars i Dolços",

      // Items (World West)
      italian: 'Italiana',
      mediterranean: 'Mediterrània',
      spanish: 'Espanyola',
      french: 'Francesa',
      greek: 'Grega',
      mexican: 'Mexicana',
      american: 'Americana',
      brazilian: 'Brasilera',
      peruvian: 'Peruana',
      argentinian: 'Argentina',
      german: 'Alemanya',

      // Items (World East)
      japanese: 'Japonesa',
      chinese: 'Xinesa',
      indian: 'Índia',
      thai: 'Tailandesa',
      korean: 'Coreana',
      vietnamese: 'Vietnamita',
      turkish: 'Turca',
      lebanese: 'Libanesa',
      poke: 'Hawaiana (Poke)',

      // Items (Fast Food)
      pizza: 'Pizza',
      burger: 'Hamburguesa',
      fried_chicken: 'Pollastre Fregit',
      kebab: 'Kebab/Dürüm',
      hotdog: 'Frankfurt/Hot Dog',
      tacos: 'Tacos/Burritos',
      sandwich: 'Entrepans/Wraps',
      crepes: 'Creps',
      empanadas: 'Empanades',

      // Items (Specific)
      sushi: 'Sushi',
      ramen: 'Ramen',
      steak: 'Carn a la brasa',
      seafood_dish: 'Mariscada',
      paella: 'Paella/Arròs',
      pasta: 'Pasta',
      bbq: 'Barbacoa/Costelles',
      dimsum: 'Dim Sum/Gyozas',
      fondue: 'Fondue/Raclette',

      // Items (Healthy)
      salad: 'Amanides',
      poke_bowl: 'Poke Bowl',
      soup: 'Sopes/Cremes',
      vegan_dish: 'Plats Vegans',
      smoothies: 'Smoothies/Fruita',
      grilled_fish: 'Peix a la planxa',

      // Items (Sweet)
      breakfast: 'Brunch',
      croissant: 'Pastisseria',
      ice_cream: 'Gelat',
      coffee: 'Cafeteria',
      bubble_tea: 'Bubble Tea',
      donuts: 'Donuts/Berlines'
    },

    exclusions: {
      // Categories
      cat_allergens: "⚠️ Les 14 Al·lèrgens Principals (UE)",
      cat_diets: "🚫 Dietes i Estils de Vida",
      cat_dislikes: "❌ Intoleràncies i Aversions Comuns",

      // Allergens
      gluten: 'Gluten',
      crustaceans: 'Crustacis',
      eggs: 'Ous',
      fish: 'Peix',
      peanuts: 'Cacauets',
      soybeans: 'Soja',
      dairy: 'Llet/Lactosa',
      nuts: 'Fruits de closca',
      celery: 'Api',
      mustard: 'Mostassa',
      sesame: 'Sèsam',
      sulphites: 'Sulfits',
      lupin: 'Tramussos',
      molluscs: 'Mol·luscs',

      // Diets
      vegan: 'Vegà (Sense animals)',
      vegetarian: 'Vegetarià',
      pescatarian: 'Pescatarià',
      halal: 'Halal',
      kosher: 'Kosher',
      keto: 'Keto (Baix carbs)',
      paleo: 'Paleo',
      low_fodmap: 'Low FODMAP',

      // Intolerances/Dislikes
      onion: 'Ceba',
      garlic: 'All',
      spicy: 'Picant',
      cilantro: 'Cilandre',
      mushrooms: 'Bolets',
      pork: 'Porc',
      beef: 'Vedella',
      alcohol: 'Alcohol',
      caffeine: 'Cafeïna',
      sugar: 'Sucre afegit',
      fructose: 'Fructosa',
      bell_pepper: 'Pebrot',
      coconut: 'Coco',
      cucumber: 'Cogombre'
    }
  }
};