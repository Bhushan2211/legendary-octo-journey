import React from 'react';
import '../src/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Image Editor App. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
