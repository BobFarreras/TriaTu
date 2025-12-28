export const es = {
  common: {
    loading: 'Pensando...',
    error: 'Algo ha salido mal',
    start_over: 'Volver a empezar',
    switch_lang: 'Cambiar idioma'
  },
  dashboard: {
    level: 'Nivel 1: La vida fácil',
    config: 'Configuración',
    quick_decision: 'Decisión Rápida',
    create_room: 'Crear Sala',
    create_desc: 'Invita a amigos y decidid juntos',
    join_room: 'Unirse',
    join_desc: '¿Tienes un código de invitación?'
  },
  decision: {
    title_food: '¿Qué comemos hoy? 🍽️',
    energy_label: 'Nivel de Energía',
    time_label: 'Tiempo disponible',
    button_decide: '🎲 ¡Decide por mí!',
    disclaimer: '*Sin devoluciones, el destino es definitivo.',

    fate_spoken: 'El destino ha hablado',
    why: '¿Por qué?',
    roll_again: '🔄 Volver a tirar',

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
    user_prefix: 'Usuario',

    mode_auto: '✨ AUTO',
    mode_manual: '📝 MANUAL',

    voting_blind: 'Votación Oculta',
    voting_public: 'Votación Pública',
    blind_desc: 'Nadie ve las opciones de los demás.',
    public_desc: 'Todos ven lo que se escribe.',
    btn_change: 'Cambiar',

    empty_options: 'Aún no hay opciones',
    input_placeholder: 'Escribe una opción...',
    add_btn: 'Añadir',
    hidden_candidate: '??????',

    magic_title: 'El Destino Manda',
    magic_desc: 'El algoritmo analizará los perfiles de comida de todos los participantes para encontrar la coincidencia matemática perfecta.',

    decide_magic: '✨ Hacer Magia y Decidir',
    decide_roll: '🎲 ¡Tirar los Dados!',
    waiting_host: 'Esperando al Host...',

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
    err_general: 'Error desconocido'
  },
  landing: {
    phrases: [
      { text: "No sé, decide tú...", emoji: "🙄" },
      { text: "Me da igual, de verdad...", emoji: "🥱" },
      { text: "¿Dónde vamos a cenar?", emoji: "😫" },
      { text: "¿Otra vez pizza?", emoji: "🍕" },
      { text: "Elige tú que no quiero pensar", emoji: "🤯" }
    ],
    hero_title: 'Adiós a perder tiempo decidiendo.',
    hero_subtitle: 'Hola a quedar más y pensar menos.',

    btn_login: 'Ya tengo cuenta',
    btn_start: '🚀 EMPEZAR'
  },
  auth: {
    // Shared
    email_label: 'Email',
    email_placeholder: 'nombre@ejemplo.com',
    password_label: 'Contraseña',
    password_placeholder: '••••••••',
    password_min: 'Mínimo 6 caracteres',
    back: 'VOLVER',

    // Login
    login_title: '¡Hola de nuevo!',
    login_subtitle: 'Tu sala te espera.',
    forgot_password: '¿Has olvidado la contraseña?',
    login_btn: 'ENTRAR',
    no_account: '¿No tienes cuenta?',
    register_link: 'Regístrate aquí',

    // Register
    register_title: 'Únete al club',
    register_subtitle: 'Empieza la aventura hoy.',
    register_btn: 'CREAR CUENTA',
    has_account: '¿Ya tienes cuenta?',
    login_link: 'Entra por aquí'
  },// ✅ NUEVAS CLAVES PARA CREAR/UNIR
  create_room: {
    back_cancel: '← CANCELAR',
    hero_title: 'Nueva Aventura',
    hero_subtitle: 'Crea un espacio para decidir con tu grupo.',
    label_name: 'Nombre de la Sala',
    placeholder_name: 'ej: Cena del Viernes 🍕',
    btn_create: '🪄 CREAR SALA',
    host_info: 'Tú serás el anfitrión 👑',
    err_name_required: 'El nombre de la sala es obligatorio.',
    err_unknown: 'Error desconocido al crear la sala.'
  },

  join_room: {
    back: '← VOLVER',
    hero_title: '¿Tienes una invitación?',
    hero_subtitle: 'Introduce el código para unirte a la fiesta.',
    label_code: 'CÓDIGO DE LA SALA (UUID)',
    placeholder_code: 'pégalo-aquí...',
    btn_join: 'ENTRAR AHORA 🍿',
    err_code_required: 'El código es obligatorio.'
  },
  profile: {
  back: '🔙',
  title: 'Tu Personaje',
  subtitle: 'Configuración del perfil',
  saved: '✅ ¡Guardado!',
  save_btn: '💾 Guardar Cambios',

  // Sección 1: Comida
  menu_title: 'Tu Menú',
  menu_desc: '¿Qué te gusta comer habitualmente?',
  search_food: '🍕 Buscar comida (ej: Sushi...)',

  // Sección 2: Exclusiones
  blacklist_title: 'Lista Negra',
  blacklist_desc: 'Alergias y cosas que no soportas.',
  search_allergy: '🥜 Buscar alergia (ej: Gluten...)',
  warning_title: '⚠️ Otras Restricciones',
  warning_text: '¿Has olvidado algo importante?',
  warning_example: 'Ej: Cilantro, Melocotón, Colorante E-120...',
  warning_placeholder: 'Escribe aquí y presiona Enter...',

  // Sección 3: Tolerancia
  flexibility_title: 'Flexibilidad',
  flexibility_desc: '¿Qué tan fácil eres de convencer?',
  rigid: 'Rígido',
  flexible: 'Flexible',
  levels: {
    low: 'NO NEGOCIABLE',
    mid: 'NI FU NI FA',
    high: 'ME ADAPTO A TODO'
  },


  food: {
    // Categorías
    cat_world_west: "🌍 Cocinas del Mundo (Europa & América)",
    cat_world_east: "🥢 Cocinas del Mundo (Asia & Oriente)",
    cat_fast: "🍔 Comida rápida & Casual",
    cat_specific: "🍣 Platos Específicos y Delicatessen",
    cat_healthy: "🥗 Saludable y Ligero",
    cat_sweet: "🧁 Desayunos y Dulces",

    // Items (World West)
    italian: 'Italiana',
    mediterranean: 'Mediterránea',
    spanish: 'Española',
    french: 'Francesa',
    greek: 'Griega',
    mexican: 'Mexicana',
    american: 'Americana',
    brazilian: 'Brasilera',
    peruvian: 'Peruana',
    argentinian: 'Argentina',
    german: 'Alemana',

    // Items (World East)
    japanese: 'Japonesa',
    chinese: 'China',
    indian: 'India',
    thai: 'Tailandesa',
    korean: 'Coreana',
    vietnamese: 'Vietnamita',
    turkish: 'Turca',
    lebanese: 'Libanesa',
    poke: 'Hawaiana (Poke)',

    // Items (Fast Food)
    pizza: 'Pizza',
    burger: 'Hamburguesa',
    fried_chicken: 'Pollo Frito',
    kebab: 'Kebab/Dürüm',
    hotdog: 'Frankfurt/Hot Dog',
    tacos: 'Tacos/Burritos',
    sandwich: 'Bocadillos/Wraps',
    crepes: 'Crepes',
    empanadas: 'Empanadas',

    // Items (Specific)
    sushi: 'Sushi',
    ramen: 'Ramen',
    steak: 'Carne a la parrilla',
    seafood_dish: 'Mariscada',
    paella: 'Paella/Arroz',
    pasta: 'Pasta',
    bbq: 'Barbacoa/Costillas',
    dimsum: 'Dim Sum/Gyozas',
    fondue: 'Fondue/Raclette',

    // Items (Healthy)
    salad: 'Ensaladas',
    poke_bowl: 'Poke Bowl',
    soup: 'Sopas/Cremas',
    vegan_dish: 'Platos Veganos',
    smoothies: 'Smoothies/Fruta',
    grilled_fish: 'Pescado a la plancha',

    // Items (Sweet)
    breakfast: 'Brunch',
    croissant: 'Pastelería',
    ice_cream: 'Helado',
    coffee: 'Cafetería',
    bubble_tea: 'Bubble Tea',
    donuts: 'Donuts/Berlines'
  },

  exclusions: {
    // Categorías
    cat_allergens: "⚠️ Los 14 Principales Alérgenos (UE)",
    cat_diets: "🚫 Dietas y Estilos de Vida",
    cat_dislikes: "❌ Intolerancias y Aversión Comunes",

    // Alérgenos
    gluten: 'Gluten',
    crustaceans: 'Crustáceos',
    eggs: 'Huevos',
    fish: 'Pescado',
    peanuts: 'Cacahuetes',
    soybeans: 'Soja',
    dairy: 'Leche/Lactosa',
    nuts: 'Frutos Secos',
    celery: 'Apio',
    mustard: 'Mostaza',
    sesame: 'Sésamo',
    sulphites: 'Sulfitos',
    lupin: 'Altramuz',
    molluscs: 'Moluscos',

    // Dietas
    vegan: 'Vegano (Sin animales)',
    vegetarian: 'Vegetariano',
    pescatarian: 'Pescetariano',
    halal: 'Halal',
    kosher: 'Kosher',
    keto: 'Keto (Bajo carbs)',
    paleo: 'Paleo',
    low_fodmap: 'Low FODMAP',

    // Intolerancias / Disgustos
    onion: 'Cebolla',
    garlic: 'Ajo',
    spicy: 'Picante',
    cilantro: 'Cilantro',
    mushrooms: 'Setas',
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




  }
}
