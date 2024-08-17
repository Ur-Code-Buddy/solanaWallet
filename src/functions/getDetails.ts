import axios from 'axios';

export async function getAccountInfo(publicKeyStr: string): Promise<number | null> {
    try {
        // The RPC URL for the Solana Devnet
        const url = 'https://api.devnet.solana.com';

        // Create the request body
        const data = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [publicKeyStr]
        };

        // Send the POST request
        const response = await axios.post(url, data);

        // Extract the balance from the response
        if (response.data && response.data.result && typeof response.data.result.value === 'number') {
            // Convert lamports to SOL
            const lamports = response.data.result.value;
            const sol = lamports / 1_000_000_000;
            return sol;
        } else {
            console.log('Account not found or invalid response');
            return null;
        }
    } catch (error) {
        console.error('Failed to get account info:', error);
        throw error;
    }
}
