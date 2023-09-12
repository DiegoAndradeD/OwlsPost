import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import axios from "axios";
import DOMPurify from "dompurify";
import '../styles/StoryForm.css'
import { useNavigate } from "react-router-dom";


interface StoryFormState {
    title: string;
    description: string;
    userId: number;
    username: string;
    remainingChars: number;

}

const StoryForm: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<StoryFormState>({
        title: '',
        description: '',
        userId: 0,
        username: '',
        remainingChars: 2000,
    });
    
    
    const maxLenght = 2000;

    //TODO - Create alert to max lenght
    const handleDescription = (e: any) => {
        const newDescription = e.target.value;
        const currentLength = newDescription.length;
        const remaining = maxLenght - currentLength;

        if (remaining >= 0) {
            setState({ ...state, description: newDescription, remainingChars: remaining });
        }
    }

    useEffect(() => {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken');
        if(accessToken) {
            setState({...state, userId: accessToken.id, username : accessToken.username});
        }
       
        
    }, [])

    const handleFormSubmit = async (event: any) => {
        event.preventDefault(); 
        const formData = new FormData();
        const cleanedTitle = DOMPurify.sanitize(state.title);
        const cleanedDescription = DOMPurify.sanitize(state.description);

        formData.append('title', cleanedTitle);
        formData.append('description', cleanedDescription);
        formData.append('userid', String(state.userId));
        formData.append('username', state.username);
        console.log(String(state.userId));

        try {
            await axios.post('http://localhost:3000/story/add_story', 
            formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.log(error);
        }

        navigate('/user_stories');
    }

    return (
        <div className="container" id="storyFormContainer">
            <div className="row justify-content-center">
                <div className="col-md-6" id="storyFormWrapper">
                    <form onSubmit={handleFormSubmit}>
                        <h2 className="mb-4">New Story</h2>
                        <div className="mb-3"  id="dataContainer">
                            <label htmlFor="title" className="col-sm-2 col-form-label">TITLE</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    placeholder="Title"
                                    value={state.title}
                                    onChange={(e) => setState({ ...state, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row" id="dataContainer">
                            <label htmlFor="description" className="col-sm-2 col-form-label">DESCRIPTION</label>
                            <div className="col-sm-10">
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Story Description"
                                    rows={10}
                                    value={state.description}
                                    onChange={handleDescription}
                                ></textarea>
                                 <p>Description Max Length: <span>{state.remainingChars}</span></p>
                            </div>
                        </div>
                        <button type="submit" className="">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StoryForm