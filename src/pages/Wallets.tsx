import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    VStack,
    Heading,
    Text,
    useToast,
} from '@chakra-ui/react';
import { mnemonicToSeed } from 'bip39';
import bs58 from 'bs58';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import WalletComponent from '../components/walletComponent'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

const SolanaWallet: React.FC = () => {
    const [mnemonic, setMnemonic] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [walletName, setWalletName] = useState<string>('');
    const [wallets, setWallets] = useState<Array<{ name: string; publicKey: string; secretKey: string }>>([]);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // Retrieve the mnemonic and wallet data from local storage
        const storedMnemonic = localStorage.getItem('seedPhrase');
        const storedWallets = localStorage.getItem('wallets');
        const storedWalletCount = localStorage.getItem('walletCount');

        if (storedMnemonic) {
            setMnemonic(storedMnemonic);
        }

        if (storedWallets && storedWalletCount) {
            setWallets(JSON.parse(storedWallets));
            setCurrentIndex(parseInt(storedWalletCount));
        }
    }, []);

    const handleMnemonicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMnemonic(e.target.value);
    };

    const handleWalletNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWalletName(e.target.value);
    };

    const handleAddWallet = async () => {
        try {
            if (!mnemonic) {
                setError('Mnemonic is required');
                return;
            }
            if (!walletName) {
                setError('Wallet name is required');
                return;
            }
    
            // Convert mnemonic to seed
            const seed = await mnemonicToSeed(mnemonic);
    
            // Define the derivation path
            const path = `m/44'/501'/${currentIndex}'/0'`;
    
            // Derive the keypair from the seed and path
            const { key } = derivePath(path, seed.toString('hex'));
    
            // Generate a keypair using the derived key
            const keypair = nacl.sign.keyPair.fromSeed(new Uint8Array(key));
    
            // Create the Solana Keypair
            const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);
    
            // Encode the secret key in Base58
            const base58SecretKey = bs58.encode(solanaKeypair.secretKey);
    
            // Update state and localStorage
            const newWallet = {
                name: walletName,
                publicKey: solanaKeypair.publicKey.toBase58(),
                secretKey: base58SecretKey
            };
    
            const updatedWallets = [...wallets, newWallet];
            setCurrentIndex(currentIndex + 1);
            setWallets(updatedWallets);
            setWalletName('');
            setError(null);
    
            localStorage.setItem('wallets', JSON.stringify(updatedWallets));
            localStorage.setItem('walletCount', (currentIndex + 1).toString());
    
            toast({
                title: "Wallet added",
                description: "Your wallet has been successfully added.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Error adding wallet:', err);
            setError('Failed to add wallet');
            toast({
                title: "Wallet creation failed",
                description: "There was an error creating the wallet.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    const handleClearData = () => {
        localStorage.removeItem('seedPhrase');
        localStorage.removeItem('wallets');
        localStorage.removeItem('walletCount');

        setMnemonic('');
        setWallets([]);
        setCurrentIndex(0);
        setWalletName('');
        setError(null);

        navigate('/');
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgImage="url('https://images.unsplash.com/photo-1653163061406-730a0df077eb?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            bgSize="cover"
            bgPosition="center"
            p={4}
            position="relative" // Positioning context for the buttons
        >
            <Button
                onClick={() => navigate('/')}
                colorScheme="blue"
                variant="solid"
                position="absolute"
                top={4}
                left={4}
                zIndex={1}
            >
                Back to Homepage
            </Button>

            <Button
                onClick={() => navigate('/send-sol')}
                colorScheme="blue"
                variant="solid"
                position="absolute"
                top={4}
                right={4}
                zIndex={1}
            >
                Want to send SOL? Click here
            </Button>

            <Button
                onClick={handleClearData}
                colorScheme="red"
                variant="solid"
                position="absolute"
                bottom={4}
                right={4}
                zIndex={1}
            >
                Clear Data
            </Button>

            <VStack spacing={6} align="center" p={6} maxW="md" mx="auto">
                <Heading as="h1" size="xl" mb={6} textAlign="center" color="white">
                    Create Solana Wallets
                </Heading>
                <Box borderWidth={1} borderRadius="lg" p={8} bg="whiteAlpha.900" shadow="lg" w="full">
                    <FormControl id="mnemonic" mb={4}>
                        <FormLabel color="black">Mnemonic</FormLabel>
                        <Input
                            type="text"
                            value={mnemonic}
                            onChange={handleMnemonicChange}
                            color="black"
                            placeholder="Enter your mnemonic"
                        />
                    </FormControl>

                    <FormControl id="wallet-name" mb={4}>
                        <FormLabel color="black">Wallet Name</FormLabel>
                        <Input
                            type="text"
                            value={walletName}
                            onChange={handleWalletNameChange}
                            color="black"
                            placeholder="Enter wallet name"
                        />
                    </FormControl>

                    <Button
                        onClick={handleAddWallet}
                        colorScheme="blue"
                        w="full"
                        mb={4}
                    >
                        Add Wallet
                    </Button>

                    {error && (
                        <Box p={4} bg="red.100" borderRadius="md" borderWidth={1} borderColor="red.300" mb={4}>
                            <Text color="red.800" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    {wallets.length > 0 && (
                        <Box>
                            {wallets.map((wallet, index) => (
                                <Box key={index} p={4} mb={4} borderWidth={1} borderRadius="md" bg="whiteAlpha.900" shadow="sm">
                                    <WalletComponent
                                        name={wallet.name}
                                        publicKey={wallet.publicKey}
                                        secretKey={wallet.secretKey}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};

export default SolanaWallet;
