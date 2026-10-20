try:
    import chromadb
    HAS_CHROMADB = True
except ImportError:
    HAS_CHROMADB = False

class RAGEngine:
    def __init__(self):
        print("Initializing Knowledge & Vector Store...")
        self.documents = {
            1: "Level 1 (Easiest): Atoms are like tiny building blocks. Everything around us is made of atoms.",
            2: "Level 2 (Simple): Atoms are the basic units of matter. They have a center called a nucleus and smaller electrons.",
            3: "Level 3 (Normal): An atom consists of a positively charged nucleus surrounded by a cloud of negatively charged electrons.",
            4: "Level 4 (Advanced): In the quantum mechanical model, electrons do not have precise orbits but exist in probabilistic orbitals.",
            5: "Level 5 (Complex): The Schrödinger wave equation governs atomic systems, defining the probabilistic electron density distribution."
        }
        
        self.collection = None
        if HAS_CHROMADB:
            try:
                self.client = chromadb.Client()
                self.collection = self.client.create_collection(name="cogflow_content")
                self._populate_initial_data()
            except Exception as e:
                print(f"ChromaDB init warning ({e}), using in-memory store.")

    def _populate_initial_data(self):
        # Define 5 difficulty levels of educational text as per the CogFlow architecture
        documents = [
            "Level 1 (Easiest): Atoms are like tiny building blocks. Everything around us is made of atoms.",
            "Level 2 (Simple): Atoms are the basic units of matter. They have a center called a nucleus and smaller electrons.",
            "Level 3 (Normal): An atom consists of a positively charged nucleus surrounded by a cloud of negatively charged electrons.",
            "Level 4 (Advanced): In the quantum mechanical model, electrons do not have precise orbits but exist in probabilistic orbitals.",
            "Level 5 (Complex): The Schrödinger wave equation governs atomic systems, defining the probabilistic electron density distribution."
        ]
        
        # Unique identifiers for each content chunk
        ids = ["lvl1", "lvl2", "lvl3", "lvl4", "lvl5"]
        
        # Attach level metadata to each document to allow targeted filtering during retrieval
        metadatas = [{"level": 1}, {"level": 2}, {"level": 3}, {"level": 4}, {"level": 5}]

        # Add the structured data into the ChromaDB collection
        self.collection.add(documents=documents, metadatas=metadatas, ids=ids)  # type: ignore
        print("[RAG] Success! Study material loaded across 5 difficulty levels.")

    def adapt_content(self, current_level: int, cognitive_state: int):
        # Map cognitive states: 0 = Flow (Maintain), 1 = Overload (Simplify), 2 = Boredom (Challenge)
        new_level = current_level

        if cognitive_state == 1:  # Overload detected -> Reduce difficulty level (floor at 1)
            new_level = max(1, current_level - 1)
        elif cognitive_state == 2:  # Boredom detected -> Increase challenge level (cap at 5)
            new_level = min(5, current_level + 1)

        # Fetch the adapted content chunk from ChromaDB matching the new target level
        if self.collection:
            try:
                results = self.collection.get(where={"level": new_level})
                if results and results.get('documents'):
                    return results['documents'][0], new_level
            except Exception:
                pass
            
        # Fast in-memory fallback
        return self.documents.get(new_level, "Content not found."), new_level