Output demo.gif

Set Shell "bash"
Set FontSize 15
Set Width 900
Set Height 500
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 40ms
Set CursorBlink false

Hide
Type "cd /tmp/demo-talks"
Enter
Sleep 300ms
Type "clear"
Enter
Sleep 300ms
Show

# List all decks
Type "sd list"
Sleep 300ms
Enter
Sleep 2.5s

# Create a new deck with the wizard
Type "sd new"
Sleep 300ms
Enter
Sleep 1.5s

# Deck name
Type "2026-05-typescript-tips"
Sleep 200ms
Enter
Sleep 1s

# Title
Type "TypeScript Tips and Tricks"
Sleep 200ms
Enter
Sleep 800ms

# Subtitle — skip
Enter
Sleep 500ms

# Author
Type "Afonso Ramos"
Sleep 200ms
Enter
Sleep 800ms

# Don't start dev server
Down
Sleep 300ms
Enter
Sleep 2s

# Show the new deck in the list
Type "sd list"
Sleep 300ms
Enter
Sleep 2.5s

# Start dev server with fuzzy match
Type "sd dev typescript"
Sleep 300ms
Enter
Sleep 5s

# Quit slidev
Ctrl+C
Sleep 1s
