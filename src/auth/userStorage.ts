const USER_KEY = 'user'

export type StoredUser = {
  name: string
  email: string
  password: string
}

export function getStoredUserJson(): string | null {
  return localStorage.getItem(USER_KEY)
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as StoredUser).email === 'string' &&
      typeof (parsed as StoredUser).password === 'string' &&
      typeof (parsed as StoredUser).name === 'string'
    ) {
      return parsed as StoredUser
    }
    return null
  } catch {
    return null
  }
}

export function saveUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser() {
  localStorage.removeItem(USER_KEY)
}
