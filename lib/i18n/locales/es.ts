export const es = {
  common: {
    loading: 'Pensando...',
    error: 'Algo ha salido mal',
    start_over: 'Volver a empezar',
    switch_lang: 'Cambiar idioma'
  },
  dashboard: {
    nav: {
      multiplayer_badge: 'MULTIPLAYER',
      guest_badge: 'INVITADO',
      recipes: 'Comunidad Recetas',
      recipes_badge: 'Social',
      ranking: 'Ranking Usuarios',
      ranking_badge: 'Top Chefs',
      my_rooms: 'Mis Salas',
      my_rooms_badge: 'Activos',
      inventory: 'Mi Inventario',
      inventory_badge: 'Despensa',
      profile: 'Mi Perfil',
      profile_badge: 'Configuración'
    },
    rooms_card: {
      hub: 'SOCIAL HUB',
      title: 'Mis Salas',
      desc: 'Gestiona, crea o únete'
    },
    // --- NUEVAS CLAVES UI ---
    greeting: 'Hola,',
    // ----------------------
    level: 'Nivel 1: La vida fácil',
    config: 'Configuración',
    quick_decision: 'Decisión Rápida',
    create_room: 'Crear Sala',
    create_desc: 'Invita a amigos y decidid juntos',
    join_room: 'Unirse',
    join_desc: '¿Tienes un código de invitación?',
    active_rooms_title: 'Tus Salas',
    active_rooms_empty: 'No tienes ninguna sala activa.',
    continue_btn: 'Continuar'
  },
  decision: {
    title_food: '¿Qué comemos hoy? 🍽️',
    energy_label: 'Nivel de Energía',
    time_label: 'Tiempo disponible',
    button_decide: '🎲 ¡Decide por mí!',
    disclaimer: '*Sin devoluciones, el destino es definitivo.',

    // Resultado
    fate_spoken: 'El destino ha hablado',
    why: '¿Por qué?',
    roll_again: '🔄 Volver a tirar',

    // --- NUEVAS CLAVES UI NECESARIAS PARA EL COMPONENTE ---
    results: {
      fate: '🎲 Resultado',
      chef: '👨‍🍳 Propuestas',
      back: 'Volver'
    },
    mobile: {
      fast_mode: 'Modo Rápido',
      actions: 'Abrir Acciones'
    },
    selector: {
      fate: 'DESTINO',
      chef: 'CHEF'
    },
    states: {
      error_title: '¡Ups! Algo ha fallado',
      fate_title: 'Hoy cocina la suerte',
      fate_desc: 'Deja la mente en blanco. Elegiremos por ti.',
      chef_title: 'Menú Inteligente',
      chef_desc: 'Analizamos tu inventario para sugerir platos.'
    },
    actions: {
      generate_menu: 'GENERAR MENÚ',
      surprise_me: '¡SORPRÉNDEME!' // ✅ NOVA CLAU
    },
    // ----------------------------------------------------

    energy_levels: {
      low: 'Modo pereza',
      mid: 'Ni fu ni fa',
      high: '¡A comerse el mundo!'
    },
    reasons: {
      high_energy: "¡Tienes buena energía! He elegido algo de tus favoritos al azar.",
      low_energy: "Energía baja detectada. He elegido una opción fácil y reconfortante.",
      balanced: "Una opción equilibrada para el tiempo que tienes.",
      random: "El destino ha decidido completamente al azar.",
      default: "Parece una buena opción por ahora."
    }
  },
  room: {
    back_home: '← Volver al inicio',
    new_room_title: 'Nueva Sala',
    id_label: 'ID',
    copy_code: 'Copiar Código',
    code_copied: '¡Código copiado al portapapeles! 📋',
    kick_confirm: '¿Quieres expulsar a este jugador?',
    host_badge: '👑 Host',
    you_badge: 'Tú',
    user_prefix: 'User',
    mode_auto: '✨ AUTO',
    mode_manual: '📝 MANUAL',
    voting_blind: 'Votación Oculta',
    voting_public: 'Votación Pública',
    blind_desc: 'Nadie ve las opciones de los demás.',
    public_desc: 'Todo el mundo ve lo que se escribe.',
    btn_change: 'Cambiar',
    empty_options: 'Aún no hay opciones',
    input_placeholder: 'Escribe una opción...',
    add_btn: 'Añadir',
    hidden_candidate: '??????',
    magic_title: 'El Destino Manda',
    magic_desc: 'El algoritmo analizará los perfiles de comida de todos los participantes para encontrar la coincidencia matemática perfecta.',
    decide_magic: '✨ Hacer Magia y Decidir',
    decide_roll: '🎲 ¡Tirar los Dados!',
    waiting_host: 'Esperando al Anfitrión...',
    history_title: 'Historial',
    trophy_empty_title: 'Sala de Trofeos vacía',
    trophy_empty_desc: 'Aún no se ha tomado ninguna decisión.',
    wall_fame: 'Muro de la Fama',
    view_more: '✨ Ver {count} victorias más...',
    clean_room: '💣 Limpiar sala',
    clean_confirm: '¿Seguro que quieres borrar el historial?',
    err_kick: 'Error expulsando usuario',
    err_clean: 'Error limpiando historial',
    err_add: 'Error añadiendo opción',
    err_general: 'Error desconocido',
    invite_cta: "Invitar amigos", // Texto del botón
    invite_sent: "¡Enlace enviado!", // Opcional, feedback
    
    link_copied: "¡Enlace copiado!",
    copy_error: "Error al copiar el enlace",
    share_title: "Únete a '{name}'",
    share_text: "¡Ey! Ayúdame a decidir qué hacemos en la sala '{name}'. Entra aquí:",

  },
  landing: {
    phrases: [
      { text: "No sé, decide tú...", emoji: "🙄" },
      { text: "A mí me da igual, de verdad...", emoji: "🥱" },
      { text: "¿Dónde vamos a cenar?", emoji: "😫" },
      { text: "¿Otra vez pizza?", emoji: "🍕" },
      { text: "Elige tú que yo no quiero pensar", emoji: "🤯" }
    ],
    hero_title: 'Adiós a perder tiempo decidiendo.',
    hero_subtitle: 'Hola a quedar más y pensar menos.',
    btn_login: 'Ya tengo cuenta',
    btn_start: '🚀 EMPEZAR'
  },
  auth: {
    email_label: 'Email',
    email_placeholder: 'nombre@ejemplo.com',
    password_label: 'Contraseña',
    password_placeholder: '••••••••',
    password_min: 'Mínimo 6 caracteres',
    back: 'ATRÁS',
    login_title: '¡Hola de nuevo!',
    login_subtitle: 'Tu sala te espera.',
    forgot_password: '¿Has olvidado la contraseña?',
    login_btn: 'ENTRAR',
    no_account: '¿No tienes cuenta?',
    register_link: "Regístrate aquí",
    register_title: 'Únete al club',
    register_subtitle: 'Empieza la aventura hoy.',
    register_btn: 'CREAR CUENTA',
    has_account: '¿Ya tienes cuenta?',
    login_link: 'Entra por aquí'
  },
  create_room: {
    back_cancel: '← CANCELAR',
    hero_title: 'Nueva Aventura',
    hero_subtitle: 'Crea un espacio para decidir con tu grupo.',
    label_name: 'Nombre de la Sala',
    placeholder_name: 'ej: Cena del Viernes 🍕',
    btn_create: '🪄 CREAR SALA',
    host_info: 'Tú serás el anfitrión (Host) 👑',
    err_name_required: 'El nombre de la sala es obligatorio.',
    err_unknown: 'Error desconocido al crear la sala.'
  },
  join_room: {
    back: '← ATRÁS',
    hero_title: '¿Tienes una invitación?',
    hero_subtitle: 'Introduce el código para unirte a la fiesta.',
    label_code: 'CÓDIGO DE LA SALA (UUID)',
    placeholder_code: 'pégalo-aquí...',
    btn_join: 'ENTRAR AHORA 🍿',
    err_code_required: 'El código es obligatorio.'
  },
  profile: {
    // Identitat
    chef_name: 'Nombre de Chef',
    chef_placeholder: 'Ej: Chef Ramsay',
    chef_hint: 'Este es el nombre que verán los demás en el Ranking.',

    // Seccions
    menu_title: 'Menú Favorito',
    menu_desc: '¿Qué te gusta?',
    blacklist_title: 'Exclusiones',
    blacklist_desc: 'Prohibida la entrada',

    // Extres
    extra_label: 'Extra',
    warning_title: '¿Te has dejado algo?',
    warning_placeholder: 'Escribe y pulsa Enter',

    // Tolerància
    flexibility_title: 'Nivel de Flexibilidad',
    rigid: 'RÍGIDO',
    flexible: 'FLEXIBLE',

    // Botons
    back: '🔙',
    title: 'Tu Personaje',
    subtitle: 'Configuración del perfil',
    saved: '✅ ¡Guardado!',
    save_btn: '💾 Guardar Cambios',
    sidebar: {
      edit: 'Editar Perfil',
      likes: 'GUSTOS',
      alerts: 'ALERTA'
    },
    // --- NOVA CLAU UI ---
    no_data: 'Sin datos...',
    // --------------------

    search_food: '🍕 Buscar comida (ej: Sushi...)',

    search_allergy: '🥜 Buscar alergia (ej: Gluten...)',

    warning_text: '¿Te has dejado algo importante?',
    warning_example: 'Ej: Cilantro, Melocotón, Colorante E-120...',

    flexibility_desc: '¿Cómo de fácil es convencerte?',

    levels: {
      low: 'NO NEGOCIABLE',
      mid: 'NI FU NI FA',
      high: 'ME ADAPTO A TODO'
    },
    food: {
      cat_world_west: "🌍 Cocinas del Mundo (Europa & América)",
      cat_world_east: "🥢 Cocinas del Mundo (Asia & Oriente)",
      cat_fast: "🍔 Fast Food & Casual",
      cat_specific: "🍣 Platos Específicos y Delicatessen",
      cat_healthy: "🥗 Saludable y Ligero",
      cat_sweet: "🧁 Desayunos y Dulces",
      italian: 'Italiana',
      mediterranean: 'Mediterránea',
      spanish: 'Española',
      french: 'Francesa',
      greek: 'Griega',
      mexican: 'Mexicana',
      american: 'Americana',
      brazilian: 'Brasileña',
      peruvian: 'Peruana',
      argentinian: 'Argentina',
      german: 'Alemana',
      japanese: 'Japonesa',
      chinese: 'China',
      indian: 'India',
      thai: 'Tailandesa',
      korean: 'Coreana',
      vietnamese: 'Vietnamita',
      turkish: 'Turca',
      lebanese: 'Libanesa',
      poke: 'Hawaiana (Poke)',
      pizza: 'Pizza',
      burger: 'Hamburguesa',
      fried_chicken: 'Pollo Frito',
      kebab: 'Kebab/Dürüm',
      hotdog: 'Frankfurt/Perrito',
      tacos: 'Tacos/Burritos',
      sandwich: 'Bocadillos/Wraps',
      crepes: 'Crepes',
      empanadas: 'Empanadas',
      sushi: 'Sushi',
      ramen: 'Ramen',
      steak: 'Carne a la brasa',
      seafood_dish: 'Mariscada',
      paella: 'Paella/Arroz',
      pasta: 'Pasta',
      bbq: 'Barbacoa/Costillas',
      dimsum: 'Dim Sum/Gyozas',
      fondue: 'Fondue/Raclette',
      salad: 'Ensaladas',
      poke_bowl: 'Poke Bowl',
      soup: 'Sopas/Cremas',
      vegan_dish: 'Platos Veganos',
      smoothies: 'Smoothies/Fruta',
      grilled_fish: 'Pescado a la plancha',
      breakfast: 'Brunch',
      croissant: 'Bollería',
      ice_cream: 'Helado',
      coffee: 'Cafetería',
      bubble_tea: 'Bubble Tea',
      donuts: 'Donuts/Berlinas'
    },
    exclusions: {
      cat_allergens: "⚠️ Los 14 Alérgenos Principales (UE)",
      cat_diets: "🚫 Dietas y Estilos de Vida",
      cat_dislikes: "❌ Intolerancias y Aversiones Comunes",
      gluten: 'Gluten',
      crustaceans: 'Crustáceos',
      eggs: 'Huevos',
      fish: 'Pescado',
      peanuts: 'Cacahuetes',
      soybeans: 'Soja',
      dairy: 'Leche/Lactosa',
      nuts: 'Frutos de cáscara',
      celery: 'Apio',
      mustard: 'Mostaza',
      sesame: 'Sésamo',
      sulphites: 'Sulfitos',
      lupin: 'Altramuces',
      molluscs: 'Moluscos',
      vegan: 'Vegano (Sin animales)',
      vegetarian: 'Vegetariano',
      pescatarian: 'Pescatariano',
      halal: 'Halal',
      kosher: 'Kosher',
      keto: 'Keto (Bajo carbs)',
      paleo: 'Paleo',
      low_fodmap: 'Low FODMAP',
      onion: 'Cebolla',
      garlic: 'Ajo',
      spicy: 'Picante',
      cilantro: 'Cilantro',
      mushrooms: 'Setas/Champiñones',
      pork: 'Cerdo',
      beef: 'Ternera',
      alcohol: 'Alcohol',
      caffeine: 'Cafeína',
      sugar: 'Azúcar añadido',
      fructose: 'Fructosa',
      bell_pepper: 'Pimiento',
      coconut: 'Coco',
      cucumber: 'Pepino'
    }
  },
  food: {
    categories: {
      protein: '🥩 Proteína',
      veggie: '🥦 Verdura',
      fruit: '🍎 Fruta',
      dairy: '🥛 Lácteo',
      cereal: '🥖 Cereales',
      drink: '🥤 Bebida',
      snack: '🍪 Snack',
      spice: '🧂 Condimentos'
    },
    items: {
      // 🍎 FRUTA
      f1: 'Manzana roja',
      f2: 'Manzana verde',
      f3: 'Manzana amarilla',
      f4: 'Plátano',
      f5: 'Plátano macho',
      f6: 'Pera conferencia',
      f7: 'Pera blanquilla',
      f8: 'Naranja',
      f9: 'Mandarina',
      f10: 'Limón',
      f11: 'Lima',
      f12: 'Pomelo',
      f13: 'Fresa',
      f14: 'Arándanos',
      f15: 'Cerezas',
      f16: 'Uva blanca',
      f17: 'Uva negra',
      f18: 'Melocotón',
      f19: 'Nectarina',
      f20: 'Paraguayo',
      f21: 'Ciruela',
      f22: 'Albaricoque',
      f23: 'Kiwi verde',
      f24: 'Kiwi amarillo',
      f25: 'Piña',
      f26: 'Mango',
      f27: 'Melón',
      f28: 'Sandía',
      f29: 'Coco',
      f30: 'Membrillo',
      f31: 'Higo',
      f32: 'Dátil fresco',

      // 🥦 VERDURA
      v1: 'Zanahoria',
      v2: 'Patata',
      v3: 'Cebolla blanca',
      v4: 'Cebolla morada',
      v5: 'Ajo',
      v6: 'Tomate maduro',
      v7: 'Tomate cherry',
      v8: 'Brócoli',
      v9: 'Pepino',
      v10: 'Lechuga iceberg',
      v11: 'Lechuga romana',
      v12: 'Lechuga hoja de roble',
      v13: 'Espinacas frescas',
      v14: 'Rúcula',
      v15: 'Berenjena',
      v16: 'Pimiento verde',
      v17: 'Pimiento rojo',
      v18: 'Pimiento amarillo',
      v19: 'Calabacín',
      v20: 'Coliflor',
      v21: 'Col verde',
      v22: 'Lombarda',
      v23: 'Jengibre',
      v24: 'Nabo',
      v25: 'Remolacha',
      v26: 'Maíz',
      v27: 'Guisantes',
      v28: 'Judías verdes',
      v29: 'Champiñones',
      v30: 'Setas variadas',

      // 🥩 PROTEÍNA
      p1: 'Pollo entero',
      p2: 'Pechuga de pollo',
      p3: 'Muslos de pollo',
      p11: 'Alitas de pollo',
      p12: 'Ternera fresca',
      p13: 'Ternera picada',
      p14: 'Entrecot de ternera',
      p15: 'Solomillo de ternera',
      p16: 'Lomo de cerdo',
      p17: 'Costillas de cerdo',
      p18: 'Carne picada de cerdo',
      p19: 'Bacon',
      p20: 'Cordero (pierna)',
      p21: 'Chuletas de cordero',
      p22: 'Merluza',
      p23: 'Bacalao fresco',
      p24: 'Bacalao desalado',
      p25: 'Dorada',
      p26: 'Lubina',
      p27: 'Sardinas',
      p28: 'Caballa',
      p29: 'Salmón fresco',
      p30: 'Salmón congelado',
      p31: 'Atún fresco',
      p32: 'Gambas',
      p33: 'Calamar',
      p34: 'Mejillones',
      p35: 'Langostino',
      p36: 'Atún en conserva',
      p37: 'Sardinas en conserva',
      p38: 'Huevos',
      p39: 'Lentejas cocidas',
      p40: 'Garbanzos cocidos',
      p41: 'Tofu',

      // 🥛 LÁCTEO
      l1: 'Leche entera',
      l2: 'Leche semi',
      l3: 'Leche desnatada',
      l4: 'Leche sin lactosa',
      l5: 'Queso curado',
      l6: 'Queso semicurado',
      l7: 'Queso tierno',
      l8: 'Queso rallado',
      l9: 'Mozzarella',
      l10: 'Queso parmesano',
      l11: 'Queso fresco',
      l12: 'Queso azul',
      l13: 'Yogur natural',
      l14: 'Yogur griego',
      l15: 'Yogur de fresa',
      l16: 'Flan',
      l17: 'Natillas',
      l18: 'Mantequilla',
      l19: 'Nata para cocinar',
      l20: 'Helado',

      // 🥖 CEREALES
      c1: 'Pan blanco',
      c2: 'Pan integral',
      c3: 'Pasta espagueti',
      c4: 'Pasta macarrones',
      c5: 'Arroz blanco',
      c6: 'Barra de pan',
      c7: 'Croissant',
      c8: 'Bagel',
      c9: 'Pan de molde',
      c10: 'Pasta fusilli',
      c11: 'Pasta penne',
      c12: 'Fideos',
      c13: 'Arroz integral',
      c14: 'Arroz basmati',
      c15: 'Arroz jazmín',
      c16: 'Cuscús',
      c17: 'Quinoa',
      c18: 'Cereales de desayuno',
      c19: 'Copos de avena',
      c20: 'Muesli',
      c21: 'Harina de trigo',
      c22: 'Harina integral',
      c23: 'Harina de avena',
      c24: 'Ensaimada',
      c25: 'Bizcocho',
      c26: 'Tortillas de trigo',

      // 🥤 BEBIDA
      b1: 'Agua',
      b2: 'Café molido',
      b3: 'Té',
      b4: 'Refresco cola',
      b5: 'Refresco naranja',
      b6: 'Refresco limón',
      b7: 'Zumo de naranja',
      b8: 'Zumo de manzana',
      b9: 'Café en grano',
      b10: 'Café soluble',
      b11: 'Infusiones',
      b12: 'Bebida vegetal de avena',
      b13: 'Bebida vegetal de almendra',
      b14: 'Cerveza',
      b15: 'Vino',
      b16: 'Vino blanco',
      b17: 'Cava',
      b18: 'Vermut',
      b19: 'Tónica',
      co13: 'Caldo de pollo',
      co14: 'Caldo de pescado',

      // 🍪 SNACK
      s1: 'Galletas',
      s2: 'Chocolate negro',
      s3: 'Palomitas',
      s4: 'Almendras',
      s5: 'Chocolate con leche',
      s6: 'Chocolate blanco',
      s7: 'Caramelos',
      s8: 'Piruletas',
      s9: 'Magdalena',
      s10: 'Donut',
      s11: 'Palitos salados',
      s12: 'Pretzels',
      s13: 'Patatas fritas',
      s14: 'Nachos',
      s15: 'Avellanas',
      s16: 'Nueces',
      s17: 'Anacardos',
      s18: 'Cacahuetes',
      s19: 'Pipas de girasol',
      s20: 'Galletas saladas',
      s21: 'Crackers',
      s22: 'Barritas de cereales',
      s23: 'Miel',

      // 🧂 CONDIMENTOS
      co1: 'Aceite de oliva virgen',
      co2: 'Aceite de girasol',
      co3: 'Sal',
      co4: 'Pimienta negra',
      co5: 'Vinagre de vino',
      co6: 'Vinagre de módena',
      co7: 'Mantequilla',
      co8: 'Margarina',
      co9: 'Kétchup',
      co10: 'Mayonesa',
      co11: 'Mostaza',
      co12: 'Mermelada',
      co15: 'Tomate frito',

      // 🥖 CONGELADOS RÁPIDOS (Z)
      z1: 'Pizza congelada',
      z2: 'Patatas pre-fritas',
      z3: 'Lasaña preparada',
      z4: 'Croquetas'
    }
  },
  community: {
    title: 'Comunidad',
    title_suffix: 'Foodie',
    subtitle: 'Explora qué cocina la gente.',
    search_placeholder: 'Buscar ingredientes...',
    filters: {
      all: 'Todas',
      fast: 'Rápidas',
      veggie: 'Vegetariano',
      vegan: 'Vegano',
      gluten_free: 'Sin Gluten',
      dairy_free: 'Sin Lactosa',
      dessert: 'Postres'
    },
    empty_state: 'No se han encontrado recetas.',
    pagination: {
      page: 'Página',
      of: 'de'
    },
    steps: {
      title: 'Instrucciones',
      count_suffix: 'pasos',
      empty: 'Sin pasos detallados.'
    }
  },
  ranking: {
    top_label: 'TOP',
    title: 'Salón de la Fama',
    season: 'Temporada 1',
    aspirants: 'Aspirantes',
    empty_list: 'Aquí no hay nadie... 👻',
    you_suffix: '(Tú)',
    points_abbr: 'PTS'
  },
  inventory: {
    header: {
      title_prefix: 'Despensa',
      title_suffix: 'Digital',
      subtitle: "Control de stock y caducidades",
      items_label: 'ITEMS:'
    },
    dashboard: {
      title_all: "📦 Todo el Inventario",
      title_expiring: "⚠️ Caduca Pronto",
      filter_prefix: "📂",
      clear_filter: "✕ Limpiar",
      scan_btn: "Escanear IA",
      add_btn: "Añadir",
      close_btn: "Cerrar"
    },
    list: {
      empty_title: "👻",
      empty_text: "No se han encontrado alimentos aquí.",
      status: {
        expired: "Caducado",
        expiring: "Caduca Pronto"
      }
    },
    scanner: {
      title_suffix: "Productos",
      subtitle: "Revisa antes de guardar",
      no_items: "No quedan items.",
      back: "Volver",
      photo_btn: "Foto",
      confirm_btn: "Confirmar todo",
      saving: "Guardando...",
      error_save: "Error guardando los items."
    },
    actions: {
      add: "Añadir",
      close: "Cerrar",
      scan: "Escanear IA",
      clear: "Limpiar",
      save: "📥 Guardar en Despensa",
      saving: "Guardando..."
    },
    form: {
      add_title: "Añadir nuevo alimento",
      name_placeholder: "¿Qué añadimos a la despensa?",
      quantity_label: "Cantidad",
      location: {
        fridge: "Nevera",
        pantry: "Despensa",
        freezer: "Congelador"
      },
      unit: {
        ut: "Ud",
        kg: "Kg",
        l: "L",
        g: "g"
      }
    },
    add_item: {
      main_btn: 'Añadir nuevo alimento',
      close_btn: 'Cerrar escáner'
    }

  },
  social: {
    title: 'Zona Social',
    actions: {
      create_badge: 'NUEVA',
      create_title: 'Crear Sala',
      join_badge: 'INVITADO',
      join_title: 'Unirme'
    },
    grid: {
      title: 'Salas Activas',
      empty: 'Ninguna sala activa aún.',
      role_admin: 'Admin',
      role_member: 'Miembro'
    }
  },
  create_recipe: {
    steps: {
      title: 'Instrucciones',
      placeholder: 'Escribe el paso aquí... (Clica los ingredientes de abajo para insertarlos)',
      quick_insert: 'Insertar rápido:',
      timer: 'Temporizador',
      add_timer: '+ ⏰ Tiempo',
      warning_ingredients: 'Añade ingredientes a la izquierda primero',
      add_btn: 'Añadir Paso ↵',
      empty_state: 'El camino al éxito empieza aquí',
      step_label: 'Paso'
    },
    ingredients: {
      title: 'Despensa Mágica',
      selected: 'seleccionados',
      search_placeholder: '¿Qué necesitas? (ej: Tomate)',
      category_all: '🌍 Todo',
      empty_search: 'No hemos encontrado nada... prueba con otra categoría.',
      basket_title: 'Tu cesta:',
      basket_empty: 'Aún vacía...',
      unit_select: 'ut' // Opcional si vols traduir unitats
    },
    form: {
      title: 'Nueva Receta',
      label_title: 'Título',
      placeholder_title: 'Ej: Tortilla de patatas',
      label_ingredients: 'Ingredientes (separados por coma)',
      placeholder_ingredients: 'Huevos, Patatas, Aceite, Sal',
      label_steps: 'Pasos (uno por línea)',
      placeholder_steps: 'Cortar patatas\nFreír\nBatir huevos',
      submit_btn: 'Publicar Receta',
      success: '¡Receta publicada!',
      error_generic: 'Error al publicar'
    },
    card: {
      view_sr: 'Ver',
      prep_time: 'm', // minuts
      created_by_you: 'Creado por ti',
      created_by_community: 'Comunidad'
    },
    editor: {
      btn_publish: 'PUBLICAR RECETA',
      btn_cooking: 'COCINANDO...'
    },
    toasts: {
      missing_name: '¡Ey! ¿Cómo se llama esta maravilla? 🤔',
      missing_ingredients: '¡La magia necesita ingredientes! 🥕',
      missing_steps: '¡Cuéntanos el secreto (los pasos)! 📜',
      success_title: '✨ ¡Receta Publicada!',
      success_desc: 'Ya está disponible para la comunidad.',
      error_title: '¡Ups! Algo ha fallado'
    },
    meta: {
      placeholder_name: 'Dale un nombre épico...',
      minutes_label: 'minutos',
      tags_title: 'Etiquetas',
      tags: {
        vegan: 'Vegano',
        vegetarian: 'Vegetariano',
        gluten_free: 'Sin Gluten',
        dairy_free: 'Sin Lactosa',
        quick: 'Rápido',
        healthy: 'Sano',
        dessert: 'Postre'
      }
    }
  },
  onboarding: {
    buttons: {
      next: "Siguiente",
      back: "Atrás",
      finish: "¡Entendido! 🚀",
      skip: "Saltar tour"
    },
    // Aquí pondremos los textos específicos del editor
    editor: {
      step1_title: "1. Bautiza tu creación",
      step1_desc: "Todo empieza con un buen nombre. ¡Escribe algo que abra el apetito!",

      step2_title: "2. El Tiempo es Oro",
      step2_desc: "¿Cuánto tardaremos? Sé realista, no queremos que se nos queme el arroz.",

      step3_title: "3. Etiquétalo",
      step3_desc: "¿Es Vegano? ¿Sin Gluten? ¿Picante? Ayuda a la gente a filtrar.",

      step4_title: "4. ¡A la Cesta!",
      step4_desc: "Busca ingredientes (ej: 'Cebolla') y añade cantidades. ¡Usa tu inventario!",

      step5_title: "5. Gestión de Ingredientes",
      step5_desc: "Aquí verás la lista. Si te equivocas, haz clic en el icono para eliminarlos.",

      step6_title: "6. La Magia (Paso a Paso)",
      step6_desc: "Explica cómo se hace. Sé claro y conciso.",

      step7_title: "7. Superpoder: Inserción Rápida",
      step7_desc: "Haz clic en estos ingredientes para añadirlos al texto con su icono. ¡Queda súper pro!",

      step8_title: "8. Publicar",
      step8_desc: "Revísalo todo y pulsa el botón mágico para guardar."
    },
    dashboard: {
      step1_title: "¡Bienvenido a la Cocina! 🏠",
      step1_desc: "Este es tu centro de mando. Desde aquí puedes gestionarlo todo.",

      step2_title: "Preferencias (Barra Lateral)",
      step2_desc: "Aquí ves lo que te gusta y lo que no. ¡Importante para cuando la IA te recomiende recetas!",

      step3_title: "Acciones Rápidas",
      step3_desc: "Acceso directo a las salas recientes o acciones sugeridas para ti.",

      step4_title: "Navegación Principal",
      step4_desc: "El menú principal. Todas las herramientas que necesitas están aquí.",

      step5_title: "Crear una Partida",
      step5_desc: "¿Quieres decidir qué cenar con amigos? ¡Crea una sala y empezad a votar!",

      step6_title: "Unirse",
      step6_desc: "¿Tienes un código o QR? Entra rápidamente en la sala de un amigo.",
      step7_title: "Comunidad de Recetas",
      step7_desc: "Inspírate con lo que cocinan los demás. ¡Copia recetas y hazlas tuyas!",

      step8_title: "El Ranking",
      step8_desc: "¿Quién es el mejor chef? Compite por puntos y medallas.",

      step9_title: "Tus Salas",
      step9_desc: "Acceso rápido a las partidas en las que ya estás jugando o has jugado.",

      step10_title: "Tu Despensa",
      step10_desc: "Gestiona lo que tienes en la nevera para recibir recomendaciones precisas.",

      step11_title: "Perfil y Configuración",
      step11_desc: "Cambia tu avatar, nombre y preferencias globales aquí."

    },
    inventory: {
      step1_title: "Tu Despensa Digital 📦",
      step1_desc: "Aquí tienes todo lo que has comprado. Controla qué tienes y dónde lo tienes.",

      step2_title: "Filtros Rápidos",
      step2_desc: "Pulsa estas tarjetas para ver solo lo que hay en la Nevera, Congelador o Despensa.",

      step3_title: "Alerta de Caducidad ⚠️",
      step3_desc: "¡Importantísimo! Si aparece un número aquí, tienes productos a punto de estropearse. ¡Priorízalos!",

      step4_title: "Escáner Mágico 📷",
      step4_desc: "¡No escribas! Haz una foto al ticket o a los productos y la IA los añadirá sola.",

      step5_title: "Añadir Manualmente",
      step5_desc: "Si prefieres hacerlo a la antigua, pulsa aquí para rellenar el formulario.",

      step6_title: "La Lista",
      step6_desc: "Aquí aparecerán los productos. Puedes editarlos o eliminarlos haciendo clic sobre ellos."
    },
    decision: {
      step1_title: "¿Qué comemos hoy? 🤔",
      step1_desc: "Esta es la herramienta de decisión rápida. Te ayudamos a elegir plato en segundos.",

      step2_title: "Elige tu Modo",
      step2_desc: "🎲 'Destino' si quieres pura suerte. 👨‍🍳 'Chef' si quieres afinar según tiempo y energía.",

      step3_title: "Configura los parámetros",
      step3_desc: "Mueve los controles según cómo te sientas hoy. ¿Poco tiempo? ¿Poca energía? ¡Díselo al Chef!",

      step4_title: "Haz la Magia ✨",
      step4_desc: "¡Pulsa el botón! (Tranquilo, es una simulación, no gastarás nada).",

      step5_title: "Los Resultados 🍽️",
      step5_desc: "Aquí tienes las propuestas. Haz clic en una receta para guardarla y cocinarla, o vuelve atrás para probar otra vez."
    }




  }

};