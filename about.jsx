import React, { useEffect } from 'react';
import Footer from "/components/footer.jsx";
import homeIcon from "/assets/homebtn.svg";
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out',
      once: true, 
    });
  }, []);

  return (
    <div className="relative text-black">
  

<button 
  onClick={() => {
    console.log(" Back button clicked!");
    window.history.back();
  }}
  className="absolute top-4 left-4 bg-white border-2 border-black rounded-lg p-2 shadow-md hover:bg-gray-100 transition-all z-50"
>
  <img src={homeIcon} alt="Home" className="w-8 h-8" />
</button>


      {/* Welcome Section */}
      <div className="py-20 px-4 text-center" data-aos="fade-up">
      <h1 className="text-6xl font-semibold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">
  Welcome to Sparkventure
</h1>
        <p className="mt-4 text-lg">Your hackathon management solution</p>
      </div>

      {/* What We Do Section */}
      <div className="py-16 px-8" data-aos="fade-up">
        <section className="mb-16 text-center">
          <h2 className="text-6xl font-semibold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">What We Do</h2>
          <p className="mt-6 text-lg text-black max-w-4xl mx-auto">
            Sparkventure is an innovative platform for managing hackathons. Whether you're a student eager to participate or an organizer looking to host an event, we streamline the entire experience. From registration to project submissions, we ensure that every step is simple and efficient.
          </p>
        </section>
      </div>

      {/* Features Section */}
      <div className="py-16 px-8" data-aos="fade-up">
        <section className="mb-16 text-center">
          <h2 className="text-6xl font-semibold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">Features</h2>
          <ul className="mt-6 space-y-6 text-lg text-black max-w-4xl mx-auto">
            <li><strong>Student Registration:</strong> Easily sign up for hackathons and submit project proposals.</li>
            <li><strong>Organizer Tools:</strong> Host, manage, and review hackathons and project proposals.</li>
            <li><strong>Admin Control:</strong> Validate colleges and organizers, manage schedules, and provide detailed insights.</li>
          </ul>
        </section>
      </div>

      {/* Meet The Team Section */}
      <div className="py-16 px-8" data-aos="fade-up">
        <section className="text-center">
          <h2 className="text-6xl font-semibold bg-gradient-to-r from-rose-600 to-orange-400 bg-clip-text text-transparent">Meet The 'Team'</h2>

          <div className="flex justify-center items-center mt-8">
            <div className="relative text-center">
              <img src="/assets/profile.jpg" alt="Profile" className="w-40 h-40 mx-auto rounded-full shadow-lg" />
              <p className="mt-6 font-semibold text-xl text-black">Mrudul V Binu</p>
              <p className="text-1xl font-semibold bg-rose-600 bg-clip-text text-transparent">
                Project Lead | Developer | Designer
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-0">
        <Footer />
      </div>
    </div>
  );
};

export default About;
