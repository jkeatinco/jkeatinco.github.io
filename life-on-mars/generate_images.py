import os
import json

# Specify the directory you want to scan
directory = r"C:\Users\jkeat\Documents\GitHub\jkeatinco.github.io\life-on-mars\img\v2"

# Get all files in the directory
files = os.listdir(directory)

# Filter out any non-image files
images = [file for file in files if file.endswith(('.png', '.jpg', '.jpeg', '.gif'))]

# Write the list of image files to a JSON file
with open('images.json', 'w') as f:
    json.dump(images, f)