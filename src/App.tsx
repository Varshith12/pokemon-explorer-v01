import { useEffect, useState } from "react";
import { Search, Heart, Moon, Sun, Sparkles, Loader2 } from "lucide-react";
import { getPokemonList, getPokemon } from "./assets/services/pokemonApi";
import type { Pokemon } from "./assets/services/pokemonApi";
import PokemonModal from "./components/PokemonModal";

const typeColors: Record<string, string> = {
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500",
  ghost: "bg-purple-500",
  dragon: "bg-indigo-500",
  ice: "bg-cyan-400 text-black",
  poison: "bg-violet-500",
  bug: "bg-lime-500 text-black",
  normal: "bg-gray-500",
  fighting: "bg-red-700",
  ground: "bg-amber-700",
  rock: "bg-stone-500",
  fairy: "bg-rose-400 text-black",
};

const pokemonTypes = [
  "All",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Psychic",
  "Dragon",
  "Ghost",
  "Ice",
  "Bug",
  "Poison",
  "Normal",
];

export default function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const [selectedType, setSelectedType] = useState("All");

  const [favorites, setFavorites] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    if (fav) setFavorites(JSON.parse(fav));

    const theme = localStorage.getItem("theme");
    if (theme) setDarkMode(theme === "dark");

    loadInitialPokemon();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await getPokemonList(20, 0);

      const details = await Promise.all(
        list.results.map((p) => getPokemon(p.name))
      );

      setPokemon(details);
      setOffset(20);
      setHasMore(Boolean(list.next));
      setSelectedType("All");
    } catch {
      setError("Couldn't load Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemon = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const list = await getPokemonList(20, offset);

      const details = await Promise.all(
        list.results.map((p) => getPokemon(p.name))
      );

      setPokemon((prev) => [...prev, ...details]);
      setOffset((prev) => prev + 20);
      setHasMore(Boolean(list.next));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadInitialPokemon();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getPokemon(search.trim().toLowerCase());

      setPokemon([result]);
      setHasMore(false);
      setSelectedType("All");
    } catch {
      setPokemon([]);
      setError("Pokémon not found. Try searching for another Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    loadInitialPokemon();
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredPokemon =
    selectedType === "All"
      ? pokemon
      : pokemon.filter((p) =>
          p.types.some(
            (t) => t.type.name.toLowerCase() === selectedType.toLowerCase()
          )
        );

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <header
        className={`sticky top-0 z-50 border-b ${
          darkMode ? "border-white/10 bg-slate-950/80" : "bg-white"
        } backdrop-blur`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-red-500 p-3">
              <Sparkles />
            </div>

            <div>
              <h1 className="text-lg font-bold">Pokémon Explorer</h1>
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Discover your favorites
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg border p-2 hover:bg-slate-700/20"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h2 className="mb-2 text-5xl font-extrabold">
          Discover <span className="text-yellow-400">Pokémon</span>
        </h2>

        <p className="mb-8 text-slate-400">
          Search, explore and discover detailed information about your favorite
          Pokémon.
        </p>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search Pokémon by name..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>

        {search && (
          <button
            onClick={clearSearch}
            className="mb-5 text-sm text-yellow-400 underline"
          >
            Clear Search
          </button>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {pokemonTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-4 py-2 text-sm ${
                selectedType === type
                  ? "bg-yellow-400 text-black"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-500/20 p-8 text-center">
            <p className="mb-3 text-red-300">{error}</p>
            <button
              onClick={loadInitialPokemon}
              className="rounded-lg bg-red-400 px-5 py-2 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {filteredPokemon.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPokemon(p)}
                  className="cursor-pointer rounded-2xl bg-slate-900 p-4 transition hover:scale-105"
                >
                  <div className="mb-2 flex justify-between text-xs text-slate-400">
                    <span>#{String(p.id).padStart(3, "0")}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                      }}
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.includes(p.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-400"
                        }
                      />
                    </button>
                  </div>

                  <img
                    src={p.sprites.other["official-artwork"].front_default}
                    alt={p.name}
                    className="mx-auto h-28 w-28"
                  />

                  <h3 className="mt-3 text-center font-bold capitalize">
                    {p.name}
                  </h3>

                  <div className="mt-3 flex justify-center gap-2">
                    {p.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`rounded-full px-3 py-1 text-xs capitalize ${
                          typeColors[t.type.name] || "bg-gray-600"
                        }`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMorePokemon}
                  disabled={loadingMore}
                  className="rounded-xl bg-yellow-400 px-8 py-3 font-semibold text-black hover:bg-yellow-300"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}