import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

// Function to send SOL
export async function sendSol(senderPrivateKeyStr: string, receiverPublicKeyStr: string, amount: number): Promise<string> {
    try {
        // Connection to Solana Devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // Decode the base58 private key
        const senderPrivateKey = bs58.decode(senderPrivateKeyStr);
        const senderKeypair = Keypair.fromSecretKey(senderPrivateKey);

        // Create a PublicKey object for the receiver
        const receiverPublicKey = new PublicKey(receiverPublicKeyStr);

        // Create a transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: receiverPublicKey,
                lamports: amount * 1000000, // Adjusted lamports conversion
            })
        );

        // Sign and send the transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [senderKeypair]
        );

        return signature;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}
