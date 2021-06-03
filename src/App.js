import Collections from './components/Collections';
import { CollectionsStore } from './stores/CollectionsStore';
import { ContextsStore } from './stores/ContextsStore';
import { EntitiesStore } from './stores/EntitiesStore';

function App() {
  return (
    <div className="App">
      <Collections store={CollectionsStore} contextsStore={ContextsStore} entitiesStore={EntitiesStore} />
    </div>
  );
}

export default App;
