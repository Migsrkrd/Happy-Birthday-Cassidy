/**
 * Generate VITE_SITE_ACCESS_HASH for the site gate (hash of her **answer**).
 * Answer is normalized the same way as the site: trim + lowercase.
 *
 * Usage: node scripts/hash-passphrase.mjs "The correct answer"
 */
import { createHash } from 'node:crypto'

const raw = process.argv[2]
if (!raw) {
  console.error('Usage: node scripts/hash-passphrase.mjs "the answer to your gate question"')
  process.exit(1)
}

const normalized = raw.trim().toLowerCase()
const hash = createHash('sha256').update(normalized, 'utf8').digest('hex')
console.log(hash)
console.error('\nAdd to .env.local (do not commit) and GitHub secret VITE_SITE_ACCESS_HASH:')
console.error(`VITE_SITE_ACCESS_HASH=${hash}`)
console.error('\nSet the question (plain text is fine; it is not the secret):')
console.error('VITE_SITE_ACCESS_QUESTION=What city did we first hang out in?')
