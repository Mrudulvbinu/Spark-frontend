import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Headerbar from "/components/headerbar.jsx";
import Navbar from "/components/navbar.jsx";
import Footer from "/components/footer.jsx";

function Approreg() {
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
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  // Render loading/error states
  if (loading) return <div className="flex justify-center items-center h-screen">Loading proposals...</div>;
  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;

  // Filter proposals by status
  const acceptedProposals = proposals.filter(p => p.status === 'approved');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');

  // Function to handle viewing proposal
  const viewProposal = (proposal) => {
    if (proposal.proposal?.url) {
      // Open PDF in new tab for viewing
      window.open(proposal.proposal.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and Navbar */}
      <Headerbar />
      <Navbar />

      {/* Page Title */}
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent animate-pulse mt-6 mb-8">
        Approved and Rejected Project Proposals
      </h2>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Accepted Proposals Column */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div className="bg-green-50 px-6 py-4 border-b border-green-200">
              <h3 className="text-2xl font-bold text-green-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accepted Proposals ({acceptedProposals.length})
              </h3>
            </div>
            <div className="divide-y divide-green-100">
              {acceptedProposals.length > 0 ? (
                acceptedProposals.map((proposal) => (
                  <div key={proposal._id} className="p-6 hover:bg-green-50 transition-colors duration-200">
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
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Accepted
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
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No accepted proposals yet
                </div>
              )}
            </div>
          </div>

          {/* Rejected Proposals Column */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <h3 className="text-2xl font-bold text-red-700 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rejected Proposals ({rejectedProposals.length})
              </h3>
            </div>
            <div className="divide-y divide-red-100">
              {rejectedProposals.length > 0 ? (
                rejectedProposals.map((proposal) => (
                  <div key={proposal._id} className="p-6 hover:bg-red-50 transition-colors duration-200">
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
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Rejected
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
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No rejected proposals yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Approreg;