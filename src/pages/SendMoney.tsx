import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Box,
    Text,
    VStack,
    useToast,
    useDisclosure,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Heading,
} from '@chakra-ui/react';
import { sendSol } from '../functions/sendSol'; // Adjust the import path as needed
import { CopyIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SendSolPage: React.FC = () => {
    const [senderPrivateKey, setSenderPrivateKey] = useState<string>('');
    const [receiverPublicKey, setReceiverPublicKey] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { isOpen: isPrivateKeyVisible, onToggle: togglePrivateKeyVisibility } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Check local storage for private key and set it
        const storedPrivateKey = localStorage.getItem('privatekeyforsending');
        if (storedPrivateKey) {
            setSenderPrivateKey(storedPrivateKey);
        }

    }, []);

    const handleSend = async () => {
        try {
            setLoading(true);
            const signature = await sendSol(senderPrivateKey, receiverPublicKey, amount);
            setTransactionSignature(signature);
            setError(null);
            toast({
                title: "Transaction successful",
                description: `Transaction signature: ${signature}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Clear the private key from local storage after successful transaction
            localStorage.removeItem('privatekeyforsending');
        } catch (err) {
            setError('Failed to send SOL');
            console.error('Send SOL error:', err);
            toast({
                title: "Transaction failed",
                description: "There was an error sending SOL.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopySignature = () => {
        if (transactionSignature) {
            navigator.clipboard.writeText(transactionSignature);
            toast({
                title: "Signature copied",
                description: "Transaction signature copied to clipboard.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.900" // Dark background color
            p={4}
            position="relative"
        >
            <Button
                onClick={() => navigate('/wallets')}
                colorScheme="teal"
                variant="solid"
                position="absolute"
                top={4}
                left={4}
                zIndex={1}
                fontSize={{ base: 'sm', md: 'md' }} // Smaller font on mobile
            >
                Back to Accounts
            </Button>

            <VStack spacing={6} align="center" p={6} maxW="md" mx="auto">
                <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.300">
                    Send SOL
                </Heading>
                <Box borderWidth={1} borderRadius="lg" p={8} bg="gray.800" shadow="lg" w="full">
                    <FormControl id="private-key" mb={4}>
                        <FormLabel color="teal.300">Sender's Private Key</FormLabel>
                        <InputGroup>
                            <Input
                                type={isPrivateKeyVisible ? 'text' : 'password'}
                                value={senderPrivateKey}
                                onChange={(e) => setSenderPrivateKey(e.target.value)}
                                isDisabled={loading}
                                color="white"
                                bg="gray.700"
                                placeholder="Enter your private key"
                                _placeholder={{ color: 'gray.400' }}
                            />
                            <InputRightElement>
                                <IconButton
                                    variant="ghost"
                                    aria-label={isPrivateKeyVisible ? "Hide Private Key" : "Show Private Key"}
                                    icon={isPrivateKeyVisible ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={togglePrivateKeyVisibility}
                                    color="teal.300"
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="receiver-public-key" mb={4}>
                        <FormLabel color="teal.300">Receiver's Public Key</FormLabel>
                        <Input
                            type="text"
                            value={receiverPublicKey}
                            onChange={(e) => setReceiverPublicKey(e.target.value)}
                            isDisabled={loading}
                            color="white"
                            bg="gray.700"
                            placeholder="Enter receiver's public key"
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </FormControl>

                    <FormControl id="amount" mb={6}>
                        <FormLabel color="teal.300">Amount (SOL)</FormLabel>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            isDisabled={loading}
                            color="white"
                            bg="gray.700"
                            placeholder="Enter amount in SOL"
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </FormControl>

                    <Button
                        onClick={handleSend}
                        colorScheme="teal"
                        isLoading={loading}
                        loadingText="Processing"
                        w="full"
                        mb={4}
                    >
                        Send {amount} SOL
                    </Button>

                    {error && (
                        <Box p={4} bg="red.600" borderRadius="md" borderWidth={1} borderColor="red.800" mb={4}>
                            <Text color="white" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    {transactionSignature && (
                        <Box p={4} bg="teal.600" borderRadius="md" borderWidth={1} borderColor="teal.800">
                            <Text fontWeight="bold" mb={2} textAlign="center" color="white">Transaction successful!</Text>
                            <HStack justifyContent="center">
                                <Button onClick={handleCopySignature} leftIcon={<CopyIcon />} colorScheme="teal" variant="outline">
                                    Copy Signature
                                </Button>
                            </HStack>
                            <Button as="a" href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} target="_blank" colorScheme="teal" w="full" mt={4}>
                                View on Explorer
                            </Button>
                        </Box>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};

export default SendSolPage;
