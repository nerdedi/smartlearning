// Curriculum modules data for Smart Learning for Independence
// Each module includes: title, strand, outcomes, activities, adjustments, assessment, portfolio
export const modules = [
  {
    id: 1,
    strand: 'Digital Foundations & Safety',
    title: 'Getting Started with iPads & Smart Board',
    outcomes: [
      'Turn on/unlock; open apps; use Home/Back; use Smart Board tools.'
    ],
    activities: [
      'Device tour; tap/drag/swipe practice on a simple game; Smart Board name writing.'
    ],
    adjustments: ['Switch access for tapping; larger text; visual step cards.'],
    assessment: "'I can open and close an app' demo video.",
    portfolio:
      'Photo of learner using device + short audio intro recorded with dictation.'
  }
  // ... (Add all 24 modules here, abbreviated for brevity)
]

// Game content used by the interactive adventure (UI/game engine)
export const GAME_CONTENT = {
  worlds: [
    {
      id: 1,
      name: 'Digital Foundations & Safety',
      theme: 'bushland',
      icon: '🌲',
      color: '#4ECDC4',
      bgGradient:
        'linear-gradient(180deg, #87CEEB 0%, #98D8AA 60%, #4A7C59 100%)',
      levels: [
        {
          id: 1,
          title: 'Getting Started',
          outcomes: ['Turn on and unlock device', 'Open and close an app'],
          collectibleIcon: '📱',
          collectibles: ['Power', 'Swipe', 'Tap', 'App', 'Home'],
          minigame: {
            type: 'checklist',
            title: 'Device Checklist',
            instruction: 'Tap each thing you can do!',
            items: [
              'Turn on my device',
              'Unlock my screen',
              'Open an app',
              'Close an app',
              'Go to home screen'
            ]
          },
          quiz: [
            {
              question: 'What is an icon?',
              options: ['A small picture you tap', 'A type of food', 'A song'],
              correct: 0
            },
            {
              question: 'To open an app, you:',
              options: ['Shake the device', 'Tap the icon', 'Blow on it'],
              correct: 1
            }
          ],
          portfolio: 'What I can do with my iPad today'
        },
        {
          id: 2,
          title: 'Accessibility For Me',
          outcomes: ['Find accessibility settings', 'Choose a helpful setting'],
          collectibleIcon: '⚙️',
          collectibles: ['Settings', 'Voice', 'Text', 'Contrast', 'Zoom'],
          minigame: {
            type: 'matching',
            title: 'Match the Setting',
            instruction: 'Match each setting to what it does',
            pairs: [
              { item: '🔊 Speak Screen', match: 'Reads text aloud' },
              { item: '🔍 Zoom', match: 'Makes things bigger' },
              { item: '⚫ High Contrast', match: 'Makes text clearer' }
            ]
          },
          quiz: [
            {
              question: 'Speak Screen helps by:',
              options: ['Making text bigger', 'Reading aloud', 'Playing music'],
              correct: 1
            },
            {
              question: 'Settings are found:',
              options: [
                'In the Settings app',
                'Under your pillow',
                'At the shops'
              ],
              correct: 0
            }
          ],
          portfolio: 'My helpful settings'
        },
        {
          id: 3,
          title: 'Online Safety I',
          outcomes: ['Know safe vs unsafe online', 'Ask for help when unsure'],
          collectibleIcon: '🛡️',
          collectibles: ['Safe', 'Shield', 'Lock', 'Trust', 'Help'],
          minigame: {
            type: 'sorting',
            title: 'Safe or Unsafe?',
            instruction: 'Drag each item to the right box',
            items: [
              { text: 'Clicking links from strangers', safe: false },
              { text: 'Asking a trusted person for help', safe: true },
              { text: 'Sharing your password', safe: false },
              { text: 'Using websites you know', safe: true },
              { text: 'Telling strangers where you live', safe: false }
            ]
          },
          quiz: [
            {
              question: 'If something online seems wrong, you should:',
              options: [
                'Ignore it',
                'Ask a trusted person',
                'Give your details'
              ],
              correct: 1
            },
            {
              question: 'Safe websites often have:',
              options: ['Lots of popups', 'A padlock icon', 'Scary pictures'],
              correct: 1
            }
          ],
          portfolio: 'My 3 safety rules'
        },
        {
          id: 4,
          title: 'Passwords & Privacy',
          outcomes: ['Create a strong passphrase', 'Keep passwords safe'],
          collectibleIcon: '🔐',
          collectibles: ['Key', 'Secret', 'Strong', 'Lock', 'Safe'],
          minigame: {
            type: 'builder',
            title: 'Build a Strong Password',
            instruction: 'Pick 3 words and a number to make a passphrase',
            words: [
              'Blue',
              'Cat',
              'Happy',
              'Tree',
              'Moon',
              'Star',
              'Pizza',
              'Rainbow'
            ],
            numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
          },
          quiz: [
            {
              question: 'Should you share your password?',
              options: [
                'Yes, with everyone',
                'No, keep it private',
                'Only on social media'
              ],
              correct: 1
            },
            {
              question: 'A strong password has:',
              options: ['Your name', 'Multiple words and numbers', 'Just 123'],
              correct: 1
            }
          ],
          portfolio: 'My password rules (not my actual password!)'
        },
        {
          id: 5,
          title: 'Spotting Scams',
          outcomes: ['Identify scam warning signs', 'Know how to report'],
          collectibleIcon: '🚨',
          collectibles: ['Warning', 'Fake', 'Report', 'Delete', 'Block'],
          minigame: {
            type: 'spotting',
            title: 'Spot the Scam!',
            instruction: 'Tap the things that look like scams',
            items: [
              { text: 'You won $1,000,000! Click now!', isScam: true },
              {
                text: 'Email from your bank asking to update details via link',
                isScam: true
              },
              { text: 'Official app from the app store', isScam: false },
              { text: 'URGENT: Your account will be deleted!', isScam: true },
              { text: 'Message from a friend you know', isScam: false }
            ]
          },
          quiz: [
            {
              question: 'Scam messages often say:',
              options: [
                'No rush, take your time',
                'URGENT! Act now!',
                'Have a nice day'
              ],
              correct: 1
            },
            {
              question: 'If you get a scam message:',
              options: ['Click the link', 'Delete and report it', 'Send money'],
              correct: 1
            }
          ],
          portfolio: 'How to spot a scam'
        },
        {
          id: 6,
          title: 'Digital Foundations Showcase',
          outcomes: ['Demonstrate device skills', 'Show safety knowledge'],
          collectibleIcon: '🏆',
          collectibles: ['Star', 'Trophy', 'Badge', 'Crown', 'Medal'],
          minigame: {
            type: 'showcase',
            title: 'Show What You Know!',
            instruction: 'Complete all the challenges',
            challenges: [
              { task: 'Name 3 things you can do on your device', type: 'text' },
              { task: 'What makes a password strong?', type: 'text' },
              { task: "Who do you ask if you're unsure online?", type: 'text' }
            ]
          },
          quiz: [
            {
              question: 'What did you learn in this world?',
              options: ['Nothing', 'Device and safety skills', 'How to cook'],
              correct: 1
            },
            {
              question: 'You should keep learning about:',
              options: [
                'Online safety',
                'Nothing more',
                'Giving away passwords'
              ],
              correct: 0
            }
          ],
          portfolio: 'What I learned about digital foundations'
        }
      ]
    },
    {
      id: 2,
      name: 'Financial Skills & Banking',
      theme: 'market',
      icon: '🏪',
      color: '#FFD93D',
      bgGradient:
        'linear-gradient(180deg, #FFF8E1 0%, #FFE082 60%, #FFB74D 100%)',
      levels: [
        {
          id: 1,
          title: 'Understanding Money',
          collectibleIcon: '💰',
          outcomes: ['Identify Australian coins and notes'],
          collectibles: ['Coin', 'Note', 'Dollar', 'Cent', 'Wallet'],
          minigame: {
            type: 'matching',
            title: 'Match the Money',
            instruction: 'Match each coin to its value'
          },
          quiz: [
            {
              question: 'How many cents in a dollar?',
              options: ['10', '100', '50'],
              correct: 1
            }
          ],
          portfolio: 'Australian money I know'
        },
        {
          id: 2,
          title: 'Making a Budget',
          collectibleIcon: '📊',
          outcomes: ['Create a simple budget'],
          collectibles: ['Budget', 'Save', 'Spend', 'Plan', 'Goal'],
          minigame: {
            type: 'budget',
            title: 'Budget Builder',
            instruction: 'Drag items into needs vs wants'
          },
          quiz: [
            {
              question: 'A budget helps you:',
              options: ['Spend everything', 'Plan your money', 'Ignore bills'],
              correct: 1
            }
          ],
          portfolio: 'My simple budget plan'
        },
        {
          id: 3,
          title: 'Safe Online Banking',
          collectibleIcon: '🏦',
          outcomes: ['Identify safe banking practices'],
          collectibles: ['Bank', 'Secure', 'Login', 'Check', 'Balance'],
          minigame: {
            type: 'sorting',
            title: 'Safe Banking?',
            instruction: 'Sort safe vs unsafe banking habits'
          },
          quiz: [
            {
              question: 'Check your bank on:',
              options: ['Any WiFi', 'Secure networks only', 'Public computers'],
              correct: 1
            }
          ],
          portfolio: 'My safe banking rules'
        },
        {
          id: 4,
          title: 'Understanding Statements',
          collectibleIcon: '📄',
          outcomes: ['Read a bank statement'],
          collectibles: ['Statement', 'Balance', 'In', 'Out', 'Date'],
          minigame: {
            type: 'reading',
            title: 'Read the Statement',
            instruction: 'Find information on the statement'
          },
          quiz: [
            {
              question: 'A statement shows:',
              options: ['Only money in', 'Money in and out', 'Nothing'],
              correct: 1
            }
          ],
          portfolio: 'What I learned about statements'
        },
        {
          id: 5,
          title: 'Avoiding Money Scams',
          collectibleIcon: '🚫',
          outcomes: ['Identify money scams'],
          collectibles: ['Scam', 'Fake', 'Real', 'Report', 'Safe'],
          minigame: {
            type: 'spotting',
            title: 'Money Scam Spotter',
            instruction: 'Find the scam attempts'
          },
          quiz: [
            {
              question: 'Real banks will:',
              options: [
                'Ask for passwords by email',
                'Never ask for your PIN',
                'Want iTunes cards'
              ],
              correct: 1
            }
          ],
          portfolio: 'Money scam warning signs'
        },
        {
          id: 6,
          title: 'Financial Skills Showcase',
          collectibleIcon: '🏆',
          outcomes: ['Demonstrate money management'],
          collectibles: ['Star', 'Trophy', 'Badge', 'Crown', 'Medal'],
          minigame: {
            type: 'showcase',
            title: 'Money Master!',
            instruction: 'Show your financial skills'
          },
          quiz: [
            {
              question: "You're now better at:",
              options: ['Wasting money', 'Managing money', 'Ignoring money'],
              correct: 1
            }
          ],
          portfolio: 'My financial skills summary'
        }
      ]
    },
    {
      id: 3,
      name: 'Community, Travel & Daily Tech',
      theme: 'city',
      icon: '🚌',
      color: '#FF6B6B',
      bgGradient:
        'linear-gradient(180deg, #E3F2FD 0%, #90CAF9 60%, #5C6BC0 100%)',
      levels: [
        {
          id: 1,
          title: 'Using Maps',
          collectibleIcon: '🗺️',
          outcomes: ['Find locations on a map'],
          collectibles: ['Map', 'Pin', 'Route', 'Find', 'Navigate'],
          minigame: {
            type: 'maps',
            title: 'Find the Place',
            instruction: 'Tap the correct location'
          },
          quiz: [
            {
              question: 'Maps help you:',
              options: ['Get lost', 'Find places', 'Cook dinner'],
              correct: 1
            }
          ],
          portfolio: 'Places I can find on a map'
        },
        {
          id: 2,
          title: 'Public Transport',
          collectibleIcon: '🚆',
          outcomes: ['Plan a trip using transport'],
          collectibles: ['Bus', 'Train', 'Tram', 'Stop', 'Route'],
          minigame: {
            type: 'planner',
            title: 'Plan Your Trip',
            instruction: 'Choose the right transport'
          },
          quiz: [
            {
              question: 'Before travelling, you should:',
              options: ['Just guess', 'Check the timetable', 'Stay home'],
              correct: 1
            }
          ],
          portfolio: 'My transport plan'
        },
        {
          id: 3,
          title: 'Using an Opal Card',
          collectibleIcon: '💳',
          outcomes: ['Tap on and off correctly'],
          collectibles: ['Tap', 'On', 'Off', 'Balance', 'Reader'],
          minigame: {
            type: 'sequence',
            title: 'Tap On, Tap Off',
            instruction: 'Put the steps in order'
          },
          quiz: [
            {
              question: 'You tap your card:',
              options: ['Only at the end', 'On and off', 'Never'],
              correct: 1
            }
          ],
          portfolio: 'How to use my travel card'
        },
        {
          id: 4,
          title: 'Community Apps',
          collectibleIcon: '📲',
          outcomes: ['Use helpful community apps'],
          collectibles: ['App', 'Weather', 'News', 'Local', 'Event'],
          minigame: {
            type: 'matching',
            title: 'Match the App',
            instruction: 'Match apps to what they do'
          },
          quiz: [
            {
              question: 'Community apps help with:',
              options: ['Nothing', 'Local information', 'Breaking things'],
              correct: 1
            }
          ],
          portfolio: 'Useful apps for my community'
        },
        {
          id: 5,
          title: 'Asking for Help',
          collectibleIcon: '🆘',
          outcomes: ['Know how to get help'],
          collectibles: ['Help', 'Ask', 'Emergency', 'Support', 'Call'],
          minigame: {
            type: 'sorting',
            title: 'Who Can Help?',
            instruction: 'Match problems to helpers'
          },
          quiz: [
            {
              question: 'In an emergency, call:',
              options: ['Your friend', '000', 'No one'],
              correct: 1
            }
          ],
          portfolio: 'People who can help me'
        },
        {
          id: 6,
          title: 'Community Showcase',
          collectibleIcon: '🏆',
          outcomes: ['Navigate your community'],
          collectibles: ['Star', 'Trophy', 'Badge', 'Crown', 'Medal'],
          minigame: {
            type: 'showcase',
            title: 'Community Expert!',
            instruction: 'Show your travel and tech skills'
          },
          quiz: [
            {
              question: 'You can now:',
              options: [
                'Get more lost',
                'Navigate your community',
                'Avoid all technology'
              ],
              correct: 1
            }
          ],
          portfolio: 'My community skills'
        }
      ]
    },
    {
      id: 4,
      name: 'Work & Communication',
      theme: 'workplace',
      icon: '💼',
      color: '#9B59B6',
      bgGradient:
        'linear-gradient(180deg, #F3E5F5 0%, #CE93D8 60%, #7B1FA2 100%)',
      levels: [
        {
          id: 1,
          title: 'Writing Emails',
          collectibleIcon: '📧',
          outcomes: ['Write a clear email'],
          collectibles: ['Email', 'Subject', 'Send', 'Reply', 'Draft'],
          minigame: {
            type: 'builder',
            title: 'Build an Email',
            instruction: 'Put the email parts together'
          },
          quiz: [
            {
              question: 'An email needs:',
              options: ['A subject line', 'Lots of emojis', 'All capitals'],
              correct: 0
            }
          ],
          portfolio: 'My sample work email'
        },
        {
          id: 2,
          title: 'Online Job Searching',
          collectibleIcon: '🔍',
          outcomes: ['Search for jobs online'],
          collectibles: ['Search', 'Job', 'Apply', 'Save', 'Filter'],
          minigame: {
            type: 'search',
            title: 'Find a Job',
            instruction: 'Use filters to find jobs'
          },
          quiz: [
            {
              question: 'Job sites help you:',
              options: ['Find work opportunities', 'Play games', 'Order food'],
              correct: 0
            }
          ],
          portfolio: "Jobs I'm interested in"
        },
        {
          id: 3,
          title: 'Digital Resumes',
          collectibleIcon: '📝',
          outcomes: ['Create a simple resume'],
          collectibles: ['Resume', 'Skills', 'Experience', 'Contact', 'Save'],
          minigame: {
            type: 'builder',
            title: 'Build Your Resume',
            instruction: 'Add sections to your resume'
          },
          quiz: [
            {
              question: 'A resume shows:',
              options: [
                'Your favourite foods',
                'Your skills and experience',
                'Your passwords'
              ],
              correct: 1
            }
          ],
          portfolio: 'Key points for my resume'
        },
        {
          id: 4,
          title: 'Video Calls',
          collectibleIcon: '📹',
          outcomes: ['Join and use video calls'],
          collectibles: ['Video', 'Mute', 'Camera', 'Join', 'Leave'],
          minigame: {
            type: 'sequence',
            title: 'Video Call Steps',
            instruction: 'Put the steps in order'
          },
          quiz: [
            {
              question: 'Before a video call, check:',
              options: ['Your camera and mic', 'Nothing', 'The weather'],
              correct: 0
            }
          ],
          portfolio: 'My video call checklist'
        },
        {
          id: 5,
          title: 'Workplace Communication',
          collectibleIcon: '💬',
          outcomes: ['Communicate professionally'],
          collectibles: ['Chat', 'Professional', 'Polite', 'Clear', 'Team'],
          minigame: {
            type: 'sorting',
            title: 'Professional or Not?',
            instruction: 'Sort the messages'
          },
          quiz: [
            {
              question: 'Professional messages are:',
              options: ['Rude and short', 'Clear and polite', 'Full of slang'],
              correct: 1
            }
          ],
          portfolio: 'My professional communication tips'
        },
        {
          id: 6,
          title: 'Work Showcase',
          collectibleIcon: '🏆',
          outcomes: ['Demonstrate work readiness'],
          collectibles: ['Star', 'Trophy', 'Badge', 'Crown', 'Medal'],
          minigame: {
            type: 'showcase',
            title: 'Work Ready!',
            instruction: 'Show your job skills'
          },
          quiz: [
            {
              question: "You're now better prepared for:",
              options: [
                'Avoiding work',
                'Finding and doing work',
                'Playing games all day'
              ],
              correct: 1
            }
          ],
          portfolio: 'My work readiness summary'
        }
      ]
    }
  ]
}
