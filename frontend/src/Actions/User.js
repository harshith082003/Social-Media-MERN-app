import axios from 'axios'
import {server} from '../main'

export const loginUser = (email, password) => async (dispatch) => {

    try {

        dispatch({
            type: "LoginRequest"
        })

        const { data } = await axios.post(`${server}/login`, 
            { email, password }, 
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,  // idu haakilla andre browser alli cookie torsalla
            },
            
        );

        dispatch({
            type: "LoginSuccess",
            payload: data.user
        })
        
    } catch (error) {
        dispatch({
            type: "LoginFailure",
            payload: error
        })
    }
}