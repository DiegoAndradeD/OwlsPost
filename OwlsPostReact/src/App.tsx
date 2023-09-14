import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import '../src/styles/App.css'

import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';
import Index from './components/Index';
import StoryForm from './components/StoryForm';
import UserStories from './components/UserStories';
import StoryPage from './components/StoryPage';
import AddChapterPage from './components/ChapterForm';
import ChapterPage from './components/ChapterPage';
import UserProfile from './components/UserProfile';
import FollowedUsers from './components/FollowedUsers';
import UserFavorites from './components/UserFavorites';

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
