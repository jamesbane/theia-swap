import {useRoutes} from 'react-router-dom';
import EventFilter from "../pages/EventFilter";
import Swap from "../pages/Swap";


const Router = () => {
    return useRoutes([
        {path: '/', element: <EventFilter/>},
        {path: '/swap', element: <Swap/>}
    ]);
}

export default Router;