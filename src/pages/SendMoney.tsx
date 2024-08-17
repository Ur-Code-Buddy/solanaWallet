import React, { useState } from 'react';
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
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            setError('Failed to send SOL');
            console.error('Send SOL error:', err);
            toast({
                title: "Transaction failed",
                description: "There was an error sending SOL.",
                status: "error",
                duration: 5000,
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
            bgImage="url('https://images.unsplash.com/photo-1653163061406-730a0df077eb?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            bgSize="cover"
            bgPosition="center"
            p={4}
            position="relative" // Ensure the button is positioned relative to this container
        >
            <Button
                onClick={() => navigate('/wallets')}
                colorScheme="blue"
                variant="solid"
                position="absolute"
                top={4}
                left={4}
                zIndex={1}
            >
                Back to Accounts
            </Button>

            <VStack spacing={6} align="center" p={6} maxW="md" mx="auto">
                <Heading as="h1" size="xl" mb={6} textAlign="center" color="white">
                    Send SOL
                </Heading>
                <Box borderWidth={1} borderRadius="lg" p={8} bg="whiteAlpha.900" shadow="lg" w="full">
                    <FormControl id="private-key" mb={4} color="black">
                        <FormLabel>Sender's Private Key</FormLabel>
                        <InputGroup>
                            <Input
                                type={isPrivateKeyVisible ? 'text' : 'password'}
                                value={senderPrivateKey}
                                onChange={(e) => setSenderPrivateKey(e.target.value)}
                                isDisabled={loading}
                                color="gray.800" // Darker text color for better readability
                                placeholder="Enter your private key"
                            />
                            <InputRightElement>
                                <IconButton
                                    variant="ghost"
                                    aria-label={isPrivateKeyVisible ? "Hide Private Key" : "Show Private Key"}
                                    icon={isPrivateKeyVisible ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={togglePrivateKeyVisibility}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="receiver-public-key" mb={4} color="black">
                        <FormLabel>Receiver's Public Key</FormLabel>
                        <Input
                            type="text"
                            value={receiverPublicKey}
                            onChange={(e) => setReceiverPublicKey(e.target.value)}
                            isDisabled={loading}
                            color="black"
                            placeholder="Enter receiver's public key"
                        />
                    </FormControl>

                    <FormControl id="amount" mb={6} color="black">
                        <FormLabel>Amount (SOL)</FormLabel>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            isDisabled={loading}
                            color="black"
                            placeholder="Enter amount in SOL"
                        />
                    </FormControl>

                    <Button
                        onClick={handleSend}
                        colorScheme="blue"
                        isLoading={loading}
                        loadingText="Processing"
                        w="full"
                        mb={4}
                    >
                        Send {amount} SOL
                    </Button>

                    {error && (
                        <Box p={4} bg="red.100" borderRadius="md" borderWidth={1} borderColor="red.300" mb={4}>
                            <Text color="red.800" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    {transactionSignature && (
                        <Box p={4} bg="green.100" borderRadius="md" borderWidth={1} borderColor="green.300">
                            <Text fontWeight="bold" mb={2} textAlign="center">Transaction successful!</Text>
                            <HStack justifyContent="center">
                                <Button onClick={handleCopySignature} leftIcon={<CopyIcon />} colorScheme="blue" variant="outline">
                                    Copy Signature
                                </Button>
                            </HStack>
                            <Button as="a" href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} target="_blank" colorScheme="blue" w="full" mt={4}>
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
