import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Wallets from './pages/Wallets'; // Assuming you have a Wallets component
import SendSolPage from './pages/SendMoney';
import { ChakraProvider } from '@chakra-ui/react';

const App: React.FC = () => {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/send-sol" element={<SendSolPage />} />
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/wallets" />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
