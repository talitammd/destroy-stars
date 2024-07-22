import React from "react";
import Score from "../Ground/Score";
import Fail from "../Fail";
import { useNavigate, useLocation } from "react-router-dom";
import './index.css'

export default function Next() {
    const { state } = useLocation();
    let navigate = useNavigate();

    const next: boolean = state.score >= state.rank ** 2 << (state.rank - 3)
    const success: boolean = state.rank === 15

    const updateLocalStorage = () => {
        const key = `rank-${state.rank - 2}`;
        let ranks = localStorage.getItem(key);
        let ranksArray = ranks ? JSON.parse(ranks) : [];
        ranksArray.push(state.score);
        ranksArray.sort((a: number, b: number) => b - a);
        if (ranksArray.length > 10) {
            ranksArray = ranksArray.slice(0, 10);
        }
        localStorage.setItem(key, JSON.stringify(ranksArray));
    };
    if (next) {
        updateLocalStorage()
        return <div >
            {!success ?
                (<div className="next">
                    <p className="title">Congratulations!</p>
                    <Score score={state.score} />
                    <button className="score" style={{ border: 'none', marginTop: '50px' }} onClick={() => navigate(`/game`, { state: state.rank + 1 })}>下一关</button></div>) :
                (<div>
                    <p className="title">All Passed!</p>
                    <button className="score" style={{ border: 'none', marginTop: '50px' }} onClick={() => navigate('/')}>返回菜单</button>
                </div>)
            }
        </div>
    } else {
        return <Fail rank={state.rank} />
    }
}