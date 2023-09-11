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
      </Routes>
    </Router>
    
  )
}

export default App
