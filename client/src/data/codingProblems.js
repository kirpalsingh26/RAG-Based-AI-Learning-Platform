export const LANGUAGES = ['javascript', 'python', 'java', 'cpp'];

export const PROBLEMS = [
  {
    id: 'two-sum-stream',
    title: 'Two Sum in Transaction Stream',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    description:
      'You are given a stream of transaction amounts and a target refund value. Return indices of the two transactions that add up to target.',
    examples: ['nums = [2,7,11,15], target = 9 → [0,1]', 'nums = [3,2,4], target = 6 → [1,2]'],
    constraints: ['2 <= n <= 10^5', 'Exactly one valid answer'],
    starterCode: {
      javascript: `function solve(nums, target) {\n  // return [i, j]\n}\n`,
      python: `def solve(nums, target):\n    # return [i, j]\n    pass\n`,
      java: `class Solution {\n  public int[] solve(int[] nums, int target) {\n    // return new int[]{i, j};\n    return new int[]{};\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n  // return {i, j};\n  return {};\n}\n`,
    },
  },
  {
    id: 'meeting-rooms',
    title: 'Meeting Room Scheduler',
    difficulty: 'Medium',
    tags: ['Intervals', 'Sorting'],
    description:
      'Given meeting intervals, determine if a single meeting room can host all meetings without overlap.',
    examples: ['[[0,30],[35,50]] → true', '[[0,30],[15,20]] → false'],
    constraints: ['1 <= intervals.length <= 10^5', '0 <= start < end <= 10^9'],
    starterCode: {
      javascript: `function solve(intervals) {\n  // return true/false\n}\n`,
      python: `def solve(intervals):\n    # return True/False\n    pass\n`,
      java: `class Solution {\n  public boolean solve(int[][] intervals) {\n    return false;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nbool solve(vector<vector<int>>& intervals) {\n  return false;\n}\n`,
    },
  },
  {
    id: 'product-recommendation',
    title: 'Top K Product Recommendations',
    difficulty: 'Medium',
    tags: ['Heap', 'Hash Map'],
    description:
      'Given a list of purchased product IDs and an integer k, return the k most frequent products.',
    examples: ['products=[1,1,1,2,2,3], k=2 → [1,2]'],
    constraints: ['1 <= products.length <= 10^5', '1 <= k <= number of unique products'],
    starterCode: {
      javascript: `function solve(products, k) {\n  // return top k frequent product ids\n}\n`,
      python: `def solve(products, k):\n    # return top k frequent ids\n    pass\n`,
      java: `import java.util.*;\n\nclass Solution {\n  public int[] solve(int[] products, int k) {\n    return new int[]{};\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& products, int k) {\n  return {};\n}\n`,
    },
  },
  {
    id: 'delivery-route',
    title: 'Minimum Delivery Route Cost',
    difficulty: 'Hard',
    tags: ['Graph', 'Dijkstra'],
    description:
      'Given weighted roads between warehouses, find the minimum cost from source warehouse to destination.',
    examples: ['n=5, edges=[[0,1,4],[1,2,3],[0,2,10]], src=0, dst=2 → 7'],
    constraints: ['1 <= n <= 10^5', '0 <= edges.length <= 2*10^5'],
    starterCode: {
      javascript: `function solve(n, edges, src, dst) {\n  // return minimum cost\n}\n`,
      python: `def solve(n, edges, src, dst):\n    # return minimum cost\n    pass\n`,
      java: `class Solution {\n  public int solve(int n, int[][] edges, int src, int dst) {\n    return -1;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(int n, vector<vector<int>>& edges, int src, int dst) {\n  return -1;\n}\n`,
    },
  },
  {
    id: 'valid-parentheses',
    title: 'Validate Support Ticket Expressions',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    description:
      'Given a string containing brackets used in a template expression, verify whether it is valid and well-formed.',
    examples: ['s = "()[]{}" → true', 's = "(]" → false'],
    constraints: ['1 <= s.length <= 10^5', 's contains only ()[]{}'],
    starterCode: {
      javascript: `function solve(s) {\n  // return true/false\n}\n`,
      python: `def solve(s):\n    # return True/False\n    pass\n`,
      java: `class Solution {\n  public boolean solve(String s) {\n    return false;\n  }\n}\n`,
      cpp: `#include <string>\nusing namespace std;\n\nbool solve(string s) {\n  return false;\n}\n`,
    },
  },
  {
    id: 'longest-substring-unique',
    title: 'Longest Unique Session Window',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Map'],
    description:
      'Find the length of the longest substring without repeating characters in a user session trace.',
    examples: ['s = "abcabcbb" → 3', 's = "bbbbb" → 1'],
    constraints: ['0 <= s.length <= 10^5'],
    starterCode: {
      javascript: `function solve(s) {\n  // return max length\n}\n`,
      python: `def solve(s):\n    # return max length\n    pass\n`,
      java: `class Solution {\n  public int solve(String s) {\n    return 0;\n  }\n}\n`,
      cpp: `#include <string>\nusing namespace std;\n\nint solve(string s) {\n  return 0;\n}\n`,
    },
  },
  {
    id: 'merge-intervals',
    title: 'Merge Delivery Time Slots',
    difficulty: 'Medium',
    tags: ['Intervals', 'Sorting'],
    description:
      'Merge overlapping delivery time slots so dispatch teams see a clean non-overlapping plan.',
    examples: ['[[1,3],[2,6],[8,10]] → [[1,6],[8,10]]'],
    constraints: ['1 <= intervals.length <= 10^5'],
    starterCode: {
      javascript: `function solve(intervals) {\n  // return merged intervals\n}\n`,
      python: `def solve(intervals):\n    # return merged intervals\n    pass\n`,
      java: `class Solution {\n  public int[][] solve(int[][] intervals) {\n    return new int[][]{};\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> solve(vector<vector<int>>& intervals) {\n  return {};\n}\n`,
    },
  },
  {
    id: 'kth-largest',
    title: 'Kth Largest Revenue Day',
    difficulty: 'Medium',
    tags: ['Heap', 'Quickselect'],
    description:
      'Given daily revenue values, return the k-th largest value for trend analysis.',
    examples: ['nums=[3,2,1,5,6,4], k=2 → 5'],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: {
      javascript: `function solve(nums, k) {\n  // return kth largest\n}\n`,
      python: `def solve(nums, k):\n    # return kth largest\n    pass\n`,
      java: `class Solution {\n  public int solve(int[] nums, int k) {\n    return -1;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums, int k) {\n  return -1;\n}\n`,
    },
  },
  {
    id: 'binary-search-logs',
    title: 'Find First Error Log Entry',
    difficulty: 'Easy',
    tags: ['Binary Search'],
    description:
      'Given a sorted array and a target error code, return the first index where it appears.',
    examples: ['nums=[1,2,2,2,3], target=2 → 1'],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: {
      javascript: `function solve(nums, target) {\n  // return first index or -1\n}\n`,
      python: `def solve(nums, target):\n    # return first index or -1\n    pass\n`,
      java: `class Solution {\n  public int solve(int[] nums, int target) {\n    return -1;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums, int target) {\n  return -1;\n}\n`,
    },
  },
  {
    id: 'number-of-islands',
    title: 'Warehouse Cluster Detection',
    difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS'],
    description:
      'Count connected clusters in a 2D map where 1 means active warehouse and 0 means empty block.',
    examples: ['grid=[[1,1,0],[0,1,0],[0,0,1]] → 2'],
    constraints: ['1 <= m,n <= 300'],
    starterCode: {
      javascript: `function solve(grid) {\n  // return number of islands\n}\n`,
      python: `def solve(grid):\n    # return number of islands\n    pass\n`,
      java: `class Solution {\n  public int solve(char[][] grid) {\n    return 0;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<vector<char>>& grid) {\n  return 0;\n}\n`,
    },
  },
  {
    id: 'task-scheduler',
    title: 'CPU Task Cooldown Planner',
    difficulty: 'Medium',
    tags: ['Greedy', 'Heap'],
    description:
      'Schedule CPU tasks with cooldown n to minimize total intervals.',
    examples: ['tasks=[A,A,A,B,B,B], n=2 → 8'],
    constraints: ['1 <= tasks.length <= 10^4'],
    starterCode: {
      javascript: `function solve(tasks, n) {\n  // return minimum intervals\n}\n`,
      python: `def solve(tasks, n):\n    # return minimum intervals\n    pass\n`,
      java: `class Solution {\n  public int solve(char[] tasks, int n) {\n    return 0;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<char>& tasks, int n) {\n  return 0;\n}\n`,
    },
  },
  {
    id: 'word-break',
    title: 'Sentence Segmentation Engine',
    difficulty: 'Medium',
    tags: ['Dynamic Programming'],
    description:
      'Determine if a string can be segmented into valid words from a dictionary.',
    examples: ['s="leetcode", dict=["leet","code"] → true'],
    constraints: ['1 <= s.length <= 300'],
    starterCode: {
      javascript: `function solve(s, wordDict) {\n  // return true/false\n}\n`,
      python: `def solve(s, wordDict):\n    # return True/False\n    pass\n`,
      java: `import java.util.*;\nclass Solution {\n  public boolean solve(String s, List<String> wordDict) {\n    return false;\n  }\n}\n`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nbool solve(string s, vector<string>& wordDict) {\n  return false;\n}\n`,
    },
  },
  {
    id: 'rotting-oranges-delivery',
    title: 'Contagion Spread Simulation',
    difficulty: 'Medium',
    tags: ['BFS', 'Matrix'],
    description:
      'In a grid simulation, return minutes needed for all fresh units to be affected, or -1 if impossible.',
    examples: ['grid=[[2,1,1],[1,1,0],[0,1,1]] → 4'],
    constraints: ['1 <= m,n <= 100'],
    starterCode: {
      javascript: `function solve(grid) {\n  // return minutes\n}\n`,
      python: `def solve(grid):\n    # return minutes\n    pass\n`,
      java: `class Solution {\n  public int solve(int[][] grid) {\n    return -1;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<vector<int>>& grid) {\n  return -1;\n}\n`,
    },
  },
  {
    id: 'lru-cache-design',
    title: 'Design API Rate Cache (LRU)',
    difficulty: 'Hard',
    tags: ['Design', 'Hash Map', 'Linked List'],
    description:
      'Design a Least Recently Used cache with O(1) get and put operations.',
    examples: ['capacity=2, put/get sequence should evict least recently used item'],
    constraints: ['1 <= capacity <= 3000'],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}\n`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass\n`,
      java: `class LRUCache {\n  public LRUCache(int capacity) {}\n  public int get(int key) { return -1; }\n  public void put(int key, int value) {}\n}\n`,
      cpp: `class LRUCache {\npublic:\n  LRUCache(int capacity) {}\n  int get(int key) { return -1; }\n  void put(int key, int value) {}\n};\n`,
    },
  },
  {
    id: 'network-delay',
    title: 'Network Delay in Data Center',
    difficulty: 'Hard',
    tags: ['Graph', 'Shortest Path'],
    description:
      'Given travel times between servers, find the time for a signal to reach all nodes from source k.',
    examples: ['times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2 → 2'],
    constraints: ['1 <= n <= 100', '1 <= times.length <= 6000'],
    starterCode: {
      javascript: `function solve(times, n, k) {\n  // return delay time or -1\n}\n`,
      python: `def solve(times, n, k):\n    # return delay time or -1\n    pass\n`,
      java: `class Solution {\n  public int solve(int[][] times, int n, int k) {\n    return -1;\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nint solve(vector<vector<int>>& times, int n, int k) {\n  return -1;\n}\n`,
    },
  },
  {
    id: 'min-window-substring',
    title: 'Minimum Inventory Cover Window',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'String'],
    description:
      'Find the smallest window in s that contains all characters of t including duplicates.',
    examples: ['s="ADOBECODEBANC", t="ABC" → "BANC"'],
    constraints: ['1 <= s.length, t.length <= 10^5'],
    starterCode: {
      javascript: `function solve(s, t) {\n  // return minimum window string\n}\n`,
      python: `def solve(s, t):\n    # return minimum window string\n    pass\n`,
      java: `class Solution {\n  public String solve(String s, String t) {\n    return \"\";\n  }\n}\n`,
      cpp: `#include <string>\nusing namespace std;\n\nstring solve(string s, string t) {\n  return \"\";\n}\n`,
    },
  },
  {
    id: 'topological-build-order',
    title: 'Project Build Order Resolver',
    difficulty: 'Medium',
    tags: ['Graph', 'Topological Sort'],
    description:
      'Given project dependencies, return a valid build order or empty if cycle exists.',
    examples: ['n=4, deps=[[1,0],[2,0],[3,1],[3,2]] → [0,1,2,3]'],
    constraints: ['1 <= n <= 10^5'],
    starterCode: {
      javascript: `function solve(numCourses, prerequisites) {\n  // return order array\n}\n`,
      python: `def solve(numCourses, prerequisites):\n    # return order list\n    pass\n`,
      java: `class Solution {\n  public int[] solve(int numCourses, int[][] prerequisites) {\n    return new int[]{};\n  }\n}\n`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solve(int numCourses, vector<vector<int>>& prerequisites) {\n  return {};\n}\n`,
    },
  },
];
