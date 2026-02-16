/* ============================================================
   Smart Learning for Independence – Module Data
   All 24 modules across 4 strands, each containing:
   - metadata (id, strand, number, title, icon, description)
   - outcomes, vocabulary, tools
   - activities (interactive content the app renders)
   - quiz questions for formative assessment
   - portfolio prompt
   ============================================================ */

const STRANDS = [
  { id: 1, title: 'Digital Foundations & Safety', color: '#3b82f6', icon: '🛡️', modules: 'mod-1 to mod-6' },
  { id: 2, title: 'Financial Capability & Digital Banking', color: '#22c55e', icon: '💰', modules: 'mod-7 to mod-12' },
  { id: 3, title: 'Community, Travel & Everyday Tech', color: '#a855f7', icon: '🗺️', modules: 'mod-13 to mod-18' },
  { id: 4, title: 'Work Readiness & Communication', color: '#f97316', icon: '💼', modules: 'mod-19 to mod-24' },
];

function strandFor(modNum) {
  if (modNum <= 6)  return STRANDS[0];
  if (modNum <= 12) return STRANDS[1];
  if (modNum <= 18) return STRANDS[2];
  return STRANDS[3];
}

const MODULES = [
  /* ======== STRAND 1: Digital Foundations & Safety ======== */
  {
    id: 'mod-1', num: 1, strand: 1,
    title: 'Getting Started with iPads & Smart Board',
    icon: '📱', badge: '📱 Device Explorer',
    description: 'Learn the basics: turning on, unlocking, opening apps, and using the Smart Board.',
    outcomes: [
      'Turn on and unlock a device',
      'Open and close an app',
      'Use the Smart Board tools',
    ],
    vocabulary: ['tap', 'swipe', 'icon', 'app', 'home button', 'lock screen'],
    tools: ['iPad with Guided Access', 'Smart Board whiteboard', 'Large-icon home screen'],
    teachContent: [
      { type: 'info', title: 'What is an iPad?', body: 'An iPad is a tablet computer made by Apple. You use your fingers to tap the screen to open apps, play games, watch videos, and learn new things.' },
      { type: 'info', title: 'Turning On Your iPad', body: 'Press and hold the button on the top or side until you see the Apple logo. Then swipe up or press the Home button to unlock.' },
      { type: 'info', title: 'The Home Screen', body: 'The Home Screen shows all your apps as small pictures called icons. Tap an icon to open the app. Press the Home button to go back.' },
      { type: 'info', title: 'Using the Smart Board', body: 'The Smart Board is a big touch screen on the wall. You can write, draw, and play games on it. Use your finger or the special pen.' },
    ],
    activities: [
      { type: 'sort', title: 'Match the Action', instruction: 'Match each action to what happens on the iPad.',
        items: [
          { text: 'Tap an icon', match: 'Opens an app' },
          { text: 'Swipe up', match: 'Goes to Home Screen' },
          { text: 'Press & hold power', match: 'Turns on the iPad' },
          { text: 'Swipe left/right', match: 'See more apps' },
        ]},
    ],
    quiz: [
      { q: 'How do you open an app on the iPad?', options: ['Tap the icon', 'Shake the iPad', 'Blow on the screen', 'Close your eyes'], answer: 0 },
      { q: 'What button takes you back to the Home Screen?', options: ['Volume button', 'Home button', 'Lock button', 'Camera button'], answer: 1 },
      { q: 'What is the Smart Board?', options: ['A small phone', 'A big touch screen on the wall', 'A keyboard', 'A game controller'], answer: 1 },
    ],
    portfolioPrompt: 'Take a screenshot of yourself using the iPad or write one thing you learned about using the device.',
  },

  {
    id: 'mod-2', num: 2, strand: 1,
    title: 'Accessibility: Making the Device Easy for Me',
    icon: '♿', badge: '♿ Access Champion',
    description: 'Explore iPad accessibility settings and choose what helps you.',
    outcomes: [
      'Find the Accessibility settings menu',
      'Enable at least one helpful setting (Speak Selection, Dictation, or Larger Text)',
      'Create a personal "My Access Profile" card',
    ],
    vocabulary: ['accessibility', 'settings', 'text size', 'speak screen', 'voice control', 'zoom'],
    tools: ['iPad Settings app', 'My Access Profile template'],
    teachContent: [
      { type: 'info', title: 'What is Accessibility?', body: 'Accessibility means making things easier for everyone to use. Your iPad has special settings that can help you see, hear, and use it better.' },
      { type: 'info', title: 'Bigger Text', body: 'If text is too small, go to Settings → Accessibility → Display & Text Size → Larger Text. Drag the slider to make words bigger!' },
      { type: 'info', title: 'Speak Selection', body: 'The iPad can read text out loud! Go to Settings → Accessibility → Spoken Content → Speak Selection. Then select any text and tap "Speak".' },
      { type: 'info', title: 'Dictation', body: 'Don\'t like typing? Use your voice! Tap the microphone 🎤 on the keyboard and speak. The iPad types what you say.' },
    ],
    activities: [
      { type: 'checklist', title: 'Try These Settings', instruction: 'Try each setting and check off the ones you like.',
        items: [
          'Make text bigger',
          'Turn on Speak Selection',
          'Try Dictation (voice typing)',
          'Turn on Zoom',
          'Change display to Bold Text',
        ]},
    ],
    quiz: [
      { q: 'Where do you find Accessibility settings?', options: ['In the Camera app', 'In Settings → Accessibility', 'On the Home Screen', 'In Messages'], answer: 1 },
      { q: 'What does "Speak Selection" do?', options: ['Makes the iPad louder', 'Reads text out loud', 'Turns off the screen', 'Takes a photo'], answer: 1 },
      { q: 'How can you type without using the keyboard?', options: ['Shake the iPad', 'Use Dictation (voice)', 'Turn it off', 'Close the app'], answer: 1 },
    ],
    portfolioPrompt: 'Take a screenshot of your chosen accessibility settings and write which one helps you the most.',
  },

  {
    id: 'mod-3', num: 3, strand: 1,
    title: 'Online Safety: Safe or Unsafe?',
    icon: '🛡️', badge: '🛡️ Safety Star',
    description: 'Know what safe and unsafe online content looks like.',
    outcomes: [
      'Identify safe vs unsafe content',
      'Tell a trusted adult when something feels wrong',
      'Use close/leave/report actions',
    ],
    vocabulary: ['safe', 'unsafe', 'pop-up', 'report', 'trusted adult', 'close'],
    tools: ['Smart Board card sort', 'Printed safe/unsafe cards'],
    teachContent: [
      { type: 'info', title: 'Safe vs Unsafe Online', body: 'The internet has lots of good things – but some things are unsafe. Safe content comes from trusted websites and apps. Unsafe content tries to trick you or makes you feel uncomfortable.' },
      { type: 'info', title: 'What to Do If Something Feels Wrong', body: 'STOP – don\'t click anything. CLOSE the page or app. TELL a trusted adult (teacher, parent, support worker) straight away.' },
      { type: 'info', title: 'Pop-ups and Ads', body: 'Pop-ups are windows that appear suddenly. They might say "You won a prize!" or "Click here!" – these are usually tricks. Close them by pressing the X button.' },
    ],
    activities: [
      { type: 'sort-buckets', title: 'Safe or Unsafe?', instruction: 'Drag each item to the correct bucket.',
        buckets: ['✅ Safe', '❌ Unsafe'],
        items: [
          { text: 'A website your teacher showed you', bucket: 0 },
          { text: 'A pop-up saying "You won $1000!"', bucket: 1 },
          { text: 'An email from someone you don\'t know with a link', bucket: 1 },
          { text: 'The school learning app', bucket: 0 },
          { text: 'A message asking for your password', bucket: 1 },
          { text: 'A video your support worker recommended', bucket: 0 },
        ]},
    ],
    quiz: [
      { q: 'A pop-up says "You won a prize! Click here!" What do you do?', options: ['Click it quickly', 'Close it and tell an adult', 'Give your address', 'Share it with friends'], answer: 1 },
      { q: 'Who is a trusted adult you can tell?', options: ['A stranger online', 'Your teacher or support worker', 'Someone in a chat room', 'A pop-up message'], answer: 1 },
      { q: 'What are the 3 safety steps?', options: ['Click, Share, Forget', 'Stop, Close, Tell', 'Open, Read, Reply', 'Like, Follow, Subscribe'], answer: 1 },
    ],
    portfolioPrompt: 'Write or record your 3 rules for staying safe online.',
  },

  {
    id: 'mod-4', num: 4, strand: 1,
    title: 'Passwords & Privacy',
    icon: '🔐', badge: '🔐 Password Pro',
    description: 'Create and protect strong passwords.',
    outcomes: [
      'Create a strong passphrase',
      'Understand why passwords must be private',
      'Know where to safely store passwords',
    ],
    vocabulary: ['password', 'passphrase', 'private', 'secret', 'password manager'],
    tools: ['Passphrase dice game', 'Password Rules poster template'],
    teachContent: [
      { type: 'info', title: 'What is a Password?', body: 'A password is a secret word or phrase that only you know. It keeps your accounts safe – like a key for a lock.' },
      { type: 'info', title: 'Strong vs Weak Passwords', body: 'Weak: "1234" or "password". Strong: "PurpleFrog42Rain!" – use 3 random words + a number. The longer, the better!' },
      { type: 'info', title: 'Keep It Secret!', body: 'NEVER share your password with anyone except a trusted adult who helps you. Don\'t write it on a sticky note on your device!' },
      { type: 'info', title: 'Password Managers', body: 'A password manager is a safe app that remembers all your passwords for you. You only need to remember one main password.' },
    ],
    activities: [
      { type: 'passphrase-builder', title: 'Build a Strong Passphrase', instruction: 'Pick one word from each column to make your passphrase. Then add a number!',
        columns: [
          ['Purple', 'Happy', 'Silver', 'Sunny', 'Brave', 'Quiet'],
          ['Frog', 'Cloud', 'Tiger', 'Banana', 'River', 'Star'],
          ['Rain', 'Jump', 'Sing', 'Zoom', 'Glow', 'Dance'],
        ]},
    ],
    quiz: [
      { q: 'Which is the strongest password?', options: ['1234', 'password', 'BraveTiger99Jump', 'abc'], answer: 2 },
      { q: 'Who should you share your password with?', options: ['Your best friend', 'No one (except a trusted adult who helps you)', 'Everyone', 'People online'], answer: 1 },
      { q: 'What does a password manager do?', options: ['Deletes your passwords', 'Safely stores your passwords', 'Shares your passwords', 'Creates weak passwords'], answer: 1 },
    ],
    portfolioPrompt: 'Create a "My Password Rules" poster (no actual passwords shown).',
  },

  {
    id: 'mod-5', num: 5, strand: 1,
    title: 'Scams: Spotting Fake Messages',
    icon: '🎣', badge: '🎣 Scam Spotter',
    description: 'Recognise scam messages and know what to do.',
    outcomes: [
      'Spot signs of a scam message',
      'Know not to click unknown links',
      'Report suspicious messages to staff',
    ],
    vocabulary: ['scam', 'phishing', 'suspicious', 'link', 'report', 'fake'],
    tools: ['Fake email/SMS cards', 'Smart Board "Spot the Scam"'],
    teachContent: [
      { type: 'info', title: 'What is a Scam?', body: 'A scam is when someone tries to trick you into giving them money or personal information. Scams can come by email, text message, phone call, or social media.' },
      { type: 'info', title: 'Scam Clues to Look For', body: '🔴 Spelling mistakes and bad grammar\n🔴 "Act now!" or "Urgent!"\n🔴 Asking for your password or bank details\n🔴 Links that look strange\n🔴 From someone you don\'t know' },
      { type: 'info', title: 'What to Do', body: 'DON\'T click any links. DON\'T reply. TELL a trusted adult or staff member. DELETE or REPORT the message.' },
    ],
    activities: [
      { type: 'spot-the-scam', title: 'Real or Scam?', instruction: 'Look at each message. Is it REAL or a SCAM?',
        messages: [
          { text: 'Hi! Your package is waiting. Click here to track: bit.ly/x8f2k', isScam: true, clue: 'Strange link from unknown sender' },
          { text: 'Appointment reminder: Dr Smith, Tuesday 2pm at Bayside Medical.', isScam: false, clue: 'From your known doctor\'s clinic' },
          { text: 'URGENT! Your bank account will be closed! Send your PIN now!', isScam: true, clue: 'Banks never ask for your PIN' },
          { text: 'Your Opal card was topped up with $20. No action needed.', isScam: false, clue: 'Matches something you actually did' },
          { text: 'Congratulations!! You won $50,000! Click to claim: freemoney.xyz', isScam: true, clue: 'Too good to be true + strange link' },
        ]},
    ],
    quiz: [
      { q: 'A text says "URGENT! Your bank account will close! Send your PIN." What do you do?', options: ['Send your PIN quickly', 'Ignore and report to a trusted adult', 'Click the link to check', 'Reply asking for more info'], answer: 1 },
      { q: 'Which is a clue that a message might be a scam?', options: ['It\'s from your teacher', 'It has good spelling', 'It says "Act now!" and asks for personal info', 'It\'s about your real appointment'], answer: 2 },
      { q: 'Your bank will NEVER ask for your...', options: ['Name', 'PIN or password by text/email', 'Address', 'Phone number'], answer: 1 },
    ],
    portfolioPrompt: 'Annotate a fake scam message – circle the clues that show it\'s a scam.',
  },

  {
    id: 'mod-6', num: 6, strand: 1,
    title: 'Taking & Sharing Photos Safely',
    icon: '📸', badge: '📸 Privacy Guardian',
    description: 'Understand photo consent and safe sharing.',
    outcomes: [
      'Ask before taking or posting someone\'s photo',
      'Recognise the share icon',
      'Choose private settings on social media',
    ],
    vocabulary: ['consent', 'permission', 'share', 'private', 'public', 'social media'],
    tools: ['Consent traffic light cards', 'iPads', 'Demo social media app'],
    teachContent: [
      { type: 'info', title: 'What is Photo Consent?', body: 'Consent means asking permission. Before you take someone\'s photo or share it online, you MUST ask them first. They can say yes or no – and that\'s okay!' },
      { type: 'info', title: 'Traffic Light Rules', body: '🟢 GREEN = Yes, you can share (they said it\'s okay)\n🟡 YELLOW = Maybe, ask first (not sure if it\'s okay)\n🔴 RED = No, don\'t share (they said no, or you didn\'t ask)' },
      { type: 'info', title: 'Private vs Public', body: 'Private means only people you choose can see your posts. Public means anyone can see them. Keep your accounts PRIVATE and only share with people you know and trust.' },
    ],
    activities: [
      { type: 'traffic-light', title: 'Share or Don\'t Share?', instruction: 'For each situation, choose: GREEN (okay to share), YELLOW (ask first), or RED (don\'t share).',
        scenarios: [
          { text: 'A selfie of just you, on your private account', answer: 'green', why: 'It\'s your photo on a private account' },
          { text: 'A photo of your friend – you haven\'t asked them', answer: 'red', why: 'You need to ask permission first' },
          { text: 'A group photo at the showcase – everyone said yes', answer: 'green', why: 'Everyone gave consent' },
          { text: 'A photo showing someone\'s address or full name', answer: 'red', why: 'Never share personal information' },
          { text: 'Your artwork that you\'re proud of', answer: 'green', why: 'It\'s your own work' },
          { text: 'A photo of a classmate\'s screen with their info', answer: 'red', why: 'That\'s someone else\'s private information' },
        ]},
    ],
    quiz: [
      { q: 'Before sharing someone\'s photo, you should...', options: ['Just post it', 'Ask their permission first', 'Tag them without asking', 'Send it to everyone'], answer: 1 },
      { q: 'What does a RED traffic light mean for sharing?', options: ['Go ahead and share', 'Ask first', 'Don\'t share', 'Share with everyone'], answer: 2 },
      { q: 'Should your social media account be PUBLIC or PRIVATE?', options: ['Public so everyone can see', 'Private so only trusted people can see', 'It doesn\'t matter', 'Delete it'], answer: 1 },
    ],
    portfolioPrompt: 'Create a "My Sharing Rules" one-pager with your personal rules for sharing photos online.',
  },

  /* ======== STRAND 2: Financial Capability & Digital Banking ======== */
  {
    id: 'mod-7', num: 7, strand: 2,
    title: 'Everyday Money: What Things Cost',
    icon: '💵', badge: '💵 Money Smart',
    description: 'Understand prices and simple budgeting.',
    outcomes: [
      'Recognise Australian notes and coins',
      'Match money to its value',
      'Compare prices of everyday items',
      'Understand needs vs wants in a budget',
    ],
    vocabulary: ['price', 'cost', 'budget', 'change', 'total', 'expensive', 'cheap', 'notes', 'coins'],
    tools: ['Smart Board shopping game', 'Price comparison cards', 'Windgap Money Cards'],
    teachContent: [
      { type: 'info', title: 'Australian Money', body: 'Australia uses dollars ($) and cents (¢). There are 100 cents in $1. Notes come in $5, $10, $20, $50, and $100. Coins are 5¢, 10¢, 20¢, 50¢, $1, and $2.' },
      { type: 'info', title: 'Understanding Prices', body: 'Every item in a shop has a price tag. When you see $4.50, that means 4 dollars and 50 cents. Always check the price before you buy!' },
      { type: 'info', title: 'Budgeting Basics', body: 'A budget is a plan for your money. Write down how much you have, then plan what to spend it on. Needs first (food, bills), then wants (treats, fun).' },
    ],
    activities: [
      { type: 'money-game', title: '💵 Money Matching Game', instruction: 'Learn to recognise Australian notes and coins, then play matching games!' },
      { type: 'budget-challenge', title: 'Shopping Challenge', instruction: 'You have $25 to spend. Pick items but stay under budget!',
        budget: 25,
        items: [
          { name: 'Bread', price: 3.50, icon: '🍞', isNeed: true },
          { name: 'Milk', price: 3.00, icon: '🥛', isNeed: true },
          { name: 'Lollies', price: 4.50, icon: '🍬', isNeed: false },
          { name: 'Chicken', price: 8.00, icon: '🍗', isNeed: true },
          { name: 'Magazine', price: 7.00, icon: '📖', isNeed: false },
          { name: 'Apples', price: 5.00, icon: '🍎', isNeed: true },
          { name: 'Toy', price: 12.00, icon: '🧸', isNeed: false },
          { name: 'Rice', price: 3.00, icon: '🍚', isNeed: true },
        ]},
    ],
    quiz: [
      { q: 'How many cents in one dollar?', options: ['10', '50', '100', '1000'], answer: 2 },
      { q: 'Which is a NEED?', options: ['Video game', 'Food & groceries', 'Fancy shoes', 'Concert tickets'], answer: 1 },
      { q: 'What is a budget?', options: ['A type of money', 'A plan for spending your money', 'A shop', 'A bank card'], answer: 1 },
    ],
    portfolioPrompt: 'Create a screenshot of your budget shopping challenge showing what you bought and how much you spent.',
  },

  {
    id: 'mod-8', num: 8, strand: 2,
    title: 'Using a Budgeting App',
    icon: '📊', badge: '📊 Budget Boss',
    description: 'Track simple income and expenses with an app.',
    outcomes: [
      'Set up spending categories',
      'Enter income and expenses',
      'Read a spending summary',
    ],
    vocabulary: ['income', 'expense', 'category', 'balance', 'track', 'summary'],
    tools: ['Budgeting app (training mode)', 'Handouts'],
    teachContent: [
      { type: 'info', title: 'Why Track Your Spending?', body: 'Tracking your money helps you know where it goes. Many people are surprised when they see how much they spend on small things!' },
      { type: 'info', title: 'Categories', body: 'Organise your spending into groups: 🍔 Food, 🚌 Transport, 🎮 Fun, 🏠 Bills, 💊 Health. This helps you see what you spend the most on.' },
      { type: 'info', title: 'How Budgeting Apps Work', body: 'Open the app → Add your income (money coming in) → Add each thing you buy → The app shows you a summary and chart of where your money went.' },
    ],
    activities: [
      { type: 'budget-tracker', title: 'My Weekly Budget', instruction: 'Enter these transactions and see where your money goes.',
        income: 150,
        transactions: [
          { name: 'Bus pass', amount: 20, category: '🚌 Transport' },
          { name: 'Groceries', amount: 45, category: '🍔 Food' },
          { name: 'Movie ticket', amount: 18, category: '🎮 Fun' },
          { name: 'Phone bill', amount: 30, category: '🏠 Bills' },
          { name: 'Lunch out', amount: 15, category: '🍔 Food' },
        ]},
    ],
    quiz: [
      { q: 'What is income?', options: ['Money you spend', 'Money coming in', 'A type of bill', 'A bank name'], answer: 1 },
      { q: 'Why do we use categories in budgeting?', options: ['To make it confusing', 'To see where money goes', 'To spend more', 'To delete transactions'], answer: 1 },
      { q: 'If you earn $150 and spend $128, how much is left?', options: ['$128', '$22', '$150', '$0'], answer: 1 },
    ],
    portfolioPrompt: 'Create a simple weekly budget showing your income and spending categories.',
  },

  {
    id: 'mod-9', num: 9, strand: 2,
    title: 'Digital Banking Basics',
    icon: '🏦', badge: '🏦 Banking Basics',
    description: 'Navigate a banking app to check balance & transactions (training mode).',
    outcomes: [
      'Navigate a demo banking app',
      'Find account balance',
      'Read recent transactions',
    ],
    vocabulary: ['balance', 'transaction', 'deposit', 'withdrawal', 'statement', 'account'],
    tools: ['Demo banking app', 'Smart Board walkthrough'],
    teachContent: [
      { type: 'info', title: 'What is Digital Banking?', body: 'Digital banking means using an app or website to manage your money instead of going to the bank. You can check your balance, see what you\'ve spent, and more.' },
      { type: 'info', title: 'Your Balance', body: 'Your balance is how much money you have in your account right now. It goes up when money comes in (deposit) and down when you spend (withdrawal).' },
      { type: 'info', title: 'Transactions', body: 'A transaction is any time money moves in or out of your account. Your banking app shows a list of all your transactions.' },
      { type: 'warning', title: '⚠️ Safety Rule', body: 'NEVER use your real banking app in class. We only use pretend/training accounts. Never let anyone see your real banking login.' },
    ],
    activities: [
      { type: 'bank-demo', title: 'Demo Bank App', instruction: 'Explore this practice bank account. Find the balance and recent transactions.',
        accountName: 'Training Account',
        balance: 542.80,
        transactions: [
          { date: 'Today', desc: 'Woolworths', amount: -32.50, icon: '🛒' },
          { date: 'Yesterday', desc: 'Pay - Windgap', amount: 450.00, icon: '💰' },
          { date: '2 days ago', desc: 'Opal top-up', amount: -20.00, icon: '🚌' },
          { date: '3 days ago', desc: 'Chemist Warehouse', amount: -15.70, icon: '💊' },
          { date: '4 days ago', desc: 'Transfer from Mum', amount: 50.00, icon: '💝' },
        ]},
    ],
    quiz: [
      { q: 'What is your balance?', options: ['How much you can borrow', 'How much money is in your account', 'Your account number', 'Your bank\'s address'], answer: 1 },
      { q: 'What is a transaction?', options: ['A type of bank', 'When money moves in or out', 'Your password', 'A receipt'], answer: 1 },
      { q: 'Should you use your real bank app in class?', options: ['Yes, always', 'No, only training accounts in class', 'Yes, to show your balance', 'Yes, if the teacher asks'], answer: 1 },
    ],
    portfolioPrompt: 'Create a step-card showing the steps to check your balance in a banking app.',
  },

  {
    id: 'mod-10', num: 10, strand: 2,
    title: 'Paying Safely (Tap, Online, BSB/Account)',
    icon: '💳', badge: '💳 Payment Pro',
    description: 'Recognise secure payments and avoid unsafe links.',
    outcomes: [
      'Recognise secure checkout (padlock/https)',
      'Avoid unsafe payment links',
      'Understand tap-to-pay basics',
    ],
    vocabulary: ['tap-to-pay', 'PIN', 'secure', 'padlock', 'https', 'checkout'],
    tools: ['Sandbox checkout flow', 'Security icon cards'],
    teachContent: [
      { type: 'info', title: 'Tap & Go', body: 'For purchases under $100, hold your card near the payment terminal. Wait for the beep – done! For over $100, you\'ll need your PIN.' },
      { type: 'info', title: 'Online Payment Safety', body: 'When paying online, look for: 🔒 A padlock icon in the address bar, "https://" at the start of the web address. These mean the website is secure.' },
      { type: 'info', title: 'What NOT to Do', body: 'Never enter your card details on a website without the padlock. Never send your card number by text or email. Never pay someone you don\'t know.' },
    ],
    activities: [
      { type: 'safe-or-not', title: 'Safe to Pay?', instruction: 'Look at each checkout scenario. Is it SAFE or UNSAFE to pay?',
        scenarios: [
          { text: 'Website shows 🔒 and starts with https://', safe: true, why: 'Secure connection with padlock' },
          { text: 'Someone texts you asking to send money via gift cards', safe: false, why: 'Never pay with gift cards – it\'s a scam' },
          { text: 'Tapping your card at a supermarket terminal', safe: true, why: 'Normal tap-to-pay at a real shop' },
          { text: 'A website with no padlock asking for credit card details', safe: false, why: 'No padlock = not secure' },
          { text: 'Paying through PayPal on a known shopping site', safe: true, why: 'PayPal is a secure payment method' },
        ]},
    ],
    quiz: [
      { q: 'What icon shows a website is secure?', options: ['A star ⭐', 'A padlock 🔒', 'A heart ❤️', 'A smiley 😊'], answer: 1 },
      { q: 'For tap-to-pay, when do you need your PIN?', options: ['Never', 'Every time', 'Over $100', 'Only at ATMs'], answer: 2 },
      { q: 'Should you send your card number by text message?', options: ['Yes, it\'s easy', 'No, never', 'Only to friends', 'Only if they ask nicely'], answer: 1 },
    ],
    portfolioPrompt: 'Create a "Safe Paying Checklist" with icons showing what to look for.',
  },

  {
    id: 'mod-11', num: 11, strand: 2,
    title: 'Bills & Subscriptions',
    icon: '📄', badge: '📄 Bill Manager',
    description: 'Read a bill, set reminders, understand recurring charges.',
    outcomes: [
      'Read the key parts of a simple bill',
      'Set a calendar reminder for due dates',
      'Understand subscriptions and how to unsubscribe',
    ],
    vocabulary: ['bill', 'due date', 'subscription', 'recurring', 'unsubscribe', 'reminder'],
    tools: ['Sample bills', 'Calendar app', 'Subscription checklist'],
    teachContent: [
      { type: 'info', title: 'Reading a Bill', body: 'Every bill has key parts: WHO it\'s from, HOW MUCH you owe, WHEN it\'s due (the date you must pay by), and HOW to pay.' },
      { type: 'info', title: 'Setting Reminders', body: 'Use your phone\'s Calendar app to set a reminder a few days BEFORE each bill is due. This way you won\'t forget to pay on time!' },
      { type: 'info', title: 'Subscriptions', body: 'A subscription is a regular payment (weekly, monthly) for a service like Netflix, Spotify, or a game. Check your subscriptions regularly – unsubscribe from ones you don\'t use!' },
    ],
    activities: [
      { type: 'bill-reader', title: 'Read This Bill', instruction: 'Look at this sample bill and answer the questions.',
        bill: {
          from: 'Telstra Mobile',
          amount: 45.00,
          dueDate: '15 March 2026',
          accountNo: '****1234',
          period: '1 Feb – 28 Feb 2026',
        },
        questions: [
          { q: 'Who is the bill from?', answer: 'Telstra Mobile' },
          { q: 'How much do you need to pay?', answer: '$45.00' },
          { q: 'When is it due?', answer: '15 March 2026' },
        ]},
    ],
    quiz: [
      { q: 'What is a "due date" on a bill?', options: ['The date you received it', 'The last day to pay', 'The date it was created', 'Your birthday'], answer: 1 },
      { q: 'What is a subscription?', options: ['A one-time purchase', 'A regular recurring payment', 'A gift card', 'A type of bank account'], answer: 1 },
      { q: 'How can you avoid forgetting bill payments?', options: ['Ignore the bill', 'Set a calendar reminder', 'Pay whenever you feel like it', 'Ask a friend to pay'], answer: 1 },
    ],
    portfolioPrompt: 'Create a monthly bills calendar showing when your bills are due.',
  },

  {
    id: 'mod-12', num: 12, strand: 2,
    title: 'My Financial Safety Plan',
    icon: '🛟', badge: '🛟 Money Safe',
    description: 'Know who to contact and what to do if something goes wrong with money.',
    outcomes: [
      'Know who to contact for money help',
      'Know what steps to take if money goes wrong',
      'Create a personal financial safety plan',
    ],
    vocabulary: ['report', 'dispute', 'block card', 'fraud', 'Scamwatch', 'bank helpline'],
    tools: ['Safety plan template', 'Contact cards'],
    teachContent: [
      { type: 'info', title: 'When Things Go Wrong', body: 'Sometimes money problems happen – you might lose your card, get scammed, or be charged the wrong amount. Don\'t panic! There are always people who can help.' },
      { type: 'info', title: 'Who Can Help?', body: '🏦 Your bank (call the number on the back of your card)\n👨‍👩‍👧 A trusted family member or support worker\n📞 Scamwatch: 1300 795 995\n🆘 National Debt Helpline: 1800 007 007' },
      { type: 'info', title: '4 Steps If Something Goes Wrong', body: '1️⃣ STOP – don\'t send more money\n2️⃣ CALL your bank or support person\n3️⃣ REPORT to Scamwatch if it\'s a scam\n4️⃣ KEEP records of what happened' },
    ],
    activities: [
      { type: 'safety-plan', title: 'My Money Safety Plan', instruction: 'Fill in your personal safety plan.',
        fields: [
          { label: 'My bank\'s name', placeholder: 'e.g. CommBank, ANZ...' },
          { label: 'Help phone number (on card)', placeholder: 'e.g. 13 22 21' },
          { label: 'My trusted person for money help', placeholder: 'e.g. Mum, support worker...' },
          { label: 'Their phone number', placeholder: 'e.g. 0400 000 000' },
          { label: 'What I will do first if something goes wrong', placeholder: 'e.g. Call my bank...' },
        ]},
    ],
    quiz: [
      { q: 'What should you do FIRST if you think you\'ve been scammed?', options: ['Send more money', 'Stop and call your bank', 'Ignore it', 'Delete everything'], answer: 1 },
      { q: 'Where can you report a scam in Australia?', options: ['Facebook', 'Scamwatch', 'Google', 'Instagram'], answer: 1 },
      { q: 'Your bank\'s helpline number is usually found...', options: ['On social media', 'On the back of your bank card', 'In a text message', 'On a billboard'], answer: 1 },
    ],
    portfolioPrompt: 'Complete your personal "If I\'m worried about money online..." safety plan.',
  },

  /* ======== STRAND 3: Community, Travel & Everyday Tech ======== */
  {
    id: 'mod-13', num: 13, strand: 3,
    title: 'Using Maps & Directions',
    icon: '🗺️', badge: '🗺️ Navigator',
    description: 'Search for a destination, read ETA, choose accessible routes.',
    outcomes: [
      'Search for a familiar location',
      'Read distance and estimated time',
      'Choose an accessible route option',
    ],
    vocabulary: ['map', 'direction', 'destination', 'route', 'ETA', 'accessible'],
    tools: ['Maps app (demo)', 'Route planning cards'],
    teachContent: [
      { type: 'info', title: 'Maps on Your Device', body: 'Your iPad or phone has a Maps app. You can type any address or place name and it will show you where it is and how to get there.' },
      { type: 'info', title: 'How to Search', body: 'Open Maps → Tap the search bar → Type the place name (e.g. "Bayside Council") → Tap "Directions" → Choose walking, driving, or public transport.' },
      { type: 'info', title: 'Reading Your Route', body: 'The app shows: 📍 Where you are now, 📍 Where you\'re going, ⏱️ How long it will take (ETA), 🚶 Step-by-step directions.' },
    ],
    activities: [
      { type: 'route-planner', title: 'Plan a Trip', instruction: 'Plan a route from the learning hub to each place. Write down the travel time.',
        destinations: [
          { name: 'Eastgardens Shopping Centre', icon: '🛍️' },
          { name: 'Bayside Council', icon: '🏛️' },
          { name: 'Botany Bay', icon: '🏖️' },
        ]},
    ],
    quiz: [
      { q: 'What does ETA mean?', options: ['Extra Time Added', 'Estimated Time of Arrival', 'Easy Travel App', 'Every Turn Available'], answer: 1 },
      { q: 'How do you find directions on your device?', options: ['Call someone', 'Open Maps and type the destination', 'Shake the device', 'Look at a paper map only'], answer: 1 },
      { q: 'Which route option is best if you use a wheelchair?', options: ['Any route', 'The accessible route', 'The fastest route only', 'The scenic route'], answer: 1 },
    ],
    portfolioPrompt: 'Take a screenshot of a route to a familiar place you visit regularly.',
  },

  {
    id: 'mod-14', num: 14, strand: 3,
    title: 'Public Transport Apps & Opal',
    icon: '🚌', badge: '🚌 Travel Smart',
    description: 'Check timetables, plan trips, and top up safely.',
    outcomes: [
      'Check bus/train timetables and disruptions',
      'Plan a simple trip using a transport app',
      'Understand how to top up an Opal card',
    ],
    vocabulary: ['timetable', 'Opal card', 'top-up', 'disruption', 'platform', 'stop'],
    tools: ['Trip planning app demo', 'Opal card info sheet'],
    teachContent: [
      { type: 'info', title: 'Transport Apps', body: 'Apps like TripView or the Transport NSW app show you bus, train, and ferry times. You can plan your whole trip from start to finish!' },
      { type: 'info', title: 'Planning a Trip', body: 'Open the app → Type where you ARE → Type where you want to GO → The app shows you options with times and stops.' },
      { type: 'info', title: 'Opal Card', body: 'Your Opal card is how you pay for public transport in Sydney. Tap on when you get on, tap off when you get off. You can top up online, at a shop, or at a machine.' },
    ],
    activities: [
      { type: 'trip-planner', title: 'Plan Your Journey', instruction: 'Use the steps to plan a journey from Banksmeadow to the city.',
        steps: [
          { step: 1, text: 'Open the transport app', icon: '📱' },
          { step: 2, text: 'Type "Banksmeadow" as your starting point', icon: '📍' },
          { step: 3, text: 'Type your destination', icon: '🏙️' },
          { step: 4, text: 'Choose a bus or train option', icon: '🚌' },
          { step: 5, text: 'Check the departure time', icon: '⏰' },
          { step: 6, text: 'Note the stops and platform', icon: '📝' },
        ]},
    ],
    quiz: [
      { q: 'What do you do with your Opal card when you get on the bus?', options: ['Wave it', 'Tap ON', 'Put it in your pocket', 'Give it to the driver'], answer: 1 },
      { q: 'What does a transport app help you do?', options: ['Play games', 'Plan your trip with times and routes', 'Take photos', 'Send messages'], answer: 1 },
      { q: 'Where can you top up your Opal card?', options: ['Only at the train station', 'Online, at shops, or at top-up machines', 'Nowhere', 'Only at the post office'], answer: 1 },
    ],
    portfolioPrompt: 'Create a trip plan card with step-by-step pictures for a journey you take regularly.',
  },

  {
    id: 'mod-15', num: 15, strand: 3,
    title: 'Telehealth Basics',
    icon: '🩺', badge: '🩺 Health Tech Ready',
    description: 'Join a practice video call and manage privacy.',
    outcomes: [
      'Join a video call',
      'Test audio and camera before a call',
      'Maintain privacy during a telehealth appointment',
    ],
    vocabulary: ['telehealth', 'video call', 'camera', 'microphone', 'mute', 'private'],
    tools: ['Video call app (practice)', 'Telehealth checklist'],
    teachContent: [
      { type: 'info', title: 'What is Telehealth?', body: 'Telehealth is when you see a doctor, therapist, or other health professional through a video call on your device – like a FaceTime call but for health.' },
      { type: 'info', title: 'How to Prepare', body: 'Before your call: ✅ Find a quiet, private room. ✅ Charge your device. ✅ Test your camera and microphone. ✅ Have your Medicare card ready. ✅ Write down any questions.' },
      { type: 'info', title: 'During the Call', body: 'Sit in good light so the doctor can see you. Speak clearly. If you can\'t hear, check your volume. It\'s okay to ask them to repeat something!' },
    ],
    activities: [
      { type: 'checklist', title: 'Before My Telehealth Call', instruction: 'Check off each step to make sure you\'re ready for a telehealth appointment.',
        items: [
          'I\'m in a quiet, private room',
          'My device is charged',
          'I tested my camera – I can see myself',
          'I tested my microphone – it\'s working',
          'I have my Medicare card or details ready',
          'I wrote down my questions',
          'The sound is turned up',
        ]},
    ],
    quiz: [
      { q: 'What is telehealth?', options: ['A health app', 'Seeing a doctor through a video call', 'A TV show about doctors', 'A type of medicine'], answer: 1 },
      { q: 'Before a telehealth call, you should...', options: ['Not prepare at all', 'Test your camera and microphone', 'Go to a noisy café', 'Turn off your device'], answer: 1 },
      { q: 'Where should you be during a telehealth call?', options: ['In public', 'In a quiet, private room', 'At a party', 'In a car'], answer: 1 },
    ],
    portfolioPrompt: 'Create your own "Before my telehealth call" checklist that you can use at home.',
  },

  {
    id: 'mod-16', num: 16, strand: 3,
    title: 'My Health & MyGov Portals',
    icon: '🏥', badge: '🏥 Portal Ready',
    description: 'Understand what health & government portals are for.',
    outcomes: [
      'Know what MyGov and My Health Record are for',
      'Know where to get login help',
      'Create a support plan for portal access',
    ],
    vocabulary: ['MyGov', 'My Health Record', 'portal', 'login', 'support person', 'Medicare'],
    tools: ['Demo portal pages', 'Support plan template'],
    teachContent: [
      { type: 'info', title: 'What is MyGov?', body: 'MyGov is a secure Australian Government website where you can access services like Medicare, Centrelink, and the NDIS – all in one place.' },
      { type: 'info', title: 'My Health Record', body: 'My Health Record is an online summary of your health information. Doctors and hospitals can add to it. You can see your medicines, test results, and more.' },
      { type: 'info', title: 'Getting Help to Log In', body: 'These portals can be tricky. It\'s okay to ask for help! Your support worker, family member, or a Services Australia office can help you set up or log in.' },
    ],
    activities: [
      { type: 'safety-plan', title: 'My Digital Help Team', instruction: 'Write down the people who can help you with online portals.',
        fields: [
          { label: 'Who helps me with MyGov?', placeholder: 'e.g. Support worker, family member...' },
          { label: 'Where I keep my login details safe', placeholder: 'e.g. Password manager, safe place at home...' },
          { label: 'Phone number if I need help', placeholder: 'e.g. Services Australia: 136 150' },
          { label: 'My nearest Services Australia office', placeholder: 'e.g. Maroubra, Rockdale...' },
        ]},
    ],
    quiz: [
      { q: 'What is MyGov used for?', options: ['Playing games', 'Accessing government services online', 'Social media', 'Shopping'], answer: 1 },
      { q: 'Who can help you log into MyGov?', options: ['No one', 'A support worker or Services Australia', 'A stranger', 'Only you, alone'], answer: 1 },
      { q: 'What does My Health Record store?', options: ['Your photos', 'Your health information', 'Your shopping list', 'Your passwords'], answer: 1 },
    ],
    portfolioPrompt: 'Create your "My digital help team" card with contacts and support details.',
  },

  {
    id: 'mod-17', num: 17, strand: 3,
    title: 'Shopping & Food Delivery Apps',
    icon: '🛒', badge: '🛒 Smart Shopper',
    description: 'Compare options, check fees, avoid impulse buys.',
    outcomes: [
      'Compare delivery options and fees',
      'Check wait times',
      'Avoid impulse purchases',
    ],
    vocabulary: ['delivery', 'fee', 'compare', 'impulse buy', 'wait time', 'add to cart'],
    tools: ['Demo delivery app', 'Decision tree template'],
    teachContent: [
      { type: 'info', title: 'Delivery Apps', body: 'Apps like Uber Eats, DoorDash, or Coles Online deliver food and groceries to your door. They\'re convenient but can have extra fees.' },
      { type: 'info', title: 'Checking Fees', body: 'Before you order, always check: 💰 Delivery fee, 💰 Service fee, 💰 Minimum order amount. These extras can make your order much more expensive!' },
      { type: 'info', title: 'Avoiding Impulse Buys', body: 'An impulse buy is when you buy something without thinking. Ask yourself: Do I NEED this? Is the price fair? Can I wait? Use a list to stay on track!' },
    ],
    activities: [
      { type: 'decision-tree', title: 'Should I Order This?', instruction: 'Use this decision tree before ordering online.',
        steps: [
          { question: 'Do I need this item?', yes: 'next', no: 'Maybe wait and think about it!' },
          { question: 'Is the price fair (not too expensive)?', yes: 'next', no: 'Look for a better deal!' },
          { question: 'Can I afford it within my budget?', yes: 'next', no: 'Save up first!' },
          { question: 'Have I checked the delivery fees?', yes: 'Great – go ahead and order!', no: 'Check the total cost including fees!' },
        ]},
    ],
    quiz: [
      { q: 'What is an impulse buy?', options: ['A planned purchase', 'Buying without thinking', 'Getting a refund', 'Using a coupon'], answer: 1 },
      { q: 'Before ordering delivery, you should check...', options: ['Nothing', 'Delivery fees and total cost', 'Your friend\'s order', 'The weather'], answer: 1 },
      { q: 'What should you do before buying something online?', options: ['Buy it immediately', 'Ask: Do I need this? Can I afford it?', 'Tell everyone', 'Close the app'], answer: 1 },
    ],
    portfolioPrompt: 'Create a "Smart Shopper" decision tree you can use before any purchase.',
  },

  {
    id: 'mod-18', num: 18, strand: 3,
    title: 'Smart Home & Daily Routines',
    icon: '🏠', badge: '🏠 Routine Master',
    description: 'Use reminders and alarms to stay organised.',
    outcomes: [
      'Set daily reminders and alarms',
      'Add weekly tasks to a calendar',
      'Try simple voice commands (if available)',
    ],
    vocabulary: ['reminder', 'alarm', 'routine', 'calendar', 'voice command', 'schedule'],
    tools: ['Clock/Calendar app', 'Voice assistant (if available)', 'Routine plan template'],
    teachContent: [
      { type: 'info', title: 'Why Routines Help', body: 'Having a daily routine helps you remember important things and feel more in control. Your device can help you stick to your routine!' },
      { type: 'info', title: 'Setting Reminders', body: 'Open the Clock app or Calendar → Set a reminder for things like: 💊 Take medicine, 🍳 Start cooking dinner, 🎒 Pack your bag, 🛏️ Bedtime.' },
      { type: 'info', title: 'Voice Commands', body: 'If your device has a voice assistant (Siri), you can say: "Hey Siri, set a reminder for 8 AM to take my medicine" or "Hey Siri, what\'s the weather?"' },
    ],
    activities: [
      { type: 'routine-builder', title: 'My Daily Routine', instruction: 'Build your ideal daily routine by putting these activities in order and adding times.',
        activities: [
          { text: 'Wake up & get ready', icon: '🌅', suggestedTime: '7:00 AM' },
          { text: 'Breakfast', icon: '🥣', suggestedTime: '7:30 AM' },
          { text: 'Learning / work', icon: '📚', suggestedTime: '9:00 AM' },
          { text: 'Lunch', icon: '🥪', suggestedTime: '12:30 PM' },
          { text: 'Afternoon activity', icon: '🏃', suggestedTime: '2:00 PM' },
          { text: 'Dinner', icon: '🍽️', suggestedTime: '6:00 PM' },
          { text: 'Relax / free time', icon: '📺', suggestedTime: '7:00 PM' },
          { text: 'Bedtime', icon: '🛏️', suggestedTime: '9:30 PM' },
        ]},
    ],
    quiz: [
      { q: 'What can you use to remember daily tasks?', options: ['Nothing – just try to remember', 'Reminders and alarms on your device', 'A crystal ball', 'Guessing'], answer: 1 },
      { q: 'Which is a good thing to set a reminder for?', options: ['Breathing', 'Taking medicine at the right time', 'Looking at the ceiling', 'Blinking'], answer: 1 },
      { q: 'How can you ask Siri to set a reminder?', options: ['Whisper really quietly', 'Say "Hey Siri, set a reminder for..."', 'Wave at the iPad', 'Press all buttons at once'], answer: 1 },
    ],
    portfolioPrompt: 'Create your morning and evening routine plan with reminders set on your device.',
  },

  /* ======== STRAND 4: Work Readiness & Communication ======== */
  {
    id: 'mod-19', num: 19, strand: 4,
    title: 'Finding Jobs Online',
    icon: '🔍', badge: '🔍 Job Hunter',
    description: 'Search job boards and read basic role requirements.',
    outcomes: [
      'Search a job board website',
      'Read a basic job ad',
      'Identify tasks you could do and support you might need',
    ],
    vocabulary: ['job board', 'job ad', 'role', 'requirements', 'apply', 'employer'],
    tools: ['Demo job board', 'Job ad templates'],
    teachContent: [
      { type: 'info', title: 'Where to Find Jobs', body: 'Job boards are websites where employers post available jobs. Popular ones include: Seek, Indeed, Jora, and Disability Employment Services.' },
      { type: 'info', title: 'Reading a Job Ad', body: 'A job ad tells you: 📋 The job title, 🏢 The company, 📍 The location, 💰 The pay (sometimes), 📝 What you\'ll do, ✅ What skills you need.' },
      { type: 'info', title: 'Asking for Support', body: 'It\'s okay to need support at work! Disability Employment Services (DES) can help you find and keep a job. They can arrange workplace adjustments too.' },
    ],
    activities: [
      { type: 'job-match', title: 'Match Your Skills to Jobs', instruction: 'Look at each job and tick the skills you already have.',
        jobs: [
          { title: 'Café Assistant', skills: ['Making coffee', 'Cleaning tables', 'Talking to customers', 'Using a cash register'] },
          { title: 'Office Helper', skills: ['Filing papers', 'Answering phones', 'Using a computer', 'Sending emails'] },
          { title: 'Garden Worker', skills: ['Watering plants', 'Using garden tools', 'Working outdoors', 'Following instructions'] },
        ]},
    ],
    quiz: [
      { q: 'What is a job board?', options: ['A wooden board', 'A website listing available jobs', 'A game', 'A type of work'], answer: 1 },
      { q: 'What should you look for in a job ad?', options: ['Only the pay', 'The title, location, tasks, and skills needed', 'Just the company name', 'Nothing – just apply'], answer: 1 },
      { q: 'Who can help you find and keep a job with support?', options: ['Nobody', 'Disability Employment Services', 'Social media', 'A robot'], answer: 1 },
    ],
    portfolioPrompt: 'Save a list of 2-3 jobs you found interesting, with notes about what skills match.',
  },

  {
    id: 'mod-20', num: 20, strand: 4,
    title: 'Making a Simple CV',
    icon: '📄', badge: '📄 CV Creator',
    description: 'Create a short CV/profile with strengths and interests.',
    outcomes: [
      'Enter your name and contact details',
      'List your strengths, skills, and interests',
      'Save your CV as a document',
    ],
    vocabulary: ['CV', 'resume', 'profile', 'strengths', 'skills', 'interests', 'reference'],
    tools: ['CV template (easy-read)', 'Word processing app'],
    teachContent: [
      { type: 'info', title: 'What is a CV?', body: 'A CV (Curriculum Vitae) or resume is a document that tells an employer about you – your name, skills, experience, and interests. It helps them decide if you\'re right for the job.' },
      { type: 'info', title: 'What to Include', body: '📛 Your name and how to contact you\n💪 Your strengths (what you\'re good at)\n🎓 Any training or courses\n⭐ Your interests and hobbies\n👤 A reference (someone who can talk about you)' },
      { type: 'info', title: 'Tips for a Great CV', body: 'Keep it short (1 page is fine). Use clear, simple language. Be honest. Ask someone to check it before sending.' },
    ],
    activities: [
      { type: 'cv-builder', title: 'Build Your CV', instruction: 'Fill in each section to create your simple CV.',
        sections: [
          { label: 'My Name', placeholder: 'Your full name' },
          { label: 'Contact (phone or email)', placeholder: 'e.g. 0400 000 000' },
          { label: 'About Me (2-3 sentences)', placeholder: 'I am a friendly person who...' },
          { label: 'My Strengths', placeholder: 'e.g. Reliable, good listener, hard worker...' },
          { label: 'My Skills', placeholder: 'e.g. Using an iPad, cooking, gardening...' },
          { label: 'My Interests', placeholder: 'e.g. Music, art, sports, animals...' },
          { label: 'A Reference (who can speak about you)', placeholder: 'e.g. My support worker, Sarah...' },
        ]},
    ],
    quiz: [
      { q: 'What is a CV for?', options: ['Playing games', 'Telling employers about your skills', 'Keeping a diary', 'Chatting with friends'], answer: 1 },
      { q: 'How long should your CV be?', options: ['10 pages', '1 page is fine', '100 pages', 'No pages'], answer: 1 },
      { q: 'What is a reference?', options: ['A type of book', 'Someone who can talk about you to an employer', 'A password', 'A social media profile'], answer: 1 },
    ],
    portfolioPrompt: 'Complete your one-page visual CV using the template provided.',
  },

  {
    id: 'mod-21', num: 21, strand: 4,
    title: 'Email & Calendar for Work',
    icon: '📧', badge: '📧 Email Ready',
    description: 'Compose polite emails, attach files, manage calendar invites.',
    outcomes: [
      'Compose a polite email with subject line',
      'Attach a file to an email',
      'Accept a calendar invite',
    ],
    vocabulary: ['email', 'subject', 'attachment', 'compose', 'reply', 'calendar invite'],
    tools: ['Email app (training account)', 'Calendar app'],
    teachContent: [
      { type: 'info', title: 'Writing a Polite Email', body: 'Every good email has:\n📝 Subject line: A short title (e.g. "Question about my shift")\n👋 Greeting: "Hi [Name]," or "Hello,"\n💬 Message: Clear and polite\n👋 Sign-off: "Thank you, [Your name]"' },
      { type: 'info', title: 'Attaching Files', body: 'To attach a file (like your CV), look for the paperclip icon 📎. Tap it, find your file, and select it. The file will be attached to your email.' },
      { type: 'info', title: 'Calendar Invites', body: 'If someone sends you a meeting invite, you\'ll see it in your email or calendar. Tap "Accept" to add it to your calendar, or "Decline" if you can\'t go.' },
    ],
    activities: [
      { type: 'email-builder', title: 'Write a Practice Email', instruction: 'Write an email to a pretend employer asking about a job.',
        template: {
          to: 'employer@example.com',
          subjectHint: 'e.g. Question about the Café Assistant job',
          bodyHint: 'Dear [Name],\n\nI saw your job ad for [job title] and I am interested.\n\n[Ask a question or say why you\'re interested]\n\nThank you,\n[Your name]',
        }},
    ],
    quiz: [
      { q: 'What should an email subject line be?', options: ['Really long and detailed', 'Short and about the topic', 'Empty', 'A secret code'], answer: 1 },
      { q: 'What icon do you look for to attach a file?', options: ['A star ⭐', 'A paperclip 📎', 'A heart ❤️', 'A camera 📷'], answer: 1 },
      { q: 'What do you tap to add a meeting to your calendar?', options: ['Delete', 'Accept', 'Ignore', 'Block'], answer: 1 },
    ],
    portfolioPrompt: 'Draft a sample email to a potential employer and save it.',
  },

  {
    id: 'mod-22', num: 22, strand: 4,
    title: 'Interview Basics & Video Etiquette',
    icon: '🎤', badge: '🎤 Interview Ready',
    description: 'Answer common questions and present yourself on video.',
    outcomes: [
      'Answer 3 common interview questions',
      'Adjust camera and microphone for video calls',
      'Greet and close a video interview politely',
    ],
    vocabulary: ['interview', 'question', 'answer', 'greeting', 'professional', 'video call'],
    tools: ['Video call app', 'Interview question cards'],
    teachContent: [
      { type: 'info', title: 'Common Interview Questions', body: '1. "Tell me about yourself" – Share your name, what you enjoy, and one strength.\n2. "Why do you want this job?" – Say what interests you about the work.\n3. "What are you good at?" – Share a skill or quality (e.g. "I\'m reliable and a fast learner").' },
      { type: 'info', title: 'Video Interview Tips', body: '📱 Set up your device at eye level\n💡 Make sure your face is well lit\n👕 Dress neatly\n🔇 Find a quiet place\n👀 Look at the camera (not the screen)\n😊 Smile and speak clearly' },
      { type: 'info', title: 'Starting & Ending', body: 'Start: "Hello, my name is [Name]. Thank you for meeting with me."\nEnd: "Thank you for your time. I enjoyed talking with you. Goodbye!"' },
    ],
    activities: [
      { type: 'interview-practice', title: 'Practice Interview', instruction: 'Write your answers to these common interview questions.',
        questions: [
          { q: 'Tell me about yourself.', hint: 'Share your name, something you enjoy, and one strength.' },
          { q: 'Why do you want this job?', hint: 'What interests you about this type of work?' },
          { q: 'What are you good at?', hint: 'Name a skill or quality. Give an example if you can.' },
          { q: 'How do you handle a challenge?', hint: 'Think of a time something was hard. What did you do?' },
        ]},
    ],
    quiz: [
      { q: 'How should you start a video interview?', options: ['Say nothing', 'Hello, my name is... Thank you for meeting with me', 'Start talking about lunch', 'Wave silently'], answer: 1 },
      { q: 'Where should you look during a video interview?', options: ['At your phone', 'At the camera', 'Out the window', 'At the floor'], answer: 1 },
      { q: 'What is a good answer to "What are you good at?"', options: ['I don\'t know', 'Everything', 'I\'m reliable and a fast learner', 'Nothing'], answer: 2 },
    ],
    portfolioPrompt: 'Practice answering one interview question on video (if consented) or write your answers.',
  },

  {
    id: 'mod-23', num: 23, strand: 4,
    title: 'Workplace Communication & Online Safety',
    icon: '💬', badge: '💬 Work Safe',
    description: 'Appropriate messaging, boundaries, and reporting bullying.',
    outcomes: [
      'Use polite and appropriate workplace messaging',
      'Understand work/personal boundaries online',
      'Know how to report bullying or harassment',
    ],
    vocabulary: ['professional', 'boundaries', 'bullying', 'harassment', 'report', 'appropriate'],
    tools: ['Message examples', 'Reporting pathway poster'],
    teachContent: [
      { type: 'info', title: 'Professional Communication', body: 'At work, messages should be: ✅ Polite, ✅ Short and clear, ✅ About work topics, ✅ Sent during work hours. Don\'t use slang, all caps, or rude language.' },
      { type: 'info', title: 'Work vs Personal', body: 'Keep work and personal accounts separate. Don\'t share personal problems at work online. Don\'t add your boss on personal social media unless they invite you.' },
      { type: 'info', title: 'If You See Bullying', body: 'Workplace bullying is NOT okay. If someone is mean, threatening, or repeatedly hurtful: 1️⃣ Don\'t respond, 2️⃣ Save the evidence (screenshot), 3️⃣ Tell your supervisor or support person, 4️⃣ You can also contact Fair Work: 13 13 94.' },
    ],
    activities: [
      { type: 'message-check', title: 'Appropriate or Not?', instruction: 'Is each message appropriate for work?',
        messages: [
          { text: 'Hi, I\'ll be 5 minutes late today. Sorry about that!', appropriate: true, why: 'Polite and professional' },
          { text: 'OMG THIS PLACE IS SO BORING!!! 🤮', appropriate: false, why: 'Rude and unprofessional' },
          { text: 'Could you please show me how to use the scanner?', appropriate: true, why: 'Asking for help politely' },
          { text: 'I hate working with you!!!', appropriate: false, why: 'Hurtful and inappropriate' },
          { text: 'Thanks for helping me today, I learned a lot.', appropriate: true, why: 'Kind and professional' },
        ]},
    ],
    quiz: [
      { q: 'How should work messages be?', options: ['Long and personal', 'Short, clear, and polite', 'In all CAPS', 'With lots of emojis'], answer: 1 },
      { q: 'If someone is bullying you at work, what should you do?', options: ['Fight back', 'Ignore it forever', 'Save evidence and tell your supervisor', 'Quit immediately'], answer: 2 },
      { q: 'Should you add your boss on your personal social media?', options: ['Always', 'Only if they invite you', 'Never', 'Post about work problems there'], answer: 1 },
    ],
    portfolioPrompt: 'Create your "At work I will..." communication pledge listing 5 rules.',
  },

  {
    id: 'mod-24', num: 24, strand: 4,
    title: 'Showcase Prep & Digital Portfolios',
    icon: '🎓', badge: '🎓 Program Graduate',
    description: 'Select best artefacts, write captions, rehearse your presentation.',
    outcomes: [
      'Select your best portfolio artefacts',
      'Write captions for your work',
      'Rehearse a short showcase presentation',
    ],
    vocabulary: ['portfolio', 'artefact', 'caption', 'presentation', 'showcase', 'reflection'],
    tools: ['Portfolio template', 'Presentation slides'],
    teachContent: [
      { type: 'info', title: 'What is a Portfolio?', body: 'Your portfolio is a collection of your best work from this program. It shows what you\'ve learned and what you can do. It\'s something to be proud of!' },
      { type: 'info', title: 'Choosing Your Best Work', body: 'Look through all the work you\'ve created in each module. Choose 5-8 pieces that show: ⭐ Something you\'re proud of, ⭐ A new skill you learned, ⭐ How much you\'ve improved.' },
      { type: 'info', title: 'Your Showcase Presentation', body: 'At the showcase, you\'ll show your portfolio to visitors. Practice saying: "This is my portfolio. I learned about... My favourite part was... I can now..."' },
    ],
    activities: [
      { type: 'portfolio-review', title: 'My Portfolio Highlights', instruction: 'Choose your favourite artefact from each strand and write a caption.',
        strands: [
          { name: 'Digital Foundations & Safety', icon: '🛡️', captionHint: 'What safety skill are you most proud of?' },
          { name: 'Financial Capability', icon: '💰', captionHint: 'What money skill did you learn?' },
          { name: 'Community & Travel', icon: '🗺️', captionHint: 'How does technology help you get around?' },
          { name: 'Work Readiness', icon: '💼', captionHint: 'What makes you ready for work?' },
        ]},
    ],
    quiz: [
      { q: 'What is a digital portfolio?', options: ['A photo album', 'A collection of your best work showing what you\'ve learned', 'A shopping list', 'A social media account'], answer: 1 },
      { q: 'How many pieces of work should you choose for your portfolio?', options: ['All of them', '5-8 of your best pieces', 'None', 'Just 1'], answer: 1 },
      { q: 'At the showcase, what should you say about your work?', options: ['Nothing', 'What you learned and your favourite part', 'That it was boring', 'Ask people to leave'], answer: 1 },
    ],
    portfolioPrompt: 'Prepare your final digital portfolio with captions ready for the showcase.',
  },
];

/* ---------- Baseline / Post digital skills checklist items ---------- */
const SKILLS_CHECKLIST = [
  { id: 'sk-1',  text: 'I can unlock my device and open an app.' },
  { id: 'sk-2',  text: 'I can change settings to make the screen easier for me to see/hear/use.' },
  { id: 'sk-3',  text: 'I can tell if a message might be a scam.' },
  { id: 'sk-4',  text: 'I can make a strong passphrase and keep it safe.' },
  { id: 'sk-5',  text: 'I can find my account balance (training account).' },
  { id: 'sk-6',  text: 'I can use a calendar reminder for bills/appointments.' },
  { id: 'sk-7',  text: 'I can plan a simple trip using a maps/transport app.' },
  { id: 'sk-8',  text: 'I can join a video appointment with camera and sound.' },
  { id: 'sk-9',  text: 'I can search for a job I\'m interested in.' },
  { id: 'sk-10', text: 'I can send a polite email with an attachment.' },
  { id: 'sk-11', text: 'I can explain my rules for sharing photos online.' },
  { id: 'sk-12', text: 'I can show one digital tool that helps me be more independent.' },
];
