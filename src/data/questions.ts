import { BrainrotQuestion, GKQuestion } from '../types';

export const BRAINROT_QUESTIONS: BrainrotQuestion[] = [
  {
    id: 'br_1',
    question: 'Which text message immediately gives you the ick?',
    options: [
      '“K.” (just the capital letter)',
      '“We need to talk...”',
      '“I saw you yesterday haha”',
      '“Haha nice”'
    ],
    originalPercent: [58, 28, 10, 4],
    category: 'Dating'
  },
  {
    id: 'br_2',
    question: 'Which behavior screams “main character syndrome”?',
    options: [
      'Posting a gym selfie with a 300-word motivational caption',
      'Saying “I manifested it” after doing normal adult chores',
      'Setting up a tripod in the middle of a busy public sidewalk',
      'Calling yourself an “entrepreneur” after selling one old shirt on Depop'
    ],
    originalPercent: [15, 20, 55, 10],
    category: 'Social Media'
  },
  {
    id: 'br_3',
    question: 'What screams rich, but actually isn’t?',
    options: [
      'Buying an $8 iced latte every single morning',
      'Wearing massive logos of luxury brands on basic t-shirts',
      'Financing an entry-level German sports car on a 72-month lease',
      'Always flying basic economy but posting from the airport lounge (using a guest pass)'
    ],
    originalPercent: [18, 42, 32, 8],
    category: 'Internet Culture'
  },
  {
    id: 'br_4',
    question: 'Who is definitely replying with just “lol” after you write a paragraph explaining your soul?',
    options: [
      'Your situationship who has their read receipts turned off',
      'Your dad who doesn’t know how to use emojis',
      'Your best friend who is currently eating tacos',
      'An Android user whose text bubble is bright green'
    ],
    originalPercent: [62, 12, 18, 8],
    category: 'Situationships'
  },
  {
    id: 'br_5',
    question: 'What is the absolute biggest NPC behavior in real life?',
    options: [
      'Walking in a straight line at exactly the same speed without looking up',
      'Clapping when the airplane lands',
      'Using the exact same TikTok sounds in real-life conversations',
      'Standing in a massive line for a mediocre viral food spot just for the photo'
    ],
    originalPercent: [12, 38, 22, 28],
    category: 'Chaos'
  },
  {
    id: 'br_6',
    question: 'Which friend is always “5 minutes away” when you text them?',
    options: [
      'The one who hasn’t even got out of bed yet',
      'The one who is currently in the shower',
      'The one who is actively looking for their keys',
      'The one who is in a completely different city'
    ],
    originalPercent: [45, 30, 20, 5],
    category: 'Family'
  },
  {
    id: 'br_7',
    question: 'What screams “I watched one productivity video and changed my life”?',
    options: [
      'Waking up at 4:30 AM to drink cold water and stare at the wall',
      'Starting a podcast with zero listeners talking about “the grind”',
      'Deleting all social media for exactly 48 hours to do a “dopamine detox”',
      'Using the word “optimize” three times in a single sentence'
    ],
    originalPercent: [25, 18, 37, 20],
    category: 'Delusions'
  },
  {
    id: 'br_8',
    question: 'What would get you instantly ghosted by a potential partner?',
    options: [
      'Using “your” instead of “you’re” in the opening message',
      'Clapping your hands while laughing at a joke',
      'Telling them your mom still tracks your location on Life360',
      'Suggesting “just a walk in the park” for a first date'
    ],
    originalPercent: [33, 8, 44, 15],
    category: 'Dating'
  },
  {
    id: 'br_9',
    question: 'Which social media app represents the absolute lowest attention span?',
    options: [
      'TikTok (scrolling 100 videos a minute)',
      'Instagram Reels (watching 3-month-old TikToks)',
      'YouTube Shorts (watching movie clips with subway surfers gameplay below)',
      'Snapchat (sending black screens with “streak” text)'
    ],
    originalPercent: [48, 14, 30, 8],
    category: 'Social Media'
  },
  {
    id: 'br_10',
    question: 'What is the most chaotic setting to be in?',
    options: [
      'A family dinner where someone brings up inheritance',
      'A group project where no one has typed in the doc and it’s due in 2 hours',
      'A Discord server with 500 active notifications',
      'An Uber ride with a driver who doesn’t use GPS and plays heavy metal'
    ],
    originalPercent: [15, 65, 8, 12],
    category: 'Chaos'
  },
  {
    id: 'br_11',
    question: 'Which of these is the most “delusional” situationship green flag?',
    options: [
      'They liked your Instagram story from 47 weeks ago',
      'They left you on read for 12 hours but used an exclamation point when they replied',
      'They told you they aren’t looking for anything serious right now (you think you can change them)',
      'They have the exact same star sign as your favorite cousin'
    ],
    originalPercent: [12, 18, 65, 5],
    category: 'Delusions'
  },
  {
    id: 'br_12',
    question: 'What is the biggest “corporate NPC” phrase?',
    options: [
      '“Let’s circle back on this”',
      '“I’m just pinging you to get this on your radar”',
      '“Hope this email finds you well”',
      '“Let’s take this offline”'
    ],
    originalPercent: [28, 22, 42, 8],
    category: 'Work'
  },
  {
    id: 'br_13',
    question: 'What is the absolute worst response to a heartfelt “I love you”?',
    options: [
      '“Aww thank you!”',
      '“I know.” (Han Solo style but they are not cool)',
      '“I love spendy time with you too”',
      '“Seen at 11:42 PM”'
    ],
    originalPercent: [15, 20, 10, 55],
    category: 'Dating'
  },
  {
    id: 'br_14',
    question: 'What screams “I have no personality of my own and copy everything I see”?',
    options: [
      'Buying Stanley cups in 12 different pastel colors',
      'Saying “let him cook” during a regular office presentation',
      'Making a compilation of sunset videos with sad lofi music',
      'Suddenly adopting a British accent after watching 3 episodes of Love Island'
    ],
    originalPercent: [45, 15, 10, 30],
    category: 'Internet Culture'
  },
  {
    id: 'br_15',
    question: 'What is the ultimate indicator that you desperately need to touch grass?',
    options: [
      'You find yourself mentally calculating the TikTok sound potential of a family funeral',
      'You have arguments with anonymous accounts about anime power scaling at 3 AM',
      'Your phone screen time report says 14 hours and you feel proud',
      'You call your real-life pets “doggo” and “chonker” unironically'
    ],
    originalPercent: [25, 40, 20, 15],
    category: 'Delusions'
  },
  {
    id: 'br_16',
    question: 'What is the absolute biggest waste of money that Gen Z loves?',
    options: [
      'Buying mysterious crystals to align your energy centers',
      'Paying $45 for a branded water bottle that keeps ice for 72 hours',
      'Mystery blind box figurines that sit on a shelf doing absolutely nothing',
      'Overpriced aesthetic room lights that make your bedroom look like a spaceship'
    ],
    originalPercent: [18, 38, 24, 20],
    category: 'Internet Culture'
  },
  {
    id: 'br_17',
    question: 'Which text abbreviation is secretly the most passive-aggressive?',
    options: [
      '“np” (No problem, but written in lower case with zero emotion)',
      '“K” (No punctuation, just one single letter representing ultimate coldness)',
      '“lol.” (With a period at the end - who laughs with a full stop?)',
      '“Ah” (The realization that they don’t actually care)'
    ],
    originalPercent: [12, 64, 18, 6],
    category: 'Social Media'
  },
  {
    id: 'br_18',
    question: 'Which friend behavior represents the peak of “lowkey fake” energy?',
    options: [
      'Only calling you when they need a ride or an extra person for a discount',
      'Commenting “STUNNING 🔥” on your post but leaving your text on read',
      'Suddenly becoming your best friend only when they are single',
      'Giving you advice that clearly sabotages your outfits'
    ],
    originalPercent: [35, 25, 30, 10],
    category: 'Family'
  }
];

export const GK_QUESTIONS: GKQuestion[] = [
  // Programming
  {
    id: 'gk_1',
    question: 'Which programming language was originally developed by Sun Microsystems in 1995?',
    options: ['C++', 'Java', 'Python', 'JavaScript'],
    correctAnswer: 1,
    category: 'Programming',
    difficulty: 'easy'
  },
  {
    id: 'gk_7',
    question: 'In programming, what is the time complexity of searching in a balanced Binary Search Tree (BST)?',
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    category: 'Programming',
    difficulty: 'medium'
  },
  {
    id: 'gk_19',
    question: 'Which of the following programming languages is famously known for its safety guarantees without a garbage collector?',
    options: ['Rust', 'Go', 'Swift', 'C#'],
    correctAnswer: 0,
    category: 'Programming',
    difficulty: 'hard'
  },
  {
    id: 'gk_20',
    question: 'What is the primary function of a linker in the compilation process of a C++ program?',
    options: [
      'To compile source code into assembly',
      'To load executable files into main memory',
      'To find syntax errors in header files',
      'To combine multiple object files into a single executable file'
    ],
    correctAnswer: 3,
    category: 'Programming',
    difficulty: 'expert'
  },

  // Technology
  {
    id: 'gk_2',
    question: 'What does the acronym HTTP stand for in web technology?',
    options: [
      'Hyperlink Text Transfer Protocol',
      'Hypertext Technical Program',
      'Hypertext Transfer Protocol',
      'High Transfer Text Procedure'
    ],
    correctAnswer: 2,
    category: 'Technology',
    difficulty: 'easy'
  },
  {
    id: 'gk_14',
    question: 'What was the code name of the first digital general-purpose computer, completed in 1945 at the University of Pennsylvania?',
    options: ['ENIAC', 'UNIVAC', 'Colossus', 'Harvard Mark I'],
    correctAnswer: 0,
    category: 'Technology',
    difficulty: 'hard'
  },
  {
    id: 'gk_21',
    question: 'Which underlying network protocol is primarily used by DNS (Domain Name System) queries due to its low overhead and speed?',
    options: ['UDP', 'TCP', 'SCTP', 'HTTP'],
    correctAnswer: 0,
    category: 'Technology',
    difficulty: 'medium'
  },
  {
    id: 'gk_22',
    question: 'Who is widely credited with inventing the World Wide Web in 1989 while working at CERN?',
    options: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Vint Cerf'],
    correctAnswer: 1,
    category: 'Technology',
    difficulty: 'easy'
  },

  // Science
  {
    id: 'gk_3',
    question: 'Who is considered the author of the first computer algorithm, written for Charles Babbage’s Analytical Engine?',
    options: ['Grace Hopper', 'Alan Turing', 'Ada Lovelace', 'Margaret Hamilton'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: 'gk_8',
    question: 'What is the speed of light in a vacuum, approximately?',
    options: [
      '300,000 kilometers per second',
      '150,000 kilometers per second',
      '1,000,000 kilometers per second',
      '30,000 kilometers per second'
    ],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: 'gk_23',
    question: 'What chemical element has the atomic number 1, representing the most abundant element in the universe?',
    options: ['Helium', 'Oxygen', 'Carbon', 'Hydrogen'],
    correctAnswer: 3,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: 'gk_24',
    question: 'Which fundamental physical force keeps nucleons (protons and neutrons) bound together inside an atomic nucleus?',
    options: ['Strong Nuclear Force', 'Electromagnetic Force', 'Weak Nuclear Force', 'Gravitational Force'],
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'hard'
  },

  // Cybersecurity
  {
    id: 'gk_4',
    question: 'In cybersecurity, what does a “Phishing” attack primarily target?',
    options: [
      'Operating system vulnerabilities',
      'Human psychology and credentials',
      'Hardware firewalls',
      'Local network routers'
    ],
    correctAnswer: 1,
    category: 'Cybersecurity',
    difficulty: 'easy'
  },
  {
    id: 'gk_11',
    question: 'What is the name of the active defense strategy where deceptive, fake assets are placed in a network to lure attackers?',
    options: ['Sandboxing', 'Honeypot', 'Firewalling', 'Phishing Sink'],
    correctAnswer: 1,
    category: 'Cybersecurity',
    difficulty: 'medium'
  },
  {
    id: 'gk_17',
    question: 'Which cybersecurity standard refers to a set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment?',
    options: ['ISO 27001', 'SOC 2', 'PCI-DSS', 'HIPAA'],
    correctAnswer: 2,
    category: 'Cybersecurity',
    difficulty: 'hard'
  },
  {
    id: 'gk_25',
    question: 'What type of cryptographic attack involves pre-computing hash values of common passwords in tables to speed up password cracking?',
    options: ['Brute Force Attack', 'Rainbow Table Attack', 'Dictionary Attack', 'Birthday Attack'],
    correctAnswer: 1,
    category: 'Cybersecurity',
    difficulty: 'expert'
  },

  // History
  {
    id: 'gk_5',
    question: 'Which historic document begins with the famous phrase: “We the People”?',
    options: [
      'The United States Constitution',
      'The Magna Carta',
      'The Declaration of Independence',
      'The Bill of Rights'
    ],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'easy'
  },
  {
    id: 'gk_10',
    question: 'In what year was the first web page published on the internet by Tim Berners-Lee?',
    options: ['1989', '1995', '1991', '2000'],
    correctAnswer: 2,
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: 'gk_26',
    question: 'Which ancient empire was ruled by Julius Caesar, Augustus, and Nero?',
    options: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Byzantine Empire'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'easy'
  },
  {
    id: 'gk_27',
    question: 'The Treaty of Versailles, signed in 1919, officially concluded which major global conflict?',
    options: ['World War I', 'World War II', 'The Napoleonic Wars', 'The Franco-Prussian War'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'medium'
  },

  // AI
  {
    id: 'gk_6',
    question: 'Which deep neural network model architecture was introduced in the 2017 seminal paper “Attention Is All You Need”?',
    options: [
      'Recurrent Neural Network (RNN)',
      'Transformer',
      'Convolutional Neural Network (CNN)',
      'Generative Adversarial Network (GAN)'
    ],
    correctAnswer: 1,
    category: 'AI',
    difficulty: 'hard'
  },
  {
    id: 'gk_28',
    question: 'Who is widely considered the father of artificial intelligence and proposed the famous imitation game (Turing Test) in 1950?',
    options: ['John McCarthy', 'Alan Turing', 'Marvin Minsky', 'Claude Shannon'],
    correctAnswer: 1,
    category: 'AI',
    difficulty: 'medium'
  },
  {
    id: 'gk_29',
    question: 'What does RLHF stand for, a technique crucial in aligning models like ChatGPT to follow user instructions safely?',
    options: [
      'Reinforcement Learning from Human Feedback',
      'Recursive Logical Hyper-parameter Fitting',
      'Randomized Latent Heuristic Filtering',
      'Recurrent Linearized Heuristic Forecasting'
    ],
    correctAnswer: 0,
    category: 'AI',
    difficulty: 'hard'
  },

  // Business
  {
    id: 'gk_9',
    question: 'Which company developed the famous mobile operating system Android before it was acquired by Google?',
    options: ['Motorola', 'Android Inc.', 'Nokia', 'Samsung'],
    correctAnswer: 1,
    category: 'Business',
    difficulty: 'medium'
  },
  {
    id: 'gk_16',
    question: 'Which of the following is a primary core design goal of Bitcoin as outlined by Satoshi Nakamoto’s whitepaper?',
    options: [
      'High-frequency stock trading automation',
      'Encrypted cloud database hosting',
      'A decentralized peer-to-peer electronic cash system',
      'Government-sponsored digital currency tracking'
    ],
    correctAnswer: 2,
    category: 'Business',
    difficulty: 'medium'
  },
  {
    id: 'gk_18',
    question: 'What is the oldest continuously active commercial software company, founded in 1968 and known for databases and enterprise apps?',
    options: ['Software AG', 'SAP', 'Microsoft', 'Oracle'],
    correctAnswer: 0,
    category: 'Business',
    difficulty: 'expert'
  },

  // Space
  {
    id: 'gk_12',
    question: 'Which planet in our solar system has the most extensive and visible ring system, discovered in detail by the Cassini spacecraft?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 1,
    category: 'Space',
    difficulty: 'easy'
  },
  {
    id: 'gk_30',
    question: 'What is the name of the first artificial satellite launched into orbit around the Earth, sent by the Soviet Union in 1957?',
    options: ['Sputnik 1', 'Vostok 1', 'Apollo 11', 'Explorer 1'],
    correctAnswer: 0,
    category: 'Space',
    difficulty: 'medium'
  },
  {
    id: 'gk_31',
    question: 'Which astronomical term refers to the boundary surrounding a black hole from which nothing, not even light, can escape?',
    options: ['Singularity', 'Ergosphere', 'Event Horizon', 'Accretion Disk'],
    correctAnswer: 2,
    category: 'Space',
    difficulty: 'medium'
  },

  // Mathematics
  {
    id: 'gk_13',
    question: 'In mathematical logic, what is the Gödel’s Incompleteness Theorem primarily about?',
    options: [
      'The limitations of provability in formal axiomatic systems',
      'The speed limits of computing recursive algorithms',
      'The exact calculation of transcendental numbers',
      'The geometric limitations of non-Euclidean spaces'
    ],
    correctAnswer: 0,
    category: 'Mathematics',
    difficulty: 'expert'
  },
  {
    id: 'gk_32',
    question: 'What is the value of the mathematical constant e (Euler’s number) up to two decimal places?',
    options: ['3.14', '1.61', '2.72', '1.41'],
    correctAnswer: 2,
    category: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: 'gk_33',
    question: 'In linear algebra, what is a square matrix called if its transpose is equal to its negative?',
    options: ['Symmetric Matrix', 'Orthogonal Matrix', 'Identity Matrix', 'Skew-Symmetric Matrix'],
    correctAnswer: 3,
    category: 'Mathematics',
    difficulty: 'hard'
  },

  // Movies
  {
    id: 'gk_15',
    question: 'In the movie “Inception” (2010), what object serves as Cobb’s (Leonardo DiCaprio) totem to test if he is in a dream?',
    options: ['A brass spinning top', 'A loaded silver die', 'A heavy metal chess piece', 'A pocket watch'],
    correctAnswer: 0,
    category: 'Movies',
    difficulty: 'easy'
  },
  {
    id: 'gk_34',
    question: 'Who directed the cinematic masterpiece “Oppenheimer” (2023) as well as “Interstellar” and “The Dark Knight”?',
    options: ['Steven Spielberg', 'Martin Scorsese', 'Christopher Nolan', 'Quentin Tarantino'],
    correctAnswer: 2,
    category: 'Movies',
    difficulty: 'easy'
  },
  {
    id: 'gk_35',
    question: 'Which movie won the Academy Award for Best Picture in 2020, becoming the first non-English language film to do so?',
    options: ['Roma', 'Parasite', 'Minari', 'Drive My Car'],
    correctAnswer: 1,
    category: 'Movies',
    difficulty: 'medium'
  },

  // Geography (New Category!)
  {
    id: 'gk_36',
    question: 'Which country has the longest coastline in the world, stretching over 202,000 kilometers?',
    options: ['Russia', 'Canada', 'Australia', 'Indonesia'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'medium'
  },
  {
    id: 'gk_37',
    question: 'What is the capital city of Australia, established in 1913 as a compromise between Sydney and Melbourne?',
    options: ['Sydney', 'Canberra', 'Melbourne', 'Brisbane'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: 'gk_38',
    question: 'Which river is the longest in the world, running northwards through northeastern Africa for 6,650 kilometers?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: 'gk_39',
    question: 'In which mountain range is Mount Everest, the tallest mountain above sea level, located?',
    options: ['Andes', 'Rockies', 'Alps', 'Himalayas'],
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: 'gk_40',
    question: 'Which country is the smallest independent state in the world, both by area and population?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },

  // Gaming (New Category!)
  {
    id: 'gk_41',
    question: 'Which video game became the best-selling video game of all time, surpassing 300 million copies across platforms?',
    options: ['Minecraft', 'Grand Theft Auto V', 'Tetris', 'Wii Sports'],
    correctAnswer: 0,
    category: 'Gaming',
    difficulty: 'easy'
  },
  {
    id: 'gk_42',
    question: 'What is the name of the fictional continent where the popular franchise “The Witcher” takes place?',
    options: ['Tamriel', 'The Continent', 'Azeroth', 'Sanctuary'],
    correctAnswer: 1,
    category: 'Gaming',
    difficulty: 'medium'
  },
  {
    id: 'gk_43',
    question: 'In the game “Minecraft”, what block do you need to construct a portal to enter the Nether dimension?',
    options: ['Cobblestone', 'Netherrack', 'Obsidian', 'Diamond Block'],
    correctAnswer: 2,
    category: 'Gaming',
    difficulty: 'easy'
  },
  {
    id: 'gk_44',
    question: 'Which year was the original Nintendo Entertainment System (NES) released in North America?',
    options: ['1980', '1983', '1985', '1989'],
    correctAnswer: 2,
    category: 'Gaming',
    difficulty: 'hard'
  },

  // Anime & Pop Culture (New Category!)
  {
    id: 'gk_45',
    question: 'In the anime “Naruto”, what is the name of the village where Naruto Uzumaki resides?',
    options: ['Hidden Sand Village', 'Hidden Mist Village', 'Hidden Rain Village', 'Hidden Leaf Village'],
    correctAnswer: 3,
    category: 'Anime & Pop Culture',
    difficulty: 'easy'
  },
  {
    id: 'gk_46',
    question: 'What is the name of the protagonist in the legendary Studio Ghibli film “Spirited Away” (2001)?',
    options: ['Chihiro', 'San', 'Kiki', 'Sheeta'],
    correctAnswer: 0,
    category: 'Anime & Pop Culture',
    difficulty: 'medium'
  },
  {
    id: 'gk_47',
    question: 'Which manga series is currently the best-selling manga series of all time, created by Eiichiro Oda?',
    options: ['Dragon Ball', 'Naruto', 'One Piece', 'Demon Slayer'],
    correctAnswer: 2,
    category: 'Anime & Pop Culture',
    difficulty: 'easy'
  },
  {
    id: 'gk_48',
    question: 'What is the signature ultimate technique of Goku in the Dragon Ball series, taught by Master Roshi?',
    options: ['Spirit Bomb', 'Special Beam Cannon', 'Kamehameha', 'Destructo Disc'],
    correctAnswer: 2,
    category: 'Anime & Pop Culture',
    difficulty: 'easy'
  },

  // Music (New Category!)
  {
    id: 'gk_49',
    question: 'Which classical composer wrote the famous “Moonlight Sonata” while progressively losing his hearing?',
    options: ['Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Johann Sebastian Bach', 'Frédéric Chopin'],
    correctAnswer: 1,
    category: 'Music',
    difficulty: 'easy'
  },
  {
    id: 'gk_50',
    question: 'What is the name of the lead vocalist of the legendary British rock band Queen?',
    options: ['Freddie Mercury', 'David Bowie', 'Mick Jagger', 'Robert Plant'],
    correctAnswer: 0,
    category: 'Music',
    difficulty: 'easy'
  },
  {
    id: 'gk_51',
    question: 'Which musical term represents a temporary transition to a different key within a song?',
    options: ['Modulation', 'Arpeggio', 'Syncopation', 'Cadence'],
    correctAnswer: 0,
    category: 'Music',
    difficulty: 'medium'
  },
  {
    id: 'gk_52',
    question: 'In what decade did the legendary band The Beatles release their revolutionary album “Abbey Road”?',
    options: ['1950s', '1960s', '1970s', '1980s'],
    correctAnswer: 1,
    category: 'Music',
    difficulty: 'easy'
  },

  // Sports (New Category!)
  {
    id: 'gk_53',
    question: 'Which country has won the most FIFA World Cup titles in football history, with 5 tournament wins?',
    options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
    correctAnswer: 2,
    category: 'Sports',
    difficulty: 'easy'
  },
  {
    id: 'gk_54',
    question: 'How many rings are on the official Olympic flag, representing the unity of the five inhabited continents?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    category: 'Sports',
    difficulty: 'easy'
  },
  {
    id: 'gk_55',
    question: 'Which legendary basketball player won 6 NBA championships with the Chicago Bulls in the 1990s?',
    options: ['Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Shaquille O’Neal'],
    correctAnswer: 0,
    category: 'Sports',
    difficulty: 'easy'
  },
  {
    id: 'gk_56',
    question: 'What is the standard length of a full-size Olympic swimming pool in meters?',
    options: ['25 meters', '50 meters', '100 meters', '75 meters'],
    correctAnswer: 1,
    category: 'Sports',
    difficulty: 'medium'
  }
];
