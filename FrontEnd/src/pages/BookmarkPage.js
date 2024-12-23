import React from 'react';
import BookmarkList from './BookmarkList';

const BookmarkPage = ({ bookmarks }) => {
  return (
    <div>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
};

export default BookmarkPage;
