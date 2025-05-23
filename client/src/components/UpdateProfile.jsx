import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Link as LinkIcon, Mail, User, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fileToUrl, userDefaultPfp } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import imageCompression from 'browser-image-compression';


export default function UpdateProfile() {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
    const [imgloading, setimgloading] = useState(false)
    const navigate = useNavigate()
    const [preview, setpreview] = useState('')
    const [profilePic, setprofilePic] = useState('')
    const fileInput = useRef('')
    const [formData, setFormData] = useState({
        profileTitle: "",
        bio: "",
        email: "",
        githubUrl: "",
        linkedinUrl: "",
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = fileInput.current.files[0];
        if (file) {
            setimgloading(true); // Show loader while compressing
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };

                const compressedImage = await imageCompression(file, options);
                console.log("Original:", (file.size / 1024 / 1024).toFixed(2), "MB");
                console.log("Compressed:", (compressedImage.size / 1024 / 1024).toFixed(2), "MB");

                setprofilePic(compressedImage); // store compressed file
                setpreview(fileToUrl(compressedImage)); // show compressed preview
            } catch (error) {
                console.error("Compression failed:", error);
                toast.error("Image compression failed");
            } finally {
                setimgloading(false);
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!preview) return toast.error('Please upload an image')
        const { profileTitle, bio, email, linkedinUrl, githubUrl } = formData
        if ([profileTitle, bio, email].some((value) => value.trim() === "")) {
            toast.error("Please fill out all fields before submitting.")
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email')
            return;
        }

        try {
            setloading(true)
            const formData = new FormData();
            formData.append("profileTitle", profileTitle);
            formData.append("bio", bio);
            formData.append("email", email);
            formData.append("linkedinUrl", linkedinUrl);
            formData.append("githubUrl", githubUrl);

            if (preview) {
                formData.append("profilePic", profilePic);
            }
            const data = await fetch('https://antisushh.onrender.com/user/updateProfile', {
                credentials: 'include',
                method: 'POST',
                body: formData,
            })
            const res = await data.json()
            if (res.success) {
                toast.success(res.message)
                dispatch(setUser(res.user))
                navigate('/feed')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }


    return (
        <div
            className="min-h-screen w-full overflow-y-auto  mx-auto text-white bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8 relative"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')"
            }}
        >
            <div className="relative max-w-2xl mx-auto text-white">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold max-[550px]:text-lg text-white">Complete Your Profile</h1>
                    <p className="mt-2 text-gray-200 text-lg max-[550px]:text-xs">Let's make your profile stand out</p>
                </div>

                <div className="backdrop-blur-xl bg-zinc-600/45 rounded-2xl shadow-2xl p-8 transition-all duration-300">
                    <form className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <User className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-white max-[550px]:text-sm">Basic Information</h2>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between w-full items-center">
                                    <img loading='lazy' src={preview ? preview : userDefaultPfp} className='w-24 h-24 max-[550px]:w-16 max-[550px]:h-16 rounded-full object-cover ' alt="" />
                                    <input onChange={handleFileChange} type="file" ref={fileInput} className='hidden' />
                                    <div className='px-4 sm:cursor-pointer py-2 rounded-lg max-[550px]:text-sm bg-black text-white font-semibold' onClick={() => fileInput.current.click()}>{imgloading ? <span className='flex gap-2 items-center'><Loader2 className='animate-spin' />wait</span> : 'upload image'}</div>
                                </div>
                                <div>
                                    <label htmlFor="profileTitle" className="block text-sm font-medium ">
                                        Profile Title
                                    </label>
                                    <input
                                        type="text"
                                        id="profileTitle"
                                        name="profileTitle"
                                        value={formData.profileTitle}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Frontend Developer"
                                        className=" mt-1 block w-full rounded-lg border text-black border-gray-300 px-4 py-3 max-[550px]:py-2 max-[550px]:text-sm  shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium ">
                                        Bio
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute top-3 left-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Tell us about yourself..."
                                            className=" block w-full rounded-lg border text-black border-gray-300 pl-10 pr-4 py-3 max-[550px]:py-2 max-[550px]:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-100">
                                        Email
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border text-black border-gray-300 pl-10 pr-4 py-3  max-[550px]:py-2 max-[550px]:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <LinkIcon className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl max-[550px]:text-sm font-semibold text-white">Social Links <span className='text-xs max-[550px]:text-[10px]'>(optional)</span></h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="githubUrl" className="block text-sm font-medium text-zinc-100">
                                        GitHub Profile
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm group">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Github className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        </div>
                                        <input
                                            type="url"
                                            id="githubUrl"
                                            name="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={handleChange}
                                            className="block w-full text-black rounded-lg  max-[550px]:py-2 max-[550px]:text-sm border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-zinc-100">
                                        Linkedin Profile
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm group">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Twitter className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        </div>
                                        <input
                                            type="url"
                                            id="linkedinUrl"
                                            value={formData.linkedinUrl}
                                            onChange={handleChange}
                                            name="linkedinUrl"
                                            className="block w-full text-black rounded-lg border max-[550px]:py-2 max-[550px]:text-sm border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="https://linkedin.com/username"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="pt-6 max-[550px]:pt-1">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full flex justify-center py-3 px-4 max-[550px]:py-2 border border-transparent rounded-lg text-sm  font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {loading ? <span className='flex gap-2 items-center'><Loader2 className='animate-spin' />wait</span> : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}