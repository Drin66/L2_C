// SeatShowcase.js
import React from "react";

function SeatShowcase() {
  return (
    <div>
      <ul className='ShowCase'>
        <li>
          <span className='seat' /> <small>Available</small>
        </li>
        <li>
          <span className='seat recommended' /> <small>Recommended</small>
        </li>
        <li>
          <span className='seat selected' /> <small>Selected</small>
        </li>
        <li>
          <span className='seat occupied' /> <small>Occupied</small>
        </li>
        <li>
          <span className='seat held' /> <small>Held by others</small>
        </li>
      </ul>
    </div>
  );
}

export default SeatShowcase;