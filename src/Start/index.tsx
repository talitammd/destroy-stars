import React from 'react';
import './index.css'
import { useNavigate } from 'react-router-dom';
export default function Start() {
    let nav = useNavigate()
    const init = 3
    return <div>
        <div className="title">
            消灭星星
        </div>
        <div className='btn-container'>
            <button className="box" onClick={() => nav(`/game`, { state: init })}>开始游戏</button>
        </div>
    </div>
}