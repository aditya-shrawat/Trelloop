import axios from "axios"
import { useEffect, useState } from "react"
import { FaCalendarAlt, FaClock, FaFilter, FaSearch, FaPlus, FaCheck } from "react-icons/fa"
import { BsHourglassSplit } from "react-icons/bs";
import dayjs from "dayjs";
import { Link } from "react-router-dom";


const getStatusBadge = (isCompleted, deadline) => {
    const now = dayjs();
    const dueDate = dayjs(deadline);
    const isValidDeadline = deadline && dueDate.isValid();

    let status = "pending";
    let icon = <FaCalendarAlt />;
    let text = "Pending";
    let bg = "bg-blue-100";
    let textColor = "text-blue-800";
    let border = "border border-blue-200 hover:bg-blue-200";

    if (isCompleted) {
        status = "completed";
        icon = <FaCheck />;
        text = "Completed";
        bg = "bg-green-100";
        textColor = "text-green-800";
        border = "border border-green-200 hover:bg-green-200";
    } else if (isValidDeadline) {
        const diff = dueDate.diff(now, "day");

        if (diff < 0) {
            status = "overdue";
            icon = <FaClock />;
            text = "Overdue";
            bg = "bg-red-100";
            textColor = "text-red-800";
            border = "border border-red-200 hover:bg-red-200";
        } else if (diff <= 1) {
            status = "due-soon";
            icon = <FaClock />;
            text = "Due Soon";
            bg = "bg-orange-100";
            textColor = "text-orange-800";
            border = "border border-orange-200 hover:bg-orange-200";
        }
    }

    return (
        <span className={`card-status ${bg} ${textColor} ${border}`}>
            <div className="text-xs mr-1">{icon}</div>
            {text}
        </span>
    );
};


const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export default function TrackDeadlines() {
    const [deadlineData,setDeadlineData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [statusCounts,setStatusCounts] = useState({
            overdue: 0,
            dueSoon: 0,
            pending: 0,
            completed: 0,
        })


    const getStatusCount = (cards)=>{
        const now = dayjs();
        const counts = {
            overdue: 0,
            dueSoon: 0,
            pending: 0,
            completed: 0,
        };

        cards.forEach(card => {
            if (card.isCompleted) {
                counts.completed += 1;
            } else if (card.deadline && dayjs(card.deadline).isValid()) {
                const diff = dayjs(card.deadline).diff(now, 'day');
                if (diff < 0) {
                    counts.overdue += 1;
                } else if (diff <= 1) {
                    counts.dueSoon += 1;
                } else {
                    counts.pending += 1;
                }
            } else {
                counts.pending += 1;
            }
        });

        setStatusCounts(counts);
    }

    const fetchDeadlines = async ()=>{
        try {
            const BackendURL = import.meta.env.VITE_BackendURL;
            const response = await axios.get(`${BackendURL}/api/deadlines`,
                {withCredentials: true}
            );

            setDeadlineData(response.data.cardsDeadlinesDetails)
            getStatusCount(response.data.cardsDeadlinesDetails)
        } catch (error) {
            console.log("Error while fetching deadlines - ",error)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDeadlines()
    },[])

  return (
    <div className="w-full p-4 md:pl-8">
            <div className="mb-10">
                <div className="w-full mb-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">Deadlines</h1>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        Track and manage all your task deadlines in one place. Stay on top of your tasks and never miss an
                        important milestone.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-lg rounded-lg p-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="z-10">
                                <p className="text-red-600 font-medium">Overdue</p>
                                <p className="text-2xl font-bold text-red-700">{statusCounts.overdue}</p>
                            </div>
                            <div className="absolute top-6 right-4">
                                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                                    <div className="text-red-600 text-2xl">
                                        <FaClock />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-lg rounded-lg p-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="z-10">
                                <p className="text-orange-600 font-medium">Due Soon</p>
                                <p className="text-2xl font-bold text-orange-700">{statusCounts.dueSoon}</p>
                            </div>
                            <div className="absolute top-6 right-4">
                                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                                    <div className="text-orange-600 text-2xl">
                                        <BsHourglassSplit />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg rounded-lg p-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="z-10">
                                <p className="text-blue-600 font-medium">Pending</p>
                                <p className="text-2xl font-bold text-blue-700">{statusCounts.pending}</p>
                            </div>
                            <div className="absolute top-6 right-4">
                                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                    <div className="text-blue-600 text-2xl">
                                        <FaCalendarAlt />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg rounded-lg p-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="z-10">
                                <p className="text-green-600 font-medium">Completed</p>
                                <p className="text-2xl font-bold text-green-700">{statusCounts.completed}</p>
                            </div>
                            <div className="absolute top-6 right-4">
                                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                                    <div className="text-green-600 text-2xl">
                                        <FaCheck />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </div>
                    <input type="text" placeholder="Search deadlines..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                    />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-200 hover:bg-gray-100 bg-transparent text-gray-700 font-medium rounded-lg transition-colors duration-200">
                    <div className="mr-2">
                        <FaFilter />
                    </div>
                    Filter
                </button>
            </div> */}

            {
            (loading)?
                (
                <div>Loading...</div>
                )
            :
            (deadlineData && deadlineData.length!==0)?
                <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden">
                    <div className="flex-1 bg-gray-100 border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-700">All Deadlines</h2>
                    </div>
                    <div className="overflow-y-hidden overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b border-gray-200">
                                        Card Name
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b border-gray-200">
                                        Deadline
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b border-gray-200">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>   
                                {deadlineData?.map((card) => (
                                    <tr key={card._id}
                                        className={`hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 `}>
                                        <td className="py-4 px-6">
                                            <Link to={`/card/${(card.name).replace(/\s+/g, '')}/${card._id}`} className="flex items-center">
                                                <span className="font-medium text-gray-900 hover:text-blue-700 cursor-pointer transition-colors">
                                                    {card.name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col sm:flex-row items-center text-gray-700">
                                                <div className="w-full flex items-center justify-start">
                                                    {
                                                    (card && card.deadline)?
                                                        (<>
                                                            <div className="mr-2 text-base text-gray-400">
                                                                <FaCalendarAlt />
                                                            </div>
                                                            <span className="font-medium shrink-0">{formatDate(card.deadline)}</span>
                                                        </>)
                                                    :
                                                        (<span className="font-medium shrink-0 w-full pl-6">—</span>)
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(card.isCompleted, card.deadline )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            :
                (
                <div className="text-center text-gray-400 py-10">
                    <p className="text-lg font-medium">No upcoming deadlines or pending tasks</p>
                    <p className="text-sm">You're all caught up for now.</p>
                </div>
                )
            }
    </div>
  )
}
