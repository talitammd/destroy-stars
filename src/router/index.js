import Ground from "@/Ground";
import Start from "@/Start";
import Next from "@/Next";
import App from "@/App";

import { createBrowserRouter, Link, Outlet,useParams } from "react-router-dom";

const routers = createBrowserRouter([
    {
        path: '/',
        element: <App />, 
        errorElement: <div>怎么会出错呢呜呜呜呜</div>,
        children:[
            {
                index: true,
                element: <Start />
            },{
                path: '/game',
                element:<Ground />
            },{
                path: '/next',
                element:<Next />
            }
        ]
    }
])
export default routers;