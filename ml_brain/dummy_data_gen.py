import pandas as pd
import numpy as np
import random
import os

def generate_dummy_data(num_samples=1000):
    print("Generating simulated data for CogFlow...")
    
    data = []
    
    # 0 = Flow (Normal), 1 = Overload (Stressed), 2 = Boredom (Disengaged)
    states = [0, 1, 2]
    
    for _ in range(num_samples):
        # Randomly assign a cognitive state for this sample
        state = random.choice(states)
        
        if state == 0:  # Flow (Ideal Learning)
            gaze_variance = random.uniform(10, 30)       # Focused viewing
            blink_rate = random.uniform(15, 20)          # Normal blinking
            facial_tension = random.uniform(0.1, 0.3)    # Relaxed face
            mouse_speed = random.uniform(20, 50)         # Steady mouse movement
            typing_gap = random.uniform(0.2, 0.4)        # Consistent typing speed
            
        elif state == 1:  # Overload (High Stress/Confusion)
            gaze_variance = random.uniform(50, 100)      # Eyes darting around
            blink_rate = random.uniform(25, 40)          # High blink rate (stress)
            facial_tension = random.uniform(0.7, 1.0)    # Furrowed eyebrows (MediaPipe)
            mouse_speed = random.uniform(80, 150)        # Erratic/fast mouse movement
            typing_gap = random.uniform(0.6, 1.2)        # Pausing a lot while typing
            
        else:  # Boredom (Disengaged)
            gaze_variance = random.uniform(0, 10)        # Staring at one spot
            blink_rate = random.uniform(5, 10)           # Very low blink rate (zoning out)
            facial_tension = random.uniform(0.0, 0.1)    # Blank expression
            mouse_speed = random.uniform(0, 5)           # Barely touching the mouse
            typing_gap = random.uniform(1.5, 3.0)        # Not typing much at all
            
        # Append the simulated row
        data.append([
            gaze_variance, 
            blink_rate, 
            facial_tension, 
            mouse_speed, 
            typing_gap, 
            state
        ])
    
    # Create a DataFrame
    columns = ['gaze_variance', 'blink_rate', 'facial_tension', 'mouse_speed', 'typing_gap', 'cognitive_state']
    df = pd.DataFrame(data, columns=columns)
    
    # Save it to a CSV file in the same folder
    file_path = 'simulated_cogflow_data.csv'
    df.to_csv(file_path, index=False)
    print(f"Success! Generated {num_samples} rows of dummy data and saved to '{file_path}'.")

if __name__ == "__main__":
    generate_dummy_data()