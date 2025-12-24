export async function exists(path: string | URL) {
  try {
    await Deno.lstat(path);
    return true;
  } catch {
    return false;
  }
}

export function existsSync(path: string | URL) {
  try {
    Deno.lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

export async function stat(path: string | URL) {
  return await Deno.stat(path);
}

export function statSync(path: string | URL) {
  return Deno.statSync(path);
}

export function readDir(path: string | URL) {
  return Deno.readDir(path);
}
