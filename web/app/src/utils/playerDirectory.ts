import type { UserSummary } from '../types/editions';

interface RawUserRecord {
  id?: unknown;
  email?: unknown;
  username?: unknown;
  roles?: unknown;
}

type GlobModule = { default: RawUserRecord } | RawUserRecord;

function loadPlayerModulesFromVite(): Record<string, GlobModule> | null {
  const meta = import.meta as { glob?: (pattern: string, options: { eager: boolean }) => unknown };
  if (typeof meta.glob !== 'function') {
    return null;
  }
  return meta.glob('../../../../data/users/*.json', {
    eager: true,
  }) as Record<string, GlobModule>;
}

function loadPlayerModulesFromNode(): Record<string, GlobModule> | null {
  if (typeof window !== 'undefined') {
    return null;
  }

  let nodeRequire: NodeRequire | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    nodeRequire = (Function('return require')() as NodeRequire) ?? null;
  } catch {
    nodeRequire = null;
  }
  if (!nodeRequire) {
    return null;
  }

  try {
    const fs = nodeRequire('fs') as typeof import('fs');
    const path = nodeRequire('path') as typeof import('path');
    const { fileURLToPath } = nodeRequire('url') as typeof import('url');

    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFilePath);
    const usersDir = path.resolve(currentDir, '../../../../data/users');

    const modules: Record<string, GlobModule> = {};
    const files = fs.readdirSync(usersDir).filter((file) => file.toLowerCase().endsWith('.json'));
    files.forEach((file) => {
      const filePath = path.join(usersDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        modules[filePath] = { default: JSON.parse(content) as RawUserRecord };
      } catch {
        // ignore malformed files
      }
    });
    return modules;
  } catch {
    return null;
  }
}

const playerFileModules = loadPlayerModulesFromVite() ?? loadPlayerModulesFromNode();

function isPlayer(record: RawUserRecord): record is UserSummary {
  if (!record || typeof record !== 'object') {
    return false;
  }
  if (typeof record.id !== 'string' || record.id.trim().length === 0) {
    return false;
  }
  if (typeof record.username !== 'string' || record.username.trim().length === 0) {
    return false;
  }
  if (typeof record.email !== 'string') {
    return false;
  }
  if (!Array.isArray(record.roles)) {
    return false;
  }
  return record.roles.some((role) => role === 'player');
}

export function loadLocalPlayerDirectory(): UserSummary[] {
  const entries: UserSummary[] = [];
  if (!playerFileModules) {
    return entries;
  }

  Object.values(playerFileModules).forEach((module) => {
    const record = (module as { default?: RawUserRecord }).default ?? (module as RawUserRecord);
    if (isPlayer(record)) {
      entries.push({
        id: record.id,
        email: record.email,
        username: record.username.trim(),
        roles: Array.isArray(record.roles)
          ? (record.roles.filter((role): role is string => typeof role === 'string') as string[])
          : [],
      });
    }
  });

  entries.sort((a, b) => {
    const aName = a.username.trim().toLowerCase();
    const bName = b.username.trim().toLowerCase();
    const comparison = aName.localeCompare(bName);
    if (comparison !== 0) {
      return comparison;
    }
    return a.id.localeCompare(b.id);
  });

  return entries;
}


