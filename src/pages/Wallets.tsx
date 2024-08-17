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
    const navigate = useNavigate(); 

    useEffect(() => {
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

            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const { key } = derivePath(path, seed.toString('hex'));
            const keypair = nacl.sign.keyPair.fromSeed(new Uint8Array(key));
            const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);
            const base58SecretKey = bs58.encode(solanaKeypair.secretKey);

            const newWallet = {
                name: walletName,
                publicKey: solanaKeypair.publicKey.toBase58(),
                secretKey: base58SecretKey,
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
            bg="gray.900"
            p={4}
            position="relative"
        >
            <Button
                onClick={() => navigate('/')}
                colorScheme="teal"
                variant="solid"
                position="absolute"
                top={{ base: 4, md: 4 }}
                left={{ base: 4, md: 4 }}
                zIndex={1}
                fontSize={{ base: 'sm', md: 'md' }}
                px={{ base: 2, md: 4 }}
            >
                Back to Homepage
            </Button>

            <Button
                onClick={() => navigate('/send-sol')}
                colorScheme="teal"
                variant="solid"
                position="absolute"
                top={{ base: 4, md: 4 }}
                right={{ base: 4, md: 4 }}
                zIndex={1}
                fontSize={{ base: 'sm', md: 'md' }}
                px={{ base: 2, md: 4 }}
            >
                Want to send SOL? Click here
            </Button>

            <Button
                onClick={handleClearData}
                colorScheme="red"
                variant="solid"
                position="absolute"
                bottom={{ base: 4, md: 4 }}
                right={{ base: 4, md: 4 }}
                zIndex={1}
                fontSize={{ base: 'sm', md: 'md' }}
                px={{ base: 2, md: 4 }}
            >
                Clear Data
            </Button>

            <VStack spacing={6} align="center" p={6} maxW="md" mx="auto">
                <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.300">
                    Create Solana Wallets
                </Heading>
                <Box borderWidth={1} borderRadius="lg" p={8} bg="gray.800" shadow="lg" w="full">
                    <FormControl id="mnemonic" mb={4}>
                        <FormLabel color="teal.300">Mnemonic</FormLabel>
                        <Input
                            type="text"
                            value={mnemonic}
                            onChange={handleMnemonicChange}
                            color="white"
                            bg="gray.700"
                            placeholder="Enter your mnemonic"
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </FormControl>

                    <FormControl id="wallet-name" mb={4}>
                        <FormLabel color="teal.300">Wallet Name</FormLabel>
                        <Input
                            type="text"
                            value={walletName}
                            onChange={handleWalletNameChange}
                            color="white"
                            bg="gray.700"
                            placeholder="Enter wallet name"
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </FormControl>

                    <Button
                        onClick={handleAddWallet}
                        colorScheme="teal"
                        w="full"
                        mb={4}
                    >
                        Add Wallet
                    </Button>

                    {error && (
                        <Box p={4} bg="red.600" borderRadius="md" borderWidth={1} borderColor="red.800" mb={4}>
                            <Text color="white" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    {wallets.length > 0 && (
                        <Box>
                            {wallets.map((wallet, index) => (
                                <Box key={index} p={4} mb={4} borderWidth={1} borderRadius="md" bg="gray.800" shadow="sm">
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
