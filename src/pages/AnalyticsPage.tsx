import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';

const AnalyticsPage: React.FC = () => {
    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.900"
            p={4}
        >
            <VStack spacing={6} align="center">
                <Heading as="h1" size="2xl" color="teal.300">
                    Analytics Dashboard
                </Heading>
                <Text color="gray.400" fontSize="lg">
                    Monitor your application’s performance and user interactions.
                </Text>

                <Analytics />

            </VStack>
        </Box>
    );
};

export default AnalyticsPage;
