// javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import VolunteerDashboard from './components/VolunteerDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import AdminDashboard from './components/AdminDashboard.jsx';
import './App.css';
import EventDetails from './components/EventDetails/EventDetails.jsx';
import VolunteerProfile from './components/VolunteerProfile.jsx';
import VolunteerEditProfile from './components/VolunteerEditProfile.jsx';
import AnnouncementPage from './components/EventDetails/AnnouncementPage.jsx';
import ForgotPassword from './components/ForgotPasswordPage.jsx';
import ResetPassword from './components/ResetPasswordPage.jsx';

// Messaging imports commented out - these files don't exist yet
// import { ChatProvider } from './contexts/ChatContext';
// import OrganizerMessages from './pages/organizer/OrganizerMessages';
// import OrganizerConversation from './pages/organizer/OrganizerConversation';
// import VolunteerMessages from './pages/volunteer/VolunteerMessages';
// import VolunteerConversation from './pages/volunteer/VolunteerConversation';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
                    <Route path="/volunteer-profile" element={<VolunteerProfile />} />
                    <Route path="/volunteer-edit-profile" element={<VolunteerEditProfile />} />
                    <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                    <Route path="/event-details/:eventId" element={<EventDetails />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/announcements" element={<AnnouncementPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Messaging routes commented out - requires ChatContext and missing components */}
                    {/*
                    <Route
                        path="/organizer"
                        element={
                            <ChatProvider userId="org_123" userType="organizer">
                                <Outlet />
                            </ChatProvider>
                        }
                    >
                        <Route path="dashboard" element={<OrganizerDashboard />} />
                        <Route path="messages" element={<OrganizerMessages />} />
                        <Route path="messages/:conversationId" element={<OrganizerConversation />} />
                    </Route>

                    <Route
                        path="/volunteer"
                        element={
                            <ChatProvider userId="vol_001" userType="volunteer">
                                <Outlet />
                            </ChatProvider>
                        }
                    >
                        <Route path="dashboard" element={<VolunteerDashboard />} />
                        <Route path="messages" element={<VolunteerMessages />} />
                        <Route path="messages/:conversationId" element={<VolunteerConversation />} />
                    </Route>
                    */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
