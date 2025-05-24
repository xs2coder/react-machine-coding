import React, { useEffect, useState } from "react";
export const useCustomHashRouter = () => {
    const [ hash, setHash ] = useState(window.location.hash);

    useEffect(()=>{
        const onHashChange = () => setHash(window.location.hash || '#');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange)
    },[])
    return hash;
}

export const useHashRouteComponent = (routes) => {
    const hash = useCustomHashRouter();
    return routes[hash] || (() => <div>Not found</div>);//the fallback should also be a component not just plain JSX
}