import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "/axiosinstance";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import GetAppIcon from '@mui/icons-material/GetApp';


const RegStud = () => {
  const { hackathonId } = useParams();  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(" Hackathon ID from URL:", hackathonId);

    if (!hackathonId) {
      console.error(" No valid hackathonId found in URL.");
      setError("Invalid hackathon ID. Please try again.");
      setLoading(false);
      return;
    }
  
    const fetchRegisteredStudents = async () => {
      try {
        const apiUrl = `/registeredhackathon/hackathon/${hackathonId}`;
        console.log(` Fetching registered students from : ${apiUrl}`); 

        const response = await axiosInstance.get(apiUrl);
        console.log(" Registered Students Data:", response.data);

        setRegistrations(response.data);
      } catch (error) {
        console.error(" Error fetching registered students:", error.response?.data || error.message);
        setError("Failed to load registered students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRegisteredStudents();
  }, [hackathonId]);

  const handleOpenDialog = (registration) => {
    setSelectedRegistration(registration);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegistration(null);
  };

  return (
    <div className="relative text-black bg-gradient-to-r from-rose-600 to-orange-400">
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center text-black mb-6">Registered Students</h2>
          {loading && <p className="text-center text-black text-lg animate-pulse">Loading...</p>}
          {error && !loading && <p className="text-center text-red-500 text-lg">{error}</p>}
  
          {!loading && !error && registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-rose-600 text-white">
                    <th className="p-3 text-left">#</th>
                    {registrations[0].isTeam ? (
                      <>
                        <th className="p-3 text-left">Team Name</th>
                        <th className="p-3 text-left">Leader Name</th>
                      </>
                    ) : (
                      <>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                      </>
                    )}
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg._id} className="border-b border-gray-300 hover:bg-gray-100 transition-all">
                      <td className="p-3">{index + 1}</td>
                      {reg.isTeam ? (
                        <>
                          <td className="p-3 font-semibold text-gray-800">{reg.teamName || "N/A"}</td>
                          <td className="p-3 font-semibold text-gray-800">{reg.leaderName || "N/A"}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 font-semibold text-gray-800">{reg.name || "N/A"}</td>
                          <td className="p-3 text-gray-600">{reg.email || "N/A"}</td>
                        </>
                      )}
                      <td className="p-3">
                        {reg.isTeam ? (
                          <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm">Team</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-400 text-gray-900 rounded-full text-sm">Solo</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleOpenDialog(reg)}
                          className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 font-bold rounded-lg text-sm cursor-pointer hover:shadow-xl transition-transform duration-300 hover:scale-110"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <p className="text-center text-gray-700 text-lg">No students registered yet.</p>
          )}
        </div>
      </div>

     {/* Details Dialog */}
<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
  <DialogTitle>
    <div className="flex justify-between items-center">
      <span>Registration Details</span>
      <IconButton onClick={handleCloseDialog}>
        <CloseIcon />
      </IconButton>
    </div>
  </DialogTitle>
  <DialogContent dividers>
    {selectedRegistration && (
      <div className="space-y-4">
        {selectedRegistration.isTeam ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Team Information</h3>
                <p><span className="font-semibold">Team Name:</span> {selectedRegistration.teamName || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Leader Information</h3>
                <p><span className="font-semibold">Name:</span> {selectedRegistration.leaderName || "N/A"}</p>
                <p><span className="font-semibold">Email:</span> {selectedRegistration.leaderEmail || "N/A"}</p>
                <p><span className="font-semibold">Date of Birth:</span> {selectedRegistration.datebirth || "N/A"}</p>
                <p><span className="font-semibold">Phone:</span> {selectedRegistration.phone || "N/A"}</p>
                <p><span className="font-semibold">Education:</span> {selectedRegistration.education || "N/A"}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-lg text-gray-800">Team Members</h3>
              {selectedRegistration.members && selectedRegistration.members.length > 0 ? (
                <div className="space-y-4">
                  {selectedRegistration.members.map((member, index) => (
                    <div key={index} className="border-t pt-4">
                      <h4 className="font-semibold">Member {index + 1}</h4>
                      <p><span className="font-semibold">Name:</span> {member.name || "N/A"}</p>
                      <p><span className="font-semibold">Email:</span> {member.email || "N/A"}</p>
                      <p><span className="font-semibold">Date of Birth:</span> {member.dob || "N/A"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No additional team members</p>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800">Participant Information</h3>
            <p><span className="font-semibold">Name:</span> {selectedRegistration.name || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {selectedRegistration.email || "N/A"}</p>
            <p><span className="font-semibold">Date of Birth:</span> {selectedRegistration.datebirth || "N/A"}</p>
            <p><span className="font-semibold">Phone:</span> {selectedRegistration.phone || "N/A"}</p>
            <p><span className="font-semibold">Education:</span> {selectedRegistration.education || "N/A"}</p>
            <p><span className="font-semibold">Previous Participation:</span> {selectedRegistration.hasParticipated || "N/A"}</p>
          </div>
        )}

        {/* Proposal Download Section */}
        {selectedRegistration.proposal?.url && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-bold text-lg text-gray-800">Project Proposal</h3>
            <div className="flex items-center space-x-4 mt-2">
              <a 
                href={selectedRegistration.proposal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                download
              >
                <GetAppIcon className="mr-2" />
                View Proposal
              </a>
              {selectedRegistration.proposal.thumbnailUrl && (
                <a 
                  href={selectedRegistration.proposal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Online
                </a>
              )}
            </div>
            {selectedRegistration.proposal.thumbnailUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">First Page Preview:</p>
                <img 
                  src={selectedRegistration.proposal.thumbnailUrl} 
                  alt="Proposal thumbnail"
                  className="max-w-xs border border-gray-200 rounded shadow-sm"
                />
              </div>
            )}
          </div>
        )}
        
        {!selectedRegistration.proposal?.url && (
          <div className="mt-4 pt-4 border-t text-gray-500 italic">
            No proposal document attached
          </div>
        )}
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default RegStud;