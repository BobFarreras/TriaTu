export const ca = {
  common: {
    loading: 'Pensant...',
    error: 'Alguna cosa ha anat malament',
    start_over: 'Tornar a començar',
    switch_lang: 'Canviar idioma'
  },
  dashboard: {
    nav: {
      multiplayer_badge: 'MULTIPLAYER',
      guest_badge: 'GUEST',
      recipes: 'Comunitat Receptes',
      recipes_badge: 'Social',
      ranking: 'Rànquing Usuaris',
      ranking_badge: 'Top Xefs',
      my_rooms: 'Les Meves Sales',
      my_rooms_badge: 'Actius',
      inventory: 'El meu Inventari',
      inventory_badge: 'Rebost',
      profile: 'El meu Perfil',
      profile_badge: 'Configuració'
    },
    rooms_card: {
      hub: 'SOCIAL HUB',
      title: 'Les Meves Sales',
      desc: 'Gestiona, crea o uneix-te'
    },
    // --- NOVES CLAUS UI ---
    greeting: 'Hola,',
    // ----------------------
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
    title_food: 'Què mengem avui? 🍽️',
    energy_label: 'Nivell d\'Energia',
    time_label: 'Temps disponible',
    button_decide: '🎲 Decideix per mi!',
    disclaimer: '*Sense devolucions, el destí és definitiu.',

    // Resultat
    fate_spoken: 'El destí ha parlat',
    why: 'Per què?',
    roll_again: '🔄 Tornar a tirar',

    // --- NOVES CLAUS UI NECESSÀRIES PER AL COMPONENT ---
    results: {
      fate: '🎲 Resultat',
      chef: '👨‍🍳 Propostes',
      back: 'Tornar'
    },
    mobile: {
      fast_mode: 'Mode Ràpid',
      actions: 'Obrir Accions'
    },
    selector: {
      fate: 'DESTÍ',
      chef: 'XEF'
    },
    states: {
      error_title: 'Ups! Alguna cosa ha fallat',
      fate_title: 'Avui cuina la sort',
      fate_desc: 'Deixa la ment en blanc. Triarem per tu.',
      chef_title: 'Menú Intel·ligent',
      chef_desc: 'Analitzem el teu inventari per suggerir plats.'
    },
    actions: {
      generate_menu: 'GENERAR MENÚ',

      surprise_me: 'SORPRÈN-ME!' // ✅ NOVA CLAU
    },
    // ----------------------------------------------------

    energy_levels: {
      low: 'Mode peresa',
      mid: 'Ni fu ni fa',
      high: 'A menjar-se el món!'
    },
    reasons: {
      high_energy: "Tens bona energia! He triat alguna cosa dels teus favorits a l'atzar.",
      low_energy: "Energia baixa detectada. He triat una opció fàcil i reconfortant.",
      balanced: "Una opció equilibrada per al temps que tens.",
      random: "El destí ha decidit completament a l'atzar.",
      default: "Sembla una bona opció per ara."
    }


  },
  room: {
    // ... (Mantén el teu contingut de room intacte)
    back_home: '← Tornar a l\'inici',
    new_room_title: 'Nova Sala',
    id_label: 'ID',
    copy_code: 'Copiar Codi',
    code_copied: 'Codi copiat al porta-retalls! 📋',
    kick_confirm: 'Vols expulsar aquest jugador?',
    host_badge: '👑 Host',
    you_badge: 'Tu',
    user_prefix: 'User',
    mode_auto: '✨ AUTO',
    mode_manual: '📝 MANUAL',
    voting_blind: 'Votació Oculta',
    voting_public: 'Votació Pública',
    blind_desc: 'Ningú veu les opcions dels altres.',
    public_desc: 'Tothom veu el que s\'escriu.',
    btn_change: 'Canviar',
    empty_options: 'Encara no hi ha opcions',
    input_placeholder: 'Escriu una opció...',
    add_btn: 'Afegir',
    hidden_candidate: '??????',
    magic_title: 'El Destí Mana',
    magic_desc: 'L\'algoritme analitzarà els perfils de menjar de tots els participants per trobar la coincidència matemàtica perfecta.',
    decide_magic: '✨ Fer Màgia i Decidir',
    decide_roll: '🎲 Tirar els Daus!',
    waiting_host: 'Esperant al Host...',
    history_title: 'Historial',
    trophy_empty_title: 'Sala de Trofeus buida',
    trophy_empty_desc: 'Encara no s\'ha pres cap decisió.',
    wall_fame: 'Mur de la Fama',
    view_more: '✨ Veure {count} victòries més...',
    clean_room: '💣 Netejar sala',
    clean_confirm: 'Segur que vols esborrar l\'historial?',
    err_kick: 'Error expulsant usuari',
    err_clean: 'Error netejant historial',
    err_add: 'Error afegint opció',
    err_general: 'Error desconegut'
  },
  landing: {
    // ... (Mantén el teu contingut de landing)
    phrases: [
      { text: "No sé, decideix tu...", emoji: "🙄" },
      { text: "A mi m'és igual, de debò...", emoji: "🥱" },
      { text: "On anem a sopar?", emoji: "😫" },
      { text: "Una altra vegada pizza?", emoji: "🍕" },
      { text: "Tria tu que jo no vull pensar", emoji: "🤯" }
    ],
    hero_title: 'Adéu a perdre temps decidint.',
    hero_subtitle: 'Hola a quedar més i pensar menys.',
    btn_login: 'Ja tinc compte',
    btn_start: '🚀 COMENÇAR'
  },
  auth: {
    // ... (Mantén el teu contingut de auth)
    email_label: 'Email',
    email_placeholder: 'nom@exemple.com',
    password_label: 'Contrasenya',
    password_placeholder: '••••••••',
    password_min: 'Mínim 6 caràcters',
    back: 'ENRERE',
    login_title: 'Hola de nou!',
    login_subtitle: 'La teva sala t\'espera.',
    forgot_password: 'Has oblidat la contrasenya?',
    login_btn: 'ENTRAR',
    no_account: 'No tens compte?',
    register_link: "Registra't aquí",
    register_title: 'Uneix-te al club',
    register_subtitle: 'Comença l\'aventura avui.',
    register_btn: 'CREAR COMPTE',
    has_account: 'Ja tens compte?',
    login_link: 'Entra per aquí'
  },
  create_room: {
    // ... (Mantén el teu contingut)
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
    // ... (Mantén el teu contingut)
    back: '← ENRERE',
    hero_title: 'Tens una invitació?',
    hero_subtitle: 'Introdueix el codi per unir-te a la festa.',
    label_code: 'CODI DE LA SALA (UUID)',
    placeholder_code: 'enganxa-ho-aqui...',
    btn_join: 'ENTRAR ARA 🍿',
    err_code_required: 'El codi és obligatori.'
  },
  profile: {
    // Identitat
    chef_name: 'Nom de Xef',
    chef_placeholder: 'Ex: Chef Ramsay',
    chef_hint: 'Aquest és el nom que veuran els altres al Rànquing.',

    // Seccions
    menu_title: 'Menú Preferit',
    menu_desc: "Què t'agrada?",
    blacklist_title: 'Exclusions',
    blacklist_desc: 'Prohibit entrar',

    // Extres
    extra_label: 'Extra',
    warning_title: "T'has deixat alguna cosa?",
    warning_placeholder: 'Escriu i prem Enter',

    // Tolerància
    flexibility_title: 'Nivell de Flexibilitat',
    rigid: 'RÍGID',
    flexible: 'FLEXIBLE',

    // Botons

    back: '🔙',
    title: 'El teu Personatge',
    subtitle: 'Configuració del perfil',
    saved: '✅ Guardat!',
    save_btn: '💾 Guardar Canvis',
    sidebar: {
      edit: 'Editar Perfil',
      likes: 'GUSTOS',
      alerts: 'ALERTA'
    },
    // --- NOVA CLAU UI ---
    no_data: 'Sense dades...',
    // --------------------

    search_food: '🍕 Buscar menjar (ex: Sushi...)',

    search_allergy: '🥜 Buscar al·lèrgia (ex: Gluten...)',

    warning_text: 'T\'has deixat alguna cosa important?',
    warning_example: 'Ex: Coriandre, Préssec, Colorant E-120...',

    flexibility_desc: 'Com de fàcil ets de convèncer?',

    levels: {
      low: 'NO NEGOCIABLE',
      mid: 'NI FU NI FA',
      high: 'M\'ADAPTO A TOT'
    },

    food: {
      // Copia tot el teu objecte food aquí (és molt llarg per repetir-lo sencer, però no canvia)
      cat_world_west: "🌍 Cuines del Món (Europa & Amèrica)",
      cat_world_east: "🥢 Cuines del Món (Àsia & Orient)",
      cat_fast: "🍔 Fast Food & Casual",
      cat_specific: "🍣 Plats Específics i Delicatessen",
      cat_healthy: "🥗 Saludable i Lleuger",
      cat_sweet: "🧁 Esmorzars i Dolços",
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
      japanese: 'Japonesa',
      chinese: 'Xinesa',
      indian: 'Índia',
      thai: 'Tailandesa',
      korean: 'Coreana',
      vietnamese: 'Vietnamita',
      turkish: 'Turca',
      lebanese: 'Libanesa',
      poke: 'Hawaiana (Poke)',
      pizza: 'Pizza',
      burger: 'Hamburguesa',
      fried_chicken: 'Pollastre Fregit',
      kebab: 'Kebab/Dürüm',
      hotdog: 'Frankfurt/Hot Dog',
      tacos: 'Tacos/Burritos',
      sandwich: 'Entrepans/Wraps',
      crepes: 'Creps',
      empanadas: 'Empanades',
      sushi: 'Sushi',
      ramen: 'Ramen',
      steak: 'Carn a la brasa',
      seafood_dish: 'Mariscada',
      paella: 'Paella/Arròs',
      pasta: 'Pasta',
      bbq: 'Barbacoa/Costelles',
      dimsum: 'Dim Sum/Gyozas',
      fondue: 'Fondue/Raclette',
      salad: 'Amanides',
      poke_bowl: 'Poke Bowl',
      soup: 'Sopes/Cremes',
      vegan_dish: 'Plats Vegans',
      smoothies: 'Smoothies/Fruita',
      grilled_fish: 'Peix a la planxa',
      breakfast: 'Brunch',
      croissant: 'Pastisseria',
      ice_cream: 'Gelat',
      coffee: 'Cafeteria',
      bubble_tea: 'Bubble Tea',
      donuts: 'Donuts/Berlines'
    },
    exclusions: {
      cat_allergens: "⚠️ Les 14 Al·lèrgens Principals (UE)",
      cat_diets: "🚫 Dietes i Estils de Vida",
      cat_dislikes: "❌ Intoleràncies i Aversions Comuns",
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
      vegan: 'Vegà (Sense animals)',
      vegetarian: 'Vegetarià',
      pescatarian: 'Pescatarià',
      halal: 'Halal',
      kosher: 'Kosher',
      keto: 'Keto (Baix carbs)',
      paleo: 'Paleo',
      low_fodmap: 'Low FODMAP',
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
  },
  food: {
    categories: {
      protein: '🥩 Proteïna',
      veggie: '🥦 Verdura',
      fruit: '🍎 Fruita',
      dairy: '🥛 Lactic',
      cereal: '🥖 Cereals',
      drink: '🥤 Beguda',
      snack: '🍪 Snack',
      spice: '🧂 Condiments'
    },
    items: {
      // 🍎 FRUITA
      f1: 'Poma vermella',
      f2: 'Poma verda',
      f3: 'Poma groga',
      f4: 'Plàtan',
      f5: 'Plàtan mascle',
      f6: 'Pera conference',
      f7: 'Pera blanquilla',
      f8: 'Taronja',
      f9: 'Mandarina',
      f10: 'Llimona',
      f11: 'Llima',
      f12: 'Aranja',
      f13: 'Maduixa',
      f14: 'Nabius',
      f15: 'Cireres',
      f16: 'Raïm blanc',
      f17: 'Raïm negre',
      f18: 'Préssec',
      f19: 'Nectarina',
      f20: 'Paraguaià',
      f21: 'Pruna',
      f22: 'Albercoc',
      f23: 'Kiwi verd',
      f24: 'Kiwi groc',
      f25: 'Pinya',
      f26: 'Mango',
      f27: 'Meló',
      f28: 'Síndria',
      f29: 'Coco',
      f30: 'Codony',
      f31: 'Figa',
      f32: 'Dàtil fresc',

      // 🥦 VERDURA
      v1: 'Pastanaga',
      v2: 'Patata',
      v3: 'Ceba blanca',
      v4: 'Ceba morada',
      v5: 'All',
      v6: 'Tomàquet madur',
      v7: 'Tomàquet cherry',
      v8: 'Bròquil',
      v9: 'Cogombre',
      v10: 'Enciam iceberg',
      v11: 'Enciam romà',
      v12: 'Enciam fulla de roure',
      v13: 'Espinacs frescos',
      v14: 'Rúcula',
      v15: 'Albergínia',
      v16: 'Pebrot verd',
      v17: 'Pebrot vermell',
      v18: 'Pebrot groc',
      v19: 'Carbassó',
      v20: 'Coliflor',
      v21: 'Col verda',
      v22: 'Col llombarda',
      v23: 'Gingebre',
      v24: 'Nap',
      v25: 'Remolatxa',
      v26: 'Blat de moro',
      v27: 'Pèsols',
      v28: 'Mongetes verdes',
      v29: 'Xampinyons',
      v30: 'Bolets variats',

      // 🥩 PROTEÏNA
      p1: 'Pollastre sencer',
      p2: 'Pit de pollastre',
      p3: 'Cuixes de pollastre',
      p11: 'Aletes de pollastre',
      p12: 'Vedella fresca',
      p13: 'Vedella picada',
      p14: 'Entrecot de vedella',
      p15: 'Filet de vedella',
      p16: 'Llom de porc',
      p17: 'Costelles de porc',
      p18: 'Carn picada de porc',
      p19: 'Bacon',
      p20: 'Xai (cuixa)',
      p21: 'Costelles de xai',
      p22: 'Lluç',
      p23: 'Bacallà fresc',
      p24: 'Bacallà dessalat',
      p25: 'Orada',
      p26: 'Llobarro',
      p27: 'Sardines',
      p28: 'Verat',
      p29: 'Salmó fresc',
      p30: 'Salmó congelat',
      p31: 'Tonyina fresca',
      p32: 'Gambes',
      p33: 'Calamar',
      p34: 'Musclos',
      p35: 'Llagostí',
      p36: 'Tonyina en conserva',
      p37: 'Sardines en conserva',
      p38: 'Ous',
      p39: 'Llenties cuites',
      p40: 'Cigrons cuits',
      p41: 'Tofu',

      // 🥛 LÀCTIC
      l1: 'Llet sencera',
      l2: 'Llet semi',
      l3: 'Llet desnatada',
      l4: 'Llet sense lactosa',
      l5: 'Formatge curat',
      l6: 'Formatge semicurat',
      l7: 'Formatge tendre',
      l8: 'Formatge ratllat',
      l9: 'Mozzarella',
      l10: 'Formatge parmesà',
      l11: 'Formatge fresc',
      l12: 'Formatge blau',
      l13: 'Iogurt natural',
      l14: 'Iogurt grec',
      l15: 'Iogurt de maduixa',
      l16: 'Flam',
      l17: 'Natilles',
      l18: 'Mantega',
      l19: 'Nata per cuinar',
      l20: 'Gelat',

      // 🥖 CEREALS
      c1: 'Pa blanc',
      c2: 'Pa integral',
      c3: 'Pasta espagueti',
      c4: 'Pasta macarrons',
      c5: 'Arròs blanc',
      c6: 'Barra de pa',
      c7: 'Croissant',
      c8: 'Bagel',
      c9: 'Pa de motlle',
      c10: 'Pasta fusilli',
      c11: 'Pasta penne',
      c12: 'Fideus',
      c13: 'Arròs integral',
      c14: 'Arròs basmati',
      c15: 'Arròs jazmín',
      c16: 'Cuscús',
      c17: 'Quinoa',
      c18: 'Cereals d’esmorzar',
      c19: 'Flocs de civada',
      c20: 'Muesli',
      c21: 'Farina de blat',
      c22: 'Farina integral',
      c23: 'Farina de civada',
      c24: 'Ensaïmada',
      c25: 'Pa de pessic',
      c26: 'Tortilles de blat',

      // 🥤 BEGUDA
      b1: 'Aigua',
      b2: 'Cafè mòlt',
      b3: 'Te',
      b4: 'Refresc cola',
      b5: 'Refresc taronja',
      b6: 'Refresc llimona',
      b7: 'Suc de taronja',
      b8: 'Suc de poma',
      b9: 'Cafè en gra',
      b10: 'Cafè soluble',
      b11: 'Infusions',
      b12: 'Beguda vegetal de civada',
      b13: 'Beguda vegetal d’ametlla',
      b14: 'Cervesa',
      b15: 'Vi',
      b16: 'Vi blanc',
      b17: 'Cava',
      b18: 'Vermut',
      b19: 'Tònica',
      co13: 'Brou de pollastre',
      co14: 'Brou de peix',

      // 🍪 SNACK
      s1: 'Galetes',
      s2: 'Xocolata negra',
      s3: 'Crispetes',
      s4: 'Ametlles',
      s5: 'Xocolata amb llet',
      s6: 'Xocolata blanca',
      s7: 'Caramels',
      s8: 'Pirulís',
      s9: 'Magdalena',
      s10: 'Dònut',
      s11: 'Bastonets salats',
      s12: 'Pretzels',
      s13: 'Patates fregides',
      s14: 'Nachos',
      s15: 'Avellanes',
      s16: 'Nous',
      s17: 'Anacards',
      s18: 'Cacauets',
      s19: 'Pipes de gira-sol',
      s20: 'Galetes salades',
      s21: 'Crackers',
      s22: 'Barretes de cereals',
      s23: 'Mel',

      // 🧂 CONDIMENTS
      co1: 'Oli d\'oliva verge',
      co2: 'Oli de gira-sol',
      co3: 'Sal',
      co4: 'Pebre negre',
      co5: 'Vinagre de vi',
      co6: 'Vinagre de mòdena',
      co7: 'Mantega',
      co8: 'Margarina',
      co9: 'Quètxup',
      co10: 'Maionesa',
      co11: 'Mostassa',
      co12: 'Melmelada',
      co15: 'Tomàquet fregit',

      // 🥖 CONGELATS RÀPIDS (Z)
      z1: 'Pizza congelada',
      z2: 'Patates pre-fregides',
      z3: 'Lassanya preparada',
      z4: 'Croquetes'
    }
  },
  community: {
    title: 'Comunitat',
    title_suffix: 'Foodie',
    subtitle: 'Explora què cuina la gent.',
    search_placeholder: 'Cercar ingredients...',
    filters: {
      all: 'Totes',
      fast: 'Ràpides',
      veggie: 'Vegetarià',
      vegan: 'Vegà',
      gluten_free: 'Sense Gluten',
      dairy_free: 'Sense Lactosa',
      dessert: 'Postres'
    },
    empty_state: 'No s\'han trobat receptes.',
    pagination: {
      page: 'Pàgina',
      of: 'de'
    },
    steps: {
      title: 'Instruccions',
      count_suffix: 'passos',
      empty: 'Sense passos detallats.'
    }
  },
  ranking: {
    top_label: 'TOP',
    title: 'Saló de la Fama',
    season: 'Temporada 1',
    aspirants: 'Aspirants',
    empty_list: 'Aquí no hi ha ningú... 👻',
    you_suffix: '(Tu)',
    points_abbr: 'PTS'
  },
  inventory: {
    header: {
      title_prefix: 'Revost',
      title_suffix: 'Digital',
      subtitle: "Control d'estoc i caducitats",
      items_label: 'ITEMS:'
    },
    dashboard: {
      title_all: "📦 Tot l'Inventari",
      title_expiring: "⚠️ Caduca Aviat",
      filter_prefix: "📂", // Prefix per a carpetes (ex: 📂 Nevera)
      clear_filter: "✕ Netejar",
      scan_btn: "Escanejar IA",
      add_btn: "Afegir",
      close_btn: "Tancar"
    },
    list: {
      empty_title: "👻",
      empty_text: "No s'han trobat aliments aquí.",
      status: {
        expired: "Caducat",
        expiring: "Caduca Aviat"
      }
    },
    scanner: {
      title_suffix: "Productes",
      subtitle: "Revisa abans de guardar",
      no_items: "No queden items.",
      back: "Tornar",
      photo_btn: "Foto",
      confirm_btn: "Confirmar tot",
      saving: "Guardant...",
      error_save: "Error guardant els items."
    },
    actions: {
      add: "Afegir",
      close: "Tancar",
      scan: "Escanejar IA",
      clear: "Netejar",
      save: "📥 Guardar al Rebost",
      saving: "Guardant..."
    },
    form: {
      add_title: "Afegir nou aliment",
      name_placeholder: "Què afegim al revost?",
      quantity_label: "Quantitat",
      location: {
        fridge: "Nevera",
        pantry: "Revost",
        freezer: "Congelador"
      },
      unit: {
        ut: "Unit",
        kg: "Kg",
        l: "L",
        g: "g"
      }
    },

    add_item: {
      main_btn: 'Afegir nou element',
      close_btn: 'Tancar escàner'
    }


  },
  social: {
    title: 'Zona Social',
    actions: {
      create_badge: 'NOVA',
      create_title: 'Crear Sala',
      join_badge: 'GUEST',
      join_title: 'Unir-me'
    },
    grid: {
      title: 'Sales Actives',
      empty: 'Cap sala activa encara.',
      role_admin: 'Admin',
      role_member: 'Membre'
    }
  },
  create_recipe: {
    steps: {
      title: 'Instruccions',
      placeholder: 'Escriu el pas aquí... (Clica els ingredients de sota per inserir-los)',
      quick_insert: 'Inserció ràpida:',
      timer: 'Temporitzador',
      add_timer: '+ ⏰ Temps',
      warning_ingredients: 'Afegeix primer els ingredients de l’esquerra',
      add_btn: 'Afegir Pas ↵',
      empty_state: 'El camí cap a l’èxit comença aquí',
      step_label: 'Pas'
    },
    ingredients: {
      title: 'Rebost Màgic',
      selected: 'seleccionats',
      search_placeholder: 'Què necessites? (ex: Tomàquet)',
      category_all: '🌍 Tot',
      empty_search: 'No hem trobat res... prova amb una altra categoria.',
      basket_title: 'La teva cistella:',
      basket_empty: 'Encara buida...',
      unit_select: 'ut' // Opcional si vols traduir unitats
    },
    form: {
      title: 'Nova Recepta',
      label_title: 'Títol',
      placeholder_title: 'Ex: Truita de patates',
      label_ingredients: 'Ingredients (separats per comes)',
      placeholder_ingredients: 'Ous, Patates, Oli, Sal',
      label_steps: 'Passos (un per línia)',
      placeholder_steps: 'Tallar patates\nFregir\nBatre els ous',
      submit_btn: 'Publicar Recepta',
      success: 'Recepta publicada!',
      error_generic: 'Error en publicar'
    },
    card: {
      view_sr: 'Veure',
      prep_time: 'm', // minuts
      created_by_you: 'Creat per tu',
      created_by_community: 'Comunitat'
    },
    editor: {
      btn_publish: 'PUBLICAR RECEPTA',
      btn_cooking: 'CUINANT...'
    },
    toasts: {
      missing_name: 'Ei! Com es diu aquesta meravella? 🤔',
      missing_ingredients: 'La màgia necessita ingredients! 🥕',
      missing_steps: 'Explica’ns el secret (els passos)! 📜',
      success_title: '✨ Recepta publicada!',
      success_desc: 'Ja està disponible per a la comunitat.',
      error_title: 'Ups! Alguna cosa ha fallat'
    },
    meta: {
      placeholder_name: 'Posa-li un nom èpic...',
      minutes_label: 'minuts',
      tags_title: 'Etiquetes',
      tags: {
        vegan: 'Vegà',
        vegetarian: 'Vegetarià',
        gluten_free: 'Sense gluten',
        dairy_free: 'Sense lactosa',
        quick: 'Ràpid',
        healthy: 'Saludable',
        dessert: 'Postres'
      }
    }


  },
  onboarding: {
    buttons: {
      next: "Següent",
      back: "Enrere",
      finish: "Entesos! 🚀",
      skip: "Saltar tour"
    },
    // Aquí posarem els textos específics de l'editor
    editor: {
      step1_title: "1. Bateja la teva creació",
      step1_desc: "Tot comença amb un bon nom. Escriu alguna cosa que faci venir gana!",

      step2_title: "2. El Temps és Or",
      step2_desc: "Quan trigarem? Sigues realista, no volem que se'ns cremi l'arròs.",

      step3_title: "3. Etiqueta-ho",
      step3_desc: "És Vegà? Sense Gluten? Picant? Ajuda a la gent a filtrar.",

      step4_title: "4. A la Cistella!",
      step4_desc: "Busca ingredients (ex: 'Ceba') i afegeix quantitats. Fes servir el teu inventari!",

      step5_title: "5. Gestió d'Ingredients",
      step5_desc: "Aquí veuràs la llista. Si t'equivoques, clica la icona per esborrar-los.",

      step6_title: "6. La Màgia (Pas a Pas)",
      step6_desc: "Explica com es fa. Sigues clar i concís.",

      step7_title: "7. Superpoder: Inserció Ràpida",
      step7_desc: "Clica aquests ingredients per afegir-los al text amb la seva icona. Queda súper pro!",

      step8_title: "8. Publicar",
      step8_desc: "Revisa-ho tot i prem el botó màgic per guardar."
    },
    dashboard: {
      step1_title: "Benvingut a la Cuina! 🏠",
      step1_desc: "Aquest és el teu centre de comandament. Des d'aquí pots gestionar-ho tot.",

      step2_title: "Preferències (Sidebar)",
      step2_desc: "Aquí veus què t'agrada i què no. Important per quan la IA et recomani receptes!",

      step3_title: "Accions Ràpides",
      step3_desc: "Accés directe a les sales recents o accions suggerides per a tu.",

      step4_title: "Navegació Principal",
      step4_desc: "El menú principal. Totes les eines que necessites estan aquí.",

      step5_title: "Crea una Partida",
      step5_desc: "Vols decidir què sopar amb amics? Crea una sala i comenceu a votar!",

      step6_title: "Unir-se",
      step6_desc: "Tens un codi o QR? Entra a la sala d'un amic ràpidament.",
      step7_title: "Comunitat de Receptes",
      step7_desc: "Inspira't amb el que cuinen els altres. Copia receptes i fes-les teves!",

      step8_title: "El Rànquing",
      step8_desc: "Qui és el millor xef? Competeix per punts i medalles.",

      step9_title: "Les Teves Sales",
      step9_desc: "Accés ràpid a les partides on ja estàs jugant o has jugat.",

      step10_title: "El Teu Rebost",
      step10_desc: "Gestiona què tens a la nevera per rebre recomanacions precises.",

      step11_title: "Perfil i Configuració",
      step11_desc: "Canvia el teu avatar, nom i preferències globals aquí."
    }
  }
};