import React, { useState, useEffect } from 'react';
import { Box, Button, Text, HStack, useToast, Tooltip, VStack } from '@chakra-ui/react';
import { CopyIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { getAccountInfo } from '../functions/getDetails'; // Adjust the path as needed

interface WalletComponentProps {
    name: string;
    publicKey: string;
    secretKey: string;
}

const WalletComponent: React.FC<WalletComponentProps> = ({ name, publicKey, secretKey }) => {
    const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const fetchedBalance = await getAccountInfo(publicKey);
                setBalance(fetchedBalance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, [publicKey]);

    const handleCopy = (text: string) => {
        toast({
            title: `Copied ${text === publicKey ? 'wallet address' : 'private key'}`,
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box
            p={4}
            mb={4}
            borderWidth={1}
            borderRadius="md"
            bg="whiteAlpha.900"
            shadow="md"
            maxW="sm" // Set a maximum width to prevent overflow
            overflow="hidden" // Hide overflow
        >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                Wallet: {name}
            </Text>
            <VStack spacing={2} align="stretch">
                <Box mb={2}>
                    <Text fontWeight="semibold">Public Key:</Text>
                    <HStack spacing={2} align="center" overflow="hidden">
                        <Text isTruncated maxW="full">{publicKey}</Text> {/* Truncate text and wrap */}
                        <Tooltip label="Copy public key" aria-label="Copy public key">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(publicKey)}
                            >
                                <CopyIcon />
                            </Button>
                        </Tooltip>
                    </HStack>
                </Box>
                <Box mb={2}>
                    <Text fontWeight="semibold">Private Key:</Text>
                    <HStack spacing={2} align="center">
                        <Text>{showPrivateKey ? secretKey : '***'}</Text>
                        <Tooltip label={showPrivateKey ? "Hide private key" : "Show private key"} aria-label="Show/Hide private key">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                            >
                                {showPrivateKey ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                        </Tooltip>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(secretKey)}
                        >
                            <CopyIcon />
                        </Button>
                    </HStack>
                </Box>
                <Box mb={2}>
                    <Text fontWeight="semibold">Balance:</Text>
                    <Text>{balance !== null ? `${balance} SOL` : 'Fetching...'}</Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default WalletComponent;
