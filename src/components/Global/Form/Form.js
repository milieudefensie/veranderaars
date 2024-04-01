import React, { useState } from "react"
import { navigate } from 'gatsby';

const Form = ({ event }) => {
  const [formData, setFormData] = useState({ name: "", email: "", postcode: "", slug: event });

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submit = await fetch("/api/submit-form", { // replace with your actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const response = await submit.json();
    if(response.status !== 200){
      // TODO create proper way to manage errors
      alert('error');
    }else{
      // TODO create thank you page and fix this
      navigate('/agenda/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <label>
        Name:
        <input type="text" name="name" onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" onChange={handleChange} required />
      </label>
      <label>
        Postcode:
        <input type="text" name="postcode" onChange={handleChange} required />
      </label>
      <input type="submit" value="Submit" />
      
    </form>
  );
};

export default Form;