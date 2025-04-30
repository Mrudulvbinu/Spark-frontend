import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "/axiosinstance"; 
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";
import { format } from 'date-fns';
import AOS from 'aos';
import 'aos/dist/aos.css';


function Ohome() {
  const navigate = useNavigate();
  const [upcominEvents, setUpcominEvents] = useState([]);
  const [conductedEvents, setConductedEvents] = useState([]);
  const [organizerId, setOrganizerId] = useState(null);


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
      console.error(" No valid organizer ID found. Please log in again.");
      setError("Organizer ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    setOrganizerId(storedOrganizerId); 
    console.log(" Using Organizer ID:", storedOrganizerId);

    const fetchData = async () => {
      try {

        const organizerId=localStorage.getItem('organizerId')
        console.log("Fetching events for Organizer ID:",organizerId);

        if (!organizerId) {
          console.error("No Organizer ID found. Please log in again.");
          return;
        }
        
        const  [ upcominRes, conductedRes]= await Promise.all([
          axiosInstance.get(`/registeredhackathon/organizer/${storedOrganizerId}?type=upcomin`),
          axiosInstance.get(`/registeredhackathon/organizer/${storedOrganizerId}?type=conducted`)          
        ]);

        setUpcominEvents(upcominRes.data);
        setConductedEvents(conductedRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
   
    fetchData();
  }, []);

  const handleGenerateReport = async (hackathonId, eventName) => {
    try {
      const response = await axiosInstance.get(`/hackathons/generate-report/${hackathonId}`, {
        responseType: "blob",
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Hackathon_Report_${eventName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(" Error generating report:", error);
    }
  };


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
           flex flex-col items-center cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-5xl font-bold "> HOST EVENT </h2>
          </div>
        </Link>

        {/* Review and Approve Proposals Card */}
        <Link to="/revappro" className="w-full flex justify-center">
          <div className="max-w-lg bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-lg rounded-lg p-8
           flex flex-col items-center cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-4xl font-bold">Review and Approve Proposals</h2>
          </div>
        </Link>

        {/* Approved and Rejected Proposals Card */}
        <Link to="/approreg" className="w-full flex justify-center">
          <div className="max-w-lg bg-gradient-to-r from-rose-600 to-orange-400 text-white shadow-lg rounded-lg p-8
           flex flex-col items-center cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">
            <h2 className="text-4xl font-bold">Approved and Rejected Proposals</h2>
          </div>
        </Link>
      </div>

  <div className="w-full transform scale-80 container mx-auto p-4">
 {/* Upcoming Events Header */}
 <section className="my-8">
 <h2 className="text-6xl font-bold text-black text-center mb-10" data-aos="fade-up">
  Upcoming Events</h2>

      {/* Upcoming Events List */}
      {upcominEvents.length > 0 ? (
        <div className="space-y-6 justify-center">
          {upcominEvents.map((event) => (
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
                <p className="text-black font-semibold text-center sm:text-left">📅 Date: {event.date ? format(new Date(event.date), 'dd MMMM yyyy') : "N/A"}</p>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
                <p className="text-black font-semibold text-center sm:text-left">{event.isTeamHackathon === true ? "📍 Venue" : "💻 Platform"}: {event.venue || "N/A"}</p>
              </div>

              <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button
        className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold w-full sm:w-auto cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
        onClick={() => navigate(`/regstud/${event._id}`)}  >
        Registered Students
        </button>
      </div>
    </div>
          ))}
        </div>
      ) : (
        <p className="text-black text-center text-3xl" data-aos="fade-up">No hackathons hosted yet.</p>
      )}
</section>


      {/* Conducted Events */}
      <section className="my-8">
      <h2 className="text-6xl font-bold text-center text-black mt-50 mb-10" data-aos="fade-up">
      Conducted Events</h2>
      {conductedEvents.length > 0 ? (
      <div className="space-y-4">
        {conductedEvents.map((event) => (
          <div 
            key={event._id} 
            className="bg-gradient-to-r from-rose-600 to-orange-400 rounded-lg shadow-lg p-4 w-4/5  sm:w-3/4 lg:w-[85%] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
            data-aos="fade-up">
         {/* Event Details */}      
              <div className="flex-1 text-left">
              <h2 className="text-2xl font-bold text-white text-center sm:text-left">{event.ename}</h2>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
              <p className="text-black font-semibold text-center sm:text-left">📅 Date: {format(new Date(event.date), 'dd MMMM yyyy')}</p>
              </div>
              <div className="flex-1 text-left sm:ml-4 ml-2">
              <p className="text-black font-semibold text-center sm:text-left">{event.isTeamHackathon === true ? "📍 Venue" : "💻 Platform"}: {event.venue || "N/A"}</p>
              </div>
              <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button
        className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold w-full sm:w-auto cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
        onClick={() => handleGenerateReport(event._id, event.ename)} >
        Generate Report
        </button>
      </div>

            </div>
      ))}
      </div>
       ) : (
        <p className="text-black text-center text-3xl" data-aos="fade-up">No conducted events.</p>
      )}
      </section>
</div>
    
    <div className="w-full"><Footer /></div>
</div>
    </section>
  );
}

export default Ohome;
