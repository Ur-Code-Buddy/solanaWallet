import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Wallets from './pages/Wallets';
import SendSolPage from './pages/SendMoney';
import AnalyticsPage from './pages/AnalyticsPage'; // Import the analytics page
import { ChakraProvider } from '@chakra-ui/react';

const App: React.FC = () => {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/send-sol" element={<SendSolPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} /> {/* New analytics route */}
                    <Route path="*" element={<Navigate to="/wallets" />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
