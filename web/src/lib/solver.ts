import { Trie } from './trie';

export type Position = { r: number; c: number };

export interface FoundWord {
  word: string;
  path: Position[];
}

export class WordSolver {
  grid: string[][];
  rows: number;
  cols: number;
  trie: Trie;

  constructor(grid: string[][], dictionary: string[]) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0]?.length || 0;
    this.trie = new Trie();
    dictionary.forEach(word => this.trie.insert(word));
  }

  // Find a specific word in the grid (DFS)
  findWord(word: string): Position[] | null {
    const target = word.toUpperCase();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === target[0]) {
          const path = this.dfs(r, c, target, 0, new Set<string>());
          if (path) return path;
        }
      }
    }
    return null;
  }

  private dfs(r: number, c: number, word: string, index: number, visited: Set<string>): Position[] | null {
    if (index === word.length - 1) return [{ r, c }];

    const key = `${r},${c}`;
    visited.add(key);

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const nKey = `${nr},${nc}`;

      if (
        nr >= 0 && nr < this.rows &&
        nc >= 0 && nc < this.cols &&
        !visited.has(nKey) &&
        this.grid[nr][nc] === word[index + 1]
      ) {
        const result = this.dfs(nr, nc, word, index + 1, new Set(visited));
        if (result) return [{ r, c }, ...result];
      }
    }

    return null;
  }

  // Solve the entire grid (BFS approach as in C++)
  solveAll(): FoundWord[] {
    const foundWordsMap = new Map<string, Position[]>();
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const q: { word: string; path: Position[]; visited: Set<string> }[] = [];
        const startChar = this.grid[r][c];
        
        if (this.trie.startsWith(startChar)) {
          q.push({
            word: startChar,
            path: [{ r, c }],
            visited: new Set([`${r},${c}`])
          });
        }

        while (q.length > 0) {
          const { word, path, visited } = q.shift()!;

          if (this.trie.search(word)) {
            if (!foundWordsMap.has(word) || path.length < foundWordsMap.get(word)!.length) {
              foundWordsMap.set(word, path);
            }
          }

          const lastPos = path[path.length - 1];

          for (const [dr, dc] of directions) {
            const nr = lastPos.r + dr;
            const nc = lastPos.c + dc;
            const nKey = `${nr},${nc}`;

            if (
              nr >= 0 && nr < this.rows &&
              nc >= 0 && nc < this.cols &&
              !visited.has(nKey)
            ) {
              const nextWord = word + this.grid[nr][nc];
              if (this.trie.startsWith(nextWord)) {
                q.push({
                  word: nextWord,
                  path: [...path, { r: nr, c: nc }],
                  visited: new Set([...visited, nKey])
                });
              }
            }
          }
        }
      }
    }

    return Array.from(foundWordsMap.entries()).map(([word, path]) => ({ word, path }));
  }
}

export function parseGrid(raw: string): string[][] {
  const parts = raw.trim().split(/\s+/);
  if (parts.length === 0) return [];
  return parts.map(row => row.split(''));
}
