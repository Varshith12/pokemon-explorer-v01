import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;

  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };

  types: PokemonType[];

  abilities: {
    ability: {
      name: string;
    };
  }[];

  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];

  // Added for the Details Modal
  moves: {
    move: {
      name: string;
    };
  }[];
}

export const getPokemonList = async (
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> => {
  const response = await axios.get<PokemonListResponse>(
    `${API_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  return response.data;
};

export const getPokemon = async (
  nameOrId: string | number
): Promise<Pokemon> => {
  const response = await axios.get<Pokemon>(`${API_URL}/pokemon/${nameOrId}`);

  return response.data;
};
