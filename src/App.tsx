import { useEffect, useState } from 'react';
import { Search, Heart, Moon, Sparkles, Loader2 } from 'lucide-react';
import { getPokemonList, getPokemon } from './assets/services/pokemonApi';
import type { Pokemon } from './assets/services/pokemonApi';
import PokemonModal from './components/PokemonModal';

const typeColors: Record<string, string> = {
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400 text-black',
  psychic: 'bg-pink-500',
  ghost: 'bg-purple-500',
  dragon: 'bg-indigo-500',
  ice: 'bg-cyan-400 text-black',
  poison: 'bg-violet-500',
  bug: 'bg-lime-500 text-black',
  normal: 'bg-gray-500',
  fighting: 'bg-red-700',
  ground: 'bg-amber-700',
  rock: 'bg-stone-500',
  fairy: 'bg-rose-400 text-black',
};

const pokemonTypes = [
  'All',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Dragon',
  'Ghost',
  'Ice',
  'Bug',
  'Poison',
  'Normal',
];

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  const loadInitialPokemon = async () => {
    try {
      setLoading(true);
      setError('');

      const list = await getPokemonList(20, 0);

      const details = await Promise.all(
        list.results.map((p) => getPokemon(p.name))
      );

      setPokemon(details);
      setOffset(20);
      setHasMore(Boolean(list.next));
      setSelectedType('All');
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setError("Couldn't load more Pokémon.");
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
      setError('');

      const result = await getPokemon(search.trim().toLowerCase());

      setPokemon([result]);
      setHasMore(false);
      setSelectedType('All');
    } catch (err) {
      console.error(err);
      setPokemon([]);
      setError('Pokémon not found. Try searching for another Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    loadInitialPokemon();
  };

  const filteredPokemon =
    selectedType === 'All'
      ? pokemon
      : pokemon.filter((p) =>
          p.types.some(
            (t) => t.type.name.toLowerCase() === selectedType.toLowerCase()
          )
        );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-red-500 p-3">
              <Sparkles />
            </div>

            <div>
              <h1 className="text-lg font-bold">Pokémon Explorer</h1>
              <p className="text-xs text-slate-400">Discover your favorites</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg p-2 hover:bg-white/10">
              <Heart />
            </button>

            <button className="rounded-lg p-2 hover:bg-white/10">
              <Moon />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Hero */}
        <section className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-2 text-yellow-300">
            <Sparkles size={18} />
            Explore the Pokémon world
          </div>

          <h2 className="text-5xl font-black">
            Discover{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500 bg-clip-text text-transparent">
              Pokémon
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Search, explore and discover detailed information about your
            favorite Pokémon.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-xl gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <Search className="text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search Pokémon by name..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <button
              onClick={handleSearch}
              className="rounded-2xl bg-yellow-400 px-6 font-semibold text-black hover:bg-yellow-300"
            >
              Search
            </button>
          </div>

          {search && (
            <button
              onClick={clearSearch}
              className="mt-3 text-sm text-slate-400 hover:text-white"
            >
              Clear Search
            </button>
          )}
        </section>

        {/* Type Filter */}
        <section className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            {pokemonTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedType === type
                    ? 'bg-yellow-400 text-black'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-red-500 bg-red-500/20 p-4 text-center text-red-300">
            <p>{error}</p>

            <button
              onClick={loadInitialPokemon}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cards */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-slate-800"
              />
            ))
          ) : filteredPokemon.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="text-6xl">🔍</div>

              <h3 className="mt-4 text-2xl font-bold">No Pokémon Found</h3>

              <p className="mt-2 text-slate-400">
                Try searching for another Pokémon.
              </p>
            </div>
          ) : (
            filteredPokemon.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPokemon(p)}
                className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    #{String(p.id).padStart(3, '0')}
                  </span>

                  <Heart
                    size={18}
                    className="text-slate-500 transition hover:text-red-400"
                  />
                </div>

                <div className="flex justify-center py-5">
                  <img
                    src={
                      p.sprites.other?.['official-artwork']?.front_default ||
                      p.sprites.front_default ||
                      ''
                    }
                    alt={p.name}
                    className="h-36 w-36 object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-center text-2xl font-bold capitalize">
                  {p.name}
                </h3>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {p.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        typeColors[type.type.name] || 'bg-gray-500'
                      }`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Load More */}
        {!loading && hasMore && filteredPokemon.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMorePokemon}
              disabled={loadingMore}
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-60"
            >
              {loadingMore && <Loader2 className="animate-spin" size={18} />}

              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        Pokémon Explorer • Powered by PokéAPI
      </footer>

      {/* Details Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
}

export default App;
