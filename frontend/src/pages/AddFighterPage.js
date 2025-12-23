import React from 'react';
import AddFighter from './AddFighter';
import { useNavigate } from 'react-router-dom';

const AddFighterPage = () => {
    const navigate = useNavigate();

    const handleAddSuccess = () => {
        navigate('/admin');
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Register New Fighter</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Add a new fighter to the system. Fill in the required information and optionally set up face recognition for attendance tracking.
                    </p>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-[#222222] px-6 py-4 border-b border-white/10">
                        <h2 className="text-xl font-semibold text-white">Fighter Registration Form</h2>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <AddFighter 
                            onAddSuccess={handleAddSuccess} 
                            onCancel={handleCancel} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFighterPage;