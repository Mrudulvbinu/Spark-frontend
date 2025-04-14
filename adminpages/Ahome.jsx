import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinstance"; 
import AOS from "aos";
import "aos/dist/aos.css";
import { FiUsers, FiLogOut, FiMenu, FiX, FiHome, FiCalendar, FiUser, FiUserCheck } from "react-icons/fi";


const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// EventCard Component (defined outside main component)
const EventCard = ({ hackathon }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">
          {hackathon.name}
        </h3>
        <div className="mt-2 text-sm text-gray-600">
          <p className="flex items-center">
            <FiCalendar className="mr-2" />
            Event Date: {formatDate(hackathon.date)}
          </p>
          <p className="flex items-center mt-1">
            <FiUserCheck className="mr-2" />
            {hackathon.organizer?.name || 'Unknown Organizer'}
          </p>
        </div>
        <button
          onClick={() => navigate(`/event-details/${hackathon._id}`)}
          className="mt-4 w-full py-2 bg-gradient-to-r from-rose-500 to-orange-400 text-white rounded-md hover:from-rose-600 hover:to-orange-500 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

function Ahome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalOrganizers: 0, 
    upcomingCount: 0,
    conductedCount: 0 
  });
  const [hackathons, setHackathons] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [conductedHackathons, setConductedHackathons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "users") {
          const [studentsRes, organizersRes] = await Promise.all([
            axiosInstance.get("/user/students"),
            axiosInstance.get("/user/organizers")
          ]);
          setStudents(studentsRes.data);
          setOrganizers(organizersRes.data);
        } else if (activeTab === "dashboard") {
          const [statsRes, eventsRes] = await Promise.all([
            axiosInstance.get("/user/user-counts"),
            axiosInstance.get("/user/event-counts")
          ]);
          setStats({
            totalStudents: statsRes.data.studentCount,
            totalOrganizers: statsRes.data.organizerCount,
            upcomingCount: eventsRes.data.upcomingCount,
            conductedCount: eventsRes.data.conductedCount
          });
        } else if (activeTab === "events") {
          const hackathonsRes = await axiosInstance.get("/user/hackathons");
          const allHackathons = hackathonsRes.data.hackathons;
          // Filter based on dynamic status
          setUpcomingHackathons(allHackathons.filter(h => h.status === 'upcoming'));
          setConductedHackathons(allHackathons.filter(h => h.status === 'conducted'));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-md z-20">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md focus:outline-none">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <img src="/assets/sparkventure.svg" alt="Logo" className="h-10" />
        <div className="w-8"></div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-white shadow-lg md:shadow-none
                   flex flex-col h-full`}>
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <img src="/assets/sparkventure.svg" alt="Logo" className="h-10" />
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "dashboard" ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'}`}>
            <FiHome className="flex-shrink-0" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "users" ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'}`}>
            <FiUsers className="flex-shrink-0" />
            <span>Users</span>
          </button>
          
          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "events" ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'}`}>
            <FiCalendar className="flex-shrink-0" />
            <span>Events</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center font font-semibold space-x-3 p-3 rounded-lg text-rose-700 hover:bg-rose-200 transition-colors">
            <FiLogOut className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-2 bg-white shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-600 to-orange-400 flex items-center justify-center text-white">
                <FiUser size={16} />
              </div>
              <span className="font-semibold">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-2 md:p-4">
          {activeTab === "dashboard" && (
            <div data-aos="fade-up">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                {/* Students Card */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.totalStudents}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-rose-50 text-rose-600">
                      <FiUser size={20} />
                    </div>
                  </div>
                </div>
                
                {/* Organizers Card */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Organizers</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.totalOrganizers}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-orange-50 text-orange-600">
                      <FiUserCheck size={20} />
                    </div>
                  </div>
                </div>
                
                {/* Events Card (Updated) */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Upcoming Events</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.upcomingCount}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                      <FiCalendar size={20} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Welcome Section */}
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mt-0 mb-0">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 text-left pb-0 ml-6" data-aos="fade-right">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">
                      Welcome to the Admin Panel
                    </h1>
                    <p className="text-xl text-gray-700 mt-2">
                      Manage student users & organizers, monitor activities, and oversee events effortlessly.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center" data-aos="fade-left">
                    <img 
                      src="/assets/admins.png" 
                      alt="Admin Panel" 
                      className="max-w-xs w-full h-auto"/>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div data-aos="fade-up">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-600 to-orange-400 p-4 text-white">
                    <h3 className="text-lg font-bold flex items-center">
                      <FiUser className="mr-2" /> Student Users
                    </h3>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {students.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {students.map((student) => (
                          <li key={student._id} className="py-3 hover:bg-gray-50 px-2 rounded transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                <FiUser />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                <p className="text-sm text-gray-500 truncate">{student.email}</p>
                                <p className="text-sm text-gray-500 truncate">{student.username}</p> 
                              </div>
                              <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No registered students yet
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Organizers Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-rose-600 p-4 text-white">
                    <h3 className="text-lg font-bold flex items-center">
                      <FiUserCheck className="mr-2" /> Organizer Users
                    </h3>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {organizers.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {organizers.map((organizer) => (
                          <li key={organizer._id} className="py-3 hover:bg-gray-50 px-2 rounded transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <FiUserCheck />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{organizer.name}</p>
                                <p className="text-sm text-gray-500 truncate">{organizer.email}</p>
                                <p className="text-sm text-gray-500 truncate">{organizer.username}</p>
                              </div>
                              <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Verified
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No registered organizers yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div data-aos="fade-up" className="p-4">
              
              {/* Upcoming Events Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Upcoming Events ({upcomingHackathons.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcomingHackathons.length > 0 ? (
                    upcomingHackathons.map((hackathon) => (
                      <EventCard key={hackathon._id} hackathon={hackathon} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No upcoming events scheduled
                    </div>
                  )}
                </div>
              </div>
              
              {/* Conducted Events Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Past Events ({conductedHackathons.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {conductedHackathons.length > 0 ? (
                    conductedHackathons.map((hackathon) => (
                      <EventCard key={hackathon._id} hackathon={hackathon} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No past events found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Ahome;