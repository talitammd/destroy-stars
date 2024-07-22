import React from 'react';
import './index.css'
interface ScoreProps {
  score: number;
}
export default function Score({ score }: ScoreProps) {
  return (
    <div className='score'>
      <span>得分: {score}</span>
    </div>
  );
}