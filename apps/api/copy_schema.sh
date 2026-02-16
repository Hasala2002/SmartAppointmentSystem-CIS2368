#!/bin/bash
# Bash script to copy schema.sql to API directory
# Run this before building if you encounter "schema.sql not found" errors

SOURCE_FILE="../../schema.sql"
DEST_FILE="./schema.sql"

if [ -f "$SOURCE_FILE" ]; then
    cp "$SOURCE_FILE" "$DEST_FILE"
    echo "✓ schema.sql copied successfully to apps/api/"
else
    echo "✗ Error: schema.sql not found at $SOURCE_FILE"
    exit 1
fi
