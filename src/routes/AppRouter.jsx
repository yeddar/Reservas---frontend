import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login.page';
import Home from '../pages/Home';
import AddReservationForm from '../pages/CreateReservation';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path='/add-reservation' element={<AddReservationForm />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;