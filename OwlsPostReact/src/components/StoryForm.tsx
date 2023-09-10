import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';

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
        setState({...state, userId: accessToken.id})
        
        console.log(accessToken);
    }, [])

    console.log(state.userId);
    return (
        <div></div>
    )
}

export default StoryForm