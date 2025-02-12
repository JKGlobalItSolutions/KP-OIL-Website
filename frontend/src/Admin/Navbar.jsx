import React from 'react';
import styled from 'styled-components';
import { Menu, User } from 'lucide-react';
import { useProfile } from './ProfileContext';

const StyledNavbar = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .menu-btn {
    background: #A41E19;
    border: none;
    cursor: pointer;
    display: none;

    color:white;
    border-radius:3px;

    @media (max-width: 991px) {
      display: block;
    }
  }

  .profile-upload {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    margin-left: auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const Navbar = ({ setIsOpen }) => {
  const { profilePicture } = useProfile();

  return (
    <StyledNavbar className='my-3'>
      <button className="menu-btn px-2 py-1 " onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>
      <div className="profile-upload">
        {profilePicture && profilePicture !== '/placeholder.svg' ? (
          <img src={profilePicture} alt="Profile" />
        ) : (
          <User size={24} />
        )}
      </div>
    </StyledNavbar>
  );
};

export default Navbar;

