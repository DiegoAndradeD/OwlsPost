import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface UserProfileStates {
    id: number;
    username: string;
    email: string;
    created_at: Date;
    followers_count: number;
}

const UserProfile: React.FC = () => {
    const { userid } = useParams<{ userid: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfileStates>({
        id: 0,
        username: '',
        email: '',
        created_at: new Date(),
        followers_count: 0
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/getUserById/${userid}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                setUser({...user, 
                    id: response.data.id, 
                    username: response.data.username,
                    email: response.data.email,
                    created_at: response.data.created_at,
                    followers_count: response.data.followers_count})
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserData();
    }, [])

    return (
        <div>
            <h1 className='h1Class'>{user.username}</h1>
        </div>
    )
}

export default UserProfile;