import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm, { UserFormData } from './UserForm';
import { useUserManagement } from '../../hooks/useUserManagement';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { addUser, users } = useUserManagement();

  const handleAddUser = (userData: UserFormData) => {
     if (users.some(u => u.email === userData.email)) {
        alert("A user with this email already exists.");
        return;
    }
    addUser({
        ...userData,
        address: null,
        verificationStatus: 'Unverified',
        kycDocument: null,
    });
    navigate('/superadmin/users');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Create New User</h1>
      <UserForm onSubmit={handleAddUser} />
    </div>
  );
};

export default AddUser;