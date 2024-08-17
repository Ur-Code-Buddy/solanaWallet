import React, { useState, useEffect } from 'react';
import { Box, Button, Text, HStack, useToast, Tooltip, VStack } from '@chakra-ui/react';
import { CopyIcon, ViewIcon, ViewOffIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { getAccountInfo } from '../functions/getDetails'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

interface WalletComponentProps {
    name: string;
    publicKey: string;
    secretKey: string;
}

const WalletComponent: React.FC<WalletComponentProps> = ({ name, publicKey, secretKey }) => {
    const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);
    const toast = useToast();
    const navigate = useNavigate(); // Initialize useNavigate

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

        const intervalId = setInterval(fetchBalance, 2000); // Refresh balance every 2 seconds

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [publicKey]);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: `Copied ${text === publicKey ? 'wallet address' : 'private key'}`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Failed to copy text:', err);
            toast({
                title: "Failed to copy",
                description: "There was an error copying the text.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleFaucetClick = () => {
        handleCopy(publicKey); // Copy the public key to the clipboard

        toast({
            title: "Public key copied",
            description: "You will be forwarded to the Solana faucet.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });

        setTimeout(() => {
            // Open the Solana faucet page in a new tab after the toast disappears
            window.open('https://faucet.solana.com/', '_blank');
        }, 3000); // Matches the duration of the toast
    };

    const handleSend = () => {
        // Clear the previous saved private key and save the current one
        localStorage.removeItem('privatekeyforsending');
        localStorage.setItem('privatekeyforsending', secretKey);
        // Navigate to the /send-sol page
        navigate('/send-sol');
    };

    const handleReceive = () => {
        // Copy the public key to the clipboard
        handleCopy(publicKey);
        // Show a toast indicating the public address was copied
        toast({
            title: "Public key copied",
            description: "You can now use this address to receive SOL.",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box
            p={{ base: 2, md: 4 }}
            mb={4}
            borderWidth={1}
            borderRadius="md"
            bg="gray.800" // Dark background
            color="whiteAlpha.900" // Light text color
            shadow="md"
            maxW={{ base: "xs", md: "sm" }} // Responsive width
            overflow="hidden"
        >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={2}>
                Wallet: {name}
            </Text>
            <VStack spacing={{ base: 2, md: 4 }} align="stretch">
                <Box>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">Public Key:</Text>
                    <HStack spacing={2} align="center">
                        <Text fontSize={{ base: "xs", md: "sm" }} isTruncated maxW="full">{publicKey}</Text>
                        <Tooltip label="Copy public key" aria-label="Copy public key">
                            <Button
                                variant="ghost"
                                size="sm"
                                colorScheme="whiteAlpha"
                                onClick={() => handleCopy(publicKey)}
                            >
                                <CopyIcon boxSize={4} />
                            </Button>
                        </Tooltip>
                        <Tooltip label="Open Solana faucet" aria-label="Solana faucet">
                            <Button
                                variant="ghost"
                                size="sm"
                                colorScheme="whiteAlpha"
                                onClick={handleFaucetClick}
                            >
                                <ExternalLinkIcon boxSize={4} />
                            </Button>
                        </Tooltip>
                    </HStack>
                </Box>
                <Box>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">Private Key:</Text>
                    <HStack spacing={2} align="center">
                        <Text fontSize={{ base: "xs", md: "sm" }}>{showPrivateKey ? secretKey : '***'}</Text>
                        <Tooltip label={showPrivateKey ? "Hide private key" : "Show private key"} aria-label="Show/Hide private key">
                            <Button
                                variant="ghost"
                                size="sm"
                                colorScheme="whiteAlpha"
                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                            >
                                {showPrivateKey ? <ViewOffIcon boxSize={4} /> : <ViewIcon boxSize={4} />}
                            </Button>
                        </Tooltip>
                        <Tooltip label="Copy private key" aria-label="Copy private key">
                            <Button
                                variant="ghost"
                                size="sm"
                                colorScheme="whiteAlpha"
                                onClick={() => handleCopy(secretKey)}
                            >
                                <CopyIcon boxSize={4} />
                            </Button>
                        </Tooltip>
                    </HStack>
                </Box>
                <Box>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">Balance:</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }}>{balance !== null ? `${balance} SOL` : 'Fetching...'}</Text>
                </Box>
                <HStack spacing={{ base: 2, md: 4 }} mt={4}>
                    <Button
                        fontSize={{ base: "sm", md: "md" }}
                        colorScheme="blue"
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                    <Button
                        fontSize={{ base: "sm", md: "md" }}
                        colorScheme="green"
                        onClick={handleReceive}
                    >
                        Receive
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default WalletComponent;
