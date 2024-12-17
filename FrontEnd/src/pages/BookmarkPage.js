import React from 'react';
import BookmarkList from './BookmarkList';

const BookmarkPage = ({ bookmarks }) => {
  return (
    <div>
      <h1>Bookmark Page</h1>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
};

export default BookmarkPage;
