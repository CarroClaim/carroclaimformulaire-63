import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const AdminLink = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link to="/admin/login">
        <Button variant="outline" size="sm" className="shadow-lg">
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </Link>
    </div>
  );
};

export default AdminLink;