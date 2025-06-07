import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
      window.location.reload();
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <p>Connexion avec Google en cours...</p>;
};

export default GoogleCallback;
