/**
 * Generates a random PIN of the specified length.
 * @param length The length of the PIN.
 * @returns The generated PIN.
 */
export const randomPin = (length: number = 4): number => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  )
}

/**
 * Generates a random string of the specified length using alphanumeric and special characters.
 * @param length The length of the generated string.
 * @returns The generated random string.
 */
export const randomString = (length: number = 8): string => {
  let result = ''
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length)
    result += chars.substring(randomNumber, randomNumber + 1)
  }

  return result
}

/**
 * Generates a random number of the specified length.
 * @param length The length of the generated random number.
 * @returns The generated random number.
 */
export const getRandom = (length: number): number => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  )
}
