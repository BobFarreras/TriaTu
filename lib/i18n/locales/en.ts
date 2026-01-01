export const en = {
  common: {
    loading: 'Thinking...',
    error: 'Something went wrong',
    start_over: 'Start over',
    switch_lang: 'Change language'
  },
  dashboard: {
    nav: {
      multiplayer_badge: 'MULTIPLAYER',
      guest_badge: 'GUEST',
      recipes: 'Recipe Community',
      recipes_badge: 'Social',
      ranking: 'User Ranking',
      ranking_badge: 'Top Chefs',
      my_rooms: 'My Rooms',
      my_rooms_badge: 'Active',
      inventory: 'My Inventory',
      inventory_badge: 'Pantry',
      profile: 'My Profile',
      profile_badge: 'Settings'
    },
    rooms_card: {
      hub: 'SOCIAL HUB',
      title: 'My Rooms',
      desc: 'Manage, create or join'
    },
    greeting: 'Hello,',
    level: 'Level 1: Easy Living',
    config: 'Settings',
    quick_decision: 'Quick Decision',
    create_room: 'Create Room',
    create_desc: 'Invite friends and decide together',
    join_room: 'Join',
    join_desc: 'Got an invite code?',
    active_rooms_title: 'Your Rooms',
    active_rooms_empty: 'No active rooms.',
    continue_btn: 'Continue'
  },

  decision: {
    title_food: 'What are we eating? 🍽️',
    energy_label: 'Energy Level',
    time_label: 'Available Time',
    button_decide: '🎲 Decide for me!',
    disclaimer: '*No refunds, fate is final.',

    // Result
    fate_spoken: 'Fate has spoken',
    why: 'Why?',
    roll_again: '🔄 Roll again',

    // UI Keys
    results: {
      fate: '🎲 Result',
      chef: '👨‍🍳 Proposals',
      back: 'Back'
    },
    mobile: {
      fast_mode: 'Quick Mode',
      actions: 'Open Actions'
    },
    selector: {
      fate: 'FATE',
      chef: 'CHEF'
    },
    states: {
      error_title: 'Oops! Something went wrong',
      fate_title: 'Luck is cooking today',
      fate_desc: 'Empty your mind. We\'ll choose for you.',
      chef_title: 'Smart Menu',
      chef_desc: 'Scanning inventory to suggest dishes.'
    },
    actions: {
      generate_menu: 'GENERATE MENU',
      surprise_me: 'SURPRISE ME!' // ✅ NOVA CLAU
    },

    energy_levels: {
      low: 'Lazy Mode',
      mid: 'Meh / So-so',
      high: 'Conquer the World!'
    },
    reasons: {
      high_energy: "You've got good vibes! I picked something from your random favorites.",
      low_energy: "Low energy detected. I chose something easy and comforting.",
      balanced: "A balanced option for the time you have.",
      random: "Fate has decided completely at random.",
      default: "Seems like a good option for now."
    }
  },
  room: {
    back_home: '← Back to home',
    new_room_title: 'New Room',
    id_label: 'ID',
    copy_code: 'Copy Code',
    code_copied: 'Code copied to clipboard! 📋',
    kick_confirm: 'Do you want to kick this player?',
    host_badge: '👑 Host',
    you_badge: 'You',
    user_prefix: 'User',
    mode_auto: '✨ AUTO',
    mode_manual: '📝 MANUAL',
    voting_blind: 'Blind Voting',
    voting_public: 'Public Voting',
    blind_desc: 'No one sees others\' choices.',
    public_desc: 'Everyone sees what is typed.',
    btn_change: 'Change',
    empty_options: 'No options yet',
    input_placeholder: 'Type an option...',
    add_btn: 'Add',
    hidden_candidate: '??????',
    magic_title: 'Fate Rules',
    magic_desc: 'The algorithm will analyze everyone\'s food profiles to find the perfect mathematical match.',
    decide_magic: '✨ Do Magic & Decide',
    decide_roll: '🎲 Roll the Dice!',
    waiting_host: 'Waiting for Host...',
    history_title: 'History',
    trophy_empty_title: 'Trophy Room Empty',
    trophy_empty_desc: 'No decisions made yet.',
    wall_fame: 'Wall of Fame',
    view_more: '✨ View {count} more victories...',
    clean_room: '💣 Clear room',
    clean_confirm: 'Are you sure you want to clear history?',
    err_kick: 'Error kicking user',
    err_clean: 'Error clearing history',
    err_add: 'Error adding option',
    err_general: 'Unknown error'
  },
  landing: {
    phrases: [
      { text: "I don't know, you decide...", emoji: "🙄" },
      { text: "I really don't care...", emoji: "🥱" },
      { text: "Where are we having dinner?", emoji: "😫" },
      { text: "Pizza again?", emoji: "🍕" },
      { text: "You choose, I don't want to think", emoji: "🤯" }
    ],
    hero_title: 'Stop wasting time deciding.',
    hero_subtitle: 'Hello to hanging out more and thinking less.',
    btn_login: 'I have an account',
    btn_start: '🚀 GET STARTED'
  },
  auth: {
    email_label: 'Email',
    email_placeholder: 'name@example.com',
    password_label: 'Password',
    password_placeholder: '••••••••',
    password_min: 'Min 6 characters',
    back: 'BACK',
    login_title: 'Welcome back!',
    login_subtitle: 'Your room awaits.',
    forgot_password: 'Forgot password?',
    login_btn: 'LOG IN',
    no_account: 'No account?',
    register_link: "Sign up here",
    register_title: 'Join the club',
    register_subtitle: 'Start the adventure today.',
    register_btn: 'CREATE ACCOUNT',
    has_account: 'Already have an account?',
    login_link: 'Log in here'
  },
  create_room: {
    back_cancel: '← CANCEL',
    hero_title: 'New Adventure',
    hero_subtitle: 'Create a space to decide with your group.',
    label_name: 'Room Name',
    placeholder_name: 'ex: Friday Dinner 🍕',
    btn_create: '🪄 CREATE ROOM',
    host_info: 'You will be the Host 👑',
    err_name_required: 'Room name is required.',
    err_unknown: 'Unknown error creating room.'
  },
  join_room: {
    back: '← BACK',
    hero_title: 'Got an invite?',
    hero_subtitle: 'Enter the code to join the party.',
    label_code: 'ROOM CODE (UUID)',
    placeholder_code: 'paste-it-here...',
    btn_join: 'JOIN NOW 🍿',
    err_code_required: 'Code is required.'
  },
  profile: {
    // Identitat
    chef_name: 'Chef Name',
    chef_placeholder: 'Ex: Chef Ramsay',
    chef_hint: 'This is the name others will see on the Leaderboard.',

    // Seccions
    menu_title: 'Favorite Menu',
    menu_desc: 'What do you like?',
    blacklist_title: 'Exclusions',
    blacklist_desc: 'Strictly prohibited',

    // Extres
    extra_label: 'Extra',
    warning_title: 'Did you forget something?',
    warning_placeholder: 'Type and press Enter',

    // Tolerància
    flexibility_title: 'Flexibility Level',
    rigid: 'RIGID',
    flexible: 'FLEXIBLE',

    // Botons
    back: '🔙',
    title: 'Your Character',
    subtitle: 'Profile settings',
    saved: '✅ Saved!',
    save_btn: '💾 Save Changes',
    sidebar: {
      edit: 'Edit Profile',
      likes: 'LIKES',
      alerts: 'ALERTS'
    },
    // --- NOVA CLAU UI ---
    no_data: 'No data...',
    // --------------------

    search_food: '🍕 Search food (ex: Sushi...)',

    search_allergy: '🥜 Search allergy (ex: Gluten...)',

    warning_text: 'Did you miss anything important?',
    warning_example: 'Ex: Cilantro, Peach, Dye E-120...',

    flexibility_desc: 'How easy are you to convince?',

    levels: {
      low: 'NON-NEGOTIABLE',
      mid: 'MEH / WHATEVER',
      high: 'UP FOR ANYTHING'
    },
    food: {
      cat_world_west: "🌍 World Cuisines (Europe & Americas)",
      cat_world_east: "🥢 World Cuisines (Asia & East)",
      cat_fast: "🍔 Fast Food & Casual",
      cat_specific: "🍣 Specific Dishes & Deli",
      cat_healthy: "🥗 Healthy & Light",
      cat_sweet: "🧁 Breakfast & Sweets",
      italian: 'Italian',
      mediterranean: 'Mediterranean',
      spanish: 'Spanish',
      french: 'French',
      greek: 'Greek',
      mexican: 'Mexican',
      american: 'American',
      brazilian: 'Brazilian',
      peruvian: 'Peruvian',
      argentinian: 'Argentinian',
      german: 'German',
      japanese: 'Japanese',
      chinese: 'Chinese',
      indian: 'Indian',
      thai: 'Thai',
      korean: 'Korean',
      vietnamese: 'Vietnamese',
      turkish: 'Turkish',
      lebanese: 'Lebanese',
      poke: 'Hawaiian (Poke)',
      pizza: 'Pizza',
      burger: 'Burger',
      fried_chicken: 'Fried Chicken',
      kebab: 'Kebab/Shawarma',
      hotdog: 'Hot Dog',
      tacos: 'Tacos/Burritos',
      sandwich: 'Sandwiches/Wraps',
      crepes: 'Crepes',
      empanadas: 'Empanadas/Pies',
      sushi: 'Sushi',
      ramen: 'Ramen',
      steak: 'Steak / Grilled Meat',
      seafood_dish: 'Seafood Platter',
      paella: 'Paella/Rice Dish',
      pasta: 'Pasta',
      bbq: 'BBQ / Ribs',
      dimsum: 'Dim Sum / Gyozas',
      fondue: 'Fondue / Raclette',
      salad: 'Salads',
      poke_bowl: 'Poke Bowl',
      soup: 'Soups/Creams',
      vegan_dish: 'Vegan Dishes',
      smoothies: 'Smoothies/Fruit',
      grilled_fish: 'Grilled Fish',
      breakfast: 'Brunch',
      croissant: 'Pastries',
      ice_cream: 'Ice Cream',
      coffee: 'Coffee Shop',
      bubble_tea: 'Bubble Tea',
      donuts: 'Donuts'
    },
    exclusions: {
      cat_allergens: "⚠️ The 14 Major Allergens (EU)",
      cat_diets: "🚫 Diets & Lifestyles",
      cat_dislikes: "❌ Common Intolerances & Dislikes",
      gluten: 'Gluten',
      crustaceans: 'Crustaceans',
      eggs: 'Eggs',
      fish: 'Fish',
      peanuts: 'Peanuts',
      soybeans: 'Soy',
      dairy: 'Milk/Lactose',
      nuts: 'Tree Nuts',
      celery: 'Celery',
      mustard: 'Mustard',
      sesame: 'Sesame',
      sulphites: 'Sulphites',
      lupin: 'Lupin',
      molluscs: 'Molluscs',
      vegan: 'Vegan (No animals)',
      vegetarian: 'Vegetarian',
      pescatarian: 'Pescatarians',
      halal: 'Halal',
      kosher: 'Kosher',
      keto: 'Keto (Low carb)',
      paleo: 'Paleo',
      low_fodmap: 'Low FODMAP',
      onion: 'Onion',
      garlic: 'Garlic',
      spicy: 'Spicy',
      cilantro: 'Cilantro',
      mushrooms: 'Mushrooms',
      pork: 'Pork',
      beef: 'Beef',
      alcohol: 'Alcohol',
      caffeine: 'Caffeine',
      sugar: 'Added Sugar',
      fructose: 'Fructose',
      bell_pepper: 'Bell Pepper',
      coconut: 'Coconut',
      cucumber: 'Cucumber'
    }
  },

  // ✅ FOOD PRESETS TRANSLATION
  food: {
    categories: {
      protein: '🥩 Protein',
      veggie: '🥦 Veggie',
      fruit: '🍎 Fruit',
      dairy: '🥛 Dairy',
      cereal: '🥖 Cereals',
      drink: '🥤 Drink',
      snack: '🍪 Snack',
      spice: '🧂 Condiments'
    },
    items: {
      // 🍎 FRUIT
      f1: 'Red apple',
      f2: 'Green apple',
      f3: 'Yellow apple',
      f4: 'Banana',
      f5: 'Plantain',
      f6: 'Conference pear',
      f7: 'White pear',
      f8: 'Orange',
      f9: 'Tangerine',
      f10: 'Lemon',
      f11: 'Lime',
      f12: 'Grapefruit',
      f13: 'Strawberry',
      f14: 'Blueberry',
      f15: 'Cherry',
      f16: 'White grape',
      f17: 'Red grape',
      f18: 'Peach',
      f19: 'Nectarine',
      f20: 'Flat peach',
      f21: 'Plum',
      f22: 'Apricot',
      f23: 'Green kiwi',
      f24: 'Yellow kiwi',
      f25: 'Pineapple',
      f26: 'Mango',
      f27: 'Melon',
      f28: 'Watermelon',
      f29: 'Coconut',
      f30: 'Quince',
      f31: 'Fig',
      f32: 'Fresh date',

      // 🥦 VEGGIE
      v1: 'Carrot',
      v2: 'Potato',
      v3: 'White onion',
      v4: 'Red onion',
      v5: 'Garlic',
      v6: 'Ripe tomato',
      v7: 'Cherry tomato',
      v8: 'Broccoli',
      v9: 'Cucumber',
      v10: 'Iceberg lettuce',
      v11: 'Romaine lettuce',
      v12: 'Oak leaf lettuce',
      v13: 'Fresh spinach',
      v14: 'Arugula',
      v15: 'Eggplant',
      v16: 'Green pepper',
      v17: 'Red pepper',
      v18: 'Yellow pepper',
      v19: 'Zucchini',
      v20: 'Cauliflower',
      v21: 'Kale/Cabbage',
      v22: 'Red cabbage',
      v23: 'Ginger',
      v24: 'Turnip',
      v25: 'Beetroot',
      v26: 'Corn',
      v27: 'Peas',
      v28: 'Green beans',
      v29: 'Mushrooms',
      v30: 'Mixed mushrooms',

      // 🥩 PROTEIN
      p1: 'Whole chicken',
      p2: 'Chicken breast',
      p3: 'Chicken thighs',
      p11: 'Chicken wings',
      p12: 'Fresh beef',
      p13: 'Minced beef',
      p14: 'Beef steak',
      p15: 'Beef fillet',
      p16: 'Pork loin',
      p17: 'Pork ribs',
      p18: 'Minced pork',
      p19: 'Bacon',
      p20: 'Lamb (leg)',
      p21: 'Lamb chops',
      p22: 'Hake',
      p23: 'Fresh cod',
      p24: 'Desalted cod',
      p25: 'Sea bream',
      p26: 'Sea bass',
      p27: 'Sardines',
      p28: 'Mackerel',
      p29: 'Fresh salmon',
      p30: 'Frozen salmon',
      p31: 'Fresh tuna',
      p32: 'Prawns',
      p33: 'Squid',
      p34: 'Mussels',
      p35: 'Langoustine',
      p36: 'Canned tuna',
      p37: 'Canned sardines',
      p38: 'Eggs',
      p39: 'Cooked lentils',
      p40: 'Cooked chickpeas',
      p41: 'Tofu',

      // 🥛 DAIRY
      l1: 'Whole milk',
      l2: 'Semi-skimmed milk',
      l3: 'Skimmed milk',
      l4: 'Lactose-free milk',
      l5: 'Cured cheese',
      l6: 'Semi-cured cheese',
      l7: 'Soft cheese',
      l8: 'Grated cheese',
      l9: 'Mozzarella',
      l10: 'Parmesan cheese',
      l11: 'Fresh cheese',
      l12: 'Blue cheese',
      l13: 'Natural yogurt',
      l14: 'Greek yogurt',
      l15: 'Strawberry yogurt',
      l16: 'Flan/Pudding',
      l17: 'Custard',
      l18: 'Butter',
      l19: 'Cooking cream',
      l20: 'Ice cream',

      // 🥖 CEREALS
      c1: 'White bread',
      c2: 'Whole wheat bread',
      c3: 'Spaghetti',
      c4: 'Macaroni',
      c5: 'White rice',
      c6: 'Baguette',
      c7: 'Croissant',
      c8: 'Bagel',
      c9: 'Sliced bread',
      c10: 'Fusilli',
      c11: 'Penne pasta',
      c12: 'Noodles',
      c13: 'Brown rice',
      c14: 'Basmati rice',
      c15: 'Jasmine rice',
      c16: 'Couscous',
      c17: 'Quinoa',
      c18: 'Breakfast cereal',
      c19: 'Oat flakes',
      c20: 'Muesli',
      c21: 'Wheat flour',
      c22: 'Whole wheat flour',
      c23: 'Oat flour',
      c24: 'Ensaïmada',
      c25: 'Sponge cake',
      c26: 'Wheat tortillas',

      // 🥤 DRINK
      b1: 'Water',
      b2: 'Ground coffee',
      b3: 'Tea',
      b4: 'Cola soda',
      b5: 'Orange soda',
      b6: 'Lemon soda',
      b7: 'Orange juice',
      b8: 'Apple juice',
      b9: 'Coffee beans',
      b10: 'Instant coffee',
      b11: 'Herbal tea',
      b12: 'Oat milk',
      b13: 'Almond milk',
      b14: 'Beer',
      b15: 'Wine',
      b16: 'White wine',
      b17: 'Cava/Champagne',
      b18: 'Vermouth',
      b19: 'Tonic water',
      co13: 'Chicken broth',
      co14: 'Fish broth',

      // 🍪 SNACK
      s1: 'Cookies',
      s2: 'Dark chocolate',
      s3: 'Popcorn',
      s4: 'Almonds',
      s5: 'Milk chocolate',
      s6: 'White chocolate',
      s7: 'Candies',
      s8: 'Lollipops',
      s9: 'Muffin',
      s10: 'Donut',
      s11: 'Breadsticks',
      s12: 'Pretzels',
      s13: 'Potato chips',
      s14: 'Nachos',
      s15: 'Hazelnuts',
      s16: 'Walnuts',
      s17: 'Cashews',
      s18: 'Peanuts',
      s19: 'Sunflower seeds',
      s20: 'Salted crackers',
      s21: 'Crackers',
      s22: 'Cereal bars',
      s23: 'Honey',

      // 🧂 CONDIMENTS
      co1: 'Virgin olive oil',
      co2: 'Sunflower oil',
      co3: 'Salt',
      co4: 'Black pepper',
      co5: 'Wine vinegar',
      co6: 'Balsamic vinegar',
      co7: 'Butter',
      co8: 'Margarine',
      co9: 'Ketchup',
      co10: 'Mayonnaise',
      co11: 'Mustard',
      co12: 'Jam/Marmalade',
      co15: 'Fried tomato sauce',

      // 🥖 QUICK FROZEN (Z)
      z1: 'Frozen pizza',
      z2: 'Frozen fries',
      z3: 'Ready lasagna',
      z4: 'Croquettes'
    }
  },
  community: {
    title: 'Community',
    title_suffix: 'Foodie',
    subtitle: 'Explore what people are cooking.',
    search_placeholder: 'Search ingredients...',
    filters: {
      all: 'All',
      fast: 'Fast',
      veggie: 'Veggie',
      vegan: 'Vegan',
      gluten_free: 'Gluten Free',
      dairy_free: 'Dairy Free',
      dessert: 'Dessert'
    },
    empty_state: 'No recipes found.',
    pagination: {
      page: 'Page',
      of: 'of'
    },
    steps: {
      title: 'Instructions',
      count_suffix: 'steps',
      empty: 'No detailed steps.'
    }
  },
  ranking: {
    top_label: 'TOP',
    title: 'Hall of Fame',
    season: 'Season 1',
    aspirants: 'Contenders',
    empty_list: 'Nobody here yet... 👻',
    you_suffix: '(You)',
    points_abbr: 'PTS'
  },
  inventory: {
    header: {
      title_prefix: 'Digital',
      title_suffix: 'Pantry',
      subtitle: "Stock and expiration control",
      items_label: 'ITEMS:'
    },
    dashboard: {
      title_all: "📦 All Inventory",
      title_expiring: "⚠️ Expiring Soon",
      filter_prefix: "📂",
      clear_filter: "✕ Clear",
      scan_btn: "AI Scan",
      add_btn: "Add",
      close_btn: "Close"
    },
    list: {
      empty_title: "👻",
      empty_text: "No items found here.",
      status: {
        expired: "Expired",
        expiring: "Expiring Soon"
      }
    },
    scanner: {
      title_suffix: "Products",
      subtitle: "Review before saving",
      no_items: "No items left.",
      back: "Back",
      photo_btn: "Photo",
      confirm_btn: "Confirm all",
      saving: "Saving...",
      error_save: "Error saving items."
    },
    actions: {
      add: "Add",
      close: "Close",
      scan: "AI Scan",
      clear: "Clear",
      save: "📥 Save to Pantry",
      saving: "Saving..."
    },
    form: {
      add_title: "Add new item",
      name_placeholder: "What are we adding?",
      quantity_label: "Quantity",
      location: {
        fridge: "Fridge",
        pantry: "Pantry",
        freezer: "Freezer"
      },
      unit: {
        ut: "Unit",
        kg: "Kg",
        l: "L",
        g: "g"
      }
    },
    add_item: {
      main_btn: 'Add new item',
      close_btn: 'Close scanner'
    }


  },
  social: {
    title: 'Social Zone',
    actions: {
      create_badge: 'NEW',
      create_title: 'Create Room',
      join_badge: 'GUEST',
      join_title: 'Join'
    },
    grid: {
      title: 'Active Rooms',
      empty: 'No active rooms yet.',
      role_admin: 'Admin',
      role_member: 'Member'
    }
  },
  create_recipe: {
    steps: {
      title: 'Instructions',
      placeholder: 'Write step here... (Click ingredients below to insert)',
      quick_insert: 'Quick insert:',
      timer: 'Timer',
      add_timer: '+ ⏰ Time',
      warning_ingredients: 'Add ingredients on the left first',
      add_btn: 'Add Step ↵',
      empty_state: 'The road to success starts here',
      step_label: 'Step'
    },
    ingredients: {
      title: 'Magic Pantry',
      selected: 'selected',
      search_placeholder: 'What do you need? (ex: Tomato)',
      category_all: '🌍 All',
      empty_search: 'Nothing found... try another category.',
      basket_title: 'Your basket:',
      basket_empty: 'Still empty...',
      unit_select: 'ut'
    },
    form: {
      title: 'New Recipe',
      label_title: 'Title',
      placeholder_title: 'Ex: Spanish Omelette',
      label_ingredients: 'Ingredients (comma separated)',
      placeholder_ingredients: 'Eggs, Potatoes, Oil, Salt',
      label_steps: 'Steps (one per line)',
      placeholder_steps: 'Cut potatoes\nFry\nWhisk eggs',
      submit_btn: 'Publish Recipe',
      success: 'Recipe published!',
      error_generic: 'Error publishing'
    },
    card: {
      view_sr: 'View',
      prep_time: 'm',
      created_by_you: 'Created by you',
      created_by_community: 'Community'
    },
    editor: {
      btn_publish: 'PUBLISH RECIPE',
      btn_cooking: 'COOKING...'
    },
    toasts: {
      missing_name: 'Hey! What is this masterpiece called? 🤔',
      missing_ingredients: 'Magic needs ingredients! 🥕',
      missing_steps: 'Tell us the secret (the steps)! 📜',
      success_title: '✨ Recipe Published!',
      success_desc: 'Now available to the community.',
      error_title: 'Oops! Something went wrong'
    },
    meta: {
      placeholder_name: 'Give it an epic name...',
      minutes_label: 'minutes',
      tags_title: 'Tags',
      tags: {
        vegan: 'Vegan',
        vegetarian: 'Vegetarian',
        gluten_free: 'Gluten Free',
        dairy_free: 'Dairy Free',
        quick: 'Quick',
        healthy: 'Healthy',
        dessert: 'Dessert'
      }
    }
  }
};