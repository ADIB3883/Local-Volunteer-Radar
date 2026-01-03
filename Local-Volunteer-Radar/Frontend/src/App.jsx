import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import VolunteerDashboard from './components/VolunteerDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import VolunteerProfile from "./components/VolunteerProfile.jsx";
import VolunteerEditProfile from "./components/VolunteerEditProfile.jsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<EventDetails />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
                    <Route path="/volunteer-profile" element={<VolunteerProfile />} />
                    <Route path="/volunteer-edit-profile" element={<VolunteerEditProfile />} />
                    <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
