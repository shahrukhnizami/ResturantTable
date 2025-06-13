import React from 'react';

import { useNavigate } from 'react-router-dom';
import CTAsection from '../components/CTAsection';
import Experience from '../components/Experience';
import Card from '../components/Card';
import Herosection from '../components/Herosection';

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Herosection/>

      {/* Info Cards */}
      <Card/>

      {/* Experience Section */}
     <Experience/>

      {/* CTA Section */}
      <CTAsection/>
    </div>
  );
}

export default Home;