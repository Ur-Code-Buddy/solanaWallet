import React, { useState } from 'react';
import {
    Box,
    Button,
    Text,
    VStack,
    useToast,
    Grid,
    GridItem,
    HStack
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import * as bip39 from 'bip39';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
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

    // Function to format mnemonic into an array of words
    const formatMnemonic = (mnemonic: string) => {
        return mnemonic.split(' ');
    };

    return (
        <Box
            minH="100vh"
            bgImage="url('https://images.unsplash.com/photo-1639815188546-c43c240ff4df?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
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
                colorScheme="blue"
                variant="solid"
                position="absolute"
                top={4}
                right={4}
                zIndex={1}
            >
                Need to transfer? Click here
            </Button>

            <Box
                p={6}
                maxW="lg"
                borderWidth={1}
                borderRadius="md"
                shadow="md"
                bg="whiteAlpha.900"
            >
                <Text fontSize="2xl" fontWeight="semibold" textAlign="center" mb={4} color="gray.800">
                    Create New Wallet
                </Text>
                <VStack spacing={4} align="stretch" mb={6}>
                    <Button
                        onClick={generateMnemonic}
                        colorScheme="blue"
                        variant="solid"
                    >
                        Generate Mnemonic
                    </Button>

                    {mnemonic && (
                        <Box
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            bg="gray.100"
                            shadow="md"
                        >
                            <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.700">
                                Mnemonic
                            </Text>
                            <Grid
                                templateColumns="repeat(4, 1fr)"
                                gap={2} // Reduced gap between words
                                p={2}
                                borderWidth={1}
                                borderRadius="md"
                                bg="white"
                                overflow="auto"
                            >
                                {formatMnemonic(mnemonic).map((word, index) => (
                                    <GridItem key={index}>
                                        <Box
                                            p={1}
                                            bg="yellow.100" // Light yellow background
                                            borderRadius="md"
                                            display="inline-block"
                                        >
                                            <Text 
                                                fontSize="md" // Slightly smaller font size
                                                fontWeight="bold" 
                                                color="black" 
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
                                    colorScheme="green"
                                    variant="solid"
                                    leftIcon={<CopyIcon />}
                                >
                                    Copy Mnemonic
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    colorScheme="blue"
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
                </VStack>
            </Box>
        </Box>
    );
};

export default SignIn;
