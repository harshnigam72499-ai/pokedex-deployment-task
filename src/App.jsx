import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "https://pokeapi.co/api/v2";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
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

      const response = await fetch(`${API_BASE_URL}/pokemon?limit=200`);

      if (!response.ok) {
        throw new Error("Pokemon list fetch failed");
      }

      const data = await response.json();
      setPokemonList(data.results);
    } catch (err) {
      setError("Failed to load Pokemon list. Please try again.");
    } finally {
      setListLoading(false);
    }
  }

  async function fetchPokemonDetails(name) {
    try {
      setDetailLoading(true);
      setError("");
      setSelectedPokemon(null);

      const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

      if (!response.ok) {
        throw new Error("Pokemon detail fetch failed");
      }

      const data = await response.json();
      setSelectedPokemon(data);
    } catch (err) {
      setError("Failed to load Pokemon details. Please try again.");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="tag">React + Docker + Nginx + HTTPS</p>
        <h1>Pokédex UI</h1>
        <p className="subtitle">
          Select a Pokémon to view its ID, sprite, types, abilities and base stats.
        </p>
      </section>

      {error && <div className="error-box">{error}</div>}

      <section className="layout">
        <div className="panel">
          <h2>Pokémon List</h2>

          {listLoading ? (
            <p className="status">Loading Pokémon...</p>
          ) : (
            <div className="pokemon-list">
              {pokemonList.map((pokemon) => (
                <button
                  key={pokemon.name}
                  className="pokemon-button"
                  onClick={() => fetchPokemonDetails(pokemon.name)}
                >
                  {pokemon.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel details-panel">
          <h2>Pokémon Details</h2>

          {detailLoading && <p className="status">Loading details...</p>}

          {!detailLoading && !selectedPokemon && (
            <p className="empty-text">Click any Pokémon name from the list.</p>
          )}

          {!detailLoading && selectedPokemon && (
            <div className="pokemon-details">
              <div className="pokemon-header">
                <img
		src={
	  selectedPokemon.sprites.other["official-artwork"].front_default ||
	  selectedPokemon.sprites.front_default
		}
                  alt={selectedPokemon.name}
                  className="pokemon-image"
                />

                <div>
                  <h3>{selectedPokemon.name}</h3>
                  <p>ID: #{selectedPokemon.id}</p>
                </div>
              </div>

              <div className="info-block">
                <h4>Types</h4>
                <div className="chips">
                  {selectedPokemon.types.map((item) => (
                    <span className="chip" key={item.type.name}>
                      {item.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-block">
                <h4>Abilities</h4>
                <div className="chips">
                  {selectedPokemon.abilities.map((item) => (
                    <span className="chip" key={item.ability.name}>
                      {item.ability.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-block">
                <h4>Base Stats</h4>
                <div className="stats">
                  {selectedPokemon.stats.map((item) => (
                    <div className="stat-row" key={item.stat.name}>
                      <span>{item.stat.name}</span>
                      <strong>{item.base_stat}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
