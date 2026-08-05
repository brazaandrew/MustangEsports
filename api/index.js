const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Connect: Supabase PostgreSQL Database connected');
  } catch (err) {
    console.warn('Supabase client connection error:', err.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mock Data
const upcomingMatches = [
  {
    id: 'm1',
    tournament: 'VCT Masters Grand Finals',
    stage: 'Grand Finals - Bo5',
    game: 'Valorant',
    team: 'Mustang Esports',
    teamLogo: '/assets/images/logo.png',
    opponent: 'Team Apex',
    opponentLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Apex',
    matchTime: new Date(Date.now() + 2 * 86400000 + 4 * 3600000 + 18 * 60000).toISOString(),
    status: 'Upcoming',
    streamUrl: 'https://www.youtube.com/embed/live_stream?channel=Twitch',
    embedId: 'dQw4w9WgXcQ',
    venue: 'Cyber Arena Dome, Seoul',
    prizePool: '$500,000'
  },
  {
    id: 'm2',
    tournament: 'ESL Pro League Season 20',
    stage: 'Group A Winners Bracket',
    game: 'CS2',
    team: 'Mustang Esports',
    teamLogo: '/assets/images/logo.png',
    opponent: 'Fnatic Elite',
    opponentLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Fnatic',
    matchTime: new Date(Date.now() + 4 * 86400000 + 12 * 3600000).toISOString(),
    status: 'Upcoming',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    embedId: 'dQw4w9WgXcQ',
    venue: 'Spodek Arena, Katowice',
    prizePool: '$250,000'
  },
  {
    id: 'm3',
    tournament: 'LEC Summer Split',
    stage: 'Week 4 Day 2',
    game: 'League of Legends',
    team: 'Mustang Esports',
    teamLogo: '/assets/images/logo.png',
    opponent: 'G2 Vanguard',
    opponentLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=G2',
    matchTime: new Date(Date.now() + 6 * 86400000 + 18 * 3600000).toISOString(),
    status: 'Upcoming',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    embedId: 'dQw4w9WgXcQ',
    venue: 'Riot Games Arena, Berlin',
    prizePool: '$100,000'
  }
];

const pastMatches = [
  {
    id: 'pm1',
    tournament: 'Valorant Champions Tour Stage 2',
    stage: 'Semifinals',
    game: 'Valorant',
    team: 'Mustang Esports',
    teamScore: 3,
    opponent: 'Sentinels Nova',
    opponentScore: 1,
    result: 'WIN',
    mvp: 'PHANTOM (2.1 KDA)',
    date: '2026-07-28',
    vodUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'pm2',
    tournament: 'CS2 BLAST Premier World Final',
    stage: 'Quarterfinals',
    game: 'CS2',
    team: 'Mustang Esports',
    teamScore: 2,
    opponent: 'Natus Vincere',
    opponentScore: 0,
    result: 'WIN',
    mvp: 'VORTEX (1.8 Rating)',
    date: '2026-07-20',
    vodUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'pm3',
    tournament: 'Rocket League Championship Series',
    stage: 'Group Phase',
    game: 'Rocket League',
    team: 'Mustang Esports',
    teamScore: 4,
    opponent: 'BDS Gaming',
    opponentScore: 2,
    result: 'WIN',
    mvp: 'BOOST (8 Goals)',
    date: '2026-07-15',
    vodUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const rosters = [
  {
    id: 'p1',
    name: 'Karl Santos',
    handle: 'KARL',
    game: 'MLBB',
    role: 'Jungler / Assassin',
    kda: '4.95',
    winRate: '86%',
    country: 'Philippines',
    flag: '🇵🇭',
    image: '/assets/images/player_phantom.png',
    signatureAgent: 'Ling / Fanny / Hayabusa',
    gear: 'ROG Phone 8 Pro, RedMagic Cyber Controller',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  },
  {
    id: 'p2',
    name: 'Ethan Vance',
    handle: 'STRIKER',
    game: 'CODM',
    role: 'Slayer / Sniper',
    kda: '3.42',
    winRate: '82%',
    country: 'USA',
    flag: '🇺🇸',
    image: '/assets/images/player_vortex.png',
    signatureAgent: 'DL Q33 / Locus / Switchblade',
    gear: 'iPad Pro 12.9, Razer Gaming Sleeves',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  },
  {
    id: 'p3',
    name: 'Chen Wei',
    handle: 'TIGER',
    game: 'HOK',
    role: 'Clash Lane / Captain',
    kda: '5.10',
    winRate: '88%',
    country: 'China',
    flag: '🇨🇳',
    image: '/assets/images/player_cypher.png',
    signatureAgent: 'Mayene / Guan Yu / Allain',
    gear: 'IQOO 12 Pro, Corsair Gaming Trigger',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  },
  {
    id: 'p4',
    name: 'Lucas Vance',
    handle: 'PHANTOM',
    game: 'VALORANT',
    role: 'Duelist / Entry',
    kda: '1.48',
    winRate: '78%',
    country: 'USA',
    flag: '🇺🇸',
    image: '/assets/images/player_apex.png',
    signatureAgent: 'Jett / Yoru / Iso',
    gear: 'Logitech G Pro X Superlight 2, Huntsman V3 Pro',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  },
  {
    id: 'p5',
    name: 'Jin-Woo Park',
    handle: 'SOLAR',
    game: 'LEAGUE OF LEGENDS',
    role: 'Mid Lane',
    kda: '4.80',
    winRate: '80%',
    country: 'South Korea',
    flag: '🇰🇷',
    image: '/assets/images/player_solar.png',
    signatureAgent: 'Azir / Ahri / LeBlanc',
    gear: 'Corsair Sabre RGB, K70 RGB PRO',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  },
  {
    id: 'p6',
    name: 'Arslan Malik',
    handle: 'KSTRIKE',
    game: 'TEKKEN 8',
    role: 'FGC Specialist',
    kda: '92% Set Win',
    winRate: '92%',
    country: 'Pakistan',
    flag: '🇵🇰',
    image: '/assets/images/player_ronin.png',
    signatureAgent: 'Kazuya / Jin / Mishima',
    gear: 'Qanba Obsidian 2 Arcade Stick, Hitbox Leverless',
    socials: { twitter: '#', twitch: '#', instagram: '#' }
  }
];

const newsArticles = [
  {
    id: 'n1',
    title: 'Mustang Esports Dominates VCT Masters Quarterfinals in Clean 2-0 Sweep',
    category: 'Tournaments',
    date: 'August 02, 2026',
    author: 'Chief Esports Editor',
    image: '/assets/images/news_vct.png',
    summary: 'With unbelievable clutch performances from PHANTOM on Jett, Mustang Esports punch their ticket to the Grand Finals.',
    content: `Mustang Esports delivered a masterclass in tactical discipline and high-octane mechanical skill at the VCT Masters Quarterfinals, shutting down Sentinels Nova in a decisive 2-0 victory.

    Map 1 (Haven) saw PHANTOM lock in Jett and post a staggering 28-11 KDA, securing critical entry frags across both A site and C long. VORTEX's IGL calls kept the opponent guessing, executing seamless split attacks with precision timing.

    "We prepared heavily for their defense setups, and every member executed their role flawlessly," said Head Coach William 'Ares' Thorne during the post-match press conference. Mustang now advances to face Team Apex in the Grand Finals this weekend.`
  },
  {
    id: 'n2',
    title: 'Mustang Welcomes CS2 Prodigy APEX to Active Pro Roster',
    category: 'Roster News',
    date: 'July 26, 2026',
    author: 'Mustang Media Team',
    image: '/assets/images/news_cs2.png',
    summary: 'The 19-year-old Ukrainian AWPer signs a multi-year deal with Mustang Esports ahead of ESL Pro League Season 20.',
    content: `We are thrilled to announce the official signing of Dmitri 'APEX' Petrov to our CS2 championship roster.

    A recognized phenom with a 1.54 HLTV rating over the past 6 months, APEX brings unmatched sniper dominance and clutch mentality. He will make his debut under the Mustang colors at the upcoming ESL Pro League in Katowice.

    Welcome to the Stampede, APEX!`
  },
  {
    id: 'n3',
    title: 'Mustang x Razer Announce Multi-Year Hardware Partnership',
    category: 'Announcements',
    date: 'July 18, 2026',
    author: 'Partnership Desk',
    image: '/assets/images/news_razer.png',
    summary: 'Razer becomes the official peripheral and gear sponsor for all Mustang Esports pro rosters.',
    content: `Mustang Esports is proud to announce Razer as our official gaming gear partner. All pro athletes across Valorant, CS2, League of Legends, and Rocket League will be equipped with Razer's industry-leading mice, keyboards, and headsets.

    Expect co-branded custom peripherals and exclusive merch giveaways for the Mustang community coming later this season!`
  }
];

const shopProducts = [
  {
    id: 'sp1',
    name: 'Mustang Pro Official Jersey 2026',
    category: 'Apparel',
    price: 79.99,
    rating: 4.9,
    image: '/assets/images/shop_jersey.png',
    description: 'Official 2026 Pro Player Jersey worn on stage. Engineered with breathable moisture-wicking cyber fabric and reinforced seams.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    tag: 'BESTSELLER'
  },
  {
    id: 'sp2',
    name: 'Mustang Cyber Oversized Hoodie',
    category: 'Apparel',
    price: 99.99,
    rating: 4.8,
    image: '/assets/images/shop_hoodie.png',
    description: 'Heavyweight 450GSM cotton hoodie with high-density Cyber Yellow embroidered logo on chest and sleeve stampede graphic.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
    tag: 'NEW DROP'
  },
  {
    id: 'sp3',
    name: 'Stealth Speed Control Mousepad 3XL',
    category: 'Accessories',
    price: 44.99,
    rating: 5.0,
    image: '/assets/images/shop_mousepad.png',
    description: '1200x600mm ultra-smooth micro-weave cloth surface with non-slip rubber base and anti-fray stitched yellow edges.',
    sizes: ['3XL (1200x600mm)'],
    inStock: true,
    tag: 'LIMITED'
  },
  {
    id: 'sp4',
    name: 'Mustang Compression Gaming Sleeve',
    category: 'Accessories',
    price: 24.99,
    rating: 4.7,
    image: '/assets/images/shop_sleeve.png',
    description: 'Ergonomic targeted arm compression sleeve reducing friction on mousepads and improving endurance during long sessions.',
    sizes: ['S/M', 'L/XL'],
    inStock: true,
    tag: 'ESSENTIAL'
  },
  {
    id: 'sp5',
    name: 'Cyber Stampede Snapback Cap',
    category: 'Apparel',
    price: 34.99,
    rating: 4.6,
    image: '/assets/images/shop_cap.png',
    description: 'Structured 6-panel snapback cap featuring 3D silicone Mustang horse crest and yellow accent under-brim.',
    sizes: ['One Size Fits All'],
    inStock: true,
    tag: ''
  }
];

const contactSubmissions = [
  {
    id: 'sub1',
    type: 'Player Recruitment / Scouting',
    name: 'Jordan Vance',
    email: 'jordan@radiant.gg',
    game: 'Valorant',
    ign: 'VANCE#NA1',
    rank: 'Radiant Top 50',
    vodLink: 'https://youtube.com/watch?v=demo',
    message: 'Looking for a tryout for the active Valorant pro roster.',
    date: '2026-08-04 09:15'
  }
];

// API Routes
app.get('/api/matches/upcoming', (req, res) => {
  res.json({ success: true, count: upcomingMatches.length, data: upcomingMatches });
});

app.get('/api/matches/history', (req, res) => {
  res.json({ success: true, count: pastMatches.length, data: pastMatches });
});

app.get('/api/rosters', async (req, res) => {
  const game = req.query.game;
  let supabaseRosters = [];
  
  if (supabase) {
    try {
      let query = supabase.from('rosters').select('*');
      if (game && game !== 'All') {
        query = query.ilike('game', `%${game}%`);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        supabaseRosters = data.map(r => ({
          id: r.id,
          handle: r.handle,
          name: r.name,
          game: r.game,
          role: r.role,
          kda: r.kda,
          winRate: r.win_rate,
          country: r.country,
          flag: r.flag,
          image: r.image,
          signatureAgent: r.signature_agent,
          gear: r.gear
        }));
      }
    } catch (err) {
      console.error('Supabase fetch rosters error:', err);
    }
  }

  // Local fallback rosters matching the game
  let localFiltered = rosters;
  if (game && game !== 'All') {
    localFiltered = rosters.filter(r => r.game.toLowerCase() === game.toLowerCase());
  }
  
  // Merge Supabase rosters with local rosters (Supabase takes precedence, avoiding duplicates by ID)
  const merged = [...supabaseRosters];
  const supabaseIds = new Set(supabaseRosters.map(r => r.id));
  
  for (const localPlayer of localFiltered) {
    if (!supabaseIds.has(localPlayer.id)) {
      merged.push(localPlayer);
    }
  }

  res.json({ success: true, count: merged.length, data: merged });
});

app.get('/api/news', (req, res) => {
  res.json({ success: true, count: newsArticles.length, data: newsArticles });
});

app.get('/api/shop/products', (req, res) => {
  res.json({ success: true, count: shopProducts.length, data: shopProducts });
});

app.post('/api/contact', (req, res) => {
  const { type, name, email, game, ign, rank, vodLink, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields (Name, Email, Message)' });
  }

  const refId = 'MST-' + Math.floor(100000 + Math.random() * 900000);
  contactSubmissions.unshift({
    id: refId,
    type: type || 'General Inquiry',
    name,
    email,
    game: game || 'N/A',
    ign: ign || 'N/A',
    rank: rank || 'N/A',
    vodLink: vodLink || 'N/A',
    message,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  res.json({
    success: true,
    message: `Thank you, ${name}! Your ${type || 'inquiry'} has been received. Our team will contact you shortly.`,
    referenceId: refId
  });
});

app.post('/api/checkout', (req, res) => {
  const { cartItems, shippingInfo } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const orderId = 'ORD-MUSTANG-' + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    success: true,
    message: 'Order placed successfully!',
    orderId,
    total: totalAmount.toFixed(2),
    estimatedDelivery: '3-5 Business Days'
  });
});

// ADMIN CMS API ENDPOINTS
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'mustang2026') {
    res.json({ success: true, token: 'mst_admin_session_token_987654', user: { name: 'Mustang Admin', role: 'Head Manager' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

// Site Settings
app.post('/api/admin/settings/logo', (req, res) => {
  const { logoBase64 } = req.body;
  if (!logoBase64) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  try {
    // The base64 string looks like "data:image/png;base64,iVBORw0KGgo..."
    const matches = logoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const logoPath = path.join(__dirname, '..', 'public', 'assets', 'images', 'logo.png');
    
    fs.writeFileSync(logoPath, imageBuffer);
    res.json({ success: true, message: 'Logo updated successfully' });
  } catch (error) {
    console.error('Error saving logo:', error);
    res.status(500).json({ success: false, message: 'Failed to update logo' });
  }
});

// Roster CRUD
app.post('/api/admin/rosters', async (req, res) => {
  const { id, handle, name, game, role, kda, winRate, country, flag, image, signatureAgent, gear } = req.body;
  
  // Strict check: if deployed on Vercel, Supabase MUST be connected for edits to persist
  if (process.env.VERCEL && !supabase) {
    return res.status(500).json({ success: false, message: 'Supabase Environment Variables are missing in Vercel Settings!' });
  }

  if (id) {
    if (supabase) {
      try {
        const { error } = await supabase.from('rosters').upsert({
          id, handle, name, game, role, kda, win_rate: winRate, country, flag, image, signature_agent: signatureAgent, gear
        });
        if (error) throw error;
      } catch (err) {
        console.error('Supabase update roster error:', err);
        return res.status(500).json({ success: false, message: 'Database Error: ' + err.message });
      }
    }

    const idx = rosters.findIndex(p => p.id === id);
    if (idx !== -1) {
      rosters[idx] = { id, handle, name, game, role, kda, winRate, country, flag, image, signatureAgent, gear };
      return res.json({ success: true, message: 'Player updated successfully', data: rosters[idx] });
    } else {
      // If updating a player that only exists in Supabase (not in local array)
      return res.json({ success: true, message: 'Player updated successfully' });
    }
  }

  const newPlayerId = 'p_' + Date.now();
  const newPlayer = {
    id: newPlayerId,
    handle: handle || 'NEW ATHLETE',
    name: name || 'Pro Player',
    game: game || 'Valorant',
    role: role || 'Duelist',
    kda: kda || '1.20',
    winRate: winRate || '75%',
    country: country || 'USA',
    flag: flag || '🇺🇸',
    image: image || '/assets/images/player_phantom.png',
    signatureAgent: signatureAgent || 'Jett',
    gear: gear || 'Pro Mouse & Keyboard'
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('rosters').insert([{
        id: newPlayer.id,
        handle: newPlayer.handle,
        name: newPlayer.name,
        game: newPlayer.game,
        role: newPlayer.role,
        kda: newPlayer.kda,
        win_rate: newPlayer.winRate,
        country: newPlayer.country,
        flag: newPlayer.flag,
        image: newPlayer.image,
        signature_agent: newPlayer.signatureAgent,
        gear: newPlayer.gear
      }]);
      if (error) throw error;
    } catch (err) {
      console.error('Supabase insert roster error:', err);
      return res.status(500).json({ success: false, message: 'Database Error: ' + err.message });
    }
  }

  rosters.unshift(newPlayer);
  res.json({ success: true, message: 'Player created successfully', data: newPlayer });
});

app.delete('/api/admin/rosters/:id', async (req, res) => {
  const id = req.params.id;
  
  if (process.env.VERCEL && !supabase) {
    return res.status(500).json({ success: false, message: 'Supabase Environment Variables are missing in Vercel Settings!' });
  }
  
  if (supabase) {
    try {
      const { error } = await supabase.from('rosters').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Supabase delete roster error:', err);
      return res.status(500).json({ success: false, message: 'Database Error: ' + err.message });
    }
  }

  const idx = rosters.findIndex(p => p.id === id);
  if (idx !== -1) {
    rosters.splice(idx, 1);
    return res.json({ success: true, message: 'Player deleted' });
  }
  
  // If deleted from Supabase but wasn't in local array
  res.json({ success: true, message: 'Player deleted' });
});

// Matches CRUD
app.post('/api/admin/matches', (req, res) => {
  const { tournament, stage, game, team, opponent, matchTime, venue, streamUrl } = req.body;
  const newMatch = {
    id: 'm_' + Date.now(),
    tournament: tournament || 'Mustang Championship',
    stage: stage || 'Grand Finals',
    game: game || 'Valorant',
    team: team || 'Mustang Esports',
    teamLogo: '/assets/images/logo.png',
    opponent: opponent || 'Opponent Team',
    opponentLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(opponent || 'Rival'),
    matchTime: matchTime || new Date(Date.now() + 86400000).toISOString(),
    status: 'Upcoming',
    streamUrl: streamUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    embedId: 'dQw4w9WgXcQ',
    venue: venue || 'Arena Stadium'
  };
  upcomingMatches.unshift(newMatch);
  res.json({ success: true, message: 'Match fixture added', data: newMatch });
});

app.delete('/api/admin/matches/:id', (req, res) => {
  const id = req.params.id;
  const idx = upcomingMatches.findIndex(m => m.id === id);
  if (idx !== -1) {
    upcomingMatches.splice(idx, 1);
    return res.json({ success: true, message: 'Match deleted' });
  }
  res.status(404).json({ success: false, message: 'Match not found' });
});

// News CRUD
app.post('/api/admin/news', (req, res) => {
  const { title, category, summary, content, image, author } = req.body;
  const newArticle = {
    id: 'n_' + Date.now(),
    title: title || 'New Tournament Announcement',
    category: category || 'Tournaments',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
    author: author || 'Mustang Editorial Team',
    image: image || '/assets/images/news_vct.png',
    summary: summary || 'Latest news update from Mustang Esports.',
    content: content || 'Full article content details...'
  };
  newsArticles.unshift(newArticle);
  res.json({ success: true, message: 'News article published', data: newArticle });
});

app.delete('/api/admin/news/:id', (req, res) => {
  const id = req.params.id;
  const idx = newsArticles.findIndex(n => n.id === id);
  if (idx !== -1) {
    newsArticles.splice(idx, 1);
    return res.json({ success: true, message: 'Article deleted' });
  }
  res.status(404).json({ success: false, message: 'Article not found' });
});

// Shop CRUD
app.post('/api/admin/shop', (req, res) => {
  const { name, category, price, description, tag, image } = req.body;
  const newProduct = {
    id: 'sp_' + Date.now(),
    name: name || 'Mustang Pro Gear',
    category: category || 'Apparel',
    price: parseFloat(price) || 49.99,
    rating: 5.0,
    image: image || '/assets/images/shop_jersey.png',
    description: description || 'Premium Mustang merchandise product.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tag: tag || 'NEW DROP'
  };
  shopProducts.unshift(newProduct);
  res.json({ success: true, message: 'Merch product added', data: newProduct });
});

app.delete('/api/admin/shop/:id', (req, res) => {
  const id = req.params.id;
  const idx = shopProducts.findIndex(p => p.id === id);
  if (idx !== -1) {
    shopProducts.splice(idx, 1);
    return res.json({ success: true, message: 'Product deleted' });
  }
  res.status(404).json({ success: false, message: 'Product not found' });
});

// Inquiries / Scouting Applications Endpoint
app.get('/api/admin/inquiries', (req, res) => {
  res.json({ success: true, count: contactSubmissions.length, data: contactSubmissions });
});

// Games & Game Logo Manager API
let gamesList = [
  { id: 'g_val', name: 'VALORANT', genre: 'Tactical Shooter', logoUrl: '/assets/images/games/valorant.svg', description: '5v5 character-based tactical shooter' },
  { id: 'g_mlbb', name: 'MLBB', genre: 'MOBA Mobile', logoUrl: '/assets/images/games/mlbb.svg', description: '5v5 Mobile Legends Bang Bang' },
  { id: 'g_codm', name: 'CODM', genre: 'FPS Mobile', logoUrl: '/assets/images/games/codm.svg', description: 'Call of Duty Mobile' },
  { id: 'g_hok', name: 'HOK', genre: 'MOBA Mobile', logoUrl: '/assets/images/games/hok.svg', description: 'Honor of Kings' },
  { id: 'g_lol', name: 'LEAGUE OF LEGENDS', genre: 'MOBA PC', logoUrl: '/assets/images/games/lol.svg', description: '5v5 League of Legends PC' },
  { id: 'g_tekken', name: 'TEKKEN 8', genre: 'Fighting Game', logoUrl: '/assets/images/games/tekken8.svg', description: 'Next-gen fighting game' }
];

app.get('/api/games', (req, res) => {
  res.json({ success: true, games: gamesList });
});

app.post('/api/games', (req, res) => {
  const { id, name, genre, description, logoUrl, logoImageBase64 } = req.body;
  const gameId = id || 'game_' + Date.now();
  let finalLogoUrl = logoUrl || '/assets/images/logo.png';

  if (logoImageBase64) {
    try {
      const base64Data = logoImageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `game_${gameId}.png`;
      const uploadDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'games');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      finalLogoUrl = `/assets/images/games/${fileName}`;
    } catch (err) {}
  }

  const newGame = {
    id: gameId,
    name: (name || 'New Game').trim(),
    genre: (genre || 'Esports').trim(),
    logoUrl: finalLogoUrl,
    description: (description || 'Official Esport Title').trim()
  };

  const idx = gamesList.findIndex(g => g.id === gameId || g.name.toLowerCase() === newGame.name.toLowerCase());
  if (idx !== -1) {
    gamesList[idx] = { ...gamesList[idx], ...newGame };
  } else {
    gamesList.unshift(newGame);
  }

  res.json({ success: true, message: 'Game details and logo updated successfully', games: gamesList });
});

app.delete('/api/games/:id', (req, res) => {
  const id = req.params.id;
  gamesList = gamesList.filter(g => g.id !== id);
  res.json({ success: true, message: 'Game deleted', games: gamesList });
});

app.get('/api/brackets', (req, res) => {
  res.json({ success: true, activeId: activeBracketId, brackets: allBrackets });
});

app.post('/api/brackets', (req, res) => {
  const bracket = req.body;
  if (!bracket || !bracket.id) {
    return res.status(400).json({ success: false, message: 'Invalid bracket payload' });
  }

  const idx = allBrackets.findIndex(b => b.id === bracket.id);
  if (idx !== -1) {
    allBrackets[idx] = bracket;
  } else {
    allBrackets.unshift(bracket);
  }
  activeBracketId = bracket.id;
  res.json({ success: true, message: 'Bracket saved to history', activeId: activeBracketId, brackets: allBrackets });
});

app.post('/api/brackets/select', (req, res) => {
  const { id } = req.body;
  if (id && allBrackets.some(b => b.id === id)) {
    activeBracketId = id;
    return res.json({ success: true, message: 'Active tournament bracket switched', activeId: activeBracketId });
  }
  res.status(404).json({ success: false, message: 'Bracket not found' });
});

app.delete('/api/brackets/:id', (req, res) => {
  const id = req.params.id;
  const idx = allBrackets.findIndex(b => b.id === id);
  if (idx !== -1) {
    allBrackets.splice(idx, 1);
    if (activeBracketId === id) {
      activeBracketId = allBrackets.length > 0 ? allBrackets[0].id : null;
    }
    return res.json({ success: true, message: 'Bracket deleted from history', activeId: activeBracketId, brackets: allBrackets });
  }
  res.status(404).json({ success: false, message: 'Bracket not found' });
});

// Fallback route for unknown routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  const rootIndexPath = path.join(__dirname, '..', 'public', 'index.html');

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  } else if (fs.existsSync(rootIndexPath)) {
    return res.sendFile(rootIndexPath);
  }
  res.status(404).json({ success: false, message: 'Resource not found' });
});

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mustang Esports Node.js server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
