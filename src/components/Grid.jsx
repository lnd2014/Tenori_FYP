import React from 'react';
import NoteSquare from './NoteSquare.jsx';
import { engine } from '../services/AudioEngine';

/**
 * Grid 组件：渲染 16x16 的交互式音乐网格
 */

const Grid = ({ grid, setGrid, currentStep }) => {
    const toggleNote = (col, row) => {
        const newGrid = [...grid];
        const cell = newGrid[col][row];

        if (cell.active) {
            newGrid[col][row] = { active: false, timbre: null };
        } else {
            // Capture current timbre from engine
            newGrid[col][row] = {
                active: true,
                timbre: { ...engine.currentTimbre }
            };
        }

        setGrid(newGrid);
    };

    return (
        <div className="grid-container">
            {grid.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[4px]">
                    {column.map((cell, rowIdx) => (
                        <NoteSquare
                            key={`${colIdx}-${rowIdx}`}
                            active={cell.active}
                            timbre={cell.timbre}
                            isCurrentStep={currentStep === colIdx}
                            onClick={() => toggleNote(colIdx, rowIdx)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;
