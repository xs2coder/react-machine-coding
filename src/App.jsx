import React from "react";
import { useHashRouteComponent } from './logic/useCustomHashRouter';
import { Carousel } from "./challenges/Carousel";
import { Typeahead } from "./challenges/Typeahead";
import { Accordion } from "./challenges/Accordion";
import { Dropdown } from "./challenges/Dropdown";
import TabsDemo from "./challenges/Tabs";
import ProgressBarDemo from "./challenges/ProgressBar";
import StarRatingDemo from "./challenges/StarRating";
import ToastDemo from "./challenges/Toast";
import ModalDemo from "./challenges/ModalDialog";

const routes = {
    '#Carousel': Carousel,
    '#Typeahead': Typeahead,
    '#Accordion': Accordion,
    '#Dropdown': Dropdown,
    '#TabsDemo': TabsDemo,
    '#ProgressBar': ProgressBarDemo,
    '#StarRating': StarRatingDemo,
    '#Toast': ToastDemo,
    '#Modal': ModalDemo,
}

export const App = () => {
    const Component = useHashRouteComponent(routes);
    console.log("current Component: ", Component);
    return (
        <div className="container mx-auto flex flex-col gap-5">
            <header className=" bg-blue-200 flex justify-between p-5">
                <div className="font-bold">React Machine Coding</div>
                <ul className="flex flex-row gap-5">
                    <li><a href="#Carousel">Carousel</a></li>
                    <li><a href="#Typeahead">Typeahead</a></li>
                    <li><a href="#Accordion">Accordion</a></li>
                    <li><a href="#Dropdown">Dropdown</a></li>
                    <li><a href="#TabsDemo">Tabs</a></li>
                    <li><a href="#ProgressBar">Progress Bar</a></li>
                    <li><a href="#StarRating">Star Rating</a></li>
                    <li><a href="#Toast">Toast</a></li>
                    <li><a href="#Modal">Modal Dialog</a></li>
                </ul>
            </header>
            <Component/>
        </div>
    )
}

export default App;