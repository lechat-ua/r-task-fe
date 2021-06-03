import { action, computed, makeObservable, observable, flow } from "mobx";
import axios from 'axios';

class EntitiesStoreClass {
  items = new Map();
  loading = false;

  constructor () {
    makeObservable(this, {
      items: observable,
      totalItems: computed,
      fetchItems: action,
      loading: observable
    });
  }

  get totalItems() {
    return this.items.size;
  }

  get itemsAsArray() {
    return [...this.items.values()];
  }

  fetchItems = flow(function* () {
    try {
      this.loading = true;
      const result = yield axios.get(`${process.env.REACT_APP_API_URL}/entities`);
      if (!result || result.status !== 200 || !result.data) {
        throw new Error('Failed to load entities');
      }
      const { data } = result;
      data.forEach(item => {
        this.items.set(item.id, item);
      });
    } catch (e) {
      console.error('failed to load entities', e);
    } finally {
      this.loading = false;
    }
  })
}

export const EntitiesStore = new EntitiesStoreClass();