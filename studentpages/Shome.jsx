import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";
import front from "/assets/front.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axiosInstance from '/axiosinstance';

function Shome() {
  const [teamHackathons, setTeamHackathons] = useState([]);
  const [soloHackathons, setSoloHackathons] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();
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

    const fetchData = async () => {
      try {

        const studentId = localStorage.getItem('studentId'); 
        console.log("Fetching events for student ID:", studentId);
  
        if (!studentId) {
          console.error("No student ID found. Please log in again.");
          return;
        }

        const [hackathonRes, upcomingRes, participatedRes] = await Promise.all([
          axiosInstance.get('/hackathons'),
          axiosInstance.get(`/registeredhackathon/registeredhackathons/${studentId}?type=upcoming`),
          axiosInstance.get(`/registeredhackathon/registeredhackathons/${studentId}?type=participated`)
        ]);

        console.log('Full Hackathon Response:', hackathonRes.data);

        const hackathons = hackathonRes.data;
        setTeamHackathons(hackathons.filter(event => event.typeofhk.includes('Team')));
        setSoloHackathons(hackathons.filter(event => event.typeofhk.includes('Solo')));

        console.log('Team Hackathons:', teamHackathons);
        console.log('Solo Hackathons:', soloHackathons);

        setUpcomingEvents(upcomingRes.data);
        setParticipatedEvents(participatedRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRegister = (event) => {
    const route = event.typeofhk === 'Team Hackathon (offline)' 
      ? `/Tregpg/${event._id}` 
      : `/Vregpg/${event._id}`;
    navigate(route);
  };

  const handleDetailsClick = (event) => {
    const route = event.typeofhk.includes('Team') 
      ? `/team-hackathon/${event._id}`
      : `/virtual-hackathon/${event._id}`;
    navigate(route);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <section className="w-full mx-auto p-0 relative">

    <div className="relative z-10">

      <Headerbar />
      <Navbar />

      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-10 py-2 bg-white shadow-lg">
      <div className="md:w-1/2 text-left mt-[-5px] md:mt-[-100px] pl-6 md:pl-12 lg:pl-16" data-aos="fade-right">

      <img 
        src="/sparkv20.svg" 
        alt="Sparkventure 2025" 
        className="w-4/5 md:w-3/4 lg:w-2/3 h-auto ml-[-1px] md:ml-[-10px] lg:ml-[-20px]" 
      />    
    <h3 className="text-3xl font-bold text-rose-600 mt-2 animate-bounce	">
      The Innovation Journey Starts Now!
    </h3>
    <p className="text-lg text-gray-700 mt-4 leading-relaxed">
      The countdown has begun! Sparkventure 2025 is officially here, 
      and we're calling all engineering and computer science students in Kerala 
      to step up and showcase their groundbreaking ideas.
    </p>
    <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-400
    bg-clip-text text-transparent animate-pulse">
      Compete. Innovate. Transform.
    </p>
  </div>

        <div className="md:w-1/2 flex justify-center mt-[-20px] md:mt-[-20px]" data-aos="fade-left">
        <div class="relative group">
            <div class="absolute inset-0 rounded-4xl bg-rose-200 blur-2xl group-hover:blur-3xl transition-all duration-500">
            </div>
            <img alt="Sparkventure 2025 Image" width="100" height="100" decoding="async"
             class="relative w-full max-w-sm h-auto drop-shadow-2xl transition-all duration-500
              group-hover:scale-105 group-hover:rotate-1 rounded-2xl" src={front}></img>
              </div>
        </div>
      </div>

        {/* Team Hackathons */}
        <h2 className="text-6xl font-bold text-center text-black mt-20" data-aos="fade-up">Team Hackathons</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {teamHackathons.length > 0 ? (
            teamHackathons.map((event) => (
              <div key={event._id} className="bg-gradient-to-r from-rose-600 to-orange-400 text-white p-6 rounded-lg shadow-lg max-w-md cursor-pointer hover:shadow-xl transition-all duration-700 ease-in-out hover:scale-[1.02] transform-gpu" data-aos="fade-up">
                <h3 className="text-2xl font-bold">{event.ename}</h3>
                <p className="text-lg">📅 Date: {event.date}</p>
                <p className="text-lg">📍 Venue: {event.venue}</p>
                <p className="text-lg">🏆 Prize: {event.prize}</p>
                <div className="flex justify-between mt-3 gap-8">
                  <button onClick={() => handleRegister(event)} className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold cursor-pointer
                   hover:shadow-xl transition-transform duration-300 hover:scale-110 min-w-[120px]">Register</button>
                  <button onClick={() => handleDetailsClick(event)} className="bg-white text-black px-4 py-2 rounded-lg font-bold cursor-pointer 
                  hover:shadow-xl transition-transform duration-300 hover:scale-110 min-w-[120px]">Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black text-center text-xl">No team hackathons available.</p>
          )}
        </div>

        {/* Solo Hackathons */}
        <h2 className="text-6xl font-bold text-center text-black mt-20" data-aos="fade-up">Virtual Solo Hackathons</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {soloHackathons.length > 0 ? (
            soloHackathons.map((event) => (
              <div key={event._id} className="bg-gradient-to-r from-orange-400 to-rose-600 text-white p-6 rounded-lg shadow-lg max-w-md cursor-pointer
               hover:shadow-xl transition-all duration-700 ease-in-out hover:scale-[1.02] transform-gpu" data-aos="fade-up">
                <h3 className="text-2xl font-bold">{event.ename}</h3>
                <p className="text-lg">📅 Date: {event.date}</p>
                <p className="text-lg">💻 Platform: {event.venue}</p>
                <p className="text-lg">🏆 Prize: {event.prize}</p>
                <div className="flex justify-between mt-3 gap-8">
                  <button onClick={() => handleRegister(event)} className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold cursor-pointer
                   hover:shadow-xl transition-transform duration-300 hover:scale-110 min-w-[120px]">Register</button>
                  <button onClick={() => handleDetailsClick(event)} className="bg-white text-black px-4 py-2 rounded-lg font-bold cursor-pointer
                   hover:shadow-xl transition-transform duration-300 hover:scale-110 min-w-[120px]">Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black text-center text-xl" data-aos="fade-up">No solo hackathons available.</p>
          )}
        </div>

  <div className="w-full transform scale-80 container mx-auto p-4">
  {/* Upcoming Events header */}
  <section className="my-8">
  <h2 className="text-6xl font-bold text-black text-center mb-10" data-aos="fade-up">
  Upcoming Registered Events</h2>

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
            <h3 className="text-xl font-bold text-white text-center sm:text-left animate-pulse">{event.hackathonId.ename}</h3>
            </div>
            <div className="flex-1 text-left sm:ml-4 ml-2">
            <p className="text-black font-semibold text-center sm:text-left">📅 Date: {formatDate(event.hackathonId.date)}</p>
            </div>
            <div className="flex-1 text-left sm:ml-4 ml-2">
            <p className="text-black font-semibold text-center sm:text-left">{event.hackathonId.isTeamHackathon === true ? "📍 Venue" : "💻 Platform"}: {event.hackathonId.venue || "N/A"}</p>
            </div>

            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button 
                className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold w-full sm:w-auto cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
                onClick={() => handleDetailsClick(event, true)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-black text-center text-xl" data-aos="fade-up">No upcoming events registered.</p>
    )}
  </section>

  {/* Participated Events */}
  <section className="my-8 mt-20">
    <h2 className="text-6xl font-bold text-black text-center mb-10 mt-30" data-aos="fade-up">
    Participated Events</h2>
    {participatedEvents.length > 0 ? (
      <div className="space-y-4">
        {participatedEvents.map((event) => (
          <div 
            key={event._id} 
            className="bg-gradient-to-r from-orange-400 to-rose-600 rounded-lg shadow-lg p-4 w-4/5  sm:w-3/4 lg:w-[85%] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
            data-aos="fade-up">
            {/* Event Details */}
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-white text-center sm:text-left">{event.hackathonId.ename}</h3>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
              <p className="text-black font-semibold text-center sm:text-left">Date: {formatDate(event.hackathonId.date)}</p>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
              <p className="text-black font-semibold text-center sm:text-left">Venue: {event.hackathonId.venue}</p>
              </div>            

            {/* Details Button (Responsive) */}
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button 
                className="bg-white text-red-700 px-4 py-2 rounded-md font-bold w-full sm:w-auto cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
                onClick={() => handleDetailsClick(event, true)}
              >
                Details
              </button>
            </div>
            
          </div>
        ))}
      </div>
    ) : (
      <p className="text-black text-center" data-aos="fade-up">No participated events.</p>
    )}
  </section>
</div>

        <Footer />
      </div>

   {/* Event Details Dialog */}
   {showDetails && selectedEvent && (
        <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={handleCloseDialog}>
          <div className="absolute inset-0 bg-red-50"></div>
          <div className="absolute inset-0 bg-opacity-20"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-fade-zoom z-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseDialog} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold">✖</button>
            <h2 className="text-3xl font-bold text-center mb-4">EVENT DETAILS</h2>
            <p className="text-lg"><strong>Name:</strong> {selectedEvent.ename}</p>
            <p className="text-lg"><strong>Date:</strong> {selectedEvent.date}</p>
            <p className="text-lg"><strong>{selectedEvent.typeofhk === 'Team Hackathon (offline)' ? 'Venue' : 'Platform'}:</strong> {selectedEvent.venue}</p>
            <p className="text-lg"><strong>Duration:</strong> {selectedEvent.durofhk}</p>
            <p className="text-lg"><strong>Prize:</strong> {selectedEvent.prize}</p>
            <p className="text-lg"><strong>Details:</strong> {selectedEvent.details}</p>
            {selectedEvent.typeofhk === 'Team Hackathon (offline)' && (
            <p className="text-lg"><strong>Maximum number of participants:</strong> {selectedEvent.maxTeamMembers}</p>)}
      
      {/* Conditionally Show Register Button */}
      {!selectedEvent.isRegisteredEvent && (
        <div className="flex justify-center mt-6">
        <p className="text-lg"><strong>Last date of registration:</strong> {selectedEvent.regend}</p>
        <button onClick={() => handleRegister(selectedEvent)} className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-800">Register</button>
        </div>
      )}
    </div>
  </div>
)}

    </section>
  );
}

export default Shome;
