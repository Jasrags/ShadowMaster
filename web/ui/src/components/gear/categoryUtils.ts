/**
 * Maps gear category IDs to human-readable display names
 */
export function getCategoryDisplayName(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    electronics: 'Electronics',
    rfid_tags: 'RFID Tags',
    communications: 'Communications',
    software: 'Software',
    skillsofts: 'Skillsofts',
    id_and_credit: 'ID and Credit',
    tools: 'Tools',
    optical_and_imaging: 'Optical and Imaging',
    vision_enhancements: 'Vision Enhancements',
    audio_devices: 'Audio Devices',
    audio_enhancements: 'Audio Enhancements',
    sensors: 'Sensors',
    security_devices: 'Security Devices',
    breaking_and_entering: 'Breaking and Entering',
    industrial_chemicals: 'Industrial Chemicals',
    survival_gear: 'Survival Gear',
    grapple_gun: 'Grapple Gun',
    biotech: 'Biotech',
    slap_patches: 'Slap Patches',
  };

  return categoryMap[categoryId] || categoryId;
}

