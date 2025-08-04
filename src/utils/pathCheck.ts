import { Tile } from '../store/gameState';

export interface Point {
    row: number;
    col: number;
}

export interface PathCheckResult {
    canConnect: boolean;
    path?: Point[];
}

/**
 * Main function: Use BFS with turn-counting to find valid path between two tiles (max 4 segments = 3 turns)
 */
export const canConnectTiles = (board: Tile[][], tile1: Tile, tile2: Tile): PathCheckResult => {
    if (
        tile1.type !== tile2.type ||
        tile1.isEmpty ||
        tile2.isEmpty ||
        tile1.id === tile2.id
    ) return { canConnect: false };

    const H = board.length;
    const W = board[0].length;
    const directions = [
        { dRow: -1, dCol: 0, dir: 'up' },
        { dRow: 1, dCol: 0, dir: 'down' },
        { dRow: 0, dCol: -1, dir: 'left' },
        { dRow: 0, dCol: 1, dir: 'right' }
    ];

    type Dir = 'up' | 'down' | 'left' | 'right';
    type QueueItem = {
        row: number,
        col: number,
        path: Point[],
        direction: Dir | null,
        turns: number
    };

    const visited = new Set<string>();
    const queue: QueueItem[] = [{
        row: tile1.row,
        col: tile1.col,
        path: [{ row: tile1.row, col: tile1.col }],
        direction: null,
        turns: 0
    }];

    while (queue.length > 0) {
        const { row, col, path, direction, turns } = queue.shift()!;

        if (turns > 2) continue;
        if (row === tile2.row && col === tile2.col) {
            return { canConnect: true, path };
        }

        for (const { dRow, dCol, dir } of directions) {
            let newRow = row + dRow;
            let newCol = col + dCol;
            const newTurns = direction === null || direction === dir ? turns : turns + 1;

            while (
                newRow >= 0 && newRow < H &&
                newCol >= 0 && newCol < W &&
                (board[newRow][newCol].isEmpty || (newRow === tile2.row && newCol === tile2.col))
            ) {
                const key = `${newRow},${newCol},${dir},${newTurns}`;
                if (visited.has(key)) {
                    newRow += dRow;
                    newCol += dCol;
                    continue;
                }
                visited.add(key);

                queue.push({
                    row: newRow,
                    col: newCol,
                    path: [...path, { row: newRow, col: newCol }],
                    direction: dir as Dir,
                    turns: newTurns
                });

                if (newRow === tile2.row && newCol === tile2.col) break;
                newRow += dRow;
                newCol += dCol;
            }
        }
    }

    return { canConnect: false };
};

export const hasValidMoves = (board: Tile[][]): boolean => {
    const activeTiles = board.flat().filter(tile => !tile.isEmpty);
    for (let i = 0; i < activeTiles.length; i++) {
        for (let j = i + 1; j < activeTiles.length; j++) {
            const tile1 = activeTiles[i];
            const tile2 = activeTiles[j];
            if (tile1.type === tile2.type) {
                const result = canConnectTiles(board, tile1, tile2);
                if (result.canConnect) return true;
            }
        }
    }
    return false;
};