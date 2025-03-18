import { useState } from "react";

const ProfilePage = () => {
    const [user, setUser] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        bio: "Web developer and tech enthusiast."
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile:", user);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Profile</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        value={user.name} 
                        onChange={handleChange} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        value={user.email} 
                        onChange={handleChange} 
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <textarea 
                        name="bio" 
                        placeholder="Bio" 
                        value={user.bio} 
                        onChange={handleChange} 
                        className="px-4 py-2 border rounded-md"
                        rows="3"
                    ></textarea>
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
