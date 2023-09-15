import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import '../src/styles/App.css'

import LoginForm from './components/Authentication_Components/LoginForm';
import Navbar from './components/Navbar';
import SignupForm from './components/Authentication_Components/SignupForm';
import Index from './components/Index';
import StoryForm from './components/Story_Components/StoryForm';
import UserStories from './components/User_Components/UserStories';
import StoryPage from './components/Story_Components/StoryPage';
import AddChapterPage from './components/Chapter_Components/ChapterForm';
import ChapterPage from './components/Chapter_Components/ChapterPage';
import UserProfile from './components/User_Components/UserProfile';
import FollowedUsers from './components/User_Components/FollowedUsers';
import UserFavorites from './components/User_Components/UserFavorites';

const App: React.FC = () => {


  return (
    <Router>
      <Navbar/> 
      <Routes>
        <Route path='Signup' element={<SignupForm/>} />
        <Route path='/'  element={<Index/>} />
        <Route path='login' element={<LoginForm />}/>
        <Route path='addStory' element={<StoryForm />}/>
        <Route path='user_stories' element={<UserStories />}/>
        <Route path='/story/:id/author/:userid' element={<StoryPage />}/>
        <Route path='/add-chapter/:id' element={<AddChapterPage />}/>
        <Route path='/chapter/:chapterId' element={<ChapterPage />}/>
        <Route path='/getUserProfile/:userid' element={<UserProfile/>}/>
        <Route path='/getFollowedUsers' element={<FollowedUsers/>}/>
        <Route path='/getUserFavorites' element={<UserFavorites/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
