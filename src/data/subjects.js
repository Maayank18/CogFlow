// ================================================
// DATA: All available subjects and their topics
// In future, this will be fetched from the backend
// ================================================

export const SUBJECTS = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: '💻',
    color: 'indigo',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
    border: 'rgba(99,102,241,0.3)',
    desc: 'Algorithms, data structures, OS, networks, and more.',
    topics: [
      { id: 'ds', name: 'Data Structures', subtopics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Hashing'] },
      { id: 'algo', name: 'Algorithms', subtopics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Divide & Conquer'] },
      { id: 'os', name: 'Operating Systems', subtopics: ['Processes & Threads', 'Memory Management', 'File Systems', 'Scheduling', 'Deadlocks'] },
      { id: 'cn', name: 'Computer Networks', subtopics: ['OSI Model', 'TCP/IP', 'HTTP & DNS', 'Routing', 'Security Basics'] },
      { id: 'dbms', name: 'DBMS', subtopics: ['SQL', 'Normalization', 'Transactions', 'Indexing', 'NoSQL'] },
      { id: 'oops', name: 'OOP Concepts', subtopics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Design Patterns'] },
    ],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    icon: '🤖',
    color: 'violet',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))',
    border: 'rgba(139,92,246,0.3)',
    desc: 'Supervised, unsupervised, and deep learning fundamentals.',
    topics: [
      { id: 'ml-basics', name: 'ML Fundamentals', subtopics: ['What is ML?', 'Bias-Variance Tradeoff', 'Train/Test Split', 'Overfitting', 'Feature Engineering'] },
      { id: 'supervised', name: 'Supervised Learning', subtopics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'SVM', 'Random Forest'] },
      { id: 'unsupervised', name: 'Unsupervised Learning', subtopics: ['K-Means', 'DBSCAN', 'PCA', 'Autoencoders', 'Anomaly Detection'] },
      { id: 'dl', name: 'Deep Learning', subtopics: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers', 'Backpropagation'] },
      { id: 'nlp', name: 'NLP', subtopics: ['Tokenization', 'Embeddings', 'Attention', 'BERT', 'GPT'] },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    color: 'cyan',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.08))',
    border: 'rgba(6,182,212,0.25)',
    desc: 'Calculus, linear algebra, probability, and discrete math.',
    topics: [
      { id: 'calc', name: 'Calculus', subtopics: ['Limits & Continuity', 'Derivatives', 'Integration', 'Differential Equations', 'Multivariable Calculus'] },
      { id: 'linalg', name: 'Linear Algebra', subtopics: ['Vectors & Matrices', 'Eigenvalues', 'Matrix Decomposition', 'Vector Spaces', 'Projections'] },
      { id: 'prob', name: 'Probability & Stats', subtopics: ['Probability Basics', 'Distributions', 'Bayes Theorem', 'Hypothesis Testing', 'Regression'] },
      { id: 'discrete', name: 'Discrete Mathematics', subtopics: ['Sets & Logic', 'Graph Theory', 'Combinatorics', 'Number Theory', 'Proofs'] },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    color: 'amber',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))',
    border: 'rgba(245,158,11,0.25)',
    desc: 'Mechanics, electricity, thermodynamics, and modern physics.',
    topics: [
      { id: 'mechanics', name: 'Classical Mechanics', subtopics: ["Newton's Laws", 'Work & Energy', 'Momentum', 'Rotational Motion', 'Gravitation'] },
      { id: 'electro', name: 'Electromagnetism', subtopics: ['Electric Fields', "Gauss's Law", 'Magnetic Fields', "Faraday's Law", "Maxwell's Equations"] },
      { id: 'thermo', name: 'Thermodynamics', subtopics: ['Laws of Thermodynamics', 'Heat Engines', 'Entropy', 'Kinetic Theory', 'Phase Transitions'] },
      { id: 'modern', name: 'Modern Physics', subtopics: ['Quantum Mechanics', 'Relativity', 'Nuclear Physics', 'Photoelectric Effect', 'Wave-Particle Duality'] },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: '📈',
    color: 'emerald',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))',
    border: 'rgba(16,185,129,0.25)',
    desc: 'Micro and macro economics, markets, and policy.',
    topics: [
      { id: 'micro', name: 'Microeconomics', subtopics: ['Supply & Demand', 'Elasticity', 'Market Structures', 'Game Theory', 'Consumer Theory'] },
      { id: 'macro', name: 'Macroeconomics', subtopics: ['GDP & Growth', 'Inflation', 'Monetary Policy', 'Fiscal Policy', 'International Trade'] },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: 'rose',
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(251,113,133,0.08))',
    border: 'rgba(244,63,94,0.25)',
    desc: 'Organic, inorganic, and physical chemistry.',
    topics: [
      { id: 'organic', name: 'Organic Chemistry', subtopics: ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Stereochemistry', 'Polymers'] },
      { id: 'physical', name: 'Physical Chemistry', subtopics: ['Thermochemistry', 'Electrochemistry', 'Chemical Kinetics', 'Equilibrium', 'Quantum Chemistry'] },
      { id: 'inorganic', name: 'Inorganic Chemistry', subtopics: ['Periodic Table Trends', 'Coordination Compounds', 'Acids & Bases', 'Redox Reactions', 'Transition Metals'] },
    ],
  },
];

// ================================================
// CONTENT LIBRARY: 3 tiers per topic
// PLACEHOLDER: In production, content will be fetched
// from ChromaDB via GET /api/content?topic=X&tier=Y
// ================================================

export const TOPIC_CONTENT = {
  // ─── ML Fundamentals ───
  'ML Fundamentals': {
    tier1: `## 🟢 What is Machine Learning? — Super Simple

**Imagine teaching a dog tricks.**

You show the dog what to do, it tries, you reward it when it gets it right. Over time, the dog **learns** without you explaining every detail.

Machine Learning works the **same way!**

**Key ideas:**
- 🎓 You give the computer **examples** (called data)
- 🔁 The computer **tries** to find patterns
- ✅ It gets **better over time** without being told specific rules

**Three types, think of them as:**
- **Supervised** → Learning with a teacher (examples with answers)
- **Unsupervised** → Exploring without a teacher (no answers given)
- **Reinforcement** → Learning by trial and reward (like the dog!)

> In one sentence: **ML is getting computers to learn from examples, not explicit rules.**`,

    tier3: `## Machine Learning — Fundamentals

Machine Learning (ML) is a subset of Artificial Intelligence where algorithms learn patterns from data to make predictions or decisions **without being explicitly programmed** for each task.

### Core Concepts

**Bias-Variance Tradeoff:**
- **High Bias** (Underfitting) — model too simple, misses patterns
- **High Variance** (Overfitting) — model too complex, memorizes noise
- Optimal ML: find the sweet spot between the two

**Train / Validation / Test Split:**
- **Training set** (~70%) — model learns from this
- **Validation set** (~15%) — tune hyperparameters
- **Test set** (~15%) — final unbiased evaluation

**Feature Engineering:**
The process of transforming raw data into meaningful inputs for the model. Includes normalization, encoding categorical variables, and creating new derived features.

### Types of ML Problems
1. **Classification** — predict a category (spam/not spam)
2. **Regression** — predict a continuous value (house price)
3. **Clustering** — group similar items (customer segments)`,

    tier5: `## Machine Learning: Theoretical Foundations

### Statistical Learning Theory (PAC Learning)

A hypothesis class H is PAC-learnable if ∃ algorithm A such that for any distribution D and any ε, δ > 0:

**P[L_D(A(S)) ≤ min_{h∈H} L_D(h) + ε] ≥ 1 − δ**

where S is a training set of m ≥ m_H(ε, δ) samples.

### Bias-Variance Decomposition

For squared loss: **E[(y − ŷ)²] = Bias²(ŷ) + Var(ŷ) + σ²_noise**

- Bias² = (E[ŷ] − f(x))² — systematic error
- Var = E[(ŷ − E[ŷ])²] — sensitivity to training set
- σ² — irreducible noise

### VC Dimension & Generalization Bounds

For finite VC dimension d_VC, with probability ≥ 1-δ:

**E_out ≤ E_in + √((8/N) · ln(4m_H(2N)/δ))**

The Rademacher complexity provides tighter distribution-dependent bounds, connecting empirical risk minimization to structural risk minimization.`,
  },

  // ─── Supervised Learning ───
  'Supervised Learning': {
    tier1: `## 🟢 Supervised Learning — Super Simple

**Think of it like learning math with an answer key.**

Your teacher gives you problems **AND** the answers. You practice until you can solve new problems on your own.

That's supervised learning!

**How it works:**
- 📚 You give the computer **examples with answers**
  - Example: "This email = SPAM", "This email = NOT SPAM"
- 🤖 The computer finds the **pattern**
- 🎯 Now it can classify **new emails it's never seen**

**Two main types:**
- **Classification** → Predicting a category
  - Is this a cat or dog? 🐱🐶
  - Will it rain tomorrow? ☀️🌧️
- **Regression** → Predicting a number
  - What will this house sell for? 🏠
  - How many units will we sell? 📦

> **Bottom line:** Show computer examples + answers → it learns the rule.`,

    tier3: `## Supervised Learning

In supervised learning, a model is trained on labeled data pairs (x_i, y_i) to learn a mapping function f: X → Y.

### Linear Regression
Fits a line through data points to predict continuous values.
- **Model:** ŷ = wᵀx + b
- **Loss:** MSE = (1/n) Σ(y_i − ŷ_i)²
- **Optimization:** Gradient descent or closed-form normal equation

### Logistic Regression
Despite the name, used for **binary classification**.
- **Output:** σ(wᵀx) where σ is the sigmoid function
- **Loss:** Binary cross-entropy
- Decision boundary at probability = 0.5

### Decision Trees
Split data based on feature thresholds to create a tree of decisions.
- **Splitting criterion:** Gini impurity or Information Gain
- **Prone to:** Overfitting on deep trees
- **Fix:** Pruning, or use Random Forests (ensembles of trees)

### Support Vector Machines (SVM)
Find the **maximum-margin hyperplane** that separates classes.
- **Kernel trick:** Maps data to higher dimensions implicitly
- **Works well:** High-dimensional spaces, text classification`,

    tier5: `## Supervised Learning: Advanced Theory

### PAC Learning & Sample Complexity

For a hypothesis class H with VC dimension d, to guarantee ε-accuracy with probability ≥ 1-δ, the sample complexity is:

**m ≥ (1/ε)(4 log(2/δ) + 8d log(13/ε))**

### Kernel Methods & RKHS

An SVM with kernel K(x, z) = φ(x)ᵀφ(z) solves:

**min_{f ∈ H_K} (1/n) Σ max(0, 1 − y_i f(x_i)) + λ‖f‖²_K**

By Mercer's theorem, valid kernels correspond to positive semidefinite Gram matrices. The representer theorem guarantees optimal f lives in span{K(x_i, ·)}.

### Boosting & AdaBoost Convergence

AdaBoost maintains a distribution D_t over training examples. At each round t, it trains weak learner h_t with error ε_t < 0.5:

**α_t = (1/2)ln((1−ε_t)/ε_t)**

Training error decays exponentially: **err_train ≤ exp(−2Σ_t γ_t²)** where γ_t = 0.5 − ε_t is the edge of each weak learner.`,
  },

  // ─── Deep Learning ───
  'Deep Learning': {
    tier1: `## 🟢 Deep Learning — Super Simple

**Imagine the brain, but made of numbers.**

Your brain has millions of neurons that talk to each other. Deep Learning creates a **fake brain** (called a neural network) inside a computer.

**How neurons work in DL:**
1. 📥 Information comes IN
2. ⚙️ The neuron does a quick **math calculation**
3. 📤 Result goes OUT to the next neuron
4. 🔁 This happens in **many layers** — that's why it's called "deep"!

**Real world examples:**
- 📸 Your phone recognizing your face = Deep Learning
- 🗣️ Siri/Alexa understanding speech = Deep Learning
- 🚗 Self-driving cars seeing the road = Deep Learning

**Why is it powerful?**
- It can learn from **raw** images, sound, and text
- The more **data and layers**, the smarter it gets

> **One sentence:** Deep Learning = many layers of math neurons that can learn almost anything from data.`,

    tier3: `## Deep Learning

Deep Learning uses multi-layer neural networks to learn hierarchical representations from raw data.

### Neural Network Architecture
- **Input Layer** — receives raw features (pixels, tokens, etc.)
- **Hidden Layers** — extract progressively abstract representations
- **Output Layer** — final prediction (class probabilities, values)

### Activation Functions
- **ReLU:** f(x) = max(0, x) — most common, avoids vanishing gradients
- **Sigmoid:** σ(x) = 1/(1+e⁻ˣ) — used in output for binary classification
- **Softmax:** normalizes outputs to probability distribution (multi-class)

### Backpropagation
The algorithm for computing gradients:
1. Forward pass: compute predictions
2. Compute loss (cross-entropy, MSE, etc.)
3. Backward pass: chain rule to compute ∂L/∂w for every weight
4. Update: w ← w − η · ∂L/∂w

### Convolutional Neural Networks (CNNs)
Designed for images — use sliding filters to detect local features (edges, shapes, objects) at multiple scales.

### Transformers
The architecture behind GPT, BERT. Uses **self-attention** to relate any token to any other token in the input, regardless of distance.`,

    tier5: `## Deep Learning: Theoretical & Advanced

### Universal Approximation Theorem

A feedforward network with a single hidden layer containing N neurons can approximate any continuous function on compact subsets of ℝⁿ to arbitrary precision, given sufficient N (Cybenko, 1989; Hornik, 1991).

### Vanishing/Exploding Gradients

In deep networks, gradients scale as: **∂L/∂W_1 = ∏_{i=1}^{L} (∂h_i/∂h_{i-1})**

If spectral norm of each Jacobian < 1 → vanishing. > 1 → exploding.

**Solutions:** Residual connections (He et al.), gradient clipping, careful initialization (He, Xavier), batch normalization.

### Attention & Self-Attention

Scaled dot-product attention: **Attention(Q,K,V) = softmax(QKᵀ/√d_k)V**

Multi-head attention projects to h subspaces: **MultiHead = Concat(head_1,...,head_h)W_O**

This allows O(1) path length between any token pair vs O(n) in RNNs, enabling modeling of long-range dependencies with O(n²) complexity in sequence length.

### Neural Tangent Kernel (NTK)

In the infinite-width limit, training dynamics of a neural network are governed by the Neural Tangent Kernel: **K_∞(x,x') = ∑_l Σ^(l)(x,x')** where Σ^(l) is defined recursively. This regime gives linear training dynamics convergent to global minima.`,
  },

  // ─── Data Structures ───
  'Data Structures': {
    tier1: `## 🟢 Data Structures — Super Simple

**Think of data structures as different types of containers.**

Just like you use a **wallet** for cards, a **bag** for books, and a **filing cabinet** for documents — different data needs different containers!

**The main containers:**

🧺 **Array** → A row of numbered boxes
- Great for: "Give me item #5"
- Bad for: Adding items in the middle

🔗 **Linked List** → A chain of treasure boxes
- Each box has the treasure + a map to the next box
- Great for: Adding/removing anywhere
- Bad for: Finding item #5 quickly

📚 **Stack** → A pile of plates
- Last plate in = First plate out (LIFO)
- Think: Undo button!

🎫 **Queue** → A line at a ticket booth
- First person in = First person out (FIFO)
- Think: Printer queue!

🌳 **Tree** → A family tree
- Has a root, branches, and leaves
- Great for: Organized searching

> **Pick the right container for the right job — that's data structures!**`,

    tier3: `## Data Structures

Data structures organize data in memory for efficient storage and retrieval. Choosing the right one determines algorithmic performance.

### Arrays
- **Access:** O(1) — direct index
- **Search:** O(n) unsorted, O(log n) sorted
- **Insert/Delete:** O(n) — shifting required

### Linked Lists
- **Singly linked:** each node has data + next pointer
- **Doubly linked:** each node has data + next + prev
- **Insert/Delete:** O(1) at known position
- **Search:** O(n) — no random access

### Stacks & Queues
| | Stack | Queue |
|---|---|---|
| Order | LIFO | FIFO |
| Insert | push() — O(1) | enqueue() — O(1) |
| Remove | pop() — O(1) | dequeue() — O(1) |
| Use case | Recursion, undo | BFS, scheduling |

### Trees
- **BST:** left < root < right. Search/Insert O(log n) average
- **AVL/Red-Black:** self-balancing, guaranteed O(log n)
- **Heap:** complete binary tree, parent ≥ children (max-heap)

### Hash Tables
- Key → hash function → index → value
- Average O(1) for insert/search/delete
- Collision handling: chaining or open addressing`,

    tier5: `## Data Structures: Advanced Analysis

### Amortized Analysis

**Dynamic Array doubling:** Single insert is O(n) on resize, but amortized O(1) by potential function Φ = 2·size − capacity.

**Proof:** ĉ_i = c_i + ΔΦ. For non-resize: ĉ = 1 + 2 = 3. For resize (capacity → 2k): ĉ = k + 1 + (2(k+1) − 2k) − (2k − k) = k + 1 + 2 − k = 3. Hence O(1) amortized.

### van Emde Boas Trees

Support successor/predecessor queries in O(log log U) for universe size U.

Recursion: **T(U) = T(√U) + O(1)** → T(U) = O(log log U)

Requires O(U) space; trade-off against comparison-based O(log n).

### Cache-Oblivious Data Structures

B-tree I/O complexity: O(log_B n) for search. Cache-oblivious B-tree (Brodal & Fagerberg) achieves this without knowing B.

**Fractional cascading** reduces repeated binary searches from O(k log n) to O(log n + k) by linking sorted lists.

### Persistent Data Structures

**Path copying:** Create new root on modification, sharing unchanged subtrees. Space O(log n) per update. Enables time-travel queries: DS[version].query().`,
  },

  // ─── Algorithms ───
  'Algorithms': {
    tier1: `## 🟢 Algorithms — Super Simple

**An algorithm is just a recipe.**

A recipe tells you: "Do step 1, then step 2, then step 3..." Until your dish is ready.

An algorithm tells a computer: "Do step 1, then step 2..." Until the problem is solved!

**Sorting — putting things in order:**
- 🃏 **Bubble Sort** → Compare neighbors, swap if wrong order. Repeat.
  - Like sorting cards one swap at a time
- 📚 **Merge Sort** → Split into halves, sort each half, combine
  - Divide and conquer — like splitting a big problem into small ones

**Searching — finding something:**
- 🔍 **Linear Search** → Check every item one by one
  - Simple but slow for big lists
- 🎯 **Binary Search** → Only works on sorted list. Check middle. Go left or right.
  - Super fast! Like finding a word in a dictionary

**Why does speed matter?**
- Bad algorithm: 1 million steps for 1000 items = 😩
- Good algorithm: 10 steps for 1000 items = 😊

> **Algorithms = the recipe. Better recipe = faster cooking.**`,

    tier3: `## Algorithms

### Sorting Complexity Comparison

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

### Dynamic Programming
Solves problems by breaking them into overlapping subproblems, storing results (memoization) to avoid redundant computation.

**Conditions:** Optimal substructure + Overlapping subproblems

**Classic examples:**
- Fibonacci: O(2ⁿ) → O(n) with DP
- 0/1 Knapsack: O(nW) pseudopolynomial
- Longest Common Subsequence: O(nm)

### Greedy Algorithms
Make locally optimal choices at each step, hoping for global optimum.
- **Works for:** Activity selection, Huffman coding, Dijkstra's
- **Proof strategy:** Exchange argument or greedy stays ahead

### Graph Algorithms
- **BFS:** O(V+E) — shortest path in unweighted graphs
- **DFS:** O(V+E) — cycle detection, topological sort
- **Dijkstra:** O((V+E) log V) — shortest path, non-negative weights`,

    tier5: `## Algorithms: Advanced Theory

### Lower Bounds via Decision Trees

Comparison-based sorting requires Ω(n log n) comparisons. Proof: a binary decision tree for n elements has n! leaves → height ≥ log₂(n!) = Ω(n log n) by Stirling's approximation.

### Randomized Algorithms & Probabilistic Analysis

**Randomized QuickSort:** Choose pivot uniformly at random. Expected comparisons = 2n ln n ≈ 1.386 n log n.

**Proof:** X_{ij} = 1 iff elements i,j compared. E[X_{ij}] = 2/(j−i+1). Total: Σ_{i<j} 2/(j−i+1) = O(n log n).

### Online Algorithms & Competitive Ratio

An online algorithm A has competitive ratio ρ if: **cost_A(σ) ≤ ρ · cost_OPT(σ) + c** for all input sequences σ.

k-server conjecture: optimal competitive ratio = k for k servers on any metric space. Proved for specific cases (Manasse et al.).

### FPT & Parameterized Complexity

A problem is Fixed-Parameter Tractable (FPT) with parameter k if solvable in f(k)·poly(n). Vertex Cover ∈ FPT: O(2^k · n) via bounded search tree.

W-hierarchy: W[1] ⊆ W[2] ⊆ ... FPT ⊆ W[1]. Clique is W[1]-complete; unlikely FPT.`,
  },

  // ─── Operating Systems ───
  'Operating Systems': {
    tier1: `## 🟢 Operating Systems — Super Simple

**The OS is like the manager of your computer.**

Imagine a busy restaurant. The **manager** coordinates the kitchen, waiters, and tables so everything runs smoothly. The OS does the same for your computer's CPU, memory, and storage.

**What does the OS do?**

🖥️ **Runs your apps** → Gives each app its fair share of the CPU

💾 **Manages memory** → Makes sure apps don't steal each other's memory

📁 **Handles files** → Organizes everything into folders and files

⌨️ **Talks to hardware** → Translates app requests into signals your hardware understands

**Key concepts:**

- **Process** → A running program (like Chrome = 1 process)
- **Thread** → A mini-task inside a process (like each Chrome tab)
- **Deadlock** → Two processes waiting for each other... forever 😅
- **Scheduling** → Deciding which process runs next

> **OS = The manager that keeps all your apps and hardware working together peacefully.**`,

    tier3: `## Operating Systems

### Process vs Thread
- **Process:** Independent program with own memory space. Heavy-weight. IPC via pipes/sockets.
- **Thread:** Lightweight unit within a process. Shares memory. Communication via shared variables.
- **Context switch cost:** Process > Thread (must swap page tables)

### CPU Scheduling Algorithms
| Algorithm | Preemptive | Starvation | Best For |
|-----------|-----------|------------|---------|
| FCFS | No | No | Simple batch |
| SJF | No | Yes | Minimize avg wait |
| Round Robin | Yes | No | Interactive systems |
| Priority | Both | Yes | Priority tasks |
| MLFQ | Yes | No | General purpose |

### Memory Management
- **Paging:** Divide memory into fixed-size pages. Eliminates external fragmentation.
- **Segmentation:** Divide into variable-size segments (code, stack, heap).
- **Virtual Memory:** Use disk as extension of RAM. Page fault → load from disk.
- **TLB:** Cache for page table entries. TLB hit → O(1) translation.

### Deadlock
**Coffman conditions (all 4 must hold):**
1. Mutual exclusion
2. Hold and wait
3. No preemption
4. Circular wait

**Prevention:** Break any one condition. **Detection:** Resource allocation graph cycles.`,

    tier5: `## Operating Systems: Advanced Concepts

### Scheduling Theory & Real-Time Systems

For periodic real-time tasks {(C_i, T_i)}: schedulable with Rate Monotonic if **U = Σ(C_i/T_i) ≤ n(2^{1/n} − 1)** (approaches ln 2 ≈ 0.693 as n → ∞).

Earliest Deadline First (EDF) achieves full utilization U ≤ 1 on uniprocessor. Proof via exchange argument showing EDF never misses deadline if total utilization ≤ 1.

### Memory Consistency Models

**Sequential Consistency (Lamport):** Result must equal some sequential interleaving of all thread operations.

**Happens-before (Lamport):** a →_hb b if: a and b in same thread with a first, or a is send and b is receive on same channel, or ∃c: a →_hb c →_hb b.

TSO (Total Store Order) — used in x86: stores can be delayed relative to loads. Requires MFENCE for sequential consistency.

### Copy-On-Write & mmap Internals

fork() uses COW: parent and child share physical pages mapped read-only. First write → page fault → allocate new physical page. Cost amortized over actual writes.

mmap with MAP_SHARED creates direct mapping to page cache. fsync() ensures durability. Page reclamation uses clock algorithm approximating LRU with reference bits.`,
  },

  // ─── Calculus ───
  'Calculus': {
    tier1: `## 🟢 Calculus — Super Simple

**Calculus is the math of change.**

Two big ideas:

**1. Derivatives → How fast is something changing?**
- 🚗 If you're driving, derivative = your **speedometer** reading right now
- The slope of a curve at any point
- "How steep is the hill here?"

**2. Integrals → Total amount accumulated**
- 🚗 If you know your speed at every moment, integral = **total distance** traveled
- Area under a curve
- "How much total rain fell during the storm?"

**Real examples:**
- 📈 Stock price going up/down → derivative = rate of change
- 💊 Drug dissolving in body → integral = total dosage absorbed
- 🌊 Wave height over time → both!

**The cool connection:**
> Derivatives and integrals are **opposite operations** — like addition and subtraction!
> (This is called the **Fundamental Theorem of Calculus**)`,

    tier3: `## Calculus

### Derivatives
The derivative measures the instantaneous rate of change:

**f'(x) = lim_{h→0} [f(x+h) − f(x)] / h**

**Key rules:**
- Power rule: d/dx[xⁿ] = nxⁿ⁻¹
- Chain rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)
- Product rule: d/dx[fg] = f'g + fg'
- Quotient rule: d/dx[f/g] = (f'g − fg') / g²

### Integration
The integral accumulates quantities:

**∫_a^b f(x)dx** = area under f(x) from a to b

**Fundamental Theorem of Calculus:**
If F'(x) = f(x), then **∫_a^b f(x)dx = F(b) − F(a)**

**Techniques:** Substitution, integration by parts (∫u dv = uv − ∫v du), partial fractions

### Applications
- **Optimization:** Set f'(x) = 0, check f''(x) for min/max
- **Related rates:** Implicit differentiation with respect to time
- **Taylor Series:** f(x) = Σ f^(n)(a)/n! · (x−a)ⁿ — approximate any function locally`,

    tier5: `## Calculus: Advanced Analysis

### Real Analysis Foundations

A function f: ℝ→ℝ is differentiable at x if the limit **f'(x) = lim_{h→0} (f(x+h)−f(x))/h** exists. The Weierstrass function W(x) = Σ aⁿcos(bⁿπx) is continuous everywhere but differentiable nowhere (for 0<a<1, ab>1+3π/2).

### Multivariable Optimization

Critical points satisfy ∇f = 0. Second-order conditions via the Hessian H:
- H positive definite → local minimum
- H negative definite → local maximum  
- H indefinite → saddle point

**Bordered Hessian** for constrained optimization (Lagrange multipliers).

### Differential Equations

**Linear ODE:** y' + p(x)y = q(x). Integrating factor μ = e^{∫p dx}.

**Existence & Uniqueness (Picard-Lindelöf):** If f is Lipschitz continuous in y, then IVP y' = f(x,y), y(x₀)=y₀ has a unique solution.

### Fourier Analysis

Any L² function decomposes: **f(x) = Σ_n ĉ_n e^{2πinx/T}** where **ĉ_n = (1/T)∫_0^T f(x)e^{-2πinx/T}dx**.

Parseval's identity: ‖f‖² = Σ|ĉ_n|². Convergence: pointwise at continuity points, uniform for C¹ functions.`,
  },

  // ─── Generic fallback for topics not in the library ───
  '__default__': {
    tier1: `## 🟢 Understanding This Topic — Simplified

**Let's break this down into the simplest possible terms.**

When you first encounter any new topic, it helps to think about it through familiar analogies.

**The core idea:**
Every complex topic has a few fundamental building blocks. Once you understand those, everything else builds naturally on top.

**Start by asking:**
- 🤔 What problem does this solve?
- 🔍 What are the key terms I keep seeing?
- 🔗 How does this connect to what I already know?

**A helpful mindset:**
- Break it into the smallest possible pieces
- Understand each piece before moving on
- Connect pieces together gradually

> **Remember:** Every expert was once a beginner. Complexity always reduces to simple rules.`,

    tier3: `## Core Concepts

This topic covers fundamental principles that form the basis for deeper understanding.

### Key Principles
Understanding any subject requires grasping its core principles before advancing to complex applications.

**Foundational Framework:**
1. **Definitions** — Precise meaning of key terms
2. **Properties** — Rules that always hold
3. **Methods** — Techniques to solve problems
4. **Applications** — Real-world uses

### Common Patterns
Most problems in this domain follow recognizable patterns:
- Identify the type of problem
- Apply the appropriate framework
- Verify your solution against known constraints

### Connections
This topic connects to broader themes across the field. Understanding the connections helps build a mental model that makes advanced material more intuitive.

> **Key insight:** Master the fundamentals deeply rather than rushing to advanced topics.`,

    tier5: `## Advanced Theoretical Perspectives

At the advanced level, we examine the theoretical underpinnings, edge cases, and connections to research frontiers.

### Formal Treatment
A rigorous treatment of this topic requires:
- Formal definitions and axioms
- Proof techniques and mathematical rigor
- Analysis of computational and space complexity
- Discussion of open problems and limitations

### Research Frontiers
Current research is pushing the boundaries of what's known, with open questions that remain unsolved.

### Cross-domain Connections
Advanced understanding reveals deep connections to:
- Adjacent fields within the discipline
- Interdisciplinary applications
- Computational theory and limits

> At this level, the goal is not just knowing **what** but deeply understanding **why** — and being able to derive results from first principles.`,
  },
};

// Get content for a given topic name and tier
export function getContent(topicName, tier) {
  const topicData = TOPIC_CONTENT[topicName] || TOPIC_CONTENT['__default__'];
  return topicData[tier] || topicData['tier3'];
}
