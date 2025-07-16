import { BrowserRouter as Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

const Home = ({ onSignOut }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem('username');
    
  const handleSignOut = async () => {
    try {
      // Get the refresh token from local storage
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('No refresh token found');
        return;
      }
      const response = await fetch('https://devconnectbackend-xfej.onrender.com/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }), // Sending the refresh token
      });
      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        onSignOut(false);
        navigate('/'); // Redirect to login page
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error);
      }
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };


    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                  <button className="nav-link btn" onClick={() => navigate('/home')}>
                        Home
                  </button>
                  </li>
                  <li className="nav-item">
                  <button className="nav-link btn" onClick={() => navigate('/profile')}>
                    My Profile
                    </button>
                  </li>
                  <li className="nav-item">
                  <button className="nav-link btn" onClick={() => navigate('/users')}>
                    Users
                    </button>
                  </li>
                  <li className="nav-item">
                  <button className="nav-link btn" onClick={() => navigate('/posts')}>
                     Posts
                    </button>
                  </li>
                  <li className="nav-item">
                  <button className="nav-link btn" onClick={() => navigate('/user-post')}>
                     My Posts
                    </button>
                  </li>
                </ul>
              </div>
              <button
                className="btn btn-danger ms-auto"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </nav>

          <div className="mt-5 pt-5 text-center"> {/* Adds spacing for fixed navbar */}
                <p >
                    Welcome {user}
              </p>
            </div>
        </>
    )
} 
export default Home