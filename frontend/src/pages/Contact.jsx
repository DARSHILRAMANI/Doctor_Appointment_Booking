import React from "react";
import { assets } from "../assets/assets";
import "./Contact.css";
const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <p>
          CONTACT <span className="contact-us">US</span>
        </p>
        <div className="contact-content">
          <img className="contact-image" src={assets.contact_image} alt="" />
          <div className="contact-details">
            <p className="office-title">OUR OFFICE</p>
            <p className="office-address">
              00000 Willms Station
              <br />
              Suite 000, Dodiyala, Gujarat
            </p>
            <p className="office-contact">
              Tel: (000) 000-0000
              <br />
              Email: darshilramani8@gmail.com
            </p>
            <p className="career-title">CAREERS AT PRESCRIPTO</p>
            <p className="career-description">
              Learn more about our teams and job openings.
            </p>
            <button className="explore-button">Explore Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
