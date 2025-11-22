import React from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';

const ProfilePhotoModal = ({ isOpen, onClose, profilePhoto, fighterName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="relative w-full max-w-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
                
                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-red-700 to-red-900">
                        <h3 className="text-xl font-bold text-white text-center flex items-center justify-center">
                            <FaUser className="mr-2" />
                            {fighterName}'s Profile Photo
                        </h3>
                    </div>
                    
                    <div className="p-4 flex justify-center">
                        {profilePhoto ? (
                            <img 
                                src={profilePhoto} 
                                alt={`${fighterName}'s profile`}
                                className="w-full max-h-[70vh] object-contain rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center text-gray-400 bg-gray-900 rounded-lg">
                                <span className="text-lg">No profile photo available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhotoModal;