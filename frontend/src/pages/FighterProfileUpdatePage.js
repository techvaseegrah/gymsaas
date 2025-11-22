import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const FighterProfileUpdatePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        phNo: '',
        address: '',
        height: '',
        weight: '',
        bloodGroup: '',
        occupation: '',
        package: 'monthly',
        previousExperience: '',
        medicalIssue: '',
        motto: '',
        martialArtsKnowledge: '',
        goals: [],
        referral: '',
        // achievements removed as it should only be editable by admin
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [existingProfilePhoto, setExistingProfilePhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFighterData = async () => {
            try {
                const res = await api.get('/fighters/me');
                const fighterData = res.data;
                
                // Set existing profile photo
                setExistingProfilePhoto(fighterData.profilePhoto || null);
                
                // Set form data with existing values (excluding achievements as it should only be editable by admin)
                setFormData({
                    age: fighterData.age || '',
                    gender: fighterData.gender || 'male',
                    phNo: fighterData.phNo || '',
                    address: fighterData.address || '',
                    height: fighterData.height || '',
                    weight: fighterData.weight || '',
                    bloodGroup: fighterData.bloodGroup || '',
                    occupation: fighterData.occupation || '',
                    package: fighterData.package || 'monthly',
                    previousExperience: fighterData.previousExperience || '',
                    medicalIssue: fighterData.medicalIssue || '',
                    motto: fighterData.motto || '',
                    martialArtsKnowledge: fighterData.martialArtsKnowledge || '',
                    goals: fighterData.goals || [],
                    referral: fighterData.referral || '',
                });
            } catch (err) {
                console.error('Error fetching fighter data:', err);
                setMessage('Error fetching profile data.');
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };
        
        fetchFighterData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoalChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, goals: [...prev.goals, value] };
            } else {
                return { ...prev, goals: prev.goals.filter(goal => goal !== value) };
            }
        });
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                setMessage('Please upload a JPG, JPEG, or PNG image.');
                setIsError(true);
                return;
            }
            
            // Convert image to Base64
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePhoto(e.target.result);
                setMessage('');
                setIsError(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload
            const payload = { ...formData };
            
            // Only include profilePhoto in payload if a new photo was uploaded
            if (profilePhoto !== null) {
                payload.profilePhoto = profilePhoto;
            }
            
            await api.put('/fighters/me', payload);
            
            setMessage('Profile updated successfully!');
            setIsError(false);
            setTimeout(() => navigate('/fighter'), 2000);
        } catch (err) {
            console.error('Profile update error:', err);
            setMessage(err.response?.data?.msg || 'Failed to update profile. Please try again.');
            setIsError(true);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="text-white">Loading your profile...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-gray-800 text-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-red-500">Update Your Fighter Profile</h1>
                <p className="text-center text-gray-400 mb-8">Update your details as needed.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {message && (
                        <div className={`p-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}
                    
                    {/* Profile Photo Upload */}
                    <div className="p-6 bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Profile Photo</h2>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {(existingProfilePhoto || profilePhoto) && (
                                <div className="mb-2">
                                    <img 
                                        src={profilePhoto || existingProfilePhoto} 
                                        alt="Profile Preview" 
                                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-gray-300 mb-2">Upload New Photo</label>
                                <input 
                                    type="file" 
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleProfilePhotoChange}
                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <p className="text-sm text-gray-400 mt-1">JPG, JPEG, or PNG format</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Personal Info */}
                    <div className="p-6 bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Personal Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                                type="number" 
                                name="age" 
                                placeholder="Age" 
                                value={formData.age} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                className="input-style"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <input 
                                type="tel" 
                                name="phNo" 
                                placeholder="Phone Number" 
                                value={formData.phNo} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <input 
                                type="text" 
                                name="address" 
                                placeholder="Address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                        </div>
                    </div>

                    {/* Fighter Details */}
                    <div className="p-6 bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Fighter Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                                type="text" 
                                name="height" 
                                placeholder="Height (cm)" 
                                value={formData.height} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <input 
                                type="text" 
                                name="weight" 
                                placeholder="Weight (kg)" 
                                value={formData.weight} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <input 
                                type="text" 
                                name="bloodGroup" 
                                placeholder="Blood Group" 
                                value={formData.bloodGroup} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <input 
                                type="text" 
                                name="occupation" 
                                placeholder="Occupation" 
                                value={formData.occupation} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <select 
                                name="package" 
                                value={formData.package} 
                                onChange={handleChange} 
                                className="input-style"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <input 
                                type="text" 
                                name="previousExperience" 
                                placeholder="Previous Martial Arts Experience?" 
                                value={formData.previousExperience} 
                                onChange={handleChange} 
                                className="input-style" 
                            />
                            <textarea 
                                name="medicalIssue" 
                                placeholder="Any Medical Issues?" 
                                value={formData.medicalIssue} 
                                onChange={handleChange} 
                                className="input-style md:col-span-2" 
                                rows="2"
                            ></textarea>
                            <textarea 
                                name="motto" 
                                placeholder="What is your Motto?" 
                                value={formData.motto} 
                                onChange={handleChange} 
                                className="input-style md:col-span-2" 
                                rows="2"
                            ></textarea>
                            <textarea 
                                name="martialArtsKnowledge" 
                                placeholder="Knowledge in Martial Arts" 
                                value={formData.martialArtsKnowledge} 
                                onChange={handleChange} 
                                className="input-style md:col-span-2" 
                                rows="2"
                            ></textarea>
                        </div>
                    </div>

                    {/* Goals & Referral */}
                    <div className="p-6 bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Goals & Referral</h2>
                        <div>
                            <label className="block mb-2">What are your goals?</label>
                            <div className="flex flex-wrap gap-4">
                                {['Fitness', 'Self-defense', 'Competition', 'Discipline'].map(goal => (
                                    <label key={goal} className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            value={goal} 
                                            checked={formData.goals.includes(goal)}
                                            onChange={handleGoalChange} 
                                            className="h-4 w-4 bg-gray-600 border-gray-500 rounded text-red-500 focus:ring-red-500" 
                                        />
                                        <span>{goal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <input 
                            type="text" 
                            name="referral" 
                            placeholder="How did you hear about us?" 
                            value={formData.referral} 
                            onChange={handleChange} 
                            className="input-style mt-4" 
                        />
                    </div>

                    {/* Achievements - Read-only notice */}
                    <div className="p-6 bg-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Achievements</h2>
                        <p className="text-gray-300">Achievements can only be added or modified by administrators.</p>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="button" 
                            onClick={() => navigate('/fighter')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Simple CSS in JS for input styling */}
            <style>{`
                .input-style {
                    background-color: #4A5568; /* gray-700 */
                    border: 1px solid #718096; /* gray-500 */
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    width: 100%;
                }
                .input-style::placeholder {
                    color: #A0AEC0; /* gray-400 */
                }
                .input-style:focus {
                    outline: none;
                    border-color: #F56565; /* red-500 */
                    box-shadow: 0 0 0 2px #F56565;
                }
            `}</style>
        </div>
    );
};

export default FighterProfileUpdatePage;