#!/bin/bash

# Define the ESLint comments
ESLINT_COMMENTS='/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/'

# Process each .tsx file
for file in $(find src -type f -name "*.tsx"); do
    # Check if file exists and is not empty
    if [ -s "$file" ]; then
        # Check if comments are already at the top
        TOP=$(head -n 2 "$file")
        if [[ "$TOP" != *"/* eslint-disable @typescript-eslint/no-explicit-any */"* ]]; then
            # Add comments at the top
            sed -i "1i\$ESLINT_COMMENTS\n\n" "$file"
        fi

        # Check if comments are already at the bottom
        BOTTOM=$(tail -n 2 "$file")
        if [[ "$BOTTOM" != *"/* eslint-disable @typescript-eslint/no-explicit-any */"* ]]; then
            # Add comments at the bottom
            echo -e "$ESLINT_COMMENTS" >> "$file"
        fi
    fi
done
