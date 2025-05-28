import React, { useState } from "react";

const sampleData = [
    {
        id: "item1",
        title: "Is this first item?",
        content: "Yes this is the first item."
    },
    {
        id: "item2",
        title: "Which component is this?",
        content: "This is an accordion component."
    },
    {
        id: "item3",
        title: "Is this good for FAQs?",
        content: "Yes very well suited components for FAQs."
    }
];

const AccordionItem = ({item, isOpen, onToggle, children}) => {
    return (
        <div className="">
            <div onClick={onToggle} onKeyDown={(e)=>{['Enter', ' '].includes(e.key) && onToggle()}} className="border p-1 flex justify-between" tabIndex={0}>
                <span>{item.title}</span>
                <span className="pr-2">+</span>
            </div>
            {
                isOpen
                &&
                <div className="border border-t-0 p-1">{children}</div>
            }
        </div>
    )
};

export const Accordion = ({items=sampleData}) => {
    const [openItems, setOpenItems] = useState(new Set());

    const onToggle = (itemId) => {
        setOpenItems(prevOpenItems => {
            if (prevOpenItems.has(itemId)) {
                const newOpenItems = new Set(prevOpenItems);
                newOpenItems.delete(itemId);
                return newOpenItems;
            } else {
                return new Set([ ...prevOpenItems, itemId ]);
            }
        })
    };

    const renderItems = () => items.map((item, index)=>(
        <AccordionItem
            key={index}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={()=>onToggle(item.id)}
        >
            {item.content}
        </AccordionItem>
    ));

    return (
        <div role="tablist" className="border p-3 flex flex-col gap-2 container w-md" tabIndex={0}>
            {renderItems()}
        </div>
    )

};
