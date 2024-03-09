import { createContext, useContext, useReducer } from 'react';
import { IContext, initState, reducer } from './reducer';


const Context = createContext<IContext>({
    state: initState,
    dispatch: () => { },
});

export const useShare = () => {
    return useContext(Context)
}

const ContextProvider = (props) => {

    const [state, dispatch] = useReducer(reducer, initState)

    return (
        <Context.Provider value={{ state, dispatch }}>
            {props?.children}
        </Context.Provider>
    )
}
export default ContextProvider