import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import '@fortawesome/fontawesome-free/css/all.css';


interface StoryFormState {
    title: string;
    description: string;
    userId: number;
    username: string;

}

const StoryForm: React.FC = () => {
    const [state, setState] = useState<StoryFormState>({
        title: '',
        description: '',
        userId: 0,
        username: '',
    });

    useEffect(() => {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken');
        setState({...state, userId: accessToken.id});
        setState({...state, username : accessToken.username});
        
        console.log(accessToken);
    }, [])

    console.log(state.userId);
    return (
        <div className="sidebarContainer">
            
    </div>
    )
}

export default StoryForm