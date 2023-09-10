import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Index.css'
import searchIcon from '../assets/lupa.png'

interface IndexState {
    search: string;
}

const Index: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<IndexState>({
      search: '',

    });
  
    return (
        <div className="mainDiv">
            <div id="welcomeText">
                <h2>Welcome to OwlsPost Where Stories Come to Life!</h2>
                <p>
                    Are you ready to embark on a journey through the captivating world
                    of storytelling?
                </p>
            </div>
                <div className="searchContainer">
                    <form action="" method="get" className="searchBar">
                        <input 
                            type="text" 
                            name="search" 
                            id="search"
                            placeholder="Search"
                            value={state.search} 
                            onChange={(e) => setState({...state, search: e.target.value})}/>

                        <button type="submit"><img src={searchIcon} alt="searchIcon" id="searchIcon" /></button>
                    </form>
                </div>
        </div>
    )
}

export default Index;