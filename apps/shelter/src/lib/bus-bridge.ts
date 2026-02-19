import { createBus, BUS_KEYS } from "@p31labs/bus";

const bus = createBus();

/**
 * Call from any Zustand store's subscribe() to sync state to bus.
 * Example: useSpoonStore.subscribe(state => syncSpoons(state.current))
 */
export function syncSpoons(spoons: number) {
  bus.emit(BUS_KEYS.SPOONS, spoons);
}

export function syncVoltage(voltage: number) {
  bus.emit(BUS_KEYS.VOLTAGE, voltage);
}

export function syncMode(mode: string) {
  bus.emit(BUS_KEYS.MODE, mode);
}

export function syncGameState(xp: number, level: number, love: number) {
  bus.emit(BUS_KEYS.XP, xp);
  bus.emit(BUS_KEYS.LEVEL, level);
  bus.emit(BUS_KEYS.LOVE, love);
}

/** Listen for molecule events from BONDING (standalone HTML) */
export function onMoleculeBuilt(callback: (molecule: string) => void) {
  return bus.on<string>(BUS_KEYS.MOLECULE, (event) => {
    callback(event.value);
  });
}

export function onAtomsChanged(callback: (count: number) => void) {
  return bus.on<number>(BUS_KEYS.ATOMS, (event) => {
    callback(event.value);
  });
}

export { bus, BUS_KEYS };
