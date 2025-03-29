import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "/axiosinstance"; 
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Ohome() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [organizerId, setOrganizerId] = useState(null);
  const [conductedEvents, setConductedEvents] = useState([]);
  const [error, setError] = useState(null); 


  useEffect(() => { 
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        navigate("/");
      };
      window.onpushstate = function () {
        navigate("/");
      };
    } else {
      window.onpopstate = null;
      window.onpushstate = null;  
    }

    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });

    let storedOrganizerId = localStorage.getItem("organizerId");
    if (!storedOrganizerId || storedOrganizerId === "null" || storedOrganizerId === "undefined") {
      console.error("No valid organizer ID found. Please log in again.");
      setError("Organizer ID not found. Please log in again.");
      return;
    }

    setOrganizerId(storedOrganizerId);
    console.log("Using Organizer ID:", storedOrganizerId);

    // Fetch upcoming events
    const fetchEvents = async (type, setter) => {
      try {
        const response = await axiosInstance.get(`/organizer/${storedOrganizerId}/events?type=${type}`);
        if (response.data.length === 0) {
          console.warn(`No ${type} events found.`);
        }
        setter(response.data);
      } catch (err) {
        setError(`Failed to fetch ${type} events: ${err.response?.data?.message || err.message}`);
      }
    };
    

    fetchEvents("upcoming", setUpcomingEvents);
    fetchEvents("conducted", setConductedEvents);
  }, []);

  return (
    <section className="w-full mx-auto p-0 relative">

    <div className="relative z-10">
      
      <Headerbar />
      <Navbar />

      <h2 className="text-5xl font-bold text-center text-black mt-15 mb-20" data-aos="fade-up">
        Conduct Team Hackathon and Virtual Solo Hackathon
      </h2>

      {/*Cards */}
      <div className="transform scale-85 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center" data-aos="fade-up">
        {/* Host Event Card */}
        <Link to="/hosthk" className="w-full flex justify-center">
          <div className="max-w-lg bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-lg rounded-lg p-8
           flex flex-col items-center cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-5xl font-bold "> HOST EVENT </h2>
          </div>
        </Link>

        {/* Review and Approve Proposals Card */}
        <Link to="/revappro" className="w-full flex justify-center">
          <div className="max-w-lg bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-lg rounded-lg p-8
           flex flex-col items-center cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold">Review and Approve Proposals</h2>
          </div>
        </Link>

        {/* Approved and Rejected Proposals Card */}
        <Link to="/approreg" className="w-full flex justify-center">
          <div className="max-w-lg bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-lg rounded-lg p-8
           flex flex-col items-center cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold">Approved and Rejected Proposals</h2>
          </div>
        </Link>
      </div>

  <div className="w-full transform scale-80 container mx-auto p-4">
 {/* Upcoming Events Header */}
 <section className="my-8">
 <h2 className="text-6xl font-bold text-black text-center mb-10" data-aos="fade-up">
  Upcoming Events</h2>

      {/* Upcoming Events List */}
      {upcomingEvents.length > 0 ? (
        <div className="space-y-6 justify-center">
          {upcomingEvents.map((event) => (
            <div
             key={event._id}
             className="bg-gradient-to-r from-orange-400 to-rose-600 rounded-lg shadow-lg p-4 w-4/5  sm:w-3/4 lg:w-[85%] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
            data-aos="fade-up"
          >
            {/* Event Details */}
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold text-white text-center sm:text-left animate-pulse">{event.ename}</h2>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
                <p className="text-black font-semibold text-center sm:text-left">📅 Date: {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
                <p className="text-black font-semibold text-center sm:text-left">{event.isTeamHackathon === true ? "📍 Venue" : "💻 Platform"}: {event.venue || "N/A"}</p>
              </div>

              <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button
        className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold w-full sm:w-auto cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
        onClick={() => navigate(`/regstud/${event._id}`)}  
        >
        Registered Students
        </button>
      </div>
    </div>
          ))}
        </div>
      ) : (
        <p className="text-black text-center text-xl" data-aos="fade-up">No registered hackathons yet.</p>
      )}
</section>


   {/* Conducted Events */}
<section className="my-8">
  <h2 className="text-6xl font-bold text-center text-black mt-50 mb-10" data-aos="fade-up">
    Conducted Events
  </h2>

  {conductedEvents.length > 0 ? (
    <div className="transform scale-85 flex flex-col space-y-6 justify-center" data-aos="fade-up">
      {conductedEvents.map((event) => (
        <div 
          key={event._id} 
          className="w-full bg-gradient-to-r from-orange-400 to-rose-600 text-white shadow-lg rounded-full py-4 px-6 mx-auto flex justify-between items-center"
          data-aos="fade-up"
        >
          {/* Event Name */}
          <div className="flex-1 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">{event.ename}</h2>
          </div>

          {/* Event Date */}
          <div className="flex-1 text-left ml-4">
            <p className="text-gray-200">📅 {new Date(event.date).toLocaleDateString()}</p>
          </div>

          {/* Additional Details */}
          <div className="flex-1 text-left ml-4">
            <p className="text-gray-300">{event.details || "No additional details provided."}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-black text-center" data-aos="fade-up">No conducted events yet.</p>
  )}
</section>



    </div>
    </div>
    <div className="w-full"><Footer /></div>

    </section>
  );
}

export default Ohome;
