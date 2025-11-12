import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { TextInput } from './common/TextInput';
import { useEdition } from '../hooks/useEdition';
import type { ShadowmasterLegacyApp } from '../types/legacy';

type ResourcesPriority = 'A' | 'B' | 'C' | 'D' | 'E' | '';

const RESOURCES_NUYEN: Record<Exclude<ResourcesPriority, ''>, number> = {
  A: 1000000,
  B: 400000,
  C: 90000,
  D: 20000,
  E: 5000,
};

export interface WeaponEntry {
  id: string;
  name: string;
  type: string;
  damage: string;
  accuracy: number;
  concealability: number;
  mode?: string;
  range?: string;
  notes?: string;
  cost?: number;
}

export interface ArmorEntry {
  id: string;
  name: string;
  type: string;
  rating: number;
  notes?: string;
  cost?: number;
}

export interface CyberwareEntry {
  id: string;
  name: string;
  rating?: number;
  essenceCost: number;
  cost?: number;
  availability?: number;
  notes?: string;
}

export interface BiowareEntry {
  id: string;
  name: string;
  rating?: number;
  cost: number;
  availability?: number;
  notes?: string;
}

export interface GearEntry {
  id: string;
  name: string;
  type: string;
  count: number;
  notes?: string;
  cost?: number;
}

export interface VehicleEntry {
  id: string;
  name: string;
  type: string;
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor?: number;
  modifications?: string[];
  notes?: string;
  cost?: number;
}

export interface EquipmentState {
  priority: ResourcesPriority;
  startingNuyen: number;
  totalCost: number;
  remainingNuyen: number;
  totalEssenceCost: number;
  weapons: WeaponEntry[];
  armor: ArmorEntry[];
  cyberware: CyberwareEntry[];
  bioware: BiowareEntry[];
  gear: GearEntry[];
  vehicles: VehicleEntry[];
}

interface EquipmentAllocationProps {
  priority: ResourcesPriority;
  storedWeapons?: WeaponEntry[];
  storedArmor?: ArmorEntry[];
  storedCyberware?: CyberwareEntry[];
  storedBioware?: BiowareEntry[];
  storedGear?: GearEntry[];
  storedVehicles?: VehicleEntry[];
  onBack: () => void;
  onStateChange: (state: EquipmentState) => void;
  onSave: (state: EquipmentState) => void;
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function EquipmentAllocation({
  priority,
  storedWeapons = [],
  storedArmor = [],
  storedCyberware = [],
  storedBioware = [],
  storedGear = [],
  storedVehicles = [],
  onBack,
  onStateChange,
  onSave,
}: EquipmentAllocationProps) {
  const startingNuyen = useMemo(() => {
    if (!priority || priority === '') return 0;
    return RESOURCES_NUYEN[priority as Exclude<ResourcesPriority, ''>] || 0;
  }, [priority]);

  const [weapons, setWeapons] = useState<WeaponEntry[]>(storedWeapons);
  const [armor, setArmor] = useState<ArmorEntry[]>(storedArmor);
  const [cyberware, setCyberware] = useState<CyberwareEntry[]>(storedCyberware);
  const [bioware, setBioware] = useState<BiowareEntry[]>(storedBioware);
  const [gear, setGear] = useState<GearEntry[]>(storedGear);
  const [vehicles, setVehicles] = useState<VehicleEntry[]>(storedVehicles);

  const totalCost = useMemo(() => {
    const weaponCost = weapons.reduce((sum, w) => sum + (w.cost || 0), 0);
    const armorCost = armor.reduce((sum, a) => sum + (a.cost || 0), 0);
    const cyberwareCost = cyberware.reduce((sum, c) => sum + (c.cost || 0), 0);
    const biowareCost = bioware.reduce((sum, b) => sum + (b.cost || 0), 0);
    const gearCost = gear.reduce((sum, g) => sum + (g.cost || 0) * g.count, 0);
    const vehicleCost = vehicles.reduce((sum, v) => sum + (v.cost || 0), 0);
    return weaponCost + armorCost + cyberwareCost + biowareCost + gearCost + vehicleCost;
  }, [weapons, armor, cyberware, bioware, gear, vehicles]);

  const totalEssenceCost = useMemo(() => {
    return cyberware.reduce((sum, c) => sum + (c.essenceCost || 0), 0);
  }, [cyberware]);

  const remainingNuyen = useMemo(() => {
    return Math.max(0, startingNuyen - totalCost);
  }, [startingNuyen, totalCost]);

  const validation = useMemo(() => {
    if (!priority || priority === '') {
      return {
        status: 'error' as const,
        message: 'Resources priority must be assigned before selecting equipment.',
      };
    }
    if (totalCost > startingNuyen) {
      return {
        status: 'error' as const,
        message: `Total cost (${totalCost.toLocaleString()}¥) exceeds available nuyen (${startingNuyen.toLocaleString()}¥).`,
      };
    }
    return {
      status: 'success' as const,
      message: `Remaining: ${remainingNuyen.toLocaleString()}¥`,
    };
  }, [priority, totalCost, startingNuyen, remainingNuyen]);

  const state: EquipmentState = useMemo(
    () => ({
      priority,
      startingNuyen,
      totalCost,
      remainingNuyen,
      totalEssenceCost,
      weapons,
      armor,
      cyberware,
      bioware,
      gear,
      vehicles,
    }),
    [priority, startingNuyen, totalCost, remainingNuyen, totalEssenceCost, weapons, armor, cyberware, bioware, gear, vehicles],
  );

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  const handleSave = () => {
    if (validation.status === 'success') {
      onSave(state);
    }
  };

  const addWeapon = () => {
    setWeapons([
      ...weapons,
      {
        id: generateId('weapon'),
        name: '',
        type: 'Firearm',
        damage: '',
        accuracy: 0,
        concealability: 0,
        cost: 0,
      },
    ]);
  };

  const updateWeapon = (id: string, updates: Partial<WeaponEntry>) => {
    setWeapons(weapons.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const removeWeapon = (id: string) => {
    setWeapons(weapons.filter((w) => w.id !== id));
  };

  const addArmor = () => {
    setArmor([
      ...armor,
      {
        id: generateId('armor'),
        name: '',
        type: 'Armor',
        rating: 0,
        cost: 0,
      },
    ]);
  };

  const updateArmor = (id: string, updates: Partial<ArmorEntry>) => {
    setArmor(armor.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const removeArmor = (id: string) => {
    setArmor(armor.filter((a) => a.id !== id));
  };

  const addCyberware = () => {
    setCyberware([
      ...cyberware,
      {
        id: generateId('cyberware'),
        name: '',
        essenceCost: 0,
        cost: 0,
      },
    ]);
  };

  const updateCyberware = (id: string, updates: Partial<CyberwareEntry>) => {
    setCyberware(cyberware.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCyberware = (id: string) => {
    setCyberware(cyberware.filter((c) => c.id !== id));
  };

  const addBioware = () => {
    setBioware([
      ...bioware,
      {
        id: generateId('bioware'),
        name: '',
        cost: 0,
      },
    ]);
  };

  const updateBioware = (id: string, updates: Partial<BiowareEntry>) => {
    setBioware(bioware.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBioware = (id: string) => {
    setBioware(bioware.filter((b) => b.id !== id));
  };

  const addGear = () => {
    setGear([
      ...gear,
      {
        id: generateId('gear'),
        name: '',
        type: 'Equipment',
        count: 1,
        cost: 0,
      },
    ]);
  };

  const updateGear = (id: string, updates: Partial<GearEntry>) => {
    setGear(gear.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const removeGear = (id: string) => {
    setGear(gear.filter((g) => g.id !== id));
  };

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        id: generateId('vehicle'),
        name: '',
        type: 'Car',
        handling: 0,
        speed: 0,
        acceleration: 0,
        body: 0,
        cost: 0,
      },
    ]);
  };

  const updateVehicle = (id: string, updates: Partial<VehicleEntry>) => {
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const renderWeaponList = () => (
    <div className="equipment-list" aria-label="Weapons">
      {weapons.length === 0 ? (
        <p className="equipment-list__empty">No weapons yet.</p>
      ) : (
        weapons.map((weapon) => (
          <div key={weapon.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${weapon.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${weapon.id}-name`}
                value={weapon.name}
                onChange={(e) => updateWeapon(weapon.id, { name: e.target.value })}
                placeholder="e.g., Ares Predator"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${weapon.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${weapon.id}-cost`}
                type="number"
                min={0}
                value={weapon.cost || 0}
                onChange={(e) => updateWeapon(weapon.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeWeapon(weapon.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderArmorList = () => (
    <div className="equipment-list" aria-label="Armor">
      {armor.length === 0 ? (
        <p className="equipment-list__empty">No armor yet.</p>
      ) : (
        armor.map((item) => (
          <div key={item.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${item.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${item.id}-name`}
                value={item.name}
                onChange={(e) => updateArmor(item.id, { name: e.target.value })}
                placeholder="e.g., Armor Jacket"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${item.id}-cost`}
                type="number"
                min={0}
                value={item.cost || 0}
                onChange={(e) => updateArmor(item.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeArmor(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderCyberwareList = () => (
    <div className="equipment-list" aria-label="Cyberware">
      {cyberware.length === 0 ? (
        <p className="equipment-list__empty">No cyberware yet.</p>
      ) : (
        cyberware.map((item) => (
          <div key={item.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${item.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${item.id}-name`}
                value={item.name}
                onChange={(e) => updateCyberware(item.id, { name: e.target.value })}
                placeholder="e.g., Datajack"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-essence`}>
              <span className="equipment-list__field-label">Essence</span>
              <input
                id={`${item.id}-essence`}
                type="number"
                step={0.1}
                min={0}
                value={item.essenceCost || 0}
                onChange={(e) => updateCyberware(item.id, { essenceCost: Number.parseFloat(e.target.value) || 0 })}
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${item.id}-cost`}
                type="number"
                min={0}
                value={item.cost || 0}
                onChange={(e) => updateCyberware(item.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeCyberware(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderBiowareList = () => (
    <div className="equipment-list" aria-label="Bioware">
      {bioware.length === 0 ? (
        <p className="equipment-list__empty">No bioware yet.</p>
      ) : (
        bioware.map((item) => (
          <div key={item.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${item.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${item.id}-name`}
                value={item.name}
                onChange={(e) => updateBioware(item.id, { name: e.target.value })}
                placeholder="e.g., Muscle Augmentation"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${item.id}-cost`}
                type="number"
                min={0}
                value={item.cost || 0}
                onChange={(e) => updateBioware(item.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeBioware(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderGearList = () => (
    <div className="equipment-list" aria-label="Gear">
      {gear.length === 0 ? (
        <p className="equipment-list__empty">No gear yet.</p>
      ) : (
        gear.map((item) => (
          <div key={item.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${item.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${item.id}-name`}
                value={item.name}
                onChange={(e) => updateGear(item.id, { name: e.target.value })}
                placeholder="e.g., Commlink"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-count`}>
              <span className="equipment-list__field-label">Count</span>
              <input
                id={`${item.id}-count`}
                type="number"
                min={1}
                value={item.count}
                onChange={(e) => updateGear(item.id, { count: Number.parseInt(e.target.value, 10) || 1 })}
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${item.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${item.id}-cost`}
                type="number"
                min={0}
                value={item.cost || 0}
                onChange={(e) => updateGear(item.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeGear(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderVehicleList = () => (
    <div className="equipment-list" aria-label="Vehicles">
      {vehicles.length === 0 ? (
        <p className="equipment-list__empty">No vehicles yet.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div key={vehicle.id} className="equipment-list__row">
            <label className="equipment-list__field" htmlFor={`${vehicle.id}-name`}>
              <span className="equipment-list__field-label">Name</span>
              <TextInput
                id={`${vehicle.id}-name`}
                value={vehicle.name}
                onChange={(e) => updateVehicle(vehicle.id, { name: e.target.value })}
                placeholder="e.g., Ford Americar"
              />
            </label>
            <label className="equipment-list__field" htmlFor={`${vehicle.id}-cost`}>
              <span className="equipment-list__field-label">Cost (¥)</span>
              <input
                id={`${vehicle.id}-cost`}
                type="number"
                min={0}
                value={vehicle.cost || 0}
                onChange={(e) => updateVehicle(vehicle.id, { cost: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </label>
            <button type="button" className="btn-link" onClick={() => removeVehicle(vehicle.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  const validationClass = `equipment-allocation__validation equipment-allocation__validation--${validation.status}`;

  return (
    <div className="equipment-allocation">
      <header className="equipment-allocation__header">
        <div className="equipment-allocation__summary">
          <span>
            Starting Nuyen: <strong>{startingNuyen.toLocaleString()}¥</strong>
          </span>
          <span>
            Total Cost: <strong>{totalCost.toLocaleString()}¥</strong>
          </span>
          <span>
            Remaining: <strong>{remainingNuyen.toLocaleString()}¥</strong>
          </span>
          {totalEssenceCost > 0 && (
            <span>
              Essence Cost: <strong>{totalEssenceCost.toFixed(1)}</strong>
            </span>
          )}
        </div>
        <div className={validationClass}>{validation.message}</div>
      </header>

      <section className="equipment-allocation__body">
        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Weapons</h4>
            <button type="button" className="btn-secondary" onClick={addWeapon}>
              Add Weapon
            </button>
          </div>
          {renderWeaponList()}
        </div>

        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Armor</h4>
            <button type="button" className="btn-secondary" onClick={addArmor}>
              Add Armor
            </button>
          </div>
          {renderArmorList()}
        </div>

        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Cyberware</h4>
            <button type="button" className="btn-secondary" onClick={addCyberware}>
              Add Cyberware
            </button>
          </div>
          {renderCyberwareList()}
        </div>

        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Bioware</h4>
            <button type="button" className="btn-secondary" onClick={addBioware}>
              Add Bioware
            </button>
          </div>
          {renderBiowareList()}
        </div>

        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Gear</h4>
            <button type="button" className="btn-secondary" onClick={addGear}>
              Add Gear
            </button>
          </div>
          {renderGearList()}
        </div>

        <div className="equipment-allocation__category">
          <div className="equipment-allocation__category-header">
            <h4>Vehicles</h4>
            <button type="button" className="btn-secondary" onClick={addVehicle}>
              Add Vehicle
            </button>
          </div>
          {renderVehicleList()}
        </div>
      </section>

      <footer className="equipment-allocation__footer">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Skills
        </button>
        <div
          className={`equipment-allocation__status ${validation.status === 'success' ? 'equipment-allocation__status--ready' : ''}`}
        >
          {validation.status === 'success'
            ? `Priority ${priority || '—'} · ${weapons.length + armor.length + cyberware.length + bioware.length + gear.length + vehicles.length} items`
            : 'Equipment selection incomplete.'}
        </div>
        <button type="button" className="btn-primary" disabled={validation.status !== 'success'} onClick={handleSave}>
          Save Equipment
        </button>
      </footer>
    </div>
  );
}

interface LegacyEquipmentState {
  weapons?: WeaponEntry[];
  armor?: ArmorEntry[];
  cyberware?: CyberwareEntry[];
  bioware?: BiowareEntry[];
  gear?: GearEntry[];
  vehicles?: VehicleEntry[];
}

export function EquipmentPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const { characterCreationData } = useEdition();
  const [priority, setPriority] = useState<ResourcesPriority>('');
  const [storedEquipment, setStoredEquipment] = useState<LegacyEquipmentState>({
    weapons: [],
    armor: [],
    cyberware: [],
    bioware: [],
    gear: [],
    vehicles: [],
  });

  useEffect(() => {
    setContainer(document.getElementById('equipment-react-root'));
  }, []);

  useEffect(() => {
    document.body.classList.add('react-equipment-enabled');
    return () => {
      document.body.classList.remove('react-equipment-enabled');
    };
  }, []);

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (!legacy) {
      return;
    }

    const syncState = () => {
      const priorities = legacy.getPriorities?.() ?? {};
      setPriority((priorities.resources as ResourcesPriority) ?? '');

      const equipmentState = legacy.getEquipmentState?.();
      if (equipmentState) {
        setStoredEquipment({
          weapons: equipmentState.weapons?.map((entry) => ({ ...entry })) ?? [],
          armor: equipmentState.armor?.map((entry) => ({ ...entry })) ?? [],
          cyberware: equipmentState.cyberware?.map((entry) => ({ ...entry })) ?? [],
          bioware: equipmentState.bioware?.map((entry) => ({ ...entry })) ?? [],
          gear: equipmentState.gear?.map((entry) => ({ ...entry })) ?? [],
          vehicles: equipmentState.vehicles?.map((entry) => ({ ...entry })) ?? [],
        });
      } else {
        setStoredEquipment({
          weapons: [],
          armor: [],
          cyberware: [],
          bioware: [],
          gear: [],
          vehicles: [],
        });
      }
    };

    syncState();

    // Subscribe to state changes if available
    const unsubscribe = legacy.subscribeEquipmentState?.(syncState);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleStateChange = (state: EquipmentState) => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.setEquipmentState) {
      legacy.setEquipmentState({
        priority: state.priority,
        weapons: state.weapons,
        armor: state.armor,
        cyberware: state.cyberware,
        bioware: state.bioware,
        gear: state.gear,
        vehicles: state.vehicles,
        totalCost: state.totalCost,
        remainingNuyen: state.remainingNuyen,
        totalEssenceCost: state.totalEssenceCost,
      });
    }
  };

  const handleSave = (state: EquipmentState) => {
    handleStateChange(state);
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(7); // Move to Contacts step
    }
  };

  const handleBack = () => {
    const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
    if (legacy?.showWizardStep) {
      legacy.showWizardStep(5); // Back to Skills step
    }
  };

  if (!container) {
    return null;
  }

  return createPortal(
    <EquipmentAllocation
      priority={priority}
      storedWeapons={storedEquipment.weapons}
      storedArmor={storedEquipment.armor}
      storedCyberware={storedEquipment.cyberware}
      storedBioware={storedEquipment.bioware}
      storedGear={storedEquipment.gear}
      storedVehicles={storedEquipment.vehicles}
      onBack={handleBack}
      onStateChange={handleStateChange}
      onSave={handleSave}
    />,
    container,
  );
}

