export const en = {
  common: {
    loading: 'Thinking...',
    error: 'Something went wrong',
    start_over: 'Start over',
    switch_lang: 'Switch language'
  },
  dashboard: {
    level: 'Level 1: Easy life',
    config: 'Settings',
    quick_decision: 'Quick Decision',
    create_room: 'Create Room',
    create_desc: 'Invite friends and decide together',
    join_room: 'Join',
    join_desc: 'Do you have an invite code?'
  },
  decision: {
    title_food: 'What are we eating today? 🍽️',
    energy_label: 'Energy Level',
    time_label: 'Available time',
    button_decide: '🎲 Decide for me!',
    disclaimer: '*No refunds, fate is final.',

    fate_spoken: 'Fate has spoken',
    why: 'Why?',
    roll_again: '🔄 Roll again',

    energy_levels: {
      low: 'Lazy mode',
      mid: 'Meh mode',
      high: 'Ready to conquer the world!'
    },
    reasons: {
      high_energy: "You have great energy! I randomly picked something from your favorites.",
      low_energy: "Low energy detected. I chose an easy and comforting option.",
      balanced: "A balanced option for the time you have.",
      random: "Fate decided completely at random.",
      default: "It seems like a good option for now."
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
    blind_desc: 'No one sees others’ options.',
    public_desc: 'Everyone sees what is written.',
    btn_change: 'Change',

    empty_options: 'No options yet',
    input_placeholder: 'Type an option...',
    add_btn: 'Add',
    hidden_candidate: '??????',

    magic_title: 'Fate Decides',
    magic_desc: 'The algorithm will analyze the food profiles of all participants to find the perfect mathematical match.',

    decide_magic: '✨ Make Magic & Decide',
    decide_roll: '🎲 Roll the Dice!',
    waiting_host: 'Waiting for Host...',

    history_title: 'History',
    trophy_empty_title: 'Empty Trophy Room',
    trophy_empty_desc: 'No decisions have been made yet.',
    wall_fame: 'Wall of Fame',
    view_more: '✨ View {count} more wins...',
    clean_room: '💣 Clear room',
    clean_confirm: 'Are you sure you want to delete the history?',

    err_kick: 'Error kicking user',
    err_clean: 'Error clearing history',
    err_add: 'Error adding option',
    err_general: 'Unknown error'
  },
  landing: {
    phrases: [
      { text: "I don’t know, you decide...", emoji: "🙄" },
      { text: "I don’t mind, really...", emoji: "🥱" },
      { text: "Where are we having dinner?", emoji: "😫" },
      { text: "Pizza again?", emoji: "🍕" },
      { text: "You choose, I don’t want to think", emoji: "🤯" }
    ],
    hero_title: 'Goodbye to wasting time deciding.',
    hero_subtitle: 'Hello to meeting more and thinking less.',

    btn_login: 'I already have an account',
    btn_start: '🚀 GET STARTED'
  },
  auth: {
    // Shared
    email_label: 'Email',
    email_placeholder: 'name@example.com',
    password_label: 'Password',
    password_placeholder: '••••••••',
    password_min: 'Minimum 6 characters',
    back: 'BACK',

    // Login
    login_title: 'Welcome back!',
    login_subtitle: 'Your room is waiting.',
    forgot_password: 'Forgot your password?',
    login_btn: 'LOG IN',
    no_account: "Don't have an account?",
    register_link: 'Sign up here',

    // Register
    register_title: 'Join the club',
    register_subtitle: 'Start the adventure today.',
    register_btn: 'CREATE ACCOUNT',
    has_account: 'Already have an account?',
    login_link: 'Log in here'
  },
  // ✅ NEW KEYS FOR CREATE/JOIN
  create_room: {
    back_cancel: '← CANCEL',
    hero_title: 'New Adventure',
    hero_subtitle: 'Create a space to decide with your group.',
    label_name: 'Room Name',
    placeholder_name: 'ex: Friday Dinner 🍕',
    btn_create: '🪄 CREATE ROOM',
    host_info: 'You will be the host 👑',
    err_name_required: 'Room name is required.',
    err_unknown: 'Unknown error creating the room.'
  },

  join_room: {
    back: '← BACK',
    hero_title: 'Got an invitation?',
    hero_subtitle: 'Enter the code to join the party.',
    label_code: 'ROOM CODE (UUID)',
    placeholder_code: 'paste-it-here...',
    btn_join: 'JOIN NOW 🍿',
    err_code_required: 'Code is required.'

  },
  profile: {
    back: '🔙',
    title: 'Your Character',
    subtitle: 'Profile Settings',
    saved: '✅ Saved!',
    save_btn: '💾 Save Changes',

    // Section 1: Food
    menu_title: 'Your Menu',
    menu_desc: 'What do you usually like to eat?',
    search_food: '🍕 Search food (ex: Sushi...)',

    // Section 2: Exclusions
    blacklist_title: 'Blacklist',
    blacklist_desc: 'Allergies and things you can’t tolerate.',
    search_allergy: '🥜 Search allergy (ex: Gluten...)',
    warning_title: '⚠️ Other Restrictions',
    warning_text: 'Did you forget something important?',
    warning_example: 'Ex: Coriander, Peach, Food Coloring E-120...',
    warning_placeholder: 'Type here and press Enter...',

    // Section 3: Tolerance
    flexibility_title: 'Flexibility',
    flexibility_desc: 'How easy are you to convince?',
    rigid: 'Rigid',
    flexible: 'Flexible',
    levels: {
      low: 'NON-NEGOTIABLE',
      mid: 'NEUTRAL',
      high: 'I ADAPT TO EVERYTHING'
    },


    food: {
      // Categories
      cat_world_west: "🌍 World Cuisines (Europe & America)",
      cat_world_east: "🥢 World Cuisines (Asia & Orient)",
      cat_fast: "🍔 Fast Food & Casual",
      cat_specific: "🍣 Specific Dishes & Delicacies",
      cat_healthy: "🥗 Healthy & Light",
      cat_sweet: "🧁 Breakfast & Sweets",

      // Items (World West)
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

      // Items (World East)
      japanese: 'Japanese',
      chinese: 'Chinese',
      indian: 'Indian',
      thai: 'Thai',
      korean: 'Korean',
      vietnamese: 'Vietnamese',
      turkish: 'Turkish',
      lebanese: 'Lebanese',
      poke: 'Hawaiian (Poke)',

      // Items (Fast Food)
      pizza: 'Pizza',
      burger: 'Burger',
      fried_chicken: 'Fried Chicken',
      kebab: 'Kebab/Dürüm',
      hotdog: 'Hot Dog',
      tacos: 'Tacos/Burritos',
      sandwich: 'Sandwiches/Wraps',
      crepes: 'Crepes',
      empanadas: 'Empanadas',

      // Items (Specific)
      sushi: 'Sushi',
      ramen: 'Ramen',
      steak: 'Grilled Meat',
      seafood_dish: 'Seafood Platter',
      paella: 'Paella/Rice',
      pasta: 'Pasta',
      bbq: 'BBQ/Ribs',
      dimsum: 'Dim Sum/Gyozas',
      fondue: 'Fondue/Raclette',

      // Items (Healthy)
      salad: 'Salads',
      poke_bowl: 'Poke Bowl',
      soup: 'Soups/Crems',
      vegan_dish: 'Vegan Dishes',
      smoothies: 'Smoothies/Fruit',
      grilled_fish: 'Grilled Fish',

      // Items (Sweet)
      breakfast: 'Brunch',
      croissant: 'Pastry',
      ice_cream: 'Ice Cream',
      coffee: 'Coffee',
      bubble_tea: 'Bubble Tea',
      donuts: 'Donuts/Berliners'
    },

    exclusions: {
      // Categories
      cat_allergens: "⚠️ The 14 Main Allergens (EU)",
      cat_diets: "🚫 Diets & Lifestyles",
      cat_dislikes: "❌ Common Intolerances & Dislikes",

      // Allergens
      gluten: 'Gluten',
      crustaceans: 'Crustaceans',
      eggs: 'Eggs',
      fish: 'Fish',
      peanuts: 'Peanuts',
      soybeans: 'Soy',
      dairy: 'Milk/Lactose',
      nuts: 'Nuts',
      celery: 'Celery',
      mustard: 'Mustard',
      sesame: 'Sesame',
      sulphites: 'Sulphites',
      lupin: 'Lupin',
      molluscs: 'Molluscs',

      // Diets
      vegan: 'Vegan (No animals)',
      vegetarian: 'Vegetarian',
      pescatarian: 'Pescatarian',
      halal: 'Halal',
      kosher: 'Kosher',
      keto: 'Keto (Low carbs)',
      paleo: 'Paleo',
      low_fodmap: 'Low FODMAP',

      // Intolerances / Dislikes
      onion: 'Onion',
      garlic: 'Garlic',
      spicy: 'Spicy',
      cilantro: 'Coriander',
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

  }

};
