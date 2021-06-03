import { action, computed, makeObservable, observable, flow } from "mobx";
import axios from 'axios';

class CollectionsStoreClass {
  items = new Map();
  loading = false;
  initialItem = {
    id: null,
    name: '',
    description: '',
    context: '',
    context_id: null,
    structure: {
      name: true
    }
  };
  selectedItem = { ...this.initialItem };

  constructor () {
    makeObservable(this, {
      items: observable,
      totalItems: computed,
      addItem: action,
      updateItem: action,
      removeItem: action,
      fetchItems: action,
      loading: observable,
      setSelectedItem: action,
      clearSelectedItem: action
    });
  }

  handleCreateOrUpdateItem = flow( function* (data) {
    if (data) {
      const { id, name, description, context_id, status, structure, context } = data;
      // `ID`, `project_id`, `name`, `description`, `context_id`, `status`, `structure`
      const itemData = {
        project_id: null,
        name,
        description,
        context_id,
        status,
        structure: JSON.stringify(structure),
        context
      }
      if (!!id) {
        yield this.updateItem(id, itemData);
      } else {
        yield this.addItem(itemData);
      }
    } else {
      throw Error('Invalid collection data');
    }
  })
  
  addItem = flow( function* (data) {
    try {
      this.loading = true;
      const { context, ...partialData } = data;
      const result = yield axios.post(`${process.env.REACT_APP_API_URL}/collections`, partialData);
      if (!result || result.status !== 200) {
        throw Error('Failed to add collection');
      }
      this.items.set(result.data.ID, result.data);
    } catch (e) {
      console.error(e);
      throw Error(e.response.data.message);
    } finally {
      this.loading = false;
    }
  })

  updateItem = flow( function* (id, data) {
    if (this.items.has(id)) {
      try {
        this.loading = true;
        const { context, ...partialData } = data;
        const result = yield axios.put(`${process.env.REACT_APP_API_URL}/collections/${id}`, { values: partialData });
        if (!result || result.status !== 200) {
          throw Error('Failed to update collection');
        }
        this.items.set(id, { ...data, id });
      } catch (e) {
        console.error(e);
        throw Error(e.response.data.message);
      } finally {
        this.loading = false;
      }
    } else {
      throw Error('Failed to update collection');
    }
  })

  removeItem = flow( function* (id) {
    try {
      this.loading = true;
      const result = yield axios.delete(`${process.env.REACT_APP_API_URL}/collections/${id}`);
      if (!result || result.status !== 200) {
        throw Error('Failed to remove collection');
      }
      this.items.delete(id);
    } catch (e) {
      console.error(e);
      throw Error('Failed to remove collection');
    } finally {
      this.loading = false;
    }
  })

  get totalItems() {
    return this.items.size;
  }

  get itemsAsArray() {
    return [...this.items.values()];
  }

  fetchItems = flow( function* () {
    try {
      this.loading = true;
      const result = yield axios.get(`${process.env.REACT_APP_API_URL}/collections`);
      if (!result || result.status !== 200 || !result.data) {
        throw new Error('Failed to load collections');
      }
      const { data } = result;
      data.forEach(item => {
        this.items.set(item.id, item);
      });
    } catch (e) {
      console.error('failed to load collections', e);
    } finally {
      this.loading = false;
    }
  })

  setSelectedItem = id => {
    if (this.items.has(id)) {
      const item = this.items.get(id);
      this.selectedItem = { ...item, structure: JSON.parse(item.structure) };
    }
  }
  clearSelectedItem = () => {
    this.selectedItem = { ...this.initialItem };
  }
}

export const CollectionsStore = new CollectionsStoreClass();