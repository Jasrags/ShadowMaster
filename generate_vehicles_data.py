#!/usr/bin/env python3
import json
import re

def to_snake_case(name):
    """Convert name to lowercase with underscores"""
    # Remove special characters except spaces and hyphens
    name = re.sub(r'[^\w\s-]', '', name)
    # Replace spaces and hyphens with underscores
    name = re.sub(r'[-\s]+', '_', name)
    # Convert to lowercase and strip underscores
    return name.lower().strip('_')

def convert_value(value, field_name):
    """Convert JSON value to Go value"""
    if value is None:
        return "nil"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        # Escape quotes
        return f'"{value.replace('"', '\\"')}"'
    if isinstance(value, list):
        items = [convert_value(item, field_name) for item in value]
        brace_open = '{'
        brace_close = '}'
        return f"[]string{brace_open}{', '.join(items)}{brace_close}"
    if isinstance(value, dict):
        # Complex structure - set to nil for now
        return "nil"  # TODO: Handle complex structures
    return str(value)

def convert_vehicle_gear_to_go(gear):
    """Convert vehicle gear JSON to Go struct"""
    if isinstance(gear, dict):
        parts = [f'Name: {convert_value(gear.get("name"), "name")}']
        if 'rating' in gear:
            parts.append(f'Rating: {convert_value(gear.get("rating"), "rating")}')
        if 'maxrating' in gear:
            parts.append(f'MaxRating: {convert_value(gear.get("maxrating"), "maxrating")}')
        return f'VehicleGear{{\n\t\t\t\t\t{", ".join(parts)},\n\t\t\t\t}}'
    return f'VehicleGear{{\n\t\t\t\t\tName: {convert_value(gear, "name")},\n\t\t\t\t}}'

def convert_vehicle_mods_to_go(mods):
    """Convert vehicle mods JSON to Go struct"""
    if not mods or 'name' not in mods:
        return "nil"
    
    name = mods.get('name')
    if isinstance(name, list):
        # Handle list of mods
        items = []
        for item in name:
            if isinstance(item, dict):
                # Complex mod with rating
                mod_name = item.get('+content', '')
                rating = item.get('+@rating', '')
                if rating:
                    items.append(f'VehicleMod{{\n\t\t\t\t\t\t\tName: {convert_value(f"{mod_name} (Rating {rating})", "name")},\n\t\t\t\t\t\t}}')
                else:
                    items.append(f'VehicleMod{{\n\t\t\t\t\t\t\tName: {convert_value(mod_name, "name")},\n\t\t\t\t\t\t}}')
            else:
                items.append(f'VehicleMod{{\n\t\t\t\t\t\t\tName: {convert_value(item, "name")},\n\t\t\t\t\t\t}}')
        return f"&VehicleMods{{\n\t\t\t\t\tName: []VehicleMod{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    else:
        # Single mod
        if isinstance(name, dict):
            mod_name = name.get('+content', '')
            rating = name.get('+@rating', '')
            if rating:
                mod_name = f"{mod_name} (Rating {rating})"
            name_val = mod_name
        else:
            name_val = name
        return f"&VehicleMods{{\n\t\t\t\t\tName: []VehicleMod{{\n\t\t\t\t\t\tVehicleMod{{\n\t\t\t\t\t\t\tName: {convert_value(name_val, "name")},\n\t\t\t\t\t\t}},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_vehicle_weapon_mounts_to_go(mounts):
    """Convert vehicle weapon mounts JSON to Go struct"""
    if not mounts or 'weaponmount' not in mounts:
        return "nil"
    
    mount = mounts.get('weaponmount')
    if isinstance(mount, list):
        items = []
        for m in mount:
            parts = []
            if 'control' in m:
                parts.append(f'Control: {convert_value(m.get("control"), "control")}')
            if 'flexibility' in m:
                parts.append(f'Flexibility: {convert_value(m.get("flexibility"), "flexibility")}')
            if 'size' in m:
                parts.append(f'Size: {convert_value(m.get("size"), "size")}')
            if 'visibility' in m:
                parts.append(f'Visibility: {convert_value(m.get("visibility"), "visibility")}')
            items.append(f'VehicleWeaponMount{{\n\t\t\t\t\t\t{", ".join(parts)},\n\t\t\t\t\t}}')
        return f"&VehicleWeaponMounts{{\n\t\t\t\t\tWeaponMount: []VehicleWeaponMount{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    else:
        parts = []
        if 'control' in mount:
            parts.append(f'Control: {convert_value(mount.get("control"), "control")}')
        if 'flexibility' in mount:
            parts.append(f'Flexibility: {convert_value(mount.get("flexibility"), "flexibility")}')
        if 'size' in mount:
            parts.append(f'Size: {convert_value(mount.get("size"), "size")}')
        if 'visibility' in mount:
            parts.append(f'Visibility: {convert_value(mount.get("visibility"), "visibility")}')
        return f"&VehicleWeaponMounts{{\n\t\t\t\t\tWeaponMount: []VehicleWeaponMount{{\n\t\t\t\t\t\tVehicleWeaponMount{{\n\t\t\t\t\t\t\t{', '.join(parts)},\n\t\t\t\t\t\t}},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_vehicle_weapons_to_go(weapons):
    """Convert vehicle weapons JSON to Go struct"""
    if not weapons or 'weapon' not in weapons:
        return "nil"
    
    weapon = weapons.get('weapon')
    if isinstance(weapon, list):
        items = []
        for w in weapon:
            name = w.get('name', '') if isinstance(w, dict) else w
            items.append(f'VehicleWeapon{{\n\t\t\t\t\t\tName: {convert_value(name, "name")},\n\t\t\t\t\t}}')
        return f"&VehicleWeapons{{\n\t\t\t\t\tWeapon: []VehicleWeapon{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    else:
        name = weapon.get('name', '') if isinstance(weapon, dict) else weapon
        return f"&VehicleWeapons{{\n\t\t\t\t\tWeapon: []VehicleWeapon{{\n\t\t\t\t\t\tVehicleWeapon{{\n\t\t\t\t\t\t\tName: {convert_value(name, "name")},\n\t\t\t\t\t\t}},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_vehicle_gears_to_go(gears):
    """Convert vehicle gears JSON to Go struct"""
    if not gears or 'gear' not in gears:
        return "nil"
    
    gear = gears.get('gear')
    if isinstance(gear, list):
        items = [convert_vehicle_gear_to_go(g) for g in gear]
        return f"&VehicleGears{{\n\t\t\t\t\tGear: []VehicleGear{{\n\t\t\t\t\t\t{', '.join(items)},\n\t\t\t\t\t}},\n\t\t\t\t}}"
    else:
        gear_go = convert_vehicle_gear_to_go(gear)
        return f"&VehicleGears{{\n\t\t\t\t\tGear: []VehicleGear{{\n\t\t\t\t\t\t{gear_go},\n\t\t\t\t\t}},\n\t\t\t\t}}"

def convert_vehicle_to_go(vehicle):
    """Convert vehicle JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(vehicle.get("name"), "name")}')
    parts.append(f'Category: {convert_value(vehicle.get("category"), "category")}')
    parts.append(f'Source: {convert_value(vehicle.get("source"), "source")}')
    
    # Vehicle stats
    parts.append(f'Accel: {convert_value(vehicle.get("accel"), "accel")}')
    parts.append(f'Armor: {convert_value(vehicle.get("armor"), "armor")}')
    parts.append(f'Avail: {convert_value(vehicle.get("avail"), "avail")}')
    parts.append(f'Body: {convert_value(vehicle.get("body"), "body")}')
    parts.append(f'Cost: {convert_value(vehicle.get("cost"), "cost")}')
    parts.append(f'Handling: {convert_value(vehicle.get("handling"), "handling")}')
    parts.append(f'Pilot: {convert_value(vehicle.get("pilot"), "pilot")}')
    parts.append(f'Sensor: {convert_value(vehicle.get("sensor"), "sensor")}')
    parts.append(f'Speed: {convert_value(vehicle.get("speed"), "speed")}')
    if 'seats' in vehicle and vehicle.get("seats"):
        parts.append(f'Seats: {convert_value(vehicle.get("seats"), "seats")}')
    else:
        parts.append('Seats: ""')
    
    # Optional fields
    if 'page' in vehicle and vehicle.get("page"):
        parts.append(f'Page: {convert_value(vehicle.get("page"), "page")}')
    if 'gears' in vehicle:
        parts.append(f'Gears: {convert_vehicle_gears_to_go(vehicle.get("gears"))}')
    if 'mods' in vehicle:
        parts.append(f'Mods: {convert_vehicle_mods_to_go(vehicle.get("mods"))}')
    if 'weaponmounts' in vehicle:
        parts.append(f'WeaponMounts: {convert_vehicle_weapon_mounts_to_go(vehicle.get("weaponmounts"))}')
    if 'weapons' in vehicle:
        parts.append(f'Weapons: {convert_vehicle_weapons_to_go(vehicle.get("weapons"))}')
    
    # Mod slots
    optional_slots = {
        'bodymodslots': 'BodyModSlots',
        'cosmeticmodslots': 'CosmeticModSlots',
        'electromagneticmodslots': 'ElectromagneticModSlots',
        'modslots': 'ModSlots',
        'powertrainmodslots': 'PowertrainModSlots',
        'protectionmodslots': 'ProtectionModSlots',
        'weaponmodslots': 'WeaponModSlots',
    }
    for slot, go_field in optional_slots.items():
        if slot in vehicle and vehicle.get(slot):
            parts.append(f'{go_field}: {convert_value(vehicle.get(slot), slot)}')
    
    if 'hide' in vehicle:
        hide = vehicle.get('hide')
        if hide is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}{str(hide).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

def convert_vehicle_mod_to_go(mod):
    """Convert vehicle modification JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(mod.get("name"), "name")}')
    parts.append(f'Category: {convert_value(mod.get("category"), "category")}')
    parts.append(f'Slots: {convert_value(mod.get("slots"), "slots")}')
    parts.append(f'Avail: {convert_value(mod.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(mod.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(mod.get("source"), "source")}')
    
    # Optional fields
    if 'page' in mod:
        parts.append(f'Page: {convert_value(mod.get("page"), "page")}')
    if 'rating' in mod:
        parts.append(f'Rating: {convert_value(mod.get("rating"), "rating")}')
    if 'required' in mod:
        parts.append('Required: nil')  # TODO: Handle complex required structures
    if 'hide' in mod:
        hide = mod.get('hide')
        if hide is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}{str(hide).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

def convert_weapon_mount_to_go(mount):
    """Convert weapon mount JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(mount.get("name"), "name")}')
    parts.append(f'Category: {convert_value(mount.get("category"), "category")}')
    parts.append(f'Slots: {convert_value(mount.get("slots"), "slots")}')
    parts.append(f'Avail: {convert_value(mount.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(mount.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(mount.get("source"), "source")}')
    
    # Optional fields
    if 'page' in mount:
        parts.append(f'Page: {convert_value(mount.get("page"), "page")}')
    if 'hide' in mount:
        hide = mount.get('hide')
        if hide is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}{str(hide).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

def convert_weapon_mount_mod_to_go(mod):
    """Convert weapon mount modification JSON to Go struct"""
    parts = []
    
    # Required fields
    parts.append(f'Name: {convert_value(mod.get("name"), "name")}')
    parts.append(f'Category: {convert_value(mod.get("category"), "category")}')
    parts.append(f'Slots: {convert_value(mod.get("slots"), "slots")}')
    parts.append(f'Avail: {convert_value(mod.get("avail"), "avail")}')
    parts.append(f'Cost: {convert_value(mod.get("cost"), "cost")}')
    parts.append(f'Source: {convert_value(mod.get("source"), "source")}')
    
    # Optional fields
    if 'page' in mod:
        parts.append(f'Page: {convert_value(mod.get("page"), "page")}')
    if 'rating' in mod:
        parts.append(f'Rating: {convert_value(mod.get("rating"), "rating")}')
    if 'required' in mod:
        parts.append('Required: nil')  # TODO: Handle complex required structures
    if 'hide' in mod:
        hide = mod.get('hide')
        if hide is None:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}true{brace_close}[0]')
        else:
            brace_open = '{'
            brace_close = '}'
            parts.append(f'Hide: &[]bool{brace_open}{str(hide).lower()}{brace_close}[0]')
    
    return "{\n\t\t\t" + ",\n\t\t\t".join(parts) + ",\n\t\t}"

# Read JSON file
with open('data/chummer/vehicles.json', 'r') as f:
    data = json.load(f)

# Generate category entries
category_entries = []
for category in data['categories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_go = f'VehicleCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    category_entries.append(f'\t"{category_id}": {category_go}')

# Generate mod category entries
mod_category_entries = []
for category in data['modcategories']['category']:
    category_name = category.get('+content', '')
    category_id = to_snake_case(category_name)
    category_go = f'VehicleModCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    mod_category_entries.append(f'\t"{category_id}": {category_go}')

# Generate weapon mount category entry
wmc = data['weaponmountcategories']['category']
if isinstance(wmc, dict):
    wmc_name = wmc.get('+content', '')
    wmc_id = to_snake_case(wmc_name)
    wmc_go = f'VehicleWeaponMountCategory{{\n\t\t\tName: {convert_value(wmc_name, "name")}, BlackMarket: {convert_value(wmc.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
    weapon_mount_category_entries = [f'\t"{wmc_id}": {wmc_go}']
else:
    weapon_mount_category_entries = []
    for category in wmc:
        category_name = category.get('+content', '')
        category_id = to_snake_case(category_name)
        category_go = f'VehicleWeaponMountCategory{{\n\t\t\tName: {convert_value(category_name, "name")}, BlackMarket: {convert_value(category.get("+@blackmarket", ""), "blackmarket")},\n\t\t}}'
        weapon_mount_category_entries.append(f'\t"{category_id}": {category_go}')

# Generate vehicle entries
vehicle_entries = []
vehicle_ids_seen = {}
for vehicle in data['vehicles']['vehicle']:
    vehicle_id = to_snake_case(vehicle.get('name', ''))
    # Handle duplicate IDs by appending a suffix
    if vehicle_id in vehicle_ids_seen:
        vehicle_ids_seen[vehicle_id] += 1
        vehicle_id = f"{vehicle_id}_{vehicle_ids_seen[vehicle_id]}"
    else:
        vehicle_ids_seen[vehicle_id] = 0
    vehicle_go = convert_vehicle_to_go(vehicle)
    vehicle_entries.append(f'\t"{vehicle_id}": {vehicle_go}')

# Generate vehicle mod entries
mod_entries = []
mod_ids_seen = {}
mods_data = data['mods']['mod']
if not isinstance(mods_data, list):
    mods_data = [mods_data]
for mod in mods_data:
    mod_id = to_snake_case(mod.get('name', ''))
    if mod_id in mod_ids_seen:
        mod_ids_seen[mod_id] += 1
        mod_id = f"{mod_id}_{mod_ids_seen[mod_id]}"
    else:
        mod_ids_seen[mod_id] = 0
    mod_go = convert_vehicle_mod_to_go(mod)
    mod_entries.append(f'\t"{mod_id}": {mod_go}')

# Generate weapon mount entries
mount_entries = []
mount_ids_seen = {}
mounts_data = data['weaponmounts']['weaponmount']
if not isinstance(mounts_data, list):
    mounts_data = [mounts_data]
for mount in mounts_data:
    mount_id = to_snake_case(mount.get('name', ''))
    if mount_id in mount_ids_seen:
        mount_ids_seen[mount_id] += 1
        mount_id = f"{mount_id}_{mount_ids_seen[mount_id]}"
    else:
        mount_ids_seen[mount_id] = 0
    mount_go = convert_weapon_mount_to_go(mount)
    mount_entries.append(f'\t"{mount_id}": {mount_go}')

# Generate weapon mount mod entries
wmm_entries = []
if 'weaponmountmods' in data and 'weaponmountmod' in data['weaponmountmods']:
    wmm_data = data['weaponmountmods']['weaponmountmod']
    if not isinstance(wmm_data, list):
        wmm_data = [wmm_data]
    wmm_ids_seen = {}
    for wmm in wmm_data:
        wmm_id = to_snake_case(wmm.get('name', ''))
        if wmm_id in wmm_ids_seen:
            wmm_ids_seen[wmm_id] += 1
            wmm_id = f"{wmm_id}_{wmm_ids_seen[wmm_id]}"
        else:
            wmm_ids_seen[wmm_id] = 0
        wmm_go = convert_weapon_mount_mod_to_go(wmm)
        wmm_entries.append(f'\t"{wmm_id}": {wmm_go}')

# Write to file
with open('vehicles_data_generated.go', 'w') as f:
    f.write('package v5\n\n')
    f.write('// DataVehicleCategories contains vehicle categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataVehicleCategories = map[string]VehicleCategory{\n')
    f.write(',\n'.join(category_entries))
    f.write(',\n}\n\n')
    f.write('// DataVehicleModCategories contains vehicle modification categories keyed by their ID (lowercase with underscores)\n')
    f.write('var DataVehicleModCategories = map[string]VehicleModCategory{\n')
    f.write(',\n'.join(mod_category_entries))
    f.write(',\n}\n\n')
    if weapon_mount_category_entries:
        f.write('// DataVehicleWeaponMountCategories contains weapon mount categories keyed by their ID (lowercase with underscores)\n')
        f.write('var DataVehicleWeaponMountCategories = map[string]VehicleWeaponMountCategory{\n')
        f.write(',\n'.join(weapon_mount_category_entries))
        f.write(',\n}\n\n')
    f.write('// DataVehicles contains vehicle records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataVehicles = map[string]Vehicle{\n')
    f.write(',\n'.join(vehicle_entries))
    f.write(',\n}\n\n')
    f.write('// DataVehicleModifications contains vehicle modification records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataVehicleModifications = map[string]VehicleModification{\n')
    f.write(',\n'.join(mod_entries))
    f.write(',\n}\n\n')
    f.write('// DataWeaponMounts contains weapon mount records keyed by their ID (lowercase with underscores)\n')
    f.write('var DataWeaponMounts = map[string]WeaponMount{\n')
    f.write(',\n'.join(mount_entries))
    f.write(',\n}\n\n')
    if wmm_entries:
        f.write('// DataWeaponMountMods contains weapon mount modification records keyed by their ID (lowercase with underscores)\n')
        f.write('var DataWeaponMountMods = map[string]WeaponMountMod{\n')
        f.write(',\n'.join(wmm_entries))
        f.write(',\n}\n')

print(f"Generated {len(category_entries)} categories, {len(mod_category_entries)} mod categories, {len(weapon_mount_category_entries)} weapon mount categories, {len(vehicle_entries)} vehicles, {len(mod_entries)} vehicle mods, {len(mount_entries)} weapon mounts, and {len(wmm_entries)} weapon mount mods")

