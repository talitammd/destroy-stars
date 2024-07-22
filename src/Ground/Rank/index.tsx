import React from "react";
import './index.css'
export default function Rank(state: any) {
    const { rank } = state
    // 检查 rank 是否有效  
    if (rank < 2) {
        console.error('Invalid rank value:', rank);
        return <div className="rankBox">无效的排名</div>;
    }

    const localData: string | null = localStorage.getItem(`rank-${rank - 2}`)
    let rankList: string[] = [];

    try {
        if (localData) {
            rankList = JSON.parse(localData) as string[];
        }
    } catch (error) {
        console.error('Error parsing local storage data:', error);
    }

    // let rankList = local ? JSON.parse(local) : []
    // rankList = rankList.slice(1, -1).split(',')
    return (
        <div className="rankBox">
            <p>排行榜</p>
            {rankList.length === 0 ? (<div>暂无数据</div>) :
                rankList.map((item, index) => (
                    <div key={index}>
                        {index + 1}:{item}
                    </div>
                ))
            }
        </div>
    );
}