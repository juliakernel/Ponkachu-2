'use client';
import { motion } from 'framer-motion';
import { canConnectTiles, Point } from '../utils/pathCheck';
import { Tile } from '../store/gameState';

interface PathVisualizerProps {
    selectedTiles: Tile[];
    board: Tile[][];
    boardWidth: number;
    boardHeight: number;
}

export default function PathVisualizer({ selectedTiles, board, boardWidth, boardHeight }: PathVisualizerProps) {
    if (selectedTiles.length !== 2) return null;
    const [tile1, tile2] = selectedTiles;
    const result = canConnectTiles(board, tile1, tile2);
    if (!result.canConnect || !result.path) return null;

    const tileSize = 64, gap = 4, boardPadding = 16;
    const getTilePosition = (tile: Tile | Point) => ({
        x: boardPadding + tile.col * (tileSize + gap),
        y: boardPadding + tile.row * (tileSize + gap)
    });

    const segments = result.path!.slice(1).map((p, i) => [result.path![i], p]);
    const boardWidthPx = boardWidth * (tileSize + gap) - gap + boardPadding * 2;
    const boardHeightPx = boardHeight * (tileSize + gap) - gap + boardPadding * 2;

    return (
        <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg width={boardWidthPx} height={boardHeightPx} className="absolute top-0 left-0" style={{ zIndex: 10 }}>
                {segments.map(([start, end], i) => {
                    const s = getTilePosition(start), e = getTilePosition(end);
                    return (
                        <motion.line key={i} x1={s.x + tileSize / 2} y1={s.y + tileSize / 2} x2={e.x + tileSize / 2} y2={e.y + tileSize / 2}
                            stroke="#ffffff" strokeWidth="3" strokeDasharray="8,4" strokeLinecap="round" />
                    );
                })}
            </svg>
        </motion.div>
    );
}