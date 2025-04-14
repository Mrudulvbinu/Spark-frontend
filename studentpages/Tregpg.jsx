import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import vid1 from '/assets/vid1.mp4';
import logo from '/assets/sparkventure.svg';
import Header from '/components/header.jsx';
import homeIcon from "/assets/homebtn.svg";


const Tregpg = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const container = document.getElementById("container");
    if (container) {
      container.classList.add("opacity-0", "translate-y-20");
      setTimeout(() => {
        container.classList.remove("opacity-0", "translate-y-20");
        container.classList.add(
          "transition-all",
          "duration-1000",
          "opacity-100",
          "translate-y-0"
        );
      }, 700);
    }
  }, []);

  const navigate = useNavigate();
  const { hackathonId } = useParams();

  const [teamSize, setTeamSize] = useState(1);
  const [members, setMembers] = useState([{}]);
  const [hasParticipated, setHasParticipated] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTeamSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    setTeamSize(size);
    // Set members array with empty objects, +1 because members start from "Member 2"
    setMembers(Array(size).fill({}));
};

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);

        // Debugging the specific member input change
        console.log(`Updated Member ${index} Data:`, updatedMembers[index]);

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const studentId = localStorage.getItem('studentId'); // Get student ID from localStorage

    console.log("Student ID from localStorage:", studentId); // 🔍 Check if studentId is null


    if (!studentId || studentId === 'null') {
      alert("Student ID is missing. Please log in again.");
      return;
  }


 // Debugging form data before constructing registration data
 console.log("Form Data Before Submission:", {
  leaderName: formData.get('leaderName'),
  datebirth: formData.get('datebirth'),
  leaderEmail: formData.get('leaderEmail'),
  phone: formData.get('phone'),
  education: formData.get('education'),
  teamName: formData.get('teamName'),
  hasParticipated,
  members: members.map((_, index) => ({
      name: formData.get(`member-${index}-name`) || 'N/A',
      email: formData.get(`member-${index}-email`) || 'N/A',
      dob: formData.get(`member-${index}-date-of-birth`) || 'N/A'
  }))
});



    const registrationData = {
      hackathonId,
      studentId,
      isTeam: true,
      teamName: formData.get('teamName'),
      leaderName: formData.get('leaderName'),
      datebirth: formData.get('datebirth'),
      leaderEmail: formData.get('leaderEmail'),
      phone: formData.get('phone'),
      education: formData.get('education'),
      hasParticipated,
      members: members.map((_, index) => ({
          name: formData.get(`member-${index}-name`) || '',
          email: formData.get(`member-${index}-email`) || '',
          dob: formData.get(`member-${index}-date-of-birth`) || ''
      }))
  };
  console.log("Registration Data Being Sent:", registrationData);
  


    try {
      await axiosInstance.post('/registeredhackathon/register', registrationData);
      alert('Team Registration successful!');
      navigate('/shome');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
    }
  };
  return (
   <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${vid1})` }}>
       <video className="absolute top-0 left-0 w-full h-full object-cover z-0 min-w-full min-h-full" autoPlay loop muted playsInline style={{
    transform: 'scale(1.0)',
    objectPosition: 'center center'
  }}>
         <source src={vid1} type="video/mp4" />
         Your browser does not support the video tag.
       </video>
      <button 
        onClick={() => {
          console.log(" Back button clicked!");
          window.history.back();
        }}
        className="absolute top-2 left-2 bg-white border-1 border-black rounded-lg p-2 shadow-md hover:bg-gray-100 transition-all z-50"
      >
        <img src={homeIcon} alt="Home" className="w-8 h-8" />
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-4 py-6 sm:px-6 sm:py-8">
         <div className="w-full">
                <Header />
              </div>

              <div id="container" className="relative z-20 w-full max-w-lg md:max-w-xl px-10 py-10 bg-white rounded-lg shadow-xl transition-all"> 
        <form onSubmit={handleSubmit} className="space-y-2">
          <h1 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-rose-600 to-orange-400
    bg-clip-text text-transparent">Register for Team Hackathon</h1>

         {/* Leader Personal Information */}
{[
    { label: "Leader Name", name: "leaderName", type: "text" },
    { label: "Date of Birth", name: "datebirth", type: "date" },
    { label: "Leader Email", name: "leaderEmail", type: "email" },
    { label: "Phone Number", name: "phone", type: "tel" }
].map(({ label, name, type }, index) => (
    <div key={index} className="flex items-center space-x-4">
        <label htmlFor={name} className="w-1/3 font-medium text-lg text-gray-700 text-right">
            {label}:
        </label>
        <input
            type={type}
            id={name}
            name={name}
            className="w-2/3 p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>
))}

          <div className="flex items-center space-x-4">
            <label htmlFor="education" className="w-1/3 font-medium text-lg text-gray-700 text-right">Education:</label>
            <select id="education" name="education" className="w-2/3 p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
              {["MCA", "BCA", "BSC", "BTech"].map((edu) => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>
          </div>

          {/* Team Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label htmlFor="team-name" className="w-1/3 font-medium text-lg text-gray-700 text-right">Team Name:</label>
              <input type="text" id="team-name" name="teamName" className="w-2/3 p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="team-size" className="w-1/3 font-medium text-lg text-gray-700 text-right"> Number of Team Mates (Excluding Leader):</label>
              <select id="team-size" value={teamSize} onChange={(e)=>handleTeamSizeChange(e)} className="w-2/3 p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
              {[...Array(5)].map((_, index) => (
            <option key={index} value={index + 1}>
                {index + 1}
            </option>
        ))}
              </select>
            </div>

            {members.map((_, index) => (
              <div key={index} className="space-y-4">
                {["Name", "Email", "Date of Birth"].map((label) => (
                  <div key={label} className="flex items-center space-x-4">
                    <label htmlFor={`member-${index}-${label.toLowerCase().replace(/ /g, "-")}`} className="w-1/3 font-medium text-lg text-gray-700 text-right">
                      Member {index + 2} {label}:
                    </label>
                    <input
                      type={label === "Date of Birth" ? "date" : label === "Email" ? "email" : "text"}
                      id={`members-${index}-${label.toLowerCase().replace(/ /g, "-")}`}
                      name={`member-${index}-${label.toLowerCase().replace(/ /g, "-")}`} // Ensure correct naming pattern
                      value={members[index][label.toLowerCase().replace(/ /g, "-")] || ""}
                      onChange={(e) => handleMemberChange(index, label.toLowerCase().replace(/ /g, "-"), e.target.value)}
                      className="w-2/3 p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Participation */}
          <div className="flex items-center space-x-4">
            <p className="w-1/3 font-medium text-lg text-gray-700 text-right">Participated before?</p>
            <div className="w-2/3 flex space-x-4">
              {["Yes", "No"].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="hackathon-participation"
                    value={value.toLowerCase()}
                    checked={hasParticipated === value.toLowerCase()}
                    onChange={() => setHasParticipated(value.toLowerCase())}
                    className="mr-2"
                    required
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>

          {/* File Upload 
          <div className="flex items-center space-x-4">
            <label htmlFor="project-proposal" className="w-1/3 font-bold text-lg text-gray-700 text-right">Upload Project Proposal:</label>
            <input type="file" id="project-proposal" onChange={handleFileChange} className="w-2/3 p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" accept=".pdf" />
          </div>
          {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
*/}
          {/* Submit Button */}
          
            <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-rose-600  text-white py-3 px-6 rounded-lg font-bold text-lg cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-105">Register</button>
          
        </form>
        </div>
      </div>

      <img src={logo} alt="Logo" className="absolute bottom-5 right-5 w-45 h-auto" />
    </div>
  );
};

export default Tregpg;
