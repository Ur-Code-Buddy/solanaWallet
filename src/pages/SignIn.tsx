import React, { useState } from 'react';
import { Box, Button, Text, VStack, useToast, Grid, GridItem, IconButton} from '@chakra-ui/react';
import { CopyIcon, InfoIcon } from '@chakra-ui/icons';
import * as bip39 from 'bip39';
import { useNavigate } from 'react-router-dom';

const SolanaVault: React.FC = () => {
    const [mnemonic, setMnemonic] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const navigate = useNavigate();

    const generateMnemonic = () => {
        try {
            const generatedMnemonic = bip39.generateMnemonic();
            setMnemonic(generatedMnemonic);
            setError(null);
        } catch (err) {
            setError('Failed to generate mnemonic');
            console.error(err);
        }
    };

    const handleCopyMnemonic = () => {
        if (mnemonic) {
            navigator.clipboard.writeText(mnemonic).then(() => {
                toast({
                    title: "Mnemonic copied to clipboard",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            }).catch((err) => {
                console.error('Failed to copy mnemonic:', err);
            });
        }
    };

    const handleNext = () => {
        if (mnemonic) {
            localStorage.setItem('seedPhrase', mnemonic);
            navigate('/wallets');
        } else {
            setError('Mnemonic is required');
        }
    };

    const formatMnemonic = (mnemonic: string) => {
        return mnemonic.split(' ');
    };

    return (
        <Box
            minH="100vh"
            bgImage="url('https://images.unsplash.com/photo-1646401742573-18430f36e7c3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            bgSize="cover"
            bgPosition="center"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            <Button
                onClick={() => navigate('/send-sol')}
                colorScheme="teal"
                variant="solid"
                position="absolute"
                top={4}
                right={4}
                zIndex={1}
            >
                Need to transfer? Click here
            </Button>

            <IconButton
                aria-label="Info about crypto wallets"
                icon={<InfoIcon />}
                colorScheme="teal"
                position="absolute"
                top={4}
                left={4}
                zIndex={1}
                onClick={() => window.open('https://crypto.com/university/crypto-wallets', '_blank')}
                variant="solid"
            />

            <Box
                p={6}
                maxW="lg"
                borderWidth={1}
                borderRadius="md"
                shadow="md"
                bg="gray.800"
            >
                <Text fontSize="2xl" fontWeight="semibold" textAlign="center" mb={4} color="teal.300">
                    Welcome to SolanaVault
                </Text>
                <VStack spacing={4} align="stretch" mb={6}>
                    {!mnemonic ? (
                        <Button
                            onClick={generateMnemonic}
                            colorScheme="teal"
                            variant="solid"
                        >
                            Generate Mnemonic
                        </Button>
                    ) : (
                        <Box
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            bg="gray.700"
                            shadow="md"
                        >
                            <Text fontSize="xl" fontWeight="semibold" mb={4} color="teal.300">
                                Mnemonic
                            </Text>
                            <Grid
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                                p={2}
                                borderWidth={1}
                                borderRadius="md"
                                bg="gray.800"
                                overflow="auto"
                            >
                                {formatMnemonic(mnemonic).map((word, index) => (
                                    <GridItem key={index}>
                                        <Box
                                            p={2}
                                            bg="teal.500"
                                            borderRadius="md"
                                            display="inline-block"
                                        >
                                            <Text 
                                                fontSize={{ base: "md", sm: "lg" }} // Smaller text on mobile
                                                fontWeight="bold" 
                                                color="white" 
                                                textAlign="center"
                                            >
                                                {word}
                                            </Text>
                                        </Box>
                                    </GridItem>
                                ))}
                            </Grid>
                            <VStack spacing={2} mt={4} align="stretch">
                                <Button
                                    onClick={handleCopyMnemonic}
                                    colorScheme="teal"
                                    variant="solid"
                                    leftIcon={<CopyIcon />}
                                >
                                    Copy Mnemonic
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    colorScheme="teal"
                                    variant="solid"
                                >
                                    Next
                                </Button>
                            </VStack>
                        </Box>
                    )}

                    {error && (
                        <Text color="red.500" textAlign="center">{error}</Text>
                    )}

                    {/* Information Box */}
                    <Box
                        p={4}
                        mt={6}
                        borderWidth={1}
                        borderRadius="md"
                        bg="blue.50"
                        shadow="md"
                    >
                        <Text fontSize="md" fontWeight="semibold" color="blue.700">
                            About SolanaVault
                        </Text>
                        <Text fontSize="sm" color="blue.600" mt={2}>
                            {mnemonic 
                                ? "If you already have a previous mnemonic, you can import it in the next page. If you don't have a mnemonic, we'll generate one for you right here."
                                : "SolanaVault is your gateway to securely manage and interact with your Solana-based assets. Generate your mnemonic, create wallets, and start transacting on the Solana blockchain with ease."
                            }
                        </Text>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default SolanaVault;
