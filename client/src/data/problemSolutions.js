export const PROBLEM_SOLUTIONS = {
  'two-sum-stream': {
    javascript: `function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  'meeting-rooms': {
    javascript: `function solve(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i += 1) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
  },
  'product-recommendation': {
    javascript: `function solve(products, k) {
  const freq = new Map();
  for (const p of products) freq.set(p, (freq.get(p) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([id]) => id);
}`,
  },
  'delivery-route': {
    javascript: `function solve(n, edges, src, dst) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) graph[u].push([v, w]);

  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = [[0, src]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    if (d !== dist[node]) continue;
    if (node === dst) return d;

    for (const [next, w] of graph[node]) {
      const nd = d + w;
      if (nd < dist[next]) {
        dist[next] = nd;
        pq.push([nd, next]);
      }
    }
  }
  return -1;
}`,
  },
  'valid-parentheses': {
    javascript: `function solve(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
  },
  'longest-substring-unique': {
    javascript: `function solve(s) {
  let left = 0;
  let best = 0;
  const seen = new Map();

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (seen.has(ch)) left = Math.max(left, seen.get(ch) + 1);
    seen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  },
  'merge-intervals': {
    javascript: `function solve(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0].slice()];

  for (let i = 1; i < intervals.length; i += 1) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}`,
  },
  'kth-largest': {
    javascript: {
      reference: `function solve(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
      improved: `function solve(nums, k) {
  const target = nums.length - k;

  const partition = (left, right, pivotIndex) => {
    const pivot = nums[pivotIndex];
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];
    let store = left;

    for (let i = left; i < right; i += 1) {
      if (nums[i] < pivot) {
        [nums[store], nums[i]] = [nums[i], nums[store]];
        store += 1;
      }
    }

    [nums[right], nums[store]] = [nums[store], nums[right]];
    return store;
  };

  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivotIndex = Math.floor((left + right) / 2);
    const idx = partition(left, right, pivotIndex);
    if (idx === target) return nums[idx];
    if (idx < target) left = idx + 1;
    else right = idx - 1;
  }

  return -1;
}`,
      complexity: 'Average O(n), Worst O(n²), Space O(1)',
      notes: 'Uses Quickselect to avoid fully sorting the array.',
    },
  },
  'binary-search-logs': {
    javascript: `function solve(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  let ans = -1;

  while (l <= r) {
    const m = (l + r) >> 1;
    if (nums[m] >= target) {
      if (nums[m] === target) ans = m;
      r = m - 1;
    } else l = m + 1;
  }
  return ans;
}`,
  },
  'number-of-islands': {
    javascript: `function solve(grid) {
  const m = grid.length;
  const n = grid[0].length;
  let islands = 0;

  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1' && grid[r][c] !== 1) return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };

  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] === '1' || grid[r][c] === 1) {
        islands += 1;
        dfs(r, c);
      }
    }
  }
  return islands;
}`,
  },
  'task-scheduler': {
    javascript: `function solve(tasks, n) {
  const count = new Map();
  for (const t of tasks) count.set(t, (count.get(t) || 0) + 1);
  const freqs = [...count.values()];
  const maxFreq = Math.max(...freqs);
  const maxCount = freqs.filter((f) => f === maxFreq).length;
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}`,
  },
  'word-break': {
    javascript: `function solve(s, wordDict) {
  const set = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
  },
  'rotting-oranges-delivery': {
    javascript: `function solve(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const q = [];
  let fresh = 0;

  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] === 2) q.push([r, c, 0]);
      if (grid[r][c] === 1) fresh += 1;
    }
  }

  let time = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (q.length) {
    const [r, c, t] = q.shift();
    time = Math.max(time, t);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 2;
      fresh -= 1;
      q.push([nr, nc, t + 1]);
    }
  }

  return fresh === 0 ? time : -1;
}`,
  },
  'lru-cache-design': {
    javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
  }
}`,
  },
  'network-delay': {
    javascript: `function solve(times, n, k) {
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);

  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const pq = [[0, k]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, node] = pq.shift();
    if (d !== dist[node]) continue;
    for (const [next, w] of graph[node]) {
      const nd = d + w;
      if (nd < dist[next]) {
        dist[next] = nd;
        pq.push([nd, next]);
      }
    }
  }

  const max = Math.max(...dist.slice(1));
  return max === Infinity ? -1 : max;
}`,
  },
  'min-window-substring': {
    javascript: `function solve(s, t) {
  if (!s || !t) return '';
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  let missing = t.length;
  let left = 0;
  let best = [0, Infinity];

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing -= 1;
      need.set(ch, need.get(ch) - 1);
    }

    while (missing === 0) {
      if (right - left < best[1] - best[0]) best = [left, right + 1];
      const lc = s[left];
      if (need.has(lc)) {
        need.set(lc, need.get(lc) + 1);
        if (need.get(lc) > 0) missing += 1;
      }
      left += 1;
    }
  }

  return best[1] === Infinity ? '' : s.slice(best[0], best[1]);
}`,
  },
  'topological-build-order': {
    javascript: `function solve(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course] += 1;
  }

  const q = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (indegree[i] === 0) q.push(i);
  }

  const order = [];
  while (q.length) {
    const node = q.shift();
    order.push(node);
    for (const next of graph[node]) {
      indegree[next] -= 1;
      if (indegree[next] === 0) q.push(next);
    }
  }

  return order.length === numCourses ? order : [];
}`,
  },
};
