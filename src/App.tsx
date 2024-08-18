import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Wallets from './pages/Wallets';
import SendSolPage from './pages/SendMoney';
import AnalyticsPage from './pages/AnalyticsPage'; // Your analytics dashboard page
import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/send-sol" element={<SendSolPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="*" element={<Navigate to="/wallets" />} />
                </Routes>
            </Router>
            <Analytics mode="production" />
        </ChakraProvider>
    );
};

export default App;
