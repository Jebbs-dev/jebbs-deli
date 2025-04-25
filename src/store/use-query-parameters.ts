import { create } from "zustand";

interface QueryParamsProps {
  querykey: string;
  setQueryKey: (query: string) => void;
}

export const useQueryParamaters = create<QueryParamsProps>((set) => ({
  querykey: "",
  setQueryKey: (query) => set({ querykey: query }),
}));
