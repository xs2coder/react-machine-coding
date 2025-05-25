import React, { useCallback, useEffect, useState, useRef } from "react";

const API_URL = 'https://restcountries.com/v3.1/name/';
const REQUIRED_DATA_PATH = 'name.official';

const DEBOUNCE_DELAY = 300;
const MIN_QUERY_LENGTH = 2;

const cache = new Map();
const MAX_CACHE_SIZE = 20;

const setCache = (key, value) => {
    if (cache.size >= MAX_CACHE_SIZE){
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    cache.set(key, value);
}

const getValueByPath = (data, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], data);
}

export const Typeahead = ({inputId = "typeahead_input" , listBoxId = "typeahead_list", errorId = "typeahead_error"}) => {
    const [value, setValue] = useState('');//what user types
    const [results, setResults] = useState([]);//API results
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    /**
    selectedIndex: -1 vs null
    -1 is more conventional for "no selection" because:
    Array indexing: -1 clearly means "before first item"
    Consistent math: selectedIndex + 1 works cleanly
    DOM conventions: Many DOM APIs use -1 for "not found"
    Conditional logic: selectedIndex >= 0 is cleaner than selectedIndex !== null
     */
    const [selectedIndex, setSelectedIndex] = useState(-1);
    // const [selectedValue, setSelectedValue] = useState(null);

    const inputRef = useRef(null);
    const listRef = useRef(null);
    const debounceRef = useRef(null);
    const abortControllerRef = useRef(null);

    const debouncedSearch = useCallback((query)=>{
        if(debounceRef.current){
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(()=> search(query), DEBOUNCE_DELAY);
    }, []);

    const search = async(query) => {
        if(!query || query.length < MIN_QUERY_LENGTH){
            setResults([]);
            setIsOpen(false);
            return;
        }

        //cancel previous request
        if(abortControllerRef.current){
            abortControllerRef.current.abort();
        }

        //check cache first
        if(cache.has(query.toLowerCase())){
            const cachedResults = cache.get(query.toLowerCase());
            setResults(cachedResults);
            setIsOpen(true);
            return;
        }

        //making API call
        setIsLoading(true);
        // setError(null);

        //create new abort controller to cancel the API call
        abortControllerRef.current = new AbortController();

        try{
            const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, {
                signal: abortControllerRef.current.signal
            });

            if(!response.ok){
                //why not setError here?
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            //validate, filter, and limit data
            const requiredResults = Array.isArray(data) ? data.filter(item => getValueByPath(item, REQUIRED_DATA_PATH)).slice(0,30) : [];

            setCache(query.toLowerCase(), requiredResults);
            setResults(requiredResults);
            setIsOpen(true);
            setSelectedIndex(-1);
        } catch(err){
            if(err.name !== 'AbortError'){
                setError('Failed to fetch. Please try again.');
                setResults([]);
                setIsOpen(false);
            }
        } finally {
            setTimeout(()=>{
                setIsLoading(false);

            }, 3000)
        }
    };

    useEffect(() => {
        debouncedSearch(value);
        return ()=>{
            if(debounceRef.current){
                clearTimeout(debounceRef.current);
            }

            //cancel any ongoing API calls
            if(abortControllerRef.current){
                abortControllerRef.current.abort();
            }
        }
    }, [value]);

    const handleInputQueryChange = (value) => {
        setError(null);
        setValue(value);
    }

    const handleKeyDown = (e) => {
        // e.preventDefault();// This would break normal typing!

        /**
        This guard is to ensure we only "hijack" keyboard behavior when our Typeahead component is actively being used, otherwise we let the browser handle keys normally when dropdown is closed.
        Otherwise:
        Arrow keys don't scroll the page when dropdown is closed (bad UX)
        Enter key doesn't submit forms when dropdown is closed (breaks normal behavior)
        Unnecessary state updates when dropdown isn't visible
        Performance waste - running logic when it's not needed
         */
        if(!isOpen) return;

        //Rest of the code runs when dropdown list is open

        if(e.key == 'Tab'){
            // Close dropdown when tabbing away
            setIsOpen(false);
            setSelectedIndex(-1);
            // Don't prevent default - let tab work normally
            return;
        }

        const isNavigationKeyPressed = ['Enter', 'ArrowDown', 'ArrowUp', 'Escape'].includes(e.key);
        
        if(!isNavigationKeyPressed){
            return; //only handle navigation keys, ignore regular typing
        } else {
            e.preventDefault();//Arrow keys normally scroll the page. We want them to navigate our list instead.
        }

        switch(e.key){
            case 'Enter':

                if(selectedIndex >= 0 && results[selectedIndex]){
                    selectListItem(results[selectedIndex]);
                }
                break;
            case 'ArrowDown':
                setSelectedIndex((prev)=>{
                    if (prev == null ) {
                        return 0;
                    } else if (prev == results.length - 1){
                        return 0;
                    }
                    return prev + 1
                });
                break;
            case 'ArrowUp':
                setSelectedIndex((prev)=>{
                    if (prev == null){
                        return results.length - 1;
                    } else if (prev == 0) {
                        return results.length - 1;
                    }
                    return prev - 1;
                });
                break;
            case 'Escape':
                setSelectedIndex(-1);
                setIsOpen(false);
                inputRef.current?.blur();
                break;
            default:
                handleInputQueryChange(e);
        }
    };

    const selectListItem = (item) => {
        const _value = getValueByPath(item, REQUIRED_DATA_PATH);
        setValue(_value);
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();//will this open the dropdown?
    }

    const handleItemClick = (item) => {
        selectListItem(item);
    }

    //If value is not selected from search results then probably open?
    const handleInputFocus = () => {
        if(results.length > 0){
            setIsOpen(true);
        }
    }

    //Without handleInputBlur, the dropdown would stay open forever after the user clicks elsewhere or tabs away.
    const handleInputBlur = () => {
        return;
    }

    return (
        <div className="relative w-full max-w-md">
            <label htmlFor={inputId}>Countries</label>
            <input
            ref={inputRef}
            id={inputId}
            value={value}
            type="text"
            name="typeahead"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={(e)=>handleInputQueryChange(e.target.value.trim())}//This follows the principle of handling data transformation at the boundary (where data enters your component) rather than inside business logic.
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            role="combobox"
            aria-controls={isOpen ? listBoxId : undefined}
            aria-haspopup="listbox"
            aria-errormessage={errorId}
            aria-expanded={isOpen}
            aria-activedescendant={selectedIndex >=0 ? `option-${selectedIndex}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"// Disable browser autocomplete
            ></input>
            {
                isLoading
                &&
                <div className="absolute right-3 top-10"><div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>
            }
            {
                !!error
                &&
                <div id={errorId} role="alert" className="mt-2 text-sm text-red-600">{error}</div>
            }
            {
                isOpen && !isLoading && value.length >= MIN_QUERY_LENGTH && results.length == 0
                &&
                <div className="text-gray-300">No Results</div>
            }
            {
                results.length > 0
                &&
                isOpen
                &&
                <ul id={listBoxId} aria-hidden={!isOpen} role="listbox" ref={listRef} className="absolute w-full z-10 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                    {
                        results.map((item, index) => {
                            const isItemSelected = index == selectedIndex;
                            const classes = isItemSelected ? "bg-pink-200" : ""
                            return (
                                <li key={index} role="option" aria-selected={isItemSelected} className={`${classes} font-medium p-1`} onClick={()=>handleItemClick(item)}>{item?.name?.official}</li>
                            )
                    })
                    }
                </ul>
            }
            {/* screen reader announcements */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isLoading && "Searching..."}
                {!isLoading && results.length > 0 && `${results.length} results found. Use arrow keys to navigate and Enter to select.`}
                {isOpen && !isLoading && results.length == 0 && value.length >= MIN_QUERY_LENGTH && "No results found for your search."}
            </div>
        </div>
    );
}