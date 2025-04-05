import React from 'react';
import { ArrowLeft, MoreHorizontal, Bookmark, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';

function SingleProfilePost() {
    const { id } = useParams();
    console.log(id)
    return (
        <div className="w-full bg-black text-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-semibold">Post</span>
                </div>
                <MoreHorizontal className="w-6 h-6" />
            </div>

            {/* User Info */}
            <div className="flex items-center p-4">
                <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                />
                <div className="ml-3">
                    <span className="font-semibold">ma.nizzz</span>
                    <p className="text-sm text-gray-400">Patuli, Kolkata</p>
                </div>
                <MoreHorizontal className="ml-auto w-5 h-5" />
            </div>

            {/* Main Image */}
            <div className="aspect-square bg-gray-800 w-full">
                <img
                    src="https://via.placeholder.com/600"
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <Heart className="w-6 h-6" />
                </div>
                <MoreHorizontal className="w-6 h-6" />
            </div>

            {/* Likes */}
            <div className="px-4 py-2">
                <p className="text-sm">
                    Liked by <span className="font-semibold">ro.raunakk</span> and <span className="font-semibold">96 others</span>
                </p>
            </div>

            {/* Caption */}
            <div className="px-4 py-2">
                <p className="text-sm">
                    <span className="font-semibold">ma.nizzz</span> swipe &gt; &gt; &gt; &gt;
                </p>
            </div>
        </div>
    );
}

export default SingleProfilePost;
