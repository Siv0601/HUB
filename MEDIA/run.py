import subprocess

# ✅ Fix: Use raw string (prefix with 'r') OR double backslashes
subprocess.Popen(["python", r"C:\background\server.py"])
subprocess.Popen(["python", r"C:\background\drawing\server.py"])

# OR
# subprocess.Popen(["python", "C:\\background\\server.py"])
# subprocess.Popen(["python", "C:\\background\\drawing\\server.py"])
