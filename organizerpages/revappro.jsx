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
        const response = await axios.get(`http://localhost:5000/api/proposals?organizerId=${organizerId}`);
        
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

  const handleApprove = async (proposalId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}/approve`,
        {},
        { validateStatus: (status) => status < 500 }
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
        {},
        { validateStatus: (status) => status < 500 }
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

  const viewProposal = (proposal) => {
    if (proposal.proposal?.url) {
      window.open(proposal.proposal.url, '_blank');
    }
  };

  // Render loading/error states
  if (loading) return <div className="flex justify-center items-center h-screen">Loading proposals...</div>;
  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and Navbar */}
      <Headerbar />
      <Navbar />

      {/* Page Title */}
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent animate-pulse mt-6 mb-8">
        Review and Approve Project Proposals
      </h2>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {proposals.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pending Proposals ({proposals.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {proposals.map((proposal) => (
                <div key={proposal._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        {proposal.name || proposal.leaderName || 'Untitled Proposal'}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {proposal.hackathonId?.ename || 'No Hackathon Name'}
                      </p>
                      <div className="text-sm text-gray-500">
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {proposal.email || proposal.leaderEmail || 'No email provided'}
                        </p>
                        <p className="flex items-center mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Registered on: {new Date(proposal.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.status || 'pending'}
                    </span>
                  </div>
                  
                  {/* Proposal View Section */}
                  {proposal.proposal?.url ? (
                    <div className="mt-4">
                      <button
                        onClick={() => viewProposal(proposal)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Proposal
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        {proposal.proposal.originalName || 'Untitled'}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 text-gray-500 italic">
                      No proposal document attached
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button 
                      onClick={() => handleApprove(proposal._id)}
                      disabled={proposal.status === 'approved'}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        proposal.status === 'approved' 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(proposal._id)}
                      disabled={proposal.status === 'rejected'}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        proposal.status === 'rejected' 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No proposals to review</h3>
              <p className="mt-1 text-sm text-gray-500">All submitted proposals have been processed.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Revappro;