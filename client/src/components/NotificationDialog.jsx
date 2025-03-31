import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const NotificationDialog = ({ open, setOpen }) => {
    const [activeTab, setActiveTab] = useState('alerts');
    const [notifications, setNotifications] = useState(null);
    const fetchAlerts = async () => { }
    const fetchRequests = async () => { }

    useEffect(() => {
        if (activeTab === 'alerts') {
            fetchAlerts()
        } else if (activeTab === 'requests') {
            fetchRequests()
        }
    }, [activeTab])

    return (
        <Dialog open={open}>
            <DialogContent className='max-w-lg max-h-[80%] p-0 border-none outline-none overflow-y-auto' onInteractOutside={() => setOpen(false)}>
                <DialogTitle className='hidden'></DialogTitle>
                <div className="h-full overflow-y-auto bg-gray-50">
                    <div className=" bg-white  shadow">
                        <div className="border-b sticky top-0 bg-white z-10">
                            <h1 className="text-2xl font-bold p-4">Notifications</h1>
                        </div>

                        <div className="py-2">
                            <div className="mb-6">
                                <div className="flex gap-4 px-6">
                                    {['alerts', 'requests'].map((e, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTab(e)}
                                            className={`flex items-center py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === e
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <span className="uppercase">{e}</span>
                                        </button>
                                    ))}


                                </div>
                                <h2 className="text-base font-semibold px-6 py-2">Today</h2>

                                {/* Follow Request Notification */}
                                {activeTab === 'requests' ? <div className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50">
                                    <div className="flex">
                                        <img
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                                            alt="raju_ansari0786"
                                            className="w-12 h-12 object-cover flex-1 flex rounded-full border-2 border-white"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-sm">
                                            <span className="font-semibold">raju_ansari0786</span>
                                            {' requested to follow you'}
                                            <span className="text-gray-500 ml-1">1h</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="px-6 py-1.5 bg-blue-500 text-white rounded-lg font-semibold text-sm">
                                            Confirm
                                        </button>
                                        <button className="px-6 py-1.5 bg-gray-100 text-black rounded-lg font-semibold text-sm">
                                            Delete
                                        </button>
                                    </div>
                                </div> : <div className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50">
                                    <div className="flex -space-x-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                                            alt="anupamra1"
                                            className="w-12 h-12 rounded-full border-2 border-white z-20"
                                        />
                                        <img
                                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
                                            alt="aditya_shaw_2006"
                                            className="w-12 h-12 rounded-full border-2 border-white z-10"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-sm">
                                            <span className="font-semibold">anupamra1</span>
                                            <span className="font-semibold"> and others</span>
                                            {' liked your post'}
                                            <span className="text-gray-500 ml-1">3h</span>
                                        </p>
                                    </div>

                                    <img
                                        src="https://images.unsplash.com/photo-1516245834210-c4c142787335?w=100&h=100&fit=crop"
                                        alt="Post preview"
                                        className="w-12 h-12 object-cover"
                                    />
                                </div>}

                                {/* Like Notification */}

                            </div>


                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NotificationDialog