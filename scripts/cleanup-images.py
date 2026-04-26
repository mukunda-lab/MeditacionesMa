import re

# Read the file
with open('/vercel/share/v0-project/lib/meditations-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all imageUrl lines that have the pattern imageUrl: "https://....",
# Pattern: spaces + imageUrl: "https://shaktianandama.com/wp-content/uploads/...",\n
content = re.sub(
    r'\s+imageUrl: "https://shaktianandama\.com/wp-content/uploads/[^"]*",\n',
    '\n',
    content
)

# Write back
with open('/vercel/share/v0-project/lib/meditations-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Removed all imageUrl fields")
