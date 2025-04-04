import React, { useEffect, useState } from 'react';
import { Form, FormControl, Button, Container } from "react-bootstrap";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import { useParams } from 'react-router-dom';

function AdminUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = (await axios.get(`https://backend-k86c.onrender.com/api/users/${id}`)).data;
        setUsername(res.name);
        setEmail(res.email);
        setIsAdmin(res.isAdmin);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user");
      }
    };
    getUser();
  }, [id]);

  const updateHandler = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setLoading(true);
      await axios.put(`https://backend-k86c.onrender.com/api/users/${id}`, {
        name: username,
        email,
        password,
        isAdmin
      });
      toast.success("Updated User!");
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to update user");
      setError(true);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <h2 className='my-2 text-center'>Edit User</h2>
      {loading && <Loader />}
      {error && <Error />}
      <Form className='w-50 mx-auto' onSubmit={updateHandler}>
        <Form.Label className='my-1'>Username</Form.Label>
        <FormControl
          type="text"
          placeholder='Username...'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <Form.Label className='my-1'>Email</Form.Label>
        <FormControl
          type="text"
          placeholder='Email...'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Form.Label className='my-1'>Password</Form.Label>
        <FormControl
          type="password"
          placeholder='Password...'
          onChange={e => setPassword(e.target.value)}
        />

        <Form.Label className='my-1'>Confirm Password</Form.Label>
        <FormControl
          type="password"
          placeholder='Confirm Password...'
          onChange={e => setCPassword(e.target.value)}
        />

        <Form.Label className='my-1'>Admin</Form.Label>
        <Form.Check
          type="switch"
          id="custom-switch"
          label={isAdmin ? "Admin" : "Not Admin"}
          checked={isAdmin}
          onChange={e => setIsAdmin(e.target.checked)}
        />

        <Button type="submit" variant='dark' className='my-3 w-100'>
          Update
        </Button>
      </Form>
    </Container>
  );
}

export default AdminUser;
