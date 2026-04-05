import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (user) {
    return (
      <div className="user-menu">
        <span className="user-email">{user.email}</span>
        <button className="user-signout" onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <>
      <button className="signin-btn" onClick={() => setShowModal(true)}>
        Sign In to Sync
      </button>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
