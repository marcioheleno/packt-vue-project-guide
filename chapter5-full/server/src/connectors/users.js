import bcrypt from 'bcrypt'
import { Users } from '../providers'

const SALT_ROUNDS = 10

export async function getUserById (id) {
  return await Users.findOne({ _id: id })
}

export async function getUserByUsername (username) {
  return await Users.findOne({ username })
}

export async function isPasswordMatching (user, password) {
  return await bcrypt.compare(password, user.password)
}

export async function hashPassword (password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function createUser ({ username, email, password }) {
  const user = await getUserByUsername(username)
  if (user) {
    throw new Error('Duplicate username')
  } else {
    const hash = await hashPassword(password)
    const result = await Users.insert({
      username,
      email,
      password: hash,
    })
    return result
  }
}
