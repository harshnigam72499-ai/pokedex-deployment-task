import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = "https://pokeapi.co/api/v2";
const POKEMON_LIMIT = 500;

function getPokemonIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function formatName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPokemonList();
  }, []);

  async function fetchPokemonList() {
    try {
      setListLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);

      if (!response.ok) {
        throw new Error("Pokemon list fetch failed");
      }

      const data = await response.json();
      setPokemonList(data.results);

      if (data.results.length > 0) {
        fetchPokemonDetails(data.results[0].name);
      }
    } catch (err) {
      setError("Failed to load Pokémon list. Please check your internet connection.");
    } finally {
      setListLoading(false);
    }
  }

  async function fetchPokemonDetails(name) {
    try {
      setDetailLoading(true);
      setError("");
      setSelectedName(name);

      const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

      if (!response.ok) {
        throw new Error("Pokemon detail fetch failed");
      }

      const data = await response.json();
      setSelectedPokemon(data);
    } catch (err) {
      setError("Failed to load Pokémon details. Please try again.");
    } finally {
      setDetailLoading(false);
    }
  }

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

  const pokemonImage =
    selectedPokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    selectedPokemon?.sprites?.other?.dream_world?.front_default ||
    selectedPokemon?.sprites?.front_default;

  return (
    <main className="app">
      <section className="hero">
        <p className="tag">React + Docker + Nginx + HTTPS</p>
        <h1>Pokédex UI</h1>
        <p className="subtitle">
          Search, select and explore Pokémon details using PokeAPI.
        </p>
      </section>

      {error && <div className="error-box">{error}</div>}

      <section className="layout">
        <aside className="panel list-panel">
          <div className="panel-title-row">
            <div>
              <h2>Pokémon List</h2>
              <p className="mini-text">
                Showing {filteredPokemon.length} of {pokemonList.length}
              </p>
            </div>

            <span className="count-badge">{POKEMON_LIMIT}</span>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm("")}>
                Clear
              </button>
            )}
          </div>

          {listLoading ? (
            <p className="status">Loading Pokémon...</p>
          ) : filteredPokemon.length === 0 ? (
            <p className="empty-text">No Pokémon found.</p>
          ) : (
            <div className="pokemon-list">
              {filteredPokemon.map((pokemon) => {
                const pokemonId = getPokemonIdFromUrl(pokemon.url);
                const isActive = selectedName === pokemon.name;

                return (
                  <button
                    key={pokemon.name}
                    className={`pokemon-button ${isActive ? "active" : ""}`}
                    onClick={() => fetchPokemonDetails(pokemon.name)}
                  >
                    <span className="pokemon-number">#{pokemonId}</span>
                    <span className="pokemon-name">{formatName(pokemon.name)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="panel details-panel">
          <div className="panel-title-row">
            <div>
              <h2>Pokémon Details</h2>
              <p className="mini-text">HD artwork, types, abilities and stats</p>
            </div>
          </div>

          {detailLoading && <p className="status">Loading details...</p>}

          {!detailLoading && !selectedPokemon && (
            <p className="empty-text">Click any Pokémon name from the list.</p>
          )}

          {!detailLoading && selectedPokemon && (
            <div className="pokemon-details">
              <div className="pokemon-header">
                <div className="image-card">
                  <img
                    src={pokemonImage}
                    alt={selectedPokemon.name}
                    className="pokemon-image"
                  />
                </div>

                <div className="main-info">
                  <p className="id-pill">#{selectedPokemon.id}</p>
                  <h3>{formatName(selectedPokemon.name)}</h3>

                  <div className="quick-info">
                    <div>
                      <span>Height</span>
                      <strong>{selectedPokemon.height / 10} m</strong>
                    </div>

                    <div>
                      <span>Weight</span>
                      <strong>{selectedPokemon.weight / 10} kg</strong>
                    </div>

                    <div>
                      <span>Base XP</span>
                      <strong>{selectedPokemon.base_experience}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-block">
                  <h4>Types</h4>
                  <div className="chips">
                    {selectedPokemon.types.map((item) => (
                      <span className="chip type-chip" key={item.type.name}>
                        {formatName(item.type.name)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-block">
                  <h4>Abilities</h4>
                  <div className="chips">
                    {selectedPokemon.abilities.map((item) => (
                      <span className="chip" key={item.ability.name}>
                        {formatName(item.ability.name)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="info-block">
                <h4>Base Stats</h4>

                <div className="stats">
                  {selectedPokemon.stats.map((item) => {
                    const percentage = Math.min((item.base_stat / 150) * 100, 100);

                    return (
                      <div className="stat-row" key={item.stat.name}>
                        <div className="stat-top">
                          <span>{formatName(item.stat.name)}</span>
                          <strong>{item.base_stat}</strong>
                        </div>

                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
