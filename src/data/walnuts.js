// Golden Walnuts — 130 total on Ginger Island (verified against Stardew Valley Wiki)
export const WALNUT_AREAS = [
  "Island East",
  "Island West",
  "Island North",
  "Volcano Dungeon",
  "Dig Site",
  "Island South",
  "Pirate Cove",
  "General",
];

export const WALNUTS = [
  // ===== GENERAL / ANYWHERE (6) =====
  { id: "gen-coconut", area: "General", description: "First Golden Coconut opened by Clint (Blacksmith)", count: 1 },
  { id: "gen-fishing", area: "General", description: "Fishing anywhere on the island (15% per cast until 5 found)", count: 5 },

  // ===== ISLAND EAST (11) =====
  { id: "e-leo-path-bush", area: "Island East", description: "Bush in the jungle on the path toward Leo's hut", count: 1 },
  { id: "e-banana-altar", area: "Island East", description: "Place a Banana on the altar by Leo's staircase (gorilla reward)", count: 3 },
  { id: "e-leo-hut-tree", area: "Island East", description: "Hit the tree inside Leo's hut with an axe", count: 1 },
  { id: "e-gembird-south", area: "Island East", description: "South of the Gem Bird Shrine (hidden passage east of Leo's stairs)", count: 1 },
  { id: "e-gembird-puzzle", area: "Island East", description: "Complete the Gem Birds puzzle", count: 5 },

  // ===== ISLAND WEST (52) =====
  { id: "w-harvest", area: "Island West", description: "Harvesting island-farm crops (5% chance, up to 5)", count: 5 },
  { id: "w-gourmand", area: "Island West", description: "Gourmand Frog quests — grow Melon, Wheat, Garlic (5 each)", count: 15 },
  { id: "w-mussel", area: "Island West", description: "Mining Mussel Nodes (10% chance, up to 5)", count: 5 },
  { id: "w-pirates-wife", area: "Island West", description: "Complete Birdie's quest 'The Pirate's Wife'", count: 5 },
  { id: "w-simon", area: "Island West", description: "Simon Says puzzle in the cave north of Tiger Slime Grove", count: 3 },
  { id: "w-js6", area: "Island West", description: "Journal Scrap #6 — dig SE beach corner by the curved palm", count: 1 },
  { id: "w-js4", area: "Island West", description: "Journal Scrap #4 — dig in sand north of Birdie's hut", count: 1 },
  { id: "w-shipwreck", area: "Island West", description: "Inside the shipwreck (hidden path at west corner)", count: 1 },
  { id: "w-mole", area: "Island West", description: "Whack-the-mole puzzle SE of Birdie's hut", count: 1 },
  { id: "w-starfish-triangle", area: "Island West", description: "Dig center of the blue starfish triangle (beach south of farm)", count: 1 },
  { id: "w-starfish-diamond", area: "Island West", description: "Dig center of the starfish diamond near the tide pools", count: 1 },
  { id: "w-tidepool-x", area: "Island West", description: "Dig the X marked in the sand in the tide pools", count: 1 },
  { id: "w-tidepool-diamond", area: "Island West", description: "Dig center of the indent diamond bottom-left of the tide pools", count: 1 },
  { id: "w-pond-coconut", area: "Island West", description: "Behind the coconut tree by the pond west of the farm", count: 1 },
  { id: "w-qis-bush1", area: "Island West", description: "Walnut bush near the cliff on the western coast toward Qi's Room", count: 1 },
  { id: "w-qis-bush2", area: "Island West", description: "Walnut bush past Qi's Walnut Room through the ocean water", count: 1 },
  { id: "w-tiger-slimes", area: "Island West", description: "Killing slimes in the Tiger Slime Grove", count: 1 },
  { id: "w-tiger-mahogany", area: "Island West", description: "Behind a mahogany tree in the Tiger Slime Grove", count: 1 },
  { id: "w-tiger-grass", area: "Island West", description: "Dig the circle of grass in the Tiger Slime Grove", count: 1 },
  { id: "w-bridge-bush", area: "Island West", description: "West over the bridge from the farm Parrot Express — bush by the south wall", count: 1 },
  { id: "w-cliff-edge-bush", area: "Island West", description: "East of Tiger Slime Grove, follow the cliff edge to a walnut bush", count: 1 },
  { id: "w-pebble-diamond", area: "Island West", description: "Dig center of the diamond pebbles east of the farm Parrot Express", count: 1 },
  { id: "w-hidden-path-bush", area: "Island West", description: "Hidden path east of the Parrot Express (jogs east then north) to a bush", count: 1 },
  { id: "w-south-cliff-bush", area: "Island West", description: "South of the Parrot Express, along the cliff bending east overlooking the farmhouse", count: 1 },

  // ===== ISLAND NORTH (17) =====
  { id: "n-entrance-stone", area: "Island North", description: "Entrance: turn west and dig the center of the stone circle", count: 1 },
  { id: "n-entrance-grove", area: "Island North", description: "Entrance: west into the hidden passage to a grove with a walnut bush", count: 1 },
  { id: "n-entrance-flowers", area: "Island North", description: "Entrance: northeast grassy area, dig center of the flower circle", count: 1 },
  { id: "n-entrance-stones2", area: "Island North", description: "Entrance: east past the flowers to another grassy area, dig the stone circle", count: 1 },
  { id: "n-fieldoffice-sand", area: "Island North", description: "Southeast of the Field Office, dig the odd-textured sand patch", count: 1 },
  { id: "n-digsite-stone", area: "Island North", description: "Up the north steps of the dig site, dig center of the stone circle", count: 1 },
  { id: "n-digsite-bridge", area: "Island North", description: "North steps of the dig site, west across the bridge — walnut plant", count: 1 },
  { id: "n-digsite-east-plants", area: "Island North", description: "North steps east through the hidden cliff passage — two walnut plants past the bridge", count: 2 },
  { id: "n-volcano-se-plant", area: "Island North", description: "Southeast of the Volcano Dungeon entrance, walnut plant hidden by a tree", count: 1 },
  { id: "n-volcano-east-dig", area: "Island North", description: "East of the Volcano entrance, dig the sand ringed by bushes and stones", count: 1 },
  { id: "n-volcano-ne-tree", area: "Island North", description: "Northeast of the Volcano entrance, knock the walnut from the curved tree with a slingshot", count: 1 },
  { id: "n-js10", area: "Island North", description: "Journal Scrap #10 — dig inside the loop of the curved palm SW of the Volcano entrance", count: 1 },
  { id: "n-nw-stone", area: "Island North", description: "Extreme northwest of the map, dig the stone circle where Leo sometimes stands", count: 1 },
  { id: "n-nw-bush", area: "Island North", description: "Extreme northwest, west along the wall through the hidden passage to a secluded bush", count: 1 },
  { id: "n-lava-bushes", area: "Island North", description: "Water a path across the lava river, then south to an open area with two bushes", count: 2 },

  // ===== VOLCANO DUNGEON (19) =====
  { id: "v-dungeon", area: "Volcano Dungeon", description: "Rocks, enemies, metal crates, and chests throughout the dungeon (up to 17)", count: 17 },
  { id: "v-forge", area: "Volcano Dungeon", description: "Walnut plants at the Forge entrance and exit", count: 2 },

  // ===== DIG SITE / ISLAND FIELD OFFICE (13) =====
  { id: "d-large-animal", area: "Dig Site", description: "Complete the Large Animal collection at the Field Office", count: 6 },
  { id: "d-snake", area: "Dig Site", description: "Complete the Snake collection at the Field Office", count: 3 },
  { id: "d-mummified-frog", area: "Dig Site", description: "Donate a Mummified Frog to the Field Office", count: 1 },
  { id: "d-mummified-bat", area: "Dig Site", description: "Donate a Mummified Bat to the Field Office", count: 1 },
  { id: "d-purple-flowers", area: "Dig Site", description: "Purple Flowers island survey (answer: 22)", count: 1 },
  { id: "d-purple-starfish", area: "Dig Site", description: "Purple Starfish island survey (answer: 18)", count: 1 },

  // ===== ISLAND SOUTH (8) =====
  { id: "s-hidden-cliff-bush", area: "Island South", description: "Hidden route behind a tree (from Island North entrance) to the upper-cliff bush", count: 1 },
  { id: "s-se-fishing", area: "Island South", description: "First time fishing the SE starfish tide pool (Island Southeast)", count: 1 },
  { id: "s-se-starfish-diamond", area: "Island South", description: "Dig center of the yellow starfish diamond (Island Southeast)", count: 1 },
  { id: "s-mermaid", area: "Island South", description: "Mermaid flute-block puzzle on a rainy day (Island Southeast)", count: 5 },

  // ===== PIRATE COVE (4) =====
  { id: "p-darts", area: "Pirate Cove", description: "Win the darts game (even nights after 8 PM, up to 3)", count: 3 },
  { id: "p-barrels-dig", area: "Pirate Cove", description: "Dig the exposed sand among the barrels east of the water", count: 1 },
];
