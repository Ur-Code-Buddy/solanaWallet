import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

// Function to derive a Keypair from a mnemonic and derivation path
export async function deriveKeypair(seedPhrase: string, derivationPath: string) {
    try {
        // Convert mnemonic to seed
        const seed = await bip39.mnemonicToSeed(seedPhrase);

        // Derive the path using the seed
        const derived = derivePath(derivationPath, seed.toString('hex'));

        // Convert derived key to Uint8Array
        const keyUint8Array = new Uint8Array(derived.key);

        // Create Keypair from the Uint8Array
        const keypair = Keypair.fromSecretKey(keyUint8Array);

        return {
            publicKey: keypair.publicKey,
            secretKey: keypair.secretKey
        };
    } catch (err) {
        console.error('Error deriving keypair:', err);
        throw err;
    }
}
