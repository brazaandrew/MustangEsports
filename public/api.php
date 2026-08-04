<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri, PHP_URL_PATH);

// If request is for a static file that exists on disk, return false to let PHP server handle static files directly
$filePath = __DIR__ . str_replace('/Mustang/public', '', $parsedUrl);
if ($parsedUrl !== '/' && $parsedUrl !== '/api.php' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

header('Content-Type: application/json');

$path = preg_replace('/^\/Mustang\/public/', '', $parsedUrl);

if (strpos($path, '/api/matches/upcoming') !== false) {
    echo json_encode([
        'success' => true,
        'count' => 3,
        'data' => [
            [
                'id' => 'm1',
                'tournament' => 'VCT Masters Grand Finals',
                'stage' => 'Grand Finals - Bo5',
                'game' => 'Valorant',
                'team' => 'Mustang Esports',
                'teamLogo' => '/assets/images/logo.png',
                'opponent' => 'Team Apex',
                'opponentLogo' => 'https://api.dicebear.com/7.x/identicon/svg?seed=Apex',
                'matchTime' => date('Y-m-d\TH:i:s\Z', time() + 180000),
                'status' => 'Upcoming',
                'streamUrl' => 'https://www.youtube.com/embed/live_stream?channel=Twitch',
                'embedId' => 'dQw4w9WgXcQ',
                'venue' => 'Cyber Arena Dome, Seoul',
                'prizePool' => '$500,000'
            ],
            [
                'id' => 'm2',
                'tournament' => 'ESL Pro League Season 20',
                'stage' => 'Group A Winners Bracket',
                'game' => 'CS2',
                'team' => 'Mustang Esports',
                'teamLogo' => '/assets/images/logo.png',
                'opponent' => 'Fnatic Elite',
                'opponentLogo' => 'https://api.dicebear.com/7.x/identicon/svg?seed=Fnatic',
                'matchTime' => date('Y-m-d\TH:i:s\Z', time() + 380000),
                'status' => 'Upcoming',
                'streamUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'embedId' => 'dQw4w9WgXcQ',
                'venue' => 'Spodek Arena, Katowice',
                'prizePool' => '$250,000'
            ]
        ]
    ]);
    exit;
}

if (strpos($path, '/api/matches/history') !== false) {
    echo json_encode([
        'success' => true,
        'count' => 3,
        'data' => [
            [
                'id' => 'pm1',
                'tournament' => 'Valorant Champions Tour Stage 2',
                'stage' => 'Semifinals',
                'game' => 'Valorant',
                'team' => 'Mustang Esports',
                'teamScore' => 3,
                'opponent' => 'Sentinels Nova',
                'opponentScore' => 1,
                'result' => 'WIN',
                'mvp' => 'PHANTOM (2.1 KDA)',
                'date' => '2026-07-28',
                'vodUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            ],
            [
                'id' => 'pm2',
                'tournament' => 'CS2 BLAST Premier World Final',
                'stage' => 'Quarterfinals',
                'game' => 'CS2',
                'team' => 'Mustang Esports',
                'teamScore' => 2,
                'opponent' => 'Natus Vincere',
                'opponentScore' => 0,
                'result' => 'WIN',
                'mvp' => 'VORTEX (1.8 Rating)',
                'date' => '2026-07-20',
                'vodUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            ]
        ]
    ]);
    exit;
}

if (strpos($path, '/api/admin/rosters') !== false || strpos($path, '/api/rosters') !== false) {
    $rostersFile = __DIR__ . '/assets/rosters_store.json';
    $defaultRosters = [
        [
            'id' => 'p1',
            'name' => 'Karl Santos',
            'handle' => 'KARL',
            'game' => 'MLBB',
            'role' => 'Jungler / Assassin',
            'kda' => '4.95',
            'winRate' => '86%',
            'country' => 'Philippines',
            'flag' => '🇵🇭',
            'image' => '/assets/images/player_phantom.png',
            'signatureAgent' => 'Ling / Fanny / Hayabusa',
            'gear' => 'ROG Phone 8 Pro, RedMagic Cyber Controller'
        ],
        [
            'id' => 'p2',
            'name' => 'Ethan Vance',
            'handle' => 'STRIKER',
            'game' => 'CODM',
            'role' => 'Slayer / Sniper',
            'kda' => '3.42',
            'winRate' => '82%',
            'country' => 'USA',
            'flag' => '🇺🇸',
            'image' => '/assets/images/player_vortex.png',
            'signatureAgent' => 'DL Q33 / Locus / Switchblade',
            'gear' => 'iPad Pro 12.9, Razer Gaming Sleeves'
        ],
        [
            'id' => 'p3',
            'name' => 'Chen Wei',
            'handle' => 'TIGER',
            'game' => 'HOK',
            'role' => 'Clash Lane / Captain',
            'kda' => '5.10',
            'winRate' => '88%',
            'country' => 'China',
            'flag' => '🇨🇳',
            'image' => '/assets/images/player_cypher.png',
            'signatureAgent' => 'Mayene / Guan Yu / Allain',
            'gear' => 'IQOO 12 Pro, Corsair Gaming Trigger'
        ],
        [
            'id' => 'p4',
            'name' => 'Lucas Vance',
            'handle' => 'PHANTOM',
            'game' => 'VALORANT',
            'role' => 'Duelist / Entry',
            'kda' => '1.48',
            'winRate' => '78%',
            'country' => 'USA',
            'flag' => '🇺🇸',
            'image' => '/assets/images/player_apex.png',
            'signatureAgent' => 'Jett / Yoru / Iso',
            'gear' => 'Logitech G Pro X Superlight 2, Huntsman V3 Pro'
        ],
        [
            'id' => 'p5',
            'name' => 'Jin-Woo Park',
            'handle' => 'SOLAR',
            'game' => 'LEAGUE OF LEGENDS',
            'role' => 'Mid Lane',
            'kda' => '4.80',
            'winRate' => '80%',
            'country' => 'South Korea',
            'flag' => '🇰🇷',
            'image' => '/assets/images/player_solar.png',
            'signatureAgent' => 'Azir / Ahri / LeBlanc',
            'gear' => 'Corsair Sabre RGB, K70 RGB PRO'
        ],
        [
            'id' => 'p6',
            'name' => 'Arslan Malik',
            'handle' => 'KSTRIKE',
            'game' => 'TEKKEN 8',
            'role' => 'FGC Specialist',
            'kda' => '92% Set Win',
            'winRate' => '92%',
            'country' => 'Pakistan',
            'flag' => '🇵🇰',
            'image' => '/assets/images/player_ronin.png',
            'signatureAgent' => 'Kazuya / Jin / Mishima',
            'gear' => 'Qanba Obsidian 2 Arcade Stick, Hitbox Leverless'
        ]
    ];

    if (!file_exists($rostersFile)) {
        file_put_contents($rostersFile, json_encode($defaultRosters));
        $rosters = $defaultRosters;
    } else {
        $rosters = json_decode(file_get_contents($rostersFile), true);
        if (!is_array($rosters)) { $rosters = $defaultRosters; }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            $pId = !empty($input['id']) ? $input['id'] : 'p_' . time();
            $newPlayer = [
                'id' => $pId,
                'name' => trim($input['name'] ?? 'Pro Player'),
                'handle' => trim($input['handle'] ?? 'ATHLETE'),
                'game' => trim($input['game'] ?? 'VALORANT'),
                'role' => trim($input['role'] ?? 'Pro Athlete'),
                'kda' => trim($input['kda'] ?? '1.20'),
                'winRate' => trim($input['winRate'] ?? '75%'),
                'country' => trim($input['country'] ?? 'USA'),
                'flag' => trim($input['flag'] ?? '🇺🇸'),
                'image' => trim($input['image'] ?? '/assets/images/player_phantom.png'),
                'signatureAgent' => trim($input['signatureAgent'] ?? 'Main Agent'),
                'gear' => trim($input['gear'] ?? 'Pro Gear')
            ];

            $found = false;
            foreach ($rosters as $idx => $r) {
                if ($r['id'] === $pId) {
                    $rosters[$idx] = array_merge($r, $newPlayer);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                array_unshift($rosters, $newPlayer);
            }
            file_put_contents($rostersFile, json_encode($rosters));
            echo json_encode(['success' => true, 'message' => 'Player saved successfully', 'data' => $newPlayer]);
            exit;
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        preg_match('/\/api\/admin\/rosters\/(.+)/', $path, $matches);
        $delId = $matches[1] ?? '';
        $rosters = array_values(array_filter($rosters, function($r) use ($delId) { return $r['id'] !== $delId; }));
        file_put_contents($rostersFile, json_encode($rosters));
        echo json_encode(['success' => true, 'message' => 'Player deleted']);
        exit;
    }

    $game = $_GET['game'] ?? 'All';
    if ($game && $game !== 'All') {
        $filtered = array_values(array_filter($rosters, function($r) use ($game) {
            return strtolower($r['game']) === strtolower($game);
        }));
        echo json_encode(['success' => true, 'count' => count($filtered), 'data' => $filtered]);
        exit;
    }

    echo json_encode(['success' => true, 'count' => count($rosters), 'data' => $rosters]);
    exit;
}

if (strpos($path, '/api/news') !== false) {
    echo json_encode([
        'success' => true,
        'count' => 3,
        'data' => [
            [
                'id' => 'n1',
                'title' => 'Mustang Esports Dominates VCT Masters Quarterfinals in Clean 2-0 Sweep',
                'category' => 'Tournaments',
                'date' => 'August 02, 2026',
                'author' => 'Chief Esports Editor',
                'image' => '/assets/images/news_vct.png',
                'summary' => 'With unbelievable clutch performances from PHANTOM on Jett, Mustang Esports punch their ticket to the Grand Finals.',
                'content' => "Mustang Esports delivered a masterclass in tactical discipline and high-octane mechanical skill at the VCT Masters Quarterfinals, shutting down Sentinels Nova in a decisive 2-0 victory.\n\nMap 1 (Haven) saw PHANTOM lock in Jett and post a staggering 28-11 KDA, securing critical entry frags across both A site and C long. VORTEX's IGL calls kept the opponent guessing, executing seamless split attacks with precision timing."
            ],
            [
                'id' => 'n2',
                'title' => 'Mustang Welcomes CS2 Prodigy APEX to Active Pro Roster',
                'category' => 'Roster News',
                'date' => 'July 26, 2026',
                'author' => 'Mustang Media Team',
                'image' => '/assets/images/news_cs2.png',
                'summary' => 'The 19-year-old Ukrainian AWPer signs a multi-year deal with Mustang Esports ahead of ESL Pro League Season 20.',
                'content' => "We are thrilled to announce the official signing of Dmitri 'APEX' Petrov to our CS2 championship roster.\n\nA recognized phenom with a 1.54 HLTV rating over the past 6 months, APEX brings unmatched sniper dominance and clutch mentality. Welcome to the Stampede!"
            ],
            [
                'id' => 'n3',
                'title' => 'Mustang x Razer Announce Multi-Year Hardware Partnership',
                'category' => 'Announcements',
                'date' => 'July 18, 2026',
                'author' => 'Partnership Desk',
                'image' => '/assets/images/news_razer.png',
                'summary' => 'Razer becomes the official peripheral and gear sponsor for all Mustang Esports pro rosters.',
                'content' => "Mustang Esports is proud to announce Razer as our official gaming gear partner. All pro athletes across Valorant, CS2, League of Legends, and Rocket League will be equipped with Razer's industry-leading mice, keyboards, and headsets."
            ]
        ]
    ]);
    exit;
}

if (strpos($path, '/api/shop/products') !== false) {
    echo json_encode([
        'success' => true,
        'count' => 5,
        'data' => [
            [
                'id' => 'sp1',
                'name' => 'Mustang Pro Official Jersey 2026',
                'category' => 'Apparel',
                'price' => 79.99,
                'rating' => 4.9,
                'image' => '/assets/images/shop_jersey.png',
                'description' => 'Official 2026 Pro Player Jersey worn on stage. Engineered with breathable moisture-wicking cyber fabric and reinforced seams.',
                'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                'inStock' => true,
                'tag' => 'BESTSELLER'
            ],
            [
                'id' => 'sp2',
                'name' => 'Mustang Cyber Oversized Hoodie',
                'category' => 'Apparel',
                'price' => 99.99,
                'rating' => 4.8,
                'image' => '/assets/images/shop_hoodie.png',
                'description' => 'Heavyweight 450GSM cotton hoodie with high-density Cyber Yellow embroidered logo on chest and sleeve stampede graphic.',
                'sizes' => ['S', 'M', 'L', 'XL', '2XL'],
                'inStock' => true,
                'tag' => 'NEW DROP'
            ],
            [
                'id' => 'sp3',
                'name' => 'Stealth Speed Control Mousepad 3XL',
                'category' => 'Accessories',
                'price' => 44.99,
                'rating' => 5.0,
                'image' => '/assets/images/shop_mousepad.png',
                'description' => '1200x600mm ultra-smooth micro-weave cloth surface with non-slip rubber base and anti-fray stitched yellow edges.',
                'sizes' => ['3XL (1200x600mm)'],
                'inStock' => true,
                'tag' => 'LIMITED'
            ],
            [
                'id' => 'sp4',
                'name' => 'Mustang Compression Gaming Sleeve',
                'category' => 'Accessories',
                'price' => 24.99,
                'rating' => 4.7,
                'image' => '/assets/images/shop_sleeve.png',
                'description' => 'Ergonomic targeted arm compression sleeve reducing friction on mousepads and improving endurance during long sessions.',
                'sizes' => ['S/M', 'L/XL'],
                'inStock' => true,
                'tag' => 'ESSENTIAL'
            ],
            [
                'id' => 'sp5',
                'name' => 'Cyber Stampede Snapback Cap',
                'category' => 'Apparel',
                'price' => 34.99,
                'rating' => 4.6,
                'image' => '/assets/images/shop_cap.png',
                'description' => 'Structured 6-panel snapback cap featuring 3D silicone Mustang horse crest and yellow accent under-brim.',
                'sizes' => ['One Size Fits All'],
                'inStock' => true,
                'tag' => ''
            ]
        ]
    ]);
    exit;
}

if (strpos($path, '/api/contact') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? 'Athlete';
    $type = $input['type'] ?? 'Inquiry';
    echo json_encode([
        'success' => true,
        'message' => "Thank you, {$name}! Your {$type} has been received. Our team will contact you shortly.",
        'referenceId' => 'MST-' . rand(100000, 999999)
    ]);
    exit;
}

if (strpos($path, '/api/checkout') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $items = $input['cartItems'] ?? [];
    $total = 0;
    foreach ($items as $item) {
        $total += ($item['price'] * $item['quantity']);
    }
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully!',
        'orderId' => 'ORD-MUSTANG-' . rand(100000, 999999),
        'total' => number_format($total, 2),
        'estimatedDelivery' => '3-5 Business Days'
    ]);
    exit;
}

if (strpos($path, '/api/admin/login') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = $input['username'] ?? '';
    $pass = $input['password'] ?? '';
    if ($user === 'admin' && $pass === 'mustang2026') {
        echo json_encode([
            'success' => true,
            'token' => 'mst_admin_session_token_987654',
            'user' => ['name' => 'Mustang Admin', 'role' => 'Head Manager']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid admin credentials']);
    }
    exit;
}

if (strpos($path, '/api/admin/settings/logo') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $logoBase64 = $input['logoBase64'] ?? '';
    
    if (!$logoBase64) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No image provided']);
        exit;
    }

    if (preg_match('/^data:image\/(\w+);base64,/', $logoBase64, $type)) {
        $data = substr($logoBase64, strpos($logoBase64, ',') + 1);
        $type = strtolower($type[1]);

        if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid image type']);
            exit;
        }

        $data = base64_decode($data);
        if ($data === false) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Base64 decode failed']);
            exit;
        }
        
        $logoPath = __DIR__ . '/assets/images/logo.png';
        if (file_put_contents($logoPath, $data)) {
            echo json_encode(['success' => true, 'message' => 'Logo updated successfully']);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save logo']);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid base64 image data']);
        exit;
    }
}

if (strpos($path, '/api/admin/inquiries') !== false) {
    echo json_encode([
        'success' => true,
        'count' => 1,
        'data' => [
            [
                'id' => 'sub1',
                'type' => 'Player Recruitment / Scouting',
                'name' => 'Jordan Vance',
                'email' => 'jordan@radiant.gg',
                'game' => 'Valorant',
                'ign' => 'VANCE#NA1',
                'rank' => 'Radiant Top 50',
                'vodLink' => 'https://youtube.com/watch?v=demo',
                'message' => 'Looking for a tryout for the active Valorant pro roster.',
                'date' => '2026-08-04 09:15'
            ]
        ]
    ]);
    exit;
}

if (strpos($path, '/api/brackets/select') !== false) {
    $storeFile = __DIR__ . '/assets/bracket_store.json';
    $input = json_decode(file_get_contents('php://input'), true);
    $store = file_exists($storeFile) ? json_decode(file_get_contents($storeFile), true) : ['activeId' => null, 'brackets' => []];
    $store['activeId'] = $input['id'] ?? null;
    file_put_contents($storeFile, json_encode($store));
    echo json_encode(['success' => true, 'activeId' => $store['activeId']]);
    exit;
}

if (strpos($path, '/api/brackets') !== false) {
    $storeFile = __DIR__ . '/assets/bracket_store.json';
    $store = file_exists($storeFile) ? json_decode(file_get_contents($storeFile), true) : null;
    if (!is_array($store)) { $store = []; }
    if (!isset($store['activeId'])) { $store['activeId'] = null; }
    if (!isset($store['brackets']) || !is_array($store['brackets'])) { $store['brackets'] = []; }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input && isset($input['id'])) {
            $existingIndex = -1;
            foreach ($store['brackets'] as $i => $b) {
                if ($b['id'] === $input['id']) { $existingIndex = $i; break; }
            }
            if ($existingIndex !== -1) {
                $store['brackets'][$existingIndex] = $input;
            } else {
                array_unshift($store['brackets'], $input);
            }
            $store['activeId'] = $input['id'];
            file_put_contents($storeFile, json_encode($store));
        }
        echo json_encode(['success' => true, 'message' => 'Bracket saved to history', 'activeId' => $store['activeId'], 'brackets' => $store['brackets']]);
        exit;
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        preg_match('/\/api\/brackets\/(.+)/', $path, $matches);
        $delId = $matches[1] ?? '';
        $store['brackets'] = array_values(array_filter($store['brackets'], function($b) use ($delId) { return $b['id'] !== $delId; }));
        if ($store['activeId'] === $delId) {
            $store['activeId'] = count($store['brackets']) > 0 ? $store['brackets'][0]['id'] : null;
        }
        file_put_contents($storeFile, json_encode($store));
        echo json_encode(['success' => true, 'activeId' => $store['activeId'], 'brackets' => $store['brackets']]);
        exit;
    } else {
        echo json_encode(['success' => true, 'activeId' => $store['activeId'], 'brackets' => $store['brackets']]);
        exit;
    }
}

if (strpos($path, '/api/games') !== false) {
    $gamesFile = __DIR__ . '/assets/games_store.json';
    $defaultGames = [
        ['id' => 'g_val', 'name' => 'VALORANT', 'genre' => 'Tactical Shooter', 'logoUrl' => '/assets/images/games/valorant.svg', 'description' => '5v5 character-based tactical shooter'],
        ['id' => 'g_mlbb', 'name' => 'MLBB', 'genre' => 'MOBA Mobile', 'logoUrl' => '/assets/images/games/mlbb.svg', 'description' => '5v5 Mobile Legends Bang Bang'],
        ['id' => 'g_codm', 'name' => 'CODM', 'genre' => 'FPS Mobile', 'logoUrl' => '/assets/images/games/codm.svg', 'description' => 'Call of Duty Mobile'],
        ['id' => 'g_hok', 'name' => 'HOK', 'genre' => 'MOBA Mobile', 'logoUrl' => '/assets/images/games/hok.svg', 'description' => 'Honor of Kings'],
        ['id' => 'g_lol', 'name' => 'LEAGUE OF LEGENDS', 'genre' => 'MOBA PC', 'logoUrl' => '/assets/images/games/lol.svg', 'description' => '5v5 League of Legends PC'],
        ['id' => 'g_tekken', 'name' => 'TEKKEN 8', 'genre' => 'Fighting Game', 'logoUrl' => '/assets/images/games/tekken8.svg', 'description' => 'Next-gen fighting game']
    ];

    if (!file_exists($gamesFile)) {
        file_put_contents($gamesFile, json_encode($defaultGames));
        $games = $defaultGames;
    } else {
        $games = json_decode(file_get_contents($gamesFile), true);
        if (!is_array($games)) { $games = $defaultGames; }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            $gameId = !empty($input['id']) ? $input['id'] : 'game_' . time();
            $logoUrl = $input['logoUrl'] ?? '/assets/images/logo.png';

            // Handle base64 logo upload if present
            if (!empty($input['logoImageBase64'])) {
                $base64 = preg_replace('/^data:image\/\w+;base64,/', '', $input['logoImageBase64']);
                $imgData = base64_decode($base64);
                if ($imgData !== false) {
                    $fileName = 'game_' . $gameId . '.png';
                    $uploadPath = __DIR__ . '/assets/images/games/' . $fileName;
                    if (!is_dir(__DIR__ . '/assets/images/games/')) {
                        mkdir(__DIR__ . '/assets/images/games/', 0777, true);
                    }
                    file_put_contents($uploadPath, $imgData);
                    $logoUrl = '/assets/images/games/' . $fileName;
                }
            }

            $newGame = [
                'id' => $gameId,
                'name' => trim($input['name'] ?? 'New Esport Game'),
                'genre' => trim($input['genre'] ?? 'Esports'),
                'logoUrl' => $logoUrl,
                'description' => trim($input['description'] ?? 'Official esport title')
            ];

            $found = false;
            foreach ($games as $idx => $g) {
                if ($g['id'] === $gameId || strtolower($g['name']) === strtolower($newGame['name'])) {
                    $games[$idx] = array_merge($g, $newGame);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                array_unshift($games, $newGame);
            }

            file_put_contents($gamesFile, json_encode($games));
            echo json_encode(['success' => true, 'message' => 'Game details & logo saved successfully!', 'games' => $games]);
            exit;
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        preg_match('/\/api\/games\/(.+)/', $path, $matches);
        $delId = $matches[1] ?? '';
        $games = array_values(array_filter($games, function($g) use ($delId) { return $g['id'] !== $delId; }));
        file_put_contents($gamesFile, json_encode($games));
        echo json_encode(['success' => true, 'message' => 'Game deleted', 'games' => $games]);
        exit;
    }

    echo json_encode(['success' => true, 'games' => $games]);
    exit;
}

http_response_code(404);
echo json_encode(['success' => false, 'message' => 'API Endpoint Not Found']);

