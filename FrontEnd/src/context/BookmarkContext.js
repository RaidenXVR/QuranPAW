// Desc: Context for bookmarks
import React, { createContext, useState } from 'react';
import { getBookmarks } from '../services/api';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const [bookmarkList, setBookmarkList] = useState([]);

    return (
        <BookmarkContext.Provider value={{ bookmarkList, setBookmarkList }}>
            {children}
        </BookmarkContext.Provider>
    );
};