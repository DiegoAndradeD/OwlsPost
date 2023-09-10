import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Index.css'

interface IndexState {
    
}

const Index: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<IndexState>({
      

    });
  
    return (
        <div id="welcomeText">
            <h2>Welcome to OwlsPost - Where Stories Come to Life!</h2>
            <p>
                Are you ready to embark on a journey through the captivating world
                of storytelling? <br /> Look no further! This is your portal to a universe
                of imagination, creativity, and literary adventure. <br />
                At OwlsPost, we believe that everyone has a story to tell. 
                Whether you're an aspiring writer, a seasoned author, or just a lover of good tales, this is the place for you.
            </p>
        </div>
    )
}

export default Index;