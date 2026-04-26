import re

# Read the file
with open('/vercel/share/v0-project/lib/meditations-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all imageUrl lines
content = re.sub(r'    imageUrl: "https://shaktianandama\.com/wp-content/uploads/[^"]*",\n', '', content)

# Write back
with open('/vercel/share/v0-project/lib/meditations-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Removed all imageUrl fields")

