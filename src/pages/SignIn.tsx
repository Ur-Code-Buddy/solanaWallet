import React, { useState } from 'react';
import { Box, Button, Text, VStack, useToast, Grid, GridItem } from '@chakra-ui/react';
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
            bgImage="url('https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
            bgSize="cover"
            bgPosition="center"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative" // Positioning context for the button
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
                                templateColumns="repeat(4, 1fr)" // 4 columns per row
                                gap={4}
                                p={2}
                                borderWidth={1}
                                borderRadius="md"
                                bg="white"
                                overflow="auto"
                            >
                                {formatMnemonic(mnemonic).map((word, index) => (
                                    <GridItem key={index}>
                                        <Box
                                            p={2}
                                            bg="yellow.100" // Light yellow background
                                            borderRadius="md"
                                            display="inline-block" // To keep the box size adjusted to its content
                                        >
                                            <Text 
                                                fontSize="lg" 
                                                fontWeight="bold" 
                                                color="black" 
                                                textAlign="center" // Center the text within the box
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
