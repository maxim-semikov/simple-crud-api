import { store } from './store';

export const getStoreValues = () => (store.size ? Array.from(store.values()) : []);
