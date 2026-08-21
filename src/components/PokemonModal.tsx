import { X, Ruler, Weight } from 'lucide-react';
import type { Pokemon } from '../assets/services/pokemonApi';

interface Props {
  pokemon: Pokemon | null;
  onClose: () => void;
}

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
};

export default function PokemonModal({ pokemon, onClose }: Props) {
  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <img
            src={
              pokemon.sprites.other?.['official-artwork']?.front_default ||
              pokemon.sprites.front_default ||
              ''
            }
            alt={pokemon.name}
            className="h-48 w-48 object-contain"
          />

          <h2 className="mt-3 text-3xl font-bold capitalize">{pokemon.name}</h2>

          <p className="text-slate-400">
            #{String(pokemon.id).padStart(3, '0')}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`rounded-full px-3 py-1 text-sm ${
                  typeColors[type.type.name] || 'bg-gray-500'
                }`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <Ruler className="mx-auto mb-2 text-cyan-400" />
            <p className="text-sm text-slate-400">Height</p>
            <p className="text-xl font-bold">{pokemon.height / 10} m</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <Weight className="mx-auto mb-2 text-yellow-400" />
            <p className="text-sm text-slate-400">Weight</p>
            <p className="text-xl font-bold">{pokemon.weight / 10} kg</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-xl font-semibold">Abilities</h3>

          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability.ability.name}
                className="rounded-full bg-blue-500/20 px-3 py-2 capitalize"
              >
                {ability.ability.name.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-xl font-semibold">Base Stats</h3>

          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <div className="mb-1 flex justify-between text-sm capitalize">
                  <span>{stat.stat.name.replace('-', ' ')}</span>
                  <span>{stat.base_stat}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
                    style={{
                      width: `${Math.min(stat.base_stat, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-xl font-semibold">Moves</h3>

          <div className="flex flex-wrap gap-2">
            {pokemon.moves?.slice(0, 10).map((move) => (
              <span
                key={move.move.name}
                className="rounded-full bg-purple-500/20 px-3 py-2 text-sm capitalize"
              >
                {move.move.name.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
