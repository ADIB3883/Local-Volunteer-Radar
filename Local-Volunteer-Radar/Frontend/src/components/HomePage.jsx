import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <h1>Welcome to Local Volunteer Radar</h1>
            <button
                className="home-login-btn"
                onClick={() => navigate('/login')}
            >
                Go to Login
            </button>
        </div>
    );
};

export default HomePage;