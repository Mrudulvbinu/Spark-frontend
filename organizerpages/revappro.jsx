import React, { useState, useEffect } from 'react';
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";
import axios from 'axios';


  function Revappro() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProposals = async () => {
        try {
          const organizerId = localStorage.getItem('organizerId') || 
          localStorage.getItem('userId') || 
          sessionStorage.getItem('organizerId');
          console.log('Fetching proposals for:', organizerId);
          const response = await axios.get(`http://localhost:5000/api/proposals?organizerId=${organizerId}`);
          console.log('API Response:', response);

          console.log('Response data:', response.data);
          console.log('Is array?', Array.isArray(response.data));
          // Ensure response.data is an array
          if (!Array.isArray(response.data)) {
            throw new Error('Invalid response format');
          }
  
          setProposals(response.data);
        } catch (err) {
          console.error('Fetch error:', err);
          setError(err.message);
          setProposals([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProposals();
    }, []);




  // Render loading/error states
  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!proposals.length) return <div>No proposals found</div>;


  const handleApprove = async (proposalId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}/approve`,
        {}, // empty body
        {
          validateStatus: (status) => status < 500 // Don't throw for server errors
        }
      );
  
      if (response.status === 200) {
        setProposals(proposals.map(proposal => 
          proposal._id === proposalId 
            ? { ...proposal, status: 'approved' } 
            : proposal
        ));
        alert('Proposal approved successfully!');
      } else {
        throw new Error(response.data?.message || 'Approval failed');
      }
    } catch (err) {
      console.error('Approval failed:', err);
      setError(err.message);
    }
  };
  
  const handleReject = async (proposalId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}/reject`,
        {}, // empty body
        {
          validateStatus: (status) => status < 500 // Don't throw for server errors
        }
      );
  
      if (response.status === 200) {
        setProposals(proposals.map(proposal => 
          proposal._id === proposalId 
            ? { ...proposal, status: 'rejected' } 
            : proposal
        ));
        alert('Proposal rejected successfully!');
      } else {
        throw new Error(response.data?.message || 'Rejection failed');
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      setError(err.message);
    }
  };
  
  return (
    <section className="w-full mx-auto p-0 relative">
      <div className="relative z-10">
        <Headerbar />
        <Navbar />            
        <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent animate-pulse mt-6 mb-4">
          Review and Approve Project Proposals
        </h2>

        <div className="transform scale-100 flex flex-col items-center space-y-2 w-full max-w-3xl mx-auto">
        {proposals.map((proposal) => (
  <div key={proposal._id} className="bg-white shadow-md rounded-lg p-2 w-full mb-4   border border-gray-200">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          {proposal.name || proposal.leaderName} - {proposal.hackathonId?.ename || 'Hackathon Name'}
        </h3>
        <p className="text-gray-600">{proposal.email || proposal.leaderEmail}</p>
        <p className="text-gray-500 text-sm mt-1">
          Registered on: {new Date(proposal.registrationDate).toLocaleDateString()}
        </p>
      </div>
      <span className={`px-2 py-1 rounded text-xs ${
        proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
        proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {proposal.status || 'pending'}
      </span>
    </div>
    
    {/* Safely render proposal link only if proposal exists */}
    {proposal.proposal?.url && (
      <div className="mt-3">
         View Proposal: <a 
  href={`https://res.cloudinary.com/dqrsmvjp9/image/upload/fl_attachment/${proposal.proposal.publicId}.pdf`}
  target="_blank" 
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline flex items-center"
>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
         {proposal.proposal.originalName || 'Untitled'}
        </a>
      </div>
    )}
    
    {/* Show message if no proposal attached */}
    {!proposal.proposal?.url && (
      <div className="mt-3 text-gray-500 italic">
        No proposal document attached
      </div>
    )}
    
    <div className="flex justify-end space-x-2 mt-3">
      <button 
        onClick={() => handleApprove(proposal._id)}
        disabled={proposal.status === 'approved'}
        className={`px-4 py-2 rounded-md ${
          proposal.status === 'approved' 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        Approve
      </button>
      <button 
        onClick={() => handleReject(proposal._id)}
        disabled={proposal.status === 'rejected'}
        className={`px-4 py-2 rounded-md ${
          proposal.status === 'rejected' 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white`}
      >
        Reject
      </button>
    </div>
  </div>
))}
        </div>

        <div className="w-full"><Footer /></div>
      </div>
    </section>
  );
}

export default Revappro;