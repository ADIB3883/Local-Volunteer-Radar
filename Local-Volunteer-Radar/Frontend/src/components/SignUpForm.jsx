import { useState } from 'react';
import VolunteerSignUpForm from './VolunteerSignUpForm';
import OrganizerSignUpForm from './OrganizerSignUpForm';
import UserTypeButton from './UserTypeButton';

const SignUpForm = () => {
    const [userType, setUserType] = useState('volunteer');

    return (
        <div className="grid gap-6 max-w-3xl mx-auto w-full px-8">
            {/* Welcome Section */}
            <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold text-black">
                    Join us today!
                </h2>
                <p className="text-gray-600 text-base">
                    Create an account to get started
                </p>
            </div>

            {/* User Type Selection */}
            <div className="grid gap-3">
                <label className="text-sm font-bold text-black">
                    I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <UserTypeButton
                        type="volunteer"
                        title="Volunteer"
                        isSelected={userType === 'volunteer'}
                        onClick={() => setUserType('volunteer')}
                    />
                    <UserTypeButton
                        type="organizer"
                        title="Organizer"
                        isSelected={userType === 'organizer'}
                        onClick={() => setUserType('organizer')}
                    />
                </div>
            </div>

            {/* Conditional Form Rendering */}
            {userType === 'volunteer' && <VolunteerSignUpForm />}
            {userType === 'organizer' && <OrganizerSignUpForm />}
        </div>
    );
};

export default SignUpForm;