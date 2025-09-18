const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3005;

// Helper to fetch a list of pokemons (names + url) from pokeapi
async function fetchPokemonList(limit = 200, offset = 0) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`);
  const json = await res.json();
  return json.results; // array of { name, url }
}

// Helper to fetch detailed pokemon info by URL
async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch pokemon: ${res.status}`);
  return res.json();
}

// GET /pokemons?name=piKachu&limit=200&offset=0
// If name provided, we filter client-side (case-insensitive, substring)
app.get('/pokemons', async (req, res) => {
  try {
    const { name, limit = '200', offset = '0', details = 'false' } = req.query;
    const nlimit = Math.min(1000, parseInt(limit, 10) || 200);
    const noffset = Math.max(0, parseInt(offset, 10) || 0);

    // Fetch list
    const list = await fetchPokemonList(nlimit, noffset);

    let filtered = list;
    if (name && name.trim() !== '') {
      const q = name.trim().toLowerCase();
      filtered = list.filter(p => p.name.toLowerCase().includes(q));
    }

    if (details === 'true') {
      // fetch details for each filtered pokemon in parallel (careful with large lists)
      const detailed = await Promise.all(filtered.map(p => fetchPokemonDetails(p.url).catch(e => ({ error: e.message }))));
      return res.json({ count: detailed.length, results: detailed });
    }

    res.json({ count: filtered.length, results: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('PokeAPI proxy: GET /pokemons?name=...&limit=...&offset=...&details=true');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
