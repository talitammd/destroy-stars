import React from "react";
import './index.css'
import { useNavigate } from 'react-router-dom';
interface FailProps {
    rank: number;
}
export default function Fail({ rank }: FailProps) {
    const navigate = useNavigate();
    return <div className="next">
        <p className="title" style={{fontSize:'30px'}}>I'm sorry you didn't get your score.</p>
        <button className="box" onClick={() => navigate(`/game`, { state: rank })}>再来一遍</button>
        <button className="box" onClick={() => navigate('/')}>返回菜单</button>
    </div>
}