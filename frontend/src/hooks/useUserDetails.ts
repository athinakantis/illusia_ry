import { useState } from 'react';
import defaultImg from '../assets/user-round.png'
import { useAuth } from './useAuth';

export  function useUserDetails() {
  const {user} = useAuth()
  const [name, setName] = useState('');
  const [image, setImage] = useState(defaultImg);
  const [email, setEmail] = useState(user?.email)

  return {name, image}
}